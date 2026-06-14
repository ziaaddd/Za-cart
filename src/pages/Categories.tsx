import { useEffect } from "react";
import Category from "../components/ecommerce/category/Category";
import fetchCategories from "../store/categories/actCategories";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { Container } from "react-bootstrap";
import type { Tcategory } from "../types/category";
import GridList from "../components/common/grid-list/GridList";
import Heading from "../components/common/heading-title/Heading";
import LoadingError from "../components/feedback/loading-error/LoadingError";

function Categories() {
  const dispatch = useAppDispatch();
  const { error, status, categories } = useAppSelector(
    (state) => state.categories,
  );

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  return (
    <Container>
      <Heading> Categories</Heading>
      <LoadingError error={error} status={status} type="categories">
        <GridList<Tcategory>
          items={categories}
          renderItems={(item) => <Category {...item} />}
        />
      </LoadingError>
    </Container>
  );
}

export default Categories;
