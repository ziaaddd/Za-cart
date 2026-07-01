import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { cleanUpCartAfterSubmitOrder } from "../../store/cart/CartSlice";
import actGetOrders from "../../store/orders/actGetOrders";
import LottiesHandler from "../../components/feedback/lotties/LottiesHandler";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const sessionId = searchParams.get("session_id");
  const { orders, getOrdersStatus } = useAppSelector((state) => state.orders);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // 1. Clear the Redux cart >> (visual only DB was cleared by webhook)
    dispatch(cleanUpCartAfterSubmitOrder());

    // 2. Refresh orders list so the new order appears immediately in Orders page
    dispatch(actGetOrders());
  }, [dispatch]);

  // Find the most recent order to display its ID
  const latestOrder = orders[0];

  return (
    <Container className="py-5 text-center" style={{ maxWidth: 600 }}>
      <LottiesHandler type="success" />

      <h3 className="fw-bold mt-2 mb-2">Payment successful!</h3>
      <p className="text-muted mb-1">
        Thank you for your purchase. Your order has been confirmed and is being
        prepared.
      </p>

      {sessionId && (
        <p className="text-muted small mb-1">
          Stripe reference:{" "}
          <span className="fw-semibold text-info">
            {sessionId.slice(0, 24)}…
          </span>
        </p>
      )}

      {getOrdersStatus === "pending" && (
        <p className="text-muted small mb-4">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading order details…
        </p>
      )}

      {getOrdersStatus === "succeeded" && latestOrder && (
        <p className="text-muted small mb-4">
          Order ID:{" "}
          <span className="fw-semibold text-info">#{latestOrder.id}</span>
        </p>
      )}

      <div className="border rounded-3 p-4 mb-4 text-start">
        <h6 className="fw-bold mb-3">What happens next?</h6>
        <div className="d-flex flex-column gap-2">
          {[
            { icon: "✅", text: "Your payment has been confirmed by Stripe" },
            { icon: "📦", text: "We are preparing your order for shipment" },
            { icon: "🚚", text: "You will receive a delivery notification" },
            { icon: "📋", text: "Track your order in the Orders section" },
          ].map(({ icon, text }) => (
            <div key={text} className="d-flex align-items-start gap-2 small">
              <span style={{ flexShrink: 0 }}>{icon}</span>
              <span className="text-muted">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <Link to="/orders">
          <Button variant="info" className="text-white fw-semibold px-4">
            View my orders
          </Button>
        </Link>
        <Button
          variant="outline-info"
          className="fw-semibold px-4"
          onClick={() => navigate("/categories")}
        >
          Continue shopping
        </Button>
      </div>
    </Container>
  );
}

export default PaymentSuccess;
