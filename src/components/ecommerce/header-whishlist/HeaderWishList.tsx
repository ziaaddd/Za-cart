import { useNavigate } from "react-router-dom";
import styles from "./HeaderWishList.module.css";
import Filllike from "../../../assets/like-fill.svg?react";
import { useAppSelector } from "../../../store/hooks";

const { wishlist } = styles;

function HeaderWishList() {
  const { likedProductsIds } = useAppSelector((state) => state.wishlist);
  const navigate = useNavigate();
  return (
    <div className={wishlist} onClick={() => navigate("wishlist")}>
      <Filllike />
      {likedProductsIds.length > 0 && likedProductsIds.length} Wishlist
    </div>
  );
}

export default HeaderWishList;
