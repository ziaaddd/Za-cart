import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import actUpdateProfile from "../store/auth/actUpdateProfile";
import { resetUpdateStatus } from "../store/auth/AuthSlice";
import actGetOrders from "../store/orders/actGetOrders";
import type { TorderStatus } from "../types/orders";
import { showSuccess } from "../utilits/toast";

const profileSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((d) => !d.newPassword || d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => !d.newPassword || d.newPassword.length >= 8, {
    message: "Password must be at least 8 characters",
    path: ["newPassword"],
  });

type TprofileForm = z.infer<typeof profileSchema>;

const STATUS_CONFIG: Record<TorderStatus, { bg: string; label: string }> = {
  pending: { bg: "warning", label: "Pending" },
  confirmed: { bg: "info", label: "Confirmed" },
  shipped: { bg: "primary", label: "Shipped" },
  delivered: { bg: "success", label: "Delivered" },
  cancelled: { bg: "danger", label: "Cancelled" },
};

function Profile() {
  const dispatch = useAppDispatch();

  const { user, updateStatus, updateError } = useAppSelector((s) => s.auth);
  const { orders, getOrdersStatus } = useAppSelector((s) => s.orders);

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // fetch recent orders
  useEffect(() => {
    if (getOrdersStatus === "idle") dispatch(actGetOrders());
  }, [dispatch, getOrdersStatus]);

  useEffect(
    () => () => {
      dispatch(resetUpdateStatus());
    },
    [dispatch],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TprofileForm>({
    mode: "onBlur",
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<TprofileForm> = (data) => {
    dispatch(
      actUpdateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        newPassword: data.newPassword || undefined,
      }),
    )
      .unwrap()
      .then(() => {
        showSuccess("Profile updated successfully");
        setEditMode(false);
        setShowPasswordFields(false);
        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          newPassword: "",
          confirmPassword: "",
        });
      });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setShowPasswordFields(false);
    dispatch(resetUpdateStatus());
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const recentOrders = orders.slice(0, 3);

  return (
    <Container className="pt-4 pb-5" style={{ maxWidth: 860 }}>
      <h2 className="fw-bold mb-4" style={{ color: "#0dcaf0" }}>
        My profile
      </h2>
      <Row className="g-4">
        <Col xs={12} md={7}>
          <div className="border rounded-3 p-4 mb-4">
            <div className="d-flex align-items-center gap-4 mb-4">
              <div
                className="rounded-circle bg-info d-flex align-items-center justify-content-center flex-shrink-0 text-white fw-bold"
                style={{ width: 72, height: 72, fontSize: 25 }}
              >
                {user?.firstName?.charAt(0).toUpperCase()}
                {user?.lastName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h5 className="fw-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </h5>
                <p className="text-muted mb-1 small">{user?.email}</p>
                <span className="badge  text-muted border small">
                  Za-Cart member
                </span>
              </div>
            </div>

            <Row className="g-3 text-center mb-4">
              <Col xs={6}>
                <div className="border rounded-3 py-3">
                  <p className="fw-bold fs-4 mb-0 text-info">{orders.length}</p>
                  <p className="text-muted small mb-0">Total orders</p>
                </div>
              </Col>
              <Col xs={6}>
                <div className="border rounded-3 py-3">
                  <p className="fw-bold fs-4 mb-0 text-success">
                    {orders.filter((o) => o.status === "delivered").length}
                  </p>
                  <p className="text-muted small mb-0">Delivered</p>
                </div>
              </Col>
            </Row>

            {!editMode && (
              <Button
                variant="outline-info"
                className="w-100"
                onClick={() => setEditMode(true)}
              >
                Edit profile
              </Button>
            )}
          </div>

          {editMode && (
            <div className="border rounded-3 p-4">
              <h6 className="fw-bold mb-4 text-info">Edit profile</h6>

              {updateStatus === "succeeded" && (
                <Alert variant="success" className="small py-2 mb-3">
                  Profile updated successfully!
                </Alert>
              )}
              {updateStatus === "failed" && updateError && (
                <Alert variant="danger" className="small py-2 mb-3">
                  {updateError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Row className="g-3 mb-3">
                  <Col xs={12} sm={6}>
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text"
                      isInvalid={!!errors.firstName}
                      {...register("firstName")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName?.message}
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      type="text"
                      isInvalid={!!errors.lastName}
                      {...register("lastName")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName?.message}
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Email{" "}
                    <span className="text-muted small">
                      (cannot be changed)
                    </span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                  />
                </Form.Group>

                <div className="mb-3">
                  <Button
                    variant="link"
                    className="p-0 text-info text-decoration-none small fw-semibold"
                    onClick={() => setShowPasswordFields((v) => !v)}
                    type="button"
                  >
                    {showPasswordFields
                      ? "▲ Cancel password change"
                      : "▼ Change password"}
                  </Button>
                </div>

                {showPasswordFields && (
                  <Row className="g-3 mb-3">
                    <Col xs={12} sm={6}>
                      <Form.Label>New password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Min. 8 characters"
                        isInvalid={!!errors.newPassword}
                        {...register("newPassword")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.newPassword?.message}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Label>Confirm password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Repeat new password"
                        isInvalid={!!errors.confirmPassword}
                        {...register("confirmPassword")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword?.message}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                )}

                <div className="d-flex gap-3 mt-2">
                  <Button
                    variant="outline-secondary"
                    onClick={handleCancelEdit}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="info"
                    className="text-white fw-semibold px-4"
                    disabled={updateStatus === "pending" || !isDirty}
                  >
                    {updateStatus === "pending" ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Saving…
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </Col>

        <Col xs={12} md={5}>
          <div className="border rounded-3 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Recent orders</h6>
              {orders.length > 3 && (
                <Link
                  to="/orders"
                  className="small text-info text-decoration-none"
                >
                  See all →
                </Link>
              )}
            </div>

            {getOrdersStatus === "pending" && (
              <div className="text-center py-4">
                <Spinner animation="border" variant="info" size="sm" />
              </div>
            )}

            {getOrdersStatus === "succeeded" && recentOrders.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted small mb-3">No orders yet.</p>
                <Link to="/categories">
                  <Button variant="outline-info" size="sm">
                    Start shopping
                  </Button>
                </Link>
              </div>
            )}

            {getOrdersStatus === "succeeded" && recentOrders.length > 0 && (
              <div className="d-flex flex-column gap-3">
                {recentOrders.map((order) => {
                  const { bg, label } = STATUS_CONFIG[order.status] ?? {
                    bg: "secondary",
                    label: order.status,
                  };
                  const date = new Date(order.created_at).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  );
                  return (
                    <div key={order.id} className="border rounded-3 p-3">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="small fw-semibold text-info">
                          #{order.id}
                        </span>
                        <Badge bg={bg} className="ms-2">
                          {label}
                        </Badge>
                      </div>
                      <p className="text-muted small mb-1">{date}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">
                          {order.orderItems.length} item
                          {order.orderItems.length !== 1 ? "s" : ""}
                        </span>
                        <span className="fw-bold small">
                          {order.total_price.toFixed(2)} EGP
                        </span>
                      </div>
                    </div>
                  );
                })}

                <Link to="/orders" className="w-100">
                  <Button variant="outline-info" size="sm" className="w-100">
                    View all orders
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
