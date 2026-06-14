import ContentLoader from "react-content-loader";

import { Row, Col } from "react-bootstrap";

const ProductSkeleton = () => {
  const renderList = Array(3)
    .fill(0)
    .map((_, idx) => (
      <Col xs={3} key={idx} className="d-flex justify-content-center mb-5 mt-2">
        <ContentLoader
          speed={2}
          width={255}
          height={350}
          viewBox="0 0 255 350"
          backgroundColor="#f5f4f4"
          foregroundColor="#ecebeb"
        >
          {/* <rect x="15" y="-1" rx="10" ry="10" width="187" height="242" /> */}
          <rect x="15" y="-1" rx="10" ry="10" width="240" height="290" />
          <rect x="41" y="257" rx="0" ry="0" width="129" height="9" />
          <rect x="57" y="294" rx="0" ry="0" width="96" height="6" />
          <rect x="14" y="308" rx="9" ry="9" width="193" height="24" />
          <rect x="58" y="273" rx="0" ry="0" width="95" height="9" />
        </ContentLoader>
      </Col>
    ));
  return <Row className="d-flex justify-content-center ">{renderList}</Row>;
};

export default ProductSkeleton;
