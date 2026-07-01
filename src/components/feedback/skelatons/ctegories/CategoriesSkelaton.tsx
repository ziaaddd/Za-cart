import { Row, Col } from "react-bootstrap";
import ContentLoader from "react-content-loader";
import { useTheme } from "../../../../context/ThemeContext";

const CategoriesSkelaton = () => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "#2c3444" : "#f0f0f0";
  const fg = theme === "dark" ? "#3a4255" : "#e0e0e0";

  return (
    <Row>
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Col
            key={`catSkel${i}`}
            xs={6}
            md={3}
            className="d-flex justify-content-center mb-5 mt-2"
          >
            <ContentLoader
              speed={2}
              width={200}
              height={200}
              viewBox="0 0 200 200"
              backgroundColor={bg}
              foregroundColor={fg}
            >
              <circle cx="100" cy="84" r="84" />
              <rect x="61" y="179" rx="3" ry="3" width="85" height="6" />
            </ContentLoader>
          </Col>
        ))}
    </Row>
  );
};

export default CategoriesSkelaton;
