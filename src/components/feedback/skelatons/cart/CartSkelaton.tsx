import ContentLoader from "react-content-loader";
import { Row, Col } from "react-bootstrap";
import { useTheme } from "../../../../context/ThemeContext";

const CartSkeleton = () => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "#2c3444" : "#f0f0f0";
  const fg = theme === "dark" ? "#3a4255" : "#e8e8e8";

  return (
    <Row>
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Col key={`cartSkel${i + 1}`} xs={12} className="mb-3">
            <ContentLoader
              speed={2}
              width="100%"
              height={140}
              viewBox="0 0 700 140"
              backgroundColor={bg}
              foregroundColor={fg}
            >
              {/* image */}
              <rect x="0" y="10" rx="12" ry="12" width="120" height="120" />
              {/* name */}
              <rect x="140" y="20" rx="4" ry="4" width="200" height="16" />
              {/* price */}
              <rect x="140" y="48" rx="4" ry="4" width="120" height="12" />
              {/* total */}
              <rect x="140" y="68" rx="4" ry="4" width="100" height="12" />
              {/* remove btn */}
              <rect x="560" y="20" rx="40" ry="40" width="120" height="40" />
              {/* qty controls */}
              <rect x="540" y="80" rx="20" ry="20" width="140" height="36" />
            </ContentLoader>
          </Col>
        ))}
    </Row>
  );
};

export default CartSkeleton;
