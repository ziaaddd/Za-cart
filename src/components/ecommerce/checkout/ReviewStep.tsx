import { Alert, Button, Spinner } from "react-bootstrap";
import type { TcheckoutForm } from "../../../validations/checkout";
import type { Tproduct } from "../../../types/product";
type TStep = 0 | 1 | 2;

interface IProps {
  shippingData: TcheckoutForm | null;
  setCurrentStep: (step: TStep) => void;
  isLoading: boolean;
  products: Tproduct[];
  subtotal: number;
  total: number;
  discountAmount: number;
  coupon: string | null;
  orderError: string | null;
  handlePay: () => void;
  paymentStatus: string;
}

function ReviewStep({
  setCurrentStep,
  shippingData,
  isLoading,
  products,
  subtotal,
  total,
  discountAmount,
  coupon,
  orderError,
  handlePay,
  paymentStatus,
}: IProps) {
  return (
    <div>
      <h5 className="fw-bold mb-4">Review your order</h5>

      {/* Shipping summary  */}
      <div className="border rounded-3 p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-semibold mb-0">Shipping to</h6>
          <Button
            variant="link"
            size="sm"
            className="text-info p-0"
            onClick={() => setCurrentStep(0)}
          >
            Edit
          </Button>
        </div>
        {shippingData && (
          <div className="small text-muted lh-lg">
            <p className="mb-0  fw-semibold">{shippingData.fullName}</p>
            <p className="mb-0">{shippingData.phone}</p>
            <p className="mb-0">{shippingData.address}</p>
            <p className="mb-0">
              {shippingData.city}, {shippingData.postalCode}
            </p>
            {shippingData.notes && (
              <p className="mb-0 fst-italic">Note: {shippingData.notes}</p>
            )}
          </div>
        )}
      </div>

      <div className="border rounded-3 p-3 mb-4">
        <h6 className="fw-semibold mb-3">Items ({products.length})</h6>
        {isLoading ? (
          <div className="text-center py-2">
            <Spinner animation="border" size="sm" variant="info" />
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {products.map((p) => (
              <div key={p.id} className="d-flex align-items-center gap-3">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="rounded-2 object-fit-contai flex-shrink-0"
                  style={{ width: 56, height: 56 }}
                />
                <div className="flex-grow-1">
                  <p className="mb-0 fw-semibold small">{p.name}</p>
                  <p className="mb-0 text-muted small">
                    Quantity: {p.quantity}
                  </p>
                </div>
                <span className="fw-bold text-nowrap small">
                  {(p.price * p.quantity!).toFixed(2)} EGP
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border rounded-3 p-3 mb-4">
        <div className="d-flex justify-content-between mb-1 small">
          <span className="text-muted">Subtotal</span>
          <span>{subtotal.toFixed(2)} EGP</span>
        </div>
        {discountAmount > 0 && (
          <div className="d-flex justify-content-between mb-1 small text-success">
            <span>Discount ({coupon})</span>
            <span>− {discountAmount.toFixed(2)} EGP</span>
          </div>
        )}
        <div className="d-flex justify-content-between mb-1 small">
          <span className="text-muted">Shipping</span>
          <span className="text-success">Free</span>
        </div>
        <hr className="my-2" />
        <div className="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span className="text-info fs-5">{total.toFixed(2)} EGP</span>
        </div>
      </div>

      {orderError && (
        <Alert variant="danger" className="small py-2">
          {orderError}
        </Alert>
      )}

      {/* Redirecting notice — shown while waiting for Stripe redirect */}
      {paymentStatus == "pending" && (
        <Alert variant="info" className="small py-2 mb-3">
          <Spinner animation="border" size="sm" className="me-2" />
          Connecting to Stripe… do not close this tab.
        </Alert>
      )}

      <div className="d-flex gap-3">
        <Button variant="outline-secondary" onClick={() => setCurrentStep(0)}>
          ← Edit address
        </Button>
        <Button
          variant="info"
          className="text-white fw-bold px-4"
          onClick={handlePay}
          disabled={paymentStatus === "pending" || isLoading}
        >
          {paymentStatus === "pending" ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Redirecting…
            </>
          ) : (
            <>🔒 Pay {total.toFixed(2)} EGP</>
          )}
        </Button>
      </div>
      <p className="text-muted small mt-3 mb-0">
        🔐 Payments are processed securely by{" "}
        <a
          href="https://stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-info"
        >
          Stripe
        </a>
        . We never store your card details.
      </p>
    </div>
  );
}

export default ReviewStep;
