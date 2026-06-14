import { Col, Row } from "react-bootstrap";
import LottiesHandler from "../../feedback/lotties/LottiesHandler";

type Titems<T> = {
  items: T[];
  renderItems: (item: T) => React.ReactNode;
};

function GridList<T extends { id?: number }>({
  items,
  renderItems,
}: Titems<T>) {
  return (
    <Row className="d-flex justify-content-center ">
      {items.length > 0 ? (
        items.map((item, index) => (
          <Col
            key={item.id ?? index}
            md={3}
            className="d-flex justify-content-center mb-5 mt-2 mx-2"
          >
            {renderItems(item)}
          </Col>
        ))
      ) : (
        // <p style={{ fontWeight: 700, fontSize: 22, textAlign: "center" }}>
        //   There Is No Items To Display
        // </p>
        <LottiesHandler type="empty" />
      )}
    </Row>
  );
}

export default GridList;
