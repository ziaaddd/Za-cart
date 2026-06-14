import ContentLoader from "react-content-loader";
import { Row, Col } from "react-bootstrap";

const ProductDetailSkeleton = () => (
  <Row className="g-4 mt-2">
    <Col xs={12} md={6}>
      <ContentLoader
        speed={2}
        width="100%"
        height={420}
        viewBox="0 0 500 420"
        backgroundColor="#f5f4f4"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="12" ry="12" width="500" height="420" />
      </ContentLoader>
    </Col>

    <Col xs={12} md={6}>
      <ContentLoader
        speed={2}
        width="100%"
        height={420}
        viewBox="0 0 500 420"
        backgroundColor="#f5f4f4"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="4" ry="4" width="200" height="16" />
        <rect x="0" y="36" rx="6" ry="6" width="420" height="32" />
        <rect x="0" y="76" rx="6" ry="6" width="300" height="32" />
        <rect x="0" y="132" rx="6" ry="6" width="160" height="40" />
        <rect x="0" y="192" rx="20" ry="20" width="110" height="32" />
        <rect x="0" y="248" rx="4" ry="4" width="480" height="14" />
        <rect x="0" y="270" rx="4" ry="4" width="460" height="14" />
        <rect x="0" y="292" rx="4" ry="4" width="380" height="14" />
        <rect x="0" y="340" rx="8" ry="8" width="120" height="48" />
        <rect x="136" y="340" rx="8" ry="8" width="200" height="48" />
        <rect x="352" y="340" rx="8" ry="8" width="48" height="48" />
      </ContentLoader>
    </Col>
  </Row>
);

export default ProductDetailSkeleton;
