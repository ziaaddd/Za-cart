import { Button, Modal, Spinner } from "react-bootstrap";
import styles from "./Product.module.css";
const { product, productImg, maximumNotice, wishListBtn, ModalBtn } = styles;
import type { Tproduct } from "../../../types/product";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addToCart } from "../../../store/cart/CartSlice";
import { useEffect, useState, memo } from "react";
import actLikeToogle from "../../../store/wishlist/actLikeToggle";
import Like from "../../../assets/like.svg?react";
import Likefill from "../../../assets/like-fill.svg?react";
import { Link, NavLink } from "react-router-dom";
import { actAddToCartServer } from "../../../store/cart/actSyncCart";
import { showSuccess, showError } from "../../../utilits/toast";

function Product({
  id,
  name,
  price,
  image,
  stock,
  quantity,
  isLiked,
  category_id,
}: Tproduct) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);

  const [isDisable, setISDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const avilabelRemaingQuantity = stock - (quantity ?? 0); //1)<=0   2) at clicked
  const reachedToMaxQuantity = avilabelRemaingQuantity <= 0 ? true : false;

  const addToCartHandeler = () => {
    dispatch(addToCart(id));

    if (token) dispatch(actAddToCartServer(id!));
    showSuccess(`${name} added to cart`);
    setISDisable(true);
  };

  const likeToggleHandel = () => {
    if (token) {
      if (!isLoading) {
        setIsLoading(true);
        dispatch(actLikeToogle(id!))
          .unwrap()
          .then(() => {
            showSuccess(
              isLiked
                ? `Removed ${name} from wishlist`
                : `Added ${name} to wishlist`,
            );
          })
          .catch(() => showError("Couldn't update wishlist, Try again."))
          .finally(() => setIsLoading(false));
      }
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (!isDisable) {
      return;
    }
    //to let sppiner for .3s
    const debounce = setTimeout(() => {
      setISDisable(false);
    }, 300);

    return () => clearTimeout(debounce);
  }, [isDisable]);

  const detailUrl = `/categories/products/${category_id}/${id}`;

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ position: "relative" }}>
          <p>You need to login first to add this item to your wishlist.</p>
          <br />
          <NavLink to="/login" className={ModalBtn}>
            {" "}
            Log In
          </NavLink>
        </Modal.Body>
      </Modal>
      <div className={product}>
        <div className={wishListBtn} onClick={likeToggleHandel}>
          {isLoading ? (
            <Spinner animation="border" size="sm" variant="primary" />
          ) : isLiked ? (
            <Likefill />
          ) : (
            <Like />
          )}
        </div>

        <Link
          className={productImg}
          to={detailUrl}
          style={{ textDecoration: "none" }}
        >
          <img src={image} alt={name} />
        </Link>
        <Link
          to={detailUrl}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h2>{name}</h2>
        </Link>
        <h3>{price.toFixed(2)} EGP</h3>
        <p className={maximumNotice}>
          {reachedToMaxQuantity
            ? "You reach to the limit"
            : `You can add ${avilabelRemaingQuantity} item(s)`}
        </p>
        <Button
          style={{ color: "white" }}
          variant="info"
          onClick={addToCartHandeler}
          disabled={isDisable || reachedToMaxQuantity}
        >
          {isDisable ? (
            <>
              <Spinner animation="border" size="sm" /> Loading...{" "}
            </>
          ) : (
            "Add to cart"
          )}
        </Button>
      </div>
    </>
  );
}

export default memo(Product);
