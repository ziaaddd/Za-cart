import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetOrders from "../../store/orders/actGetOrders";
import LoadingError from "../../components/feedback/loading-error/LoadingError";
import LottiesHandler from "../../components/feedback/lotties/LottiesHandler";
import Heading from "../../components/common/heading-title/Heading";
import OrderCard from "../../components/ecommerce/orders/OrderCard";

function Orders() {
  const dispatch = useAppDispatch();
  const { orders, getOrdersStatus, getOrdersError } = useAppSelector(
    (s) => s.orders,
  );

  useEffect(() => {
    const promise = dispatch(actGetOrders());
    return () => promise.abort();
  }, [dispatch]);

  return (
    <Container className="pt-4 pb-5">
      {/* Page heading */}
      <div className="d-flex align-items-baseline justify-content-between mb-4 flex-wrap gap-2">
        <Heading> My orders</Heading>
        {getOrdersStatus === "succeeded" && orders.length > 0 && (
          <span className="text-muted small">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <LoadingError
        status={getOrdersStatus}
        error={getOrdersError}
        type="order"
      >
        {orders.length === 0 ? (
          <div className="text-center py-4">
            <LottiesHandler type="empty" />
            <h5 className="fw-bold mb-2">No orders yet</h5>
            <p className="text-muted mb-4">
              When you place an order it will show up here.
            </p>
            <Link to="/categories">
              <Button variant="info" className="text-white fw-semibold px-4">
                Start shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </LoadingError>
    </Container>
  );
}

export default Orders;
