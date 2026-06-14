import { memo, useEffect, useMemo } from "react";
import Product from "../components/ecommerce/product/Product";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import actGetLikedProducts from "../store/wishlist/actGetLikedProducts";
import { wishListCleanUp } from "../store/wishlist/WishListSlice";
import { Container } from "react-bootstrap";
import GridList from "../components/common/grid-list/GridList";
import type { Tproduct } from "../types/product";
import Heading from "../components/common/heading-title/Heading";
import LoadingError from "../components/feedback/loading-error/LoadingError";
import LottiesHandler from "../components/feedback/lotties/LottiesHandler";
import { Link } from "react-router-dom";

function Wishlist() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { error, status, likedProductsFullInfo } = useAppSelector(
    (state) => state.wishlist,
  );

  const fullProductInfo = useMemo(
    () =>
      likedProductsFullInfo.map((product) => ({
        ...product,
        quantity: items[product.id || 0],
        isLiked: true,
      })),
    [likedProductsFullInfo, items],
  );

  useEffect(() => {
    const promise = dispatch(actGetLikedProducts("productsFullInfo"));

    return () => {
      promise.abort();
      dispatch(wishListCleanUp());
    };
  }, [dispatch]);

  return (
    <Container>
      <Heading> Wish List </Heading>
      <LoadingError error={error} status={status} type="products">
        {likedProductsFullInfo.length ? (
          <GridList<Tproduct>
            items={fullProductInfo}
            renderItems={(item) => <Product {...item} />}
          />
        ) : (
          <div style={{ textAlign: "center", fontSize: "25px" }}>
            <LottiesHandler
              type="emptywish"
              // message="Your Wish-List Is Empty"
            />
            <Link to="/categories" style={{ color: "#0dcaf0" }}>
              Add To Wish-List
            </Link>
          </div>
        )}
      </LoadingError>
    </Container>
  );
}

export default memo(Wishlist);
