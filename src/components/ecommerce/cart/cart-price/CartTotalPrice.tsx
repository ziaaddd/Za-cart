import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import type { Tproduct } from "../../../../types/product";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../store/hooks";

const COUPONS: Record<string, number> = {
  SAVE10: 10,
  SAVE20: 20,
  ZACART: 15,
};

interface Props {
  products: Tproduct[];
}

function CartTotalPrice({ products }: Props) {
  const navigate = useNavigate();

  const { token } = useAppSelector((state) => state.auth);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = products.reduce((acc, p) => {
    return acc + p.price * (p.quantity ?? 1);
  }, 0);

  const discountPct = appliedCoupon ? COUPONS[appliedCoupon] : 0;
  const discountAmount = +(subtotal * (discountPct / 100)).toFixed(2);
  const total = +(subtotal - discountAmount).toFixed(2);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try SAVE10, SAVE20, or ZACART.");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: { discount: discountAmount, discountPct, coupon: appliedCoupon },
    });
  };

  return (
    <>
      {/*order summary card */}
      <div className="border rounded-3 p-4 ">
        <h5 className="fw-bold mb-4">Order summary</h5>

        <div className="d-flex flex-column gap-2 mb-2">
          {products.map((p) => (
            <div key={p.id} className="d-flex justify-content-between small">
              <span
                className="text-muted text-truncate me-2"
                style={{ maxWidth: 160 }}
              >
                {p.name} × {p.quantity ?? 1}
              </span>
              <span className="fw-semibold text-nowrap">
                {(p.price * (p.quantity ?? 1)).toFixed(2)} EGP
              </span>
            </div>
          ))}
        </div>

        <hr />

        {/* coupon input */}
        <div className="mb-3">
          <Form.Label className="small fw-semibold mb-1">
            Coupon code
          </Form.Label>
          {appliedCoupon ? (
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success px-3 py-2 fs-6">
                {appliedCoupon} — {discountPct}% off
              </span>
              <Button
                variant="link"
                size="sm"
                className="text-danger p-0"
                onClick={handleRemoveCoupon}
              >
                Remove
              </Button>
            </div>
          ) : (
            <>
              <InputGroup size="sm">
                <Form.Control
                  placeholder="Enter code…"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  aria-label="Coupon code"
                />
                <Button
                  variant="outline-info"
                  onClick={handleApplyCoupon}
                  disabled={!couponInput.trim()}
                >
                  Apply
                </Button>
              </InputGroup>
              {couponError && (
                <p className="text-danger small mt-1 mb-0">{couponError}</p>
              )}
            </>
          )}
        </div>

        <hr />

        {/* final price  */}
        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted">Subtotal</span>
          <span>{subtotal.toFixed(2)} EGP</span>
        </div>

        {discountAmount > 0 && (
          <div className="d-flex justify-content-between mb-1 text-success">
            <span>Discount ({discountPct}%)</span>
            <span>− {discountAmount.toFixed(2)} EGP</span>
          </div>
        )}

        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted">Shipping</span>
          <span className="text-success small fw-semibold">Free</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
          <span>Total</span>
          <span className="text-info">{total.toFixed(2)} EGP</span>
        </div>

        {/* disabled if not logged in */}
        <Button
          variant="info"
          className="w-100 text-white fw-bold py-2"
          onClick={handleCheckout}
          disabled={!token}
          title={!token ? "Login to place an order" : undefined}
        >
          Proceed to checkout
        </Button>

        {!token && (
          <p className="text-muted text-center small mt-2 mb-0">
            <Link to="/login" className="text-info">
              Log in
            </Link>
            to place your order
          </p>
        )}
      </div>
    </>
  );
}

export default CartTotalPrice;
