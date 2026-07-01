import { memo, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import fetchFeaturedProducts from "../../../store/products/actFeaturedProducts";
import Product from "../product/Product";
import LottiesHandler from "../../feedback/lotties/LottiesHandler";

function WishlistRecommended() {
  const dispatch = useAppDispatch();
  const { featuredProducts, featuredStatus } = useAppSelector(
    (state) => state.products,
  );
  const { items } = useAppSelector((state) => state.cart);
  const { likedProductsIds } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (featuredProducts.length) return;
    const promise = dispatch(fetchFeaturedProducts());
    return () => promise.abort();
  }, [dispatch, featuredProducts.length]);

  const displayProducts = useMemo(
    () =>
      featuredProducts.slice(0, 4).map((p) => ({
        ...p,
        quantity: items[p.id ?? 0],
        isLiked: likedProductsIds.includes(p.id!),
      })),
    [featuredProducts, items, likedProductsIds],
  );

  return (
    <div className="text-center">
      <LottiesHandler type="emptywish" />
      <h4 className="fw-bold mb-2">Your wishlist is empty</h4>
      <p className="text-muted mb-4">
        Save items you love and find them here anytime.
      </p>
      <Link to="/categories">
        <Button variant="info" className="text-white fw-semibold px-4 mb-5">
          Start shopping
        </Button>
      </Link>

      {featuredStatus === "succeeded" && displayProducts.length > 0 && (
        <div className="mt-2">
          <h5 className="fw-bold mb-4 text-info text-start">
            You might like these
          </h5>
          <Row className="g-4 justify-content-center">
            {displayProducts.map((product) => (
              <Col
                key={product.id}
                xs={12}
                sm={6}
                md={3}
                className="d-flex justify-content-center"
              >
                <Product {...product} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export default memo(WishlistRecommended);
