import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { cleanUpCartFullInfo } from "../../store/cart/CartSlice";
import { resetOrderStatus } from "../../store/orders/OrdersSlice";
import { type TcheckoutForm } from "../../validations/checkout";
import getItemsInfo from "../../store/cart/actGetItemsInfo";
import Heading from "../../components/common/heading-title/Heading";
import StepIndicator from "../../components/ecommerce/checkout/StepIndicator";
import ShippingStep from "../../components/ecommerce/checkout/ShippingStep";
import ReviewStep from "../../components/ecommerce/checkout/ReviewStep";
import OrderSidebar from "../../components/ecommerce/checkout/OrderSidebar";
import { showError } from "../../utilits/toast";
import { resetPaymentStatus } from "../../store/payment/PaymentSlice";
import actCreateCheckoutSession from "../../store/payment/actCreateCheckoutSession";

type TStep = 0 | 1 | 2;

function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useAppSelector((s) => s.auth);
  const {
    items,
    ItemsFullInfo,
    status: cartStatus,
  } = useAppSelector((s) => s.cart);
  // add
  const { status: paymentStatus, error: paymentError } = useAppSelector(
    (s) => s.payment,
  );

  //old
  const { error: orderError } = useAppSelector((s) => s.orders);

  const { discount = 0, coupon = null } =
    (location.state as {
      discount: number;
      discountPct: number;
      coupon: string | null;
    }) ?? {};

  const [currentStep, setCurrentStep] = useState<TStep>(0);
  const [shippingData, setShippingData] = useState<TcheckoutForm | null>(null);
  // //pld
  // const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const itemsKey = Object.keys(items).join(",");
  useEffect(() => {
    if (!Object.keys(items).length) return;
    const promise = dispatch(getItemsInfo());
    return () => {
      promise.abort();
      dispatch(cleanUpCartFullInfo());
    };
  }, [dispatch, itemsKey]);

  //new
  useEffect(() => {
    return () => {
      dispatch(resetOrderStatus());
      dispatch(resetPaymentStatus());
    };
  }, [dispatch]);
  // Show payment error as toast (Edge Function call failed)
  useEffect(() => {
    if (paymentStatus === "failed" && paymentError) {
      showError(paymentError);
    }
  }, [paymentStatus, paymentError]);

  const products = ItemsFullInfo.map((p) => ({
    ...p,
    quantity: items[p.id!] ?? 1,
  }));
  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const discountAmount = discount;
  const total = +(subtotal - discountAmount).toFixed(2);
  const isLoading = cartStatus === "pending" || cartStatus === "idle";

  //gurds
  if (!token) return <Navigate to="/login?message=login_required" />;
  if (!Object.keys(items).length && currentStep < 2)
    return <Navigate to="/cart" />;

  const handlePay = () => {
    if (!shippingData) return;
    dispatch(
      actCreateCheckoutSession({
        shippingData,
        discount: discountAmount,
        coupon,
      }),
    );
    // Note: on success this redirects the browser to Stripe — fulfilled case
    // barely fires in practice. The error case fires and we show a toast above.
  };

  const handleBackToCart = () => {
    //new
    dispatch(resetPaymentStatus());
    navigate("/cart");
  };

  return (
    <Container className="pt-4 pb-5" style={{ maxWidth: 900 }}>
      <Heading>Checkout</Heading>

      <StepIndicator currentStep={currentStep} />

      <Row className="g-4 align-items-start">
        <Col xs={12} md={7}>
          <div className="border rounded-3 p-4 ">
            {currentStep === 0 && (
              <ShippingStep
                setShippingData={setShippingData}
                setCurrentStep={setCurrentStep as (s: 0 | 1 | 2) => void}
                handleBackToCart={handleBackToCart}
              />
            )}
            {currentStep === 1 && (
              <ReviewStep
                shippingData={shippingData}
                setCurrentStep={setCurrentStep as (s: 0 | 1 | 2) => void}
                isLoading={isLoading}
                products={products}
                subtotal={subtotal}
                total={total}
                discountAmount={discountAmount}
                coupon={coupon}
                orderError={orderError}
                handlePay={handlePay}
                paymentStatus={paymentStatus}
              />
            )}
          </div>
        </Col>
        <Col xs={12} md={5}>
          <OrderSidebar
            isLoading={isLoading}
            products={products}
            total={total}
            subtotal={subtotal}
            discountAmount={discountAmount}
            coupon={coupon}
          />
        </Col>
      </Row>
      {/* )} */}
    </Container>
  );
}

export default Checkout;
