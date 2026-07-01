import ContentLoader from "react-content-loader";

import { Row, Col } from "react-bootstrap";
import { useTheme } from "../../../../context/ThemeContext";

const ProductSkeleton = () => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "#2c3444" : "#f5f4f4";
  const fg = theme === "dark" ? "#3a4255" : "#ecebeb";

  const cards = Array(4).fill(0);

  return (
    <Row className="d-flex justify-content-center">
      {cards.map((_, i) => (
        <Col
          key={`orderSkl${i}`}
          xs={6}
          md={3}
          className="d-flex justify-content-center mb-5 mt-2"
        >
          <ContentLoader
            speed={2}
            width={255}
            height={350}
            viewBox="0 0 255 350"
            backgroundColor={bg}
            foregroundColor={fg}
          >
            <rect x="0" y="0" rx="10" ry="10" width="255" height="290" />
            <rect x="41" y="300" rx="4" ry="4" width="129" height="9" />
            <rect x="57" y="316" rx="4" ry="4" width="96" height="6" />
            <rect x="14" y="328" rx="9" ry="9" width="193" height="24" />
          </ContentLoader>
        </Col>
      ))}
    </Row>
  );
};

export default ProductSkeleton;
