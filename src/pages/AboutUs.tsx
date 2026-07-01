import { Container, Row, Col } from "react-bootstrap";
import Heading from "../components/common/heading-title/Heading";

function AboutUs() {
  return (
    <Container className="py-5">
      <Heading>About Us</Heading>
      <Row className="g-4">
        <Col xs={12} md={6}>
          <h5 className="fw-bold mb-3">Who we are</h5>
          <p className="text-muted lh-lg">
            Za-Cart is an Egyptian e-commerce platform built to make online
            shopping fast, simple, and enjoyable. We connect shoppers with
            hundreds of curated products across electronics, fashion, home
            goods, and more.
          </p>
        </Col>
        <Col xs={12} md={6}>
          <h5 className="fw-bold mb-3">Our mission</h5>
          <p className="text-muted lh-lg">
            We believe everyone deserves access to great products at fair
            prices, delivered right to their door. Our mission is to make that
            happen — every day, for every customer.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutUs;
