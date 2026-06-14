import LottiesHandler from "../../feedback/lotties/LottiesHandler";
import type { TcheckoutForm } from "../../../validations/checkout";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Iprops {
  confirmedOrderId: string | null;
  shippingData: TcheckoutForm | null;
}

function ConfirmationStep({ confirmedOrderId, shippingData }: Iprops) {
  const navigate = useNavigate();

  return (
    <div className="text-center py-3">
      <LottiesHandler type="success" />
      <h4 className="fw-bold mt-2 mb-2">Order placed successfully!</h4>
      {confirmedOrderId && (
        <p className="text-muted small mb-1">
          Order ID:{" "}
          <span className="fw-semibold text-dark">{confirmedOrderId}</span>
        </p>
      )}
      {shippingData && (
        <p className="text-muted small mb-4">
          We'll deliver to{" "}
          <strong>
            {shippingData.address}, {shippingData.city}
          </strong>
          .
        </p>
      )}
      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <Button
          variant="info"
          className="text-white fw-semibold px-4"
          onClick={() => navigate("/categories")}
        >
          Continue shopping
        </Button>
        <Button
          variant="outline-info"
          className="fw-semibold px-4"
          onClick={() => navigate("/orders")}
        >
          View my orders
        </Button>
      </div>
    </div>
  );
}

export default ConfirmationStep;
