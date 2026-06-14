import styles from "./Category.module.css";
import type { Tcategory } from "../../../types/category";
import { Link } from "react-router-dom";
const { category, categoryImg, categoryTitle } = styles;

function Category({ id, name, image }: Tcategory) {
  return (
    <div className={` ${category}`}>
      <Link to={`/categories/products/${id}`}>
        <div className={categoryImg}>
          <img src={image} alt={name} />
        </div>
        <h4 className={categoryTitle}>{name}</h4>
      </Link>
    </div>
  );
}

export default Category;
