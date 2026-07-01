import { Form, Button, Row, Col, Container, Alert } from "react-bootstrap";
import { logInSchema, type logInType } from "../validations/Login";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { actAuthLogIn } from "../store/auth/actAuthLogIn";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { cleanUser } from "../store/auth/AuthSlice";
import { useEffect, useState } from "react";
import { actLoadCartFromServer } from "../store/cart/actSyncCart";
import actGetLikedProducts from "../store/wishlist/actGetLikedProducts";
import PasswordInput from "../components/common/passwowrd-input/PasswordInput";
import GoogleButton from "../components/common/google-btn/GoogleButton";
import { showSuccess } from "../utilits/toast";

const REMEMBER_KEY = "remembered_email";

function LogIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error, token } = useAppSelector((state) => state.auth);

  const rememberedEmail = localStorage.getItem(REMEMBER_KEY) ?? "";
  const [rememberMe, setRememberMe] = useState(!!rememberedEmail);

  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
  } = useForm<logInType>({
    mode: "onBlur",
    resolver: zodResolver(logInSchema),
    defaultValues: { email: rememberedEmail, password: "" },
  });

  const submitForm: SubmitHandler<logInType> = (data) => {
    const { password, email } = data;

    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    dispatch(actAuthLogIn({ password, email }))
      .unwrap()
      .then(() => {
        dispatch(actLoadCartFromServer());
        dispatch(actGetLikedProducts("productsIds"));
        showSuccess("Welcome back! to ZaCart");

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
              Welcome back
            </h2>
            <Form onSubmit={handleSubmit(submitForm)}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  isInvalid={!!errors.email}
                  {...register("email")}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <PasswordInput
                  isInvalid={!!errors.password}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-danger small mt-1 mb-0">
                    {errors.password.message}
                  </p>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="remember-me"
                  label="Remember my email"
                  onChange={(e) => setRememberMe(e.target.checked)}
                  checked={rememberMe}
                />
              </Form.Group>

              <Form.Group style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  disabled={isValidating}
                  style={{
                    width: " 35%",
                    backgroundColor: "#0dcaf0",
                    color: "white",
                    border: "none",
                  }}
                >
                  {isValidating ? "Logging in..." : "Log In"}
                </Button>
              </Form.Group>

              <div className="d-flex align-items-center gap-2 my-3">
                <hr className="flex-grow-1" />
                <span className="text-muted small">or</span>
                <hr className="flex-grow-1" />
              </div>

              {/* Google OAuth */}
              <GoogleButton />

              <p
                className="text-center my-2 "
                style={{ color: "#cdc9c9", fontSize: "15px" }}
              >
                Don't have an account?
                <Link to="/register" style={{ color: "#0dcaf0" }}>
                  {isValidating
                    ? "Validating..."
                    : status === "pending"
                      ? "Loading..."
                      : "Sign Up"}
                </Link>
              </p>
              {error && (
                <Alert variant="danger" className="mt-3 mb-0 small text-center">
                  {error}
                </Alert>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LogIn;
