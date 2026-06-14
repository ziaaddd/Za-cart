import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import fetchCategories from "../../store/categories/actCategories";
import fetchFeaturedProducts from "../../store/products/actFeaturedProducts";

import Category from "../../components/ecommerce/category/Category";
import Product from "../../components/ecommerce/product/Product";
import CategoriesSkelaton from "../../components/feedback/skelatons/ctegories/CategoriesSkelaton";
import ProductSkeleton from "../../components/feedback/skelatons/products/ProductsSkelaton";
import styles from "./Home.module.css";

const {
  hero,
  heroInner,
  homeGalary,
  heroTitle,
  heroSub,
  heroCta,
  section,
  sectionHeader,
  sectionTitle,
  sectionLink,
  categoryRow,
  productRow,
} = styles;

function Home() {
  const dispatch = useAppDispatch();

  const { categories, status: catStatus } = useAppSelector(
    (state) => state.categories,
  );

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const { featuredProducts, featuredStatus } = useAppSelector(
    (state) => state.products,
  );

  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { likedProductsIds } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (featuredProducts.length) return;
    const promise = dispatch(fetchFeaturedProducts());
    return () => promise.abort();
  }, [dispatch, featuredProducts.length]);

  const featuredProductsFullInfo = useMemo(
    () =>
      featuredProducts.map((p) => ({
        ...p,
        quantity: cartItems[p.id ?? 0],
        isLiked: likedProductsIds.includes(p.id!),
      })),
    [featuredProducts, cartItems, likedProductsIds],
  );

  const featuredCategories = categories.slice(0, 4);

  return (
    <div>
      <div className={homeGalary}></div>
      <div className={hero}>
        <div className={heroInner}>
          <h1 className={heroTitle}>
            Everything you need,
            <br />
            <span>delivered fast.</span>
          </h1>
          <p className={heroSub}>
            Browse hundreds of products across dozens of categories — from
            electronics to fashion, all in one place.
          </p>
          <div className={heroCta}>
            <Button
              as={Link as React.ElementType}
              to="/categories"
              size="lg"
              style={{
                backgroundColor: "#0dcaf0",
                border: "none",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Shop now
            </Button>
            <Link
              to="/about-us"
              style={{
                color: "#0dcaf0",
                fontWeight: 700,
                alignSelf: "center",
                textDecoration: "none",
              }}
            >
              More →
            </Link>
          </div>
        </div>
      </div>

      <Container>
        <div className={section}>
          <div className={sectionHeader}>
            <h2 className={sectionTitle}>Shop by category</h2>
            <Link to="/categories" className={sectionLink}>
              See all →
            </Link>
          </div>

          {catStatus === "pending" ? (
            <CategoriesSkelaton />
          ) : (
            <Row className={categoryRow}>
              {featuredCategories.map((cat) => (
                <Col
                  key={cat.id}
                  xs={6}
                  md={3}
                  className="d-flex justify-content-center mb-4"
                >
                  <Category {...cat} />
                </Col>
              ))}
            </Row>
          )}
        </div>

        <div className={section}>
          <div className={sectionHeader}>
            <h2 className={sectionTitle}>New arrivals</h2>
            <Link to="/categories" className={sectionLink}>
              Browse all →
            </Link>
          </div>

          {featuredStatus === "pending" ? (
            <ProductSkeleton />
          ) : (
            <Row className={productRow}>
              {featuredProductsFullInfo.map((product) => (
                <Col
                  key={product.id}
                  xs={12}
                  sm={6}
                  md={3}
                  className="d-flex justify-content-center mb-5 mt-2"
                >
                  <Product {...product} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Home;
