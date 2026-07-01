import { useNavigate, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import LottiesHandler from "../../components/feedback/lotties/LottiesHandler";

function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <Container className="py-5 text-center" style={{ maxWidth: 540 }}>
      <LottiesHandler type="error" />

      <h3 className="fw-bold mt-2 mb-2">Payment cancelled</h3>
      <p className="text-muted mb-4">
        No charge was made. Your cart is saved — you can try again whenever
        you're ready.
      </p>

      <div className="border rounded-3 p-4 mb-4 text-start">
        <h6 className="fw-bold mb-3">Having trouble paying?</h6>
        <div className="d-flex flex-column gap-2">
          {[
            "Make sure your card details are correct",
            "Check you have sufficient funds",
            "Try a different card",
            "Use the test card: 4242 4242 4242 4242 (any future date, any CVC)",
          ].map((tip) => (
            <p key={tip} className="small text-muted mb-0">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <Button
          variant="info"
          className="text-white fw-semibold px-4"
          onClick={() => navigate("/checkout")}
        >
          Try again
        </Button>
        <Link to="/cart">
          <Button variant="outline-secondary" className="px-4">
            Back to cart
          </Button>
        </Link>
      </div>
    </Container>
  );
}

export default PaymentCancel;
