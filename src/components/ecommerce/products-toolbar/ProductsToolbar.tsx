import { useRef } from "react";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import type { SortKey } from "../../../pages/products/Products";
import styles from "./ProductsToolbar.module.css";

interface Props {
  search: string;
  minPrice: number;
  maxPrice: number;
  priceBounds: { min: number; max: number };
  sort: SortKey;
  disabled: boolean;
  onSearchChange: (value: string) => void;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onSortChange: (value: SortKey) => void;
  onReset: () => void;
}

function ProductsToolbar({
  search,
  minPrice,
  maxPrice,
  priceBounds,
  sort,
  disabled,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onReset,
}: Props) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  };

  const isFiltered =
    search !== "" ||
    minPrice > priceBounds.min ||
    (maxPrice < priceBounds.max && maxPrice !== 0) ||
    sort !== "newest";

  return (
    <div className={styles.toolbar}>
      <Row className="g-2 align-items-end">
        <Col xs={12} md={4}>
          <Form.Label className={styles.label}>Search</Form.Label>
          <InputGroup>
            <InputGroup.Text className={styles.inputIcon}>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products…"
              defaultValue={search}
              onChange={handleSearchInput}
              disabled={disabled}
              className={styles.searchInput}
            />
          </InputGroup>
        </Col>

        <Col xs={6} md={2}>
          <Form.Label className={styles.label}>Min price</Form.Label>
          <Form.Control
            type="number"
            min={priceBounds.min}
            max={maxPrice || priceBounds.max}
            value={minPrice}
            onChange={(e) => onMinPriceChange(Number(e.target.value))}
            disabled={disabled}
            className={styles.priceInput}
            aria-label="Minimum price"
          />
        </Col>

        <Col xs={6} md={2}>
          <Form.Label className={styles.label}>Max price</Form.Label>
          <Form.Control
            type="number"
            min={minPrice}
            max={priceBounds.max}
            value={maxPrice || priceBounds.max}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            disabled={disabled}
            className={styles.priceInput}
            aria-label="Maximum price"
          />
        </Col>

        <Col xs={12} md={3}>
          <Form.Label className={styles.label}>Sort by</Form.Label>
          <Form.Select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            disabled={disabled}
            aria-label="Sort products"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
            <option value="name_asc">Name</option>
          </Form.Select>
        </Col>

        <Col xs={12} md={1} className="d-flex align-items-end">
          {isFiltered && (
            <Button onClick={onReset} className={styles.resetBtn}>
              Reset
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ProductsToolbar;
