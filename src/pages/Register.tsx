import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Container,
  Alert,
} from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type registerType } from "../validations/Register";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import actAuthRegister from "../store/auth/actAuthRegister";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { cleanUser } from "../store/auth/AuthSlice";
import PasswordInput from "../components/common/passwowrd-input/PasswordInput";
import GoogleButton from "../components/common/google-btn/GoogleButton";
import { showSuccess } from "../utilits/toast";

function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error, token } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
  } = useForm<registerType>({
    mode: "onBlur",
    resolver: zodResolver(registerSchema),
  });

  const submitForm: SubmitHandler<registerType> = (data) => {
    const { firstName, lastName, email, password } = data;

    dispatch(actAuthRegister({ firstName, lastName, email, password }))
      .unwrap()
      .then(() => {
        showSuccess("Your account created, welcome to Za-Cart");

        navigate("/");
      });
  };

  useEffect(() => {
    return () => {
      dispatch(cleanUser());
    };
  }, [dispatch]);

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="border rounded-3 p-4 p-md-5 ">
            <h2
              className="fw-bold text-center mb-4"
              style={{ color: "#0dcaf0" }}
            >
              Create your account
            </h2>
            <Form onSubmit={handleSubmit(submitForm)}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  {...register("firstName")}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  {...register("lastName")}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 position-relative">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  {...register("email")}
                  isInvalid={!!errors.email}
                />
                {isValidating && (
                  <div className="position-absolute end-0 top-50 me-3">
                    <Spinner animation="border" size="sm" variant="primary" />
                  </div>
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <PasswordInput
                  isInvalid={!!errors.password}
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="text-danger small mt-1 mb-0">
                    {errors.password.message}
                  </p>
                ) : (
                  <p className="text-muted small mt-1 mb-0">
                    Min. 8 characters, at least 1 special character
                  </p>
                )}
              </Form.Group>

              {/* Confirm password */}
              <Form.Group className="mb-4">
                <Form.Label>Confirm password</Form.Label>
                <PasswordInput
                  isInvalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-danger small mt-1 mb-0">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Form.Group>

              <Form.Group style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  disabled={isValidating}
                  style={{ backgroundColor: "#0dcaf0", border: "none" }}
                >
                  {isValidating
                    ? "Validating..."
                    : status === "pending"
                      ? "Loading..."
                      : "Register"}
                </Button>
              </Form.Group>
              <div className="d-flex align-items-center gap-2 my-3">
                <hr className="flex-grow-1" />
                <span className="text-muted small">or</span>
                <hr className="flex-grow-1" />
              </div>

              {/* Google OAuth */}
              <GoogleButton />

              {/* Error */}
              {error && (
                <Alert variant="danger" className="mt-3 mb-0 small text-center">
                  {error}
                </Alert>
              )}
              {/* login alt */}
              <p
                className="text-center my-2 "
                style={{ color: "#cdc9c9", fontSize: "15px" }}
              >
                Already have an account?
                <Link to="/login" style={{ color: "#0dcaf0" }}>
                  log In
                </Link>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
