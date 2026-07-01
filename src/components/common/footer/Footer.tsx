import React, { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { showSuccess } from "../../../utilits/toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showSuccess("You're subscribed! Check your inbox for updates.");
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
              <p className="mb-4">
                Your ultimate destination for premium tech, fashion, and
                everyday essentials. High quality, fast delivery, and 24/7
                customer support.
              </p>
            </div>
          </Col>

          <Col lg={2} sm={6}>
            <h6 className={`${styles.heading} mb-3 text-uppercase`}>Shop</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link to="/categories" className={styles.link}>
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/categories" className={styles.link}>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/categories" className={styles.link}>
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className={styles.link}>
                  Wishlist
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={2} sm={6}>
            <h6 className={`${styles.heading} mb-3 text-uppercase`}>Account</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link to="/profile" className={styles.link}>
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className={styles.link}>
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className={styles.link}>
                  My Cart
                </Link>
              </li>
              <li>
                <Link to="/about-us" className={styles.link}>
                  About Us
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h6 className={`${styles.heading} mb-3 text-uppercase`}>
              Stay Updated
            </h6>
            <p className="mb-3">
              Subscribe for new arrivals, special offers, and exclusive
              discounts.
            </p>
            <Form onSubmit={handleSubscribe}>
              <InputGroup className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                  className={styles.newsletterInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className={styles.subscribeBtn}
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        <hr className={styles.divider} />

        <Row className="align-items-center gy-3">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} All rights reserved to{" "}
              <span className={styles.brandText}>Z-Cart</span>.
            </p>
          </Col>

          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-2 align-items-center">
              <span className="small me-2">We Accept:</span>
              {["Visa", "Mastercard", "PayPal", "Stripe"].map((method) => (
                <span
                  key={method}
                  className="badge bg-secondary px-2 py-1 opacity-75"
                >
                  {method}
                </span>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
