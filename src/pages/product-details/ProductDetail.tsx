import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Modal,
  Breadcrumb,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetProductById from "../../store/products/actGetProductById";
import actGetRelatedProducts from "../../store/products/actGetRelatedProducts";
import { productDetailCleanUp } from "../../store/products/ProductsSlice";
import { addToCart } from "../../store/cart/CartSlice";
import { actUpdateCartServer } from "../../store/cart/actSyncCart";
import actLikeToogle from "../../store/wishlist/actLikeToggle";
import fetchCategories from "../../store/categories/actCategories";
import ProductDetailSkeleton from "../../components/feedback/skelatons/products/ProductDetailSkeleton";
import Product from "../../components/ecommerce/product/Product";
import LottiesHandler from "../../components/feedback/lotties/LottiesHandler";
import Like from "../../assets/like.svg?react";
import Likefill from "../../assets/like-fill.svg?react";
import styles from "./ProductDetails.module.css";

function ProductDetail() {
  const { categoryId, productId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { likedProductsIds } = useAppSelector((state) => state.wishlist);
  const { categories } = useAppSelector((state) => state.categories);
  const { productDetail, productDetailStatus, relatedProducts, relatedStatus } =
    useAppSelector((state) => state.products);

  const [quantity, setQuantity] = useState(1);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const isLiked = likedProductsIds.includes(productDetail?.id ?? -1);
  const inCartQty = cartItems[productDetail?.id ?? -1] ?? 0;
  const remainingStock = (productDetail?.stock ?? 0) - inCartQty;
  const inStock = remainingStock > 0;
  const categoryName =
    categories.find((category) => category.id === Number(categoryId))?.name ??
    "Category";

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (!productId || !categoryId) return;

    const detailPromise = dispatch(actGetProductById(Number(productId)));
    const relatedPromise = dispatch(
      actGetRelatedProducts({
        categoryId: Number(categoryId),
        excludeProductId: Number(productId),
      }),
    );

    return () => {
      detailPromise.abort();
      relatedPromise.abort();
      dispatch(productDetailCleanUp());
    };
  }, [dispatch, productId, categoryId]);

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  const handleAddToCart = () => {
    if (!productDetail?.id) return;
    setAddingToCart(true);
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(productDetail.id));
    }
    if (token)
      dispatch(actUpdateCartServer({ productId: productDetail.id, quantity }));
    setTimeout(() => setAddingToCart(false), 400);
  };

  const handleLikeToggle = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    if (likeLoading || !productDetail?.id) return;
    setLikeLoading(true);
    dispatch(actLikeToogle(productDetail.id))
      .unwrap()
      .finally(() => setLikeLoading(false));
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (productDetailStatus === "pending" || productDetailStatus === "idle") {
    return (
      <Container className="pt-4 pb-5">
        <ProductDetailSkeleton />
      </Container>
    );
  }

  if (productDetailStatus === "failed") {
    return (
      <Container className="pt-4 text-center">
        <LottiesHandler
          type="error"
          message={`Somthing wrong , the is no matched product `}
        />

        <Button
          variant="outline-info"
          className="mt-3"
          onClick={() => navigate(-1)}
        >
          ← Go back
        </Button>
      </Container>
    );
  }

  if (!productDetail) return null;

  const relatedWithState = relatedProducts.map((product) => ({
    ...product,
    quantity: cartItems[product.id ?? 0],
    isLiked: likedProductsIds.includes(product.id!),
  }));

  return (
    <>
      {/* ── Login required modal ────────────────────────────────────── */}
      <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Login required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            You need to be logged in to save items to your wishlist.
          </p>
          <Link to="/login" className="btn btn-info text-white w-100">
            Log in
          </Link>
        </Modal.Body>
      </Modal>

      <Container className="pt-4 pb-5">
        {/* ── Breadcrumb (React Bootstrap component, no raw HTML needed) ── */}
        {/* Breadcrumb shows the path: Home > Categories > Category > Product */}
        {/* Each item is a link except the last one (active) which is just text */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/categories" }}>
            Categories
          </Breadcrumb.Item>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: `/categories/products/${categoryId}` }}
          >
            {categoryName}
          </Breadcrumb.Item>
          {/* active prop = last item, shown as plain text, not a link */}
          <Breadcrumb.Item active>{productDetail.name}</Breadcrumb.Item>
        </Breadcrumb>

        {/* ── Main product section ─────────────────────────────────────── */}
        <Row className="g-4 g-md-5 align-items-start mb-5">
          {/* Left — image */}
          <Col xs={12} md={6}>
            <div className={styles.imageWrapper}>
              <img
                src={productDetail.image}
                alt={productDetail.name}
                loading="lazy"
                className="img-fluid"
                style={{ maxHeight: 460, objectFit: "contain", width: "100%" }}
              />
            </div>
          </Col>

          {/* Right — info */}
          <Col xs={12} md={6}>
            <h1 className="fs-2 fw-bold mb-2">{productDetail.name}</h1>

            <p className="fs-3 fw-bold text-info mb-3">
              {productDetail.price.toFixed(2)} EGP
            </p>

            {/* Stock badge */}
            <div className="mb-3">
              {inStock ? (
                <Badge bg="success" className="px-3 py-2 fs-6">
                  ✓ In stock ({remainingStock} left)
                </Badge>
              ) : (
                <Badge bg="danger" className="px-3 py-2 fs-6">
                  ✗ Out of stock
                </Badge>
              )}
            </div>

            <p className="text-secondary lh-lg mb-4">
              {productDetail.description}
            </p>

            <hr className="mb-4" />

            {/* Quantity selector + Add to cart + Wishlist toggle */}
            <div className="d-flex align-items-center gap-3 flex-wrap  p-3 rounded">
              {inStock && (
                <div className="d-flex align-items-center border rounded-5 overflow-hidden">
                  <Button
                    variant="light"
                    className="px-3 py-2 border-0 rounded-0"
                    onClick={() => setQuantity((q) => q - 1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </Button>
                  <span
                    className="px-3 py-2 fw-semibold border-start border-end text-center"
                    style={{ minWidth: 44 }}
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="light"
                    className="px-3 py-2 border-0 rounded-0"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= remainingStock}
                  >
                    +
                  </Button>
                </div>
              )}

              {/* Add to cart >>*/}
              <Button
                variant="info"
                className="text-white px-4 py-2 fw-semibold"
                onClick={handleAddToCart}
                disabled={!inStock || addingToCart}
                style={{ minWidth: 160 }}
              >
                {addingToCart ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding…
                  </>
                ) : (
                  `Add ${quantity} to cart`
                )}
              </Button>

              {/* Wishlist heart */}
              <Button
                // variant={isLiked ? "" : "info"}
                className={`p-2 d-flex align-items-center justify-content-center border ${styles.heartBtn}`}
                onClick={handleLikeToggle}
                title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              >
                {likeLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : isLiked ? (
                  <Likefill className={styles.heartIcon} />
                ) : (
                  <Like className={styles.heartIcon} />
                )}
              </Button>
            </div>

            {/* Already-in-cart notice */}
            {inCartQty > 0 && (
              <p className="text-muted mt-3 small">
                You already have {inCartQty} of this item in your cart.
              </p>
            )}
          </Col>
        </Row>

        {/*  related products  */}
        {relatedStatus === "pending" && (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="info" />
          </div>
        )}

        {relatedStatus === "succeeded" && relatedWithState.length > 0 && (
          <section>
            <hr className="my-4" />
            <h2 className="fs-4 fw-bold mb-4 text-info">You may also like</h2>
            <Row className="g-4 justify-content-center">
              {relatedWithState.map((product) => (
                <Col
                  key={product.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="d-flex flex-column justify-content-center"
                >
                  <Product {...product} />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Container>
    </>
  );
}

export default ProductDetail;
