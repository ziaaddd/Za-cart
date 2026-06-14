import { Row, Col } from "react-bootstrap";
import Product from "../product/Product";
import type { Tproduct } from "../../../types/product";
import styles from "./ProductsGrid.module.css";

interface IProps {
  products: Tproduct[];
}

function ProductsGrid({ products }: IProps) {
  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>🔍</span>
        <h3 className={styles.emptyTitle}>No products found</h3>
        <p className={styles.emptyText}>
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <Row className="d-flex justify-content-center">
      {products.map((product) => (
        <Col
          key={product.id}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          className="d-flex justify-content-center mb-5 mt-2"
        >
          <Product {...product} />
        </Col>
      ))}
    </Row>
  );
}

export default ProductsGrid;
