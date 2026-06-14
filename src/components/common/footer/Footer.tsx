import React, { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import styles from "./Footer.module.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className={`${styles.footerContainer} pt-5 pb-3 mt-auto`}>
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="pe-lg-4">
              <h4 className={`${styles.heading} mb-3 text-uppercase`}>
                <span className={styles.brandText}>Z</span>-Cart
              </h4>
              <p className=" mb-4">
                Your ultimate destination for premium tech, fashion, and
                everyday essentials. High quality, fast delivery, and 24/7
                customer support.
              </p>
            </div>
          </Col>

          <Col lg={2} sm={6}>
            <h6 className={`${styles.heading} mb-3 text-uppercase`}>
              Shop Categories
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <a href="/shop/electronics" className={styles.link}>
                  Electronics
                </a>
              </li>
              <li>
                <a href="/shop/home" className={styles.link}>
                  Home & Living
                </a>
              </li>
              <li>
                <a href="/shop/accessories" className={styles.link}>
                  Accessories
                </a>
              </li>
              <li>
                <a href="/shop/offers" className={styles.link}>
                  Clothing & Offers
                </a>
              </li>
              <li>
                <a href="/shop/offers" className={styles.link}>
                  Groceries
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={2} sm={6}>
            <h6 className={`${styles.heading} mb-3 text-uppercase`}>
              Customer Service
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <a href="/help" className={styles.link}>
                  Help Center
                </a>
              </li>
              <li>
                <a href="/track-order" className={styles.link}>
                  Track Order
                </a>
              </li>
              <li>
                <a href="/returns" className={styles.link}>
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="/shipping" className={styles.link}>
                  AI assistant
                </a>
              </li>
              <li>
                <a href="/contact" className={styles.link}>
                  Contact Us
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h6 className={`${styles.heading} mb-3 text-uppercase`}>
              Stay Updated
            </h6>
            <p className=" mb-3">
              Subscribe to our newsletter to receive updates on new arrivals,
              special offers, and exclusive discounts.
            </p>
            <Form onSubmit={handleSubscribe}>
              <InputGroup className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Your email address"
                  aria-label="Your email address"
                  className={styles.newsletterInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className={styles.subscribeBtn}>
                  Subscribe
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        <hr className={styles.divider} />

        <Row className="align-items-center gy-3">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0 ">
              &copy; All rights reserved to{" "}
              <span className={styles.brandText}>Z-Cart</span> in 2025.
            </p>
          </Col>

          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-2 align-items-center">
              <span className=" small me-2">We Accept:</span>
              <span className="badge bg-secondary px-2 py-1 opacity-75">
                Visa
              </span>
              <span className="badge bg-secondary px-2 py-1 opacity-75">
                Mastercard
              </span>
              <span className="badge bg-secondary px-2 py-1 opacity-75">
                PayPal
              </span>
              <span className="badge bg-secondary px-2 py-1 opacity-75">
                Stripe
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
