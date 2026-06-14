import { Spinner } from "react-bootstrap";
import type { Tproduct } from "../../../types/product";

interface IProps {
  isLoading: boolean;
  products: Tproduct[];
  total: number;
  subtotal: number;
  discountAmount: number;
  coupon: string | null;
}

function OrderSidebar({
  isLoading,
  products,
  total,
  subtotal,
  discountAmount,
  coupon,
}: IProps) {
  return (
    <div
      className="border rounded-3 p-4 bg-light position-sticky"
      style={{ top: 16 }}
    >
      <h6 className="fw-bold mb-3">Order summary</h6>

      {isLoading ? (
        <div className="text-center py-3">
          <Spinner animation="border" variant="info" size="sm" />
        </div>
      ) : (
        <>
          <div className="d-flex flex-column gap-2 mb-3">
            {products.map((p) => (
              <div key={p.id} className="d-flex justify-content-between small">
                <span
                  className="text-muted text-truncate me-2"
                  style={{ maxWidth: 140 }}
                >
                  {p.name} × {p.quantity}
                </span>
                <span className="fw-semibold text-nowrap">
                  {(p.price * p.quantity!).toFixed(2)} EGP
                </span>
              </div>
            ))}
          </div>
          <hr className="my-2" />
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Subtotal</span>
            <span>{subtotal.toFixed(2)} EGP</span>
          </div>
          {discountAmount > 0 && (
            <div className="d-flex justify-content-between small mb-1 text-success">
              <span>Coupon ({coupon})</span>
              <span>− {discountAmount.toFixed(2)} EGP</span>
            </div>
          )}
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Shipping</span>
            <span className="text-success">Free</span>
          </div>
          <hr className="my-2" />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span className="text-info">{total.toFixed(2)} EGP</span>
          </div>
        </>
      )}
    </div>
  );
}
export default OrderSidebar;
