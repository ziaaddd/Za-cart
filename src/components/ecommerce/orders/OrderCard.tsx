import { memo, useState } from "react";
import type { Torders, TorderStatus } from "../../../types/orders";
import { Badge, Button, Col, Collapse, Row } from "react-bootstrap";

const STATUS_CONFIG: Record<TorderStatus, { bg: string; label: string }> = {
  pending: { bg: "warning", label: "Pending" },
  confirmed: { bg: "info", label: "Confirmed" },
  shipped: { bg: "primary", label: "Shipped" },
  delivered: { bg: "success", label: "Delivered" },
  cancelled: { bg: "danger", label: "Cancelled" },
};

function OrderCard({ order }: { order: Torders }) {
  const [open, setOpen] = useState(false);

  const { bg, label } = STATUS_CONFIG[order.status] ?? {
    bg: "secondary",
    label: order.status,
  };

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border rounded-3 p-3 p-md-4 ">
      <Row className=" align-items-center  g-2">
        <Col xs={6} className=" justify-content-center">
          <p className="mb-0 fw-semibold " style={{ fontSize: 15 }}>
            Order <span className="text-info">#{order.id}</span>
          </p>
          <p className="mb-0 text-muted small mt-1">{formattedDate}</p>
        </Col>

        <Col
          xs={6}
          className="d-flex align-items-center justify-content-sm-end gap-3"
        >
          <Badge bg={bg} className="px-3 py-1 ">
            {label}
          </Badge>
          {order.payment_status === "paid" && (
            <Badge bg="success" className="px-2 py-1">
              💳 Paid
            </Badge>
          )}

          {order.payment_status === "refunded" && (
            <Badge bg="warning" className="px-2 py-1">
              ↩ Refunded
            </Badge>
          )}

          <span className="fw-bold  text-nowrap">
            {order.total_price.toFixed(2)} EGP
          </span>
        </Col>
      </Row>

      <hr className="my-3" />

      <Button
        variant="link"
        className="p-0 text-info text-decoration-none small fw-semibold"
        onClick={() => setOpen((o) => !o)}
      >
        {open
          ? "▲ Hide items"
          : `▼ Show ${order.orderItems.length} item${order.orderItems.length !== 1 ? "s" : ""}`}
      </Button>

      <Collapse in={open}>
        <div>
          <div className="d-flex flex-column gap-3 mt-3">
            {order.orderItems.map((item) => (
              <div key={item.id} className="d-flex align-items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="rounded-2 object-fit-contain flex-shrink-0"
                  style={{ width: 56, height: 56 }}
                />
                <div className="flex-grow-1">
                  <p className="mb-0 fw-semibold small">{item.name}</p>
                  <p className="mb-0 text-muted small">
                    {item.price.toFixed(2)} EGP × {item.quantity}
                  </p>
                </div>
                <span className="fw-bold text-nowrap small">
                  {(item.price * item.quantity).toFixed(2)} EGP
                </span>
              </div>
            ))}
          </div>

          {order.shipping_address && (
            <div className="mt-3 pt-3 border-top">
              <p
                className="mb-1 small fw-semibold text-muted text-uppercase"
                style={{ letterSpacing: "0.04em" }}
              >
                Delivered to
              </p>
              <p className="mb-0 small ">{order.shipping_address.fullName}</p>
              <p className="mb-0 small text-muted">
                {order.shipping_address.address}, {order.shipping_address.city}{" "}
                {order.shipping_address.postalCode}
              </p>
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
}

export default memo(OrderCard);
