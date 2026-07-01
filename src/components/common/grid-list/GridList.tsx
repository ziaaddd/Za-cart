import { Col, Row } from "react-bootstrap";

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
      {items.map((item, index) => (
        <Col
          key={item.id ?? index}
          md={3}
          className="d-flex justify-content-center mb-5 mt-2 mx-2"
        >
          {renderItems(item)}
        </Col>
      ))}
    </Row>
  );
}

export default GridList;
