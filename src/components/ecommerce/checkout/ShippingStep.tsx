import { Form, Row, Col, Button } from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import type { TcheckoutForm } from "../../../validations/checkout";
import { checkoutSchema } from "../../../validations/checkout";
type TStep = 0 | 1 | 2;

interface IProps {
  setShippingData: (data: TcheckoutForm) => void;
  setCurrentStep: (step: TStep) => void;
  handleBackToCart: () => void;
}

function ShippingStep({
  setShippingData,
  setCurrentStep,
  handleBackToCart,
}: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TcheckoutForm>({
    mode: "onBlur",
    resolver: zodResolver(checkoutSchema),
  });

  const onAddressSubmit: SubmitHandler<TcheckoutForm> = (data) => {
    setShippingData(data);
    setCurrentStep(1);
  };

  return (
    <Form onSubmit={handleSubmit(onAddressSubmit)} noValidate>
      <h5 className="fw-bold mb-4">Shipping address</h5>

      <Form.Group className="mb-3">
        <Form.Label>
          Full name <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder=""
          isInvalid={!!errors.fullName}
          {...register("fullName")}
        />
        <Form.Control.Feedback type="invalid">
          {errors.fullName?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          Phone number <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="tel"
          placeholder="+20 "
          isInvalid={!!errors.phone}
          {...register("phone")}
        />
        <Form.Control.Feedback type="invalid">
          {errors.phone?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          Street address <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="123 El-Tahrir St, Apt 4"
          isInvalid={!!errors.address}
          {...register("address")}
        />
        <Form.Control.Feedback type="invalid">
          {errors.address?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Row className="g-3 mb-3">
        <Col xs={12} sm={7}>
          <Form.Label>
            City <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Cairo"
            isInvalid={!!errors.city}
            {...register("city")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.city?.message}
          </Form.Control.Feedback>
        </Col>
        <Col xs={12} sm={5}>
          <Form.Label>
            Postal code <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="11511"
            isInvalid={!!errors.postalCode}
            {...register("postalCode")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.postalCode?.message}
          </Form.Control.Feedback>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>
          Delivery notes <span className="text-muted small">(optional)</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Ring the bell, leave at door, etc."
          {...register("notes")}
        />
      </Form.Group>

      <div className="d-flex gap-3">
        <Button variant="outline-secondary" onClick={handleBackToCart}>
          ← Back to cart
        </Button>
        <Button
          type="submit"
          variant="info"
          className="text-white fw-semibold px-4"
        >
          Review order →
        </Button>
      </div>
    </Form>
  );
}

export default ShippingStep;
