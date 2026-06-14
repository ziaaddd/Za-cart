import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actOrders from "../../store/orders/actOrders";
import {
  cleanUpCartAfterSubmitOrder,
  cleanUpCartFullInfo,
} from "../../store/cart/CartSlice";
import { resetOrderStatus } from "../../store/orders/OrdersSlice";
import { type TcheckoutForm } from "../../validations/checkout";
import getItemsInfo from "../../store/cart/actGetItemsInfo";
import Heading from "../../components/common/heading-title/Heading";
import StepIndicator from "../../components/ecommerce/checkout/StepIndicator";
import ConfirmationStep from "../../components/ecommerce/checkout/ConfirmationStep";
import ShippingStep from "../../components/ecommerce/checkout/ShippingStep";
import ReviewStep from "../../components/ecommerce/checkout/ReviewStep";
import OrderSidebar from "../../components/ecommerce/checkout/OrderSidebar";
import { showSuccess, showError } from "../../utilits/toast";
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
  const { status: orderStatus, error: orderError } = useAppSelector(
    (s) => s.orders,
  );

  const { discount = 0, coupon = null } =
    (location.state as {
      discount: number;
      discountPct: number;
      coupon: string | null;
    }) ?? {};

  const [currentStep, setCurrentStep] = useState<TStep>(0);
  const [shippingData, setShippingData] = useState<TcheckoutForm | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const itemsKey = Object.keys(items).join(",");
  useEffect(() => {
    if (!Object.keys(items).length) return;
    const promise = dispatch(getItemsInfo());
    return () => {
      promise.abort();
      dispatch(cleanUpCartFullInfo());
    };
  }, [dispatch, itemsKey]);

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

  const handlePlaceOrder = () => {
    if (!shippingData) return;
    dispatch(
      actOrders({
        totalPrice: subtotal,
        discount: discountAmount,
        shippingAddress: shippingData,
      }),
    )
      .unwrap()
      .then((data) => {
        dispatch(cleanUpCartAfterSubmitOrder());
        setConfirmedOrderId(data?.completeOrder.id ?? "--");
        setCurrentStep(2);
        showSuccess("Order placed successfully!");
      })
      .catch((err: string) =>
        showError(err || "Couldn't place your order, Try again."),
      );
  };

  const handleBackToCart = () => {
    dispatch(resetOrderStatus());
    navigate("/cart");
  };

  return (
    <Container className="pt-4 pb-5" style={{ maxWidth: 900 }}>
      <Heading>Chekout</Heading>

      <StepIndicator currentStep={currentStep} />

      {currentStep === 2 ? (
        <ConfirmationStep
          confirmedOrderId={confirmedOrderId}
          shippingData={shippingData}
        />
      ) : (
        <Row className="g-4 align-items-start">
          <Col xs={12} md={7}>
            <div className="border rounded-3 p-4 bg-white">
              {currentStep === 0 && (
                <ShippingStep
                  setShippingData={setShippingData}
                  setCurrentStep={setCurrentStep}
                  handleBackToCart={handleBackToCart}
                />
              )}
              {currentStep === 1 && (
                <ReviewStep
                  shippingData={shippingData}
                  setCurrentStep={setCurrentStep}
                  isLoading={isLoading}
                  products={products}
                  subtotal={subtotal}
                  total={total}
                  discountAmount={discountAmount}
                  coupon={coupon}
                  orderError={orderError}
                  handlePlaceOrder={handlePlaceOrder}
                  orderStatus={orderStatus}
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
      )}
    </Container>
  );
}

export default Checkout;
