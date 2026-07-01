import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import getItemsInfo from "../store/cart/actGetItemsInfo";
import {
  CahngeCartItemQun,
  cleanUpCartFullInfo,
} from "../store/cart/CartSlice";
import CartListOfItems from "../components/ecommerce/cart/CartListOfItems";
import CartTotalPrice from "../components/ecommerce/cart/cart-price/CartTotalPrice";
import LoadingError from "../components/feedback/loading-error/LoadingError";
import LottiesHandler from "../components/feedback/lotties/LottiesHandler";
import { Link } from "react-router-dom";
import { resetOrderStatus } from "../store/orders/OrdersSlice";
import { actUpdateCartServer } from "../store/cart/actSyncCart";
import { showInfo } from "../utilits/toast";
import { Button, Container } from "react-bootstrap";

function Cart() {
  const dispatch = useAppDispatch();
  const { items, ItemsFullInfo, status, error } = useAppSelector(
    (state) => state.cart,
  );

  const productsWithItsquantity = ItemsFullInfo.map((product) => ({
    ...product,
    quantity: items[product.id!],
  }));

  const removeFromCartHandeler = useCallback(
    (id: number) => {
      dispatch(actUpdateCartServer({ productId: id, quantity: 0 }));
      showInfo("Item removed from cart");
    },
    [dispatch],
  );

  const changeCartItemQunHandeler = useCallback(
    (id: number, quantity: number) => {
      dispatch(CahngeCartItemQun({ id, quantity }));
      dispatch(actUpdateCartServer({ productId: id, quantity }));
    },
    [dispatch],
  );

  // to re-fetch of full product info if cart items change
  const itemsKey = Object.keys(items).join(",");

  useEffect(() => {
    if (!Object.keys(items).length) return;
    const promise = dispatch(getItemsInfo());
    return () => {
      promise.abort();
      dispatch(cleanUpCartFullInfo());
      dispatch(resetOrderStatus()); // this to close success lotti
    };
  }, [dispatch, itemsKey]);

  return (
    <Container>
      <h2 className="fw-bold mb-3" style={{ color: "#0dcaf0" }}>
        Your cart
      </h2>
      <LoadingError status={status} error={error} type="cart">
        {productsWithItsquantity.length ? (
          <>
            <CartListOfItems
              products={productsWithItsquantity}
              removeFromCartHandeler={removeFromCartHandeler}
              changeCartItemQunHandeler={changeCartItemQunHandeler}
            />
            <CartTotalPrice products={productsWithItsquantity} />
          </>
        ) : (
          <div
            style={{ textAlign: "center", fontSize: "25px", color: "#0dcaf0" }}
          >
            <LottiesHandler type="empty" />
            <h4 className="fw-bold mb-2">Your cart is empty</h4>
            <p className="text-muted mb-4">
              Looks like you haven't added anything yet.
            </p>
            <Link to="/categories">
              <Button variant="info" className="text-white fw-semibold px-4">
                Start shopping
              </Button>
            </Link>
          </div>
        )}
      </LoadingError>
    </Container>
  );
}

export default Cart;
