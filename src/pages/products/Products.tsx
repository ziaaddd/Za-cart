import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import fetchProducts from "../../store/products/actProducts";
import fetchCategories from "../../store/categories/actCategories";
import LoadingError from "../../components/feedback/loading-error/LoadingError";
import { productsCleanUp } from "../../store/products/ProductsSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import ProductsToolbar from "../../components/ecommerce/products-toolbar/ProductsToolbar";
import ProductsGrid from "../../components/ecommerce/products-grid/ProductsGrid";
import type { Tproduct } from "../../types/product";
import styles from "./Products.module.css";

const SEARCH_PARAM = "search";
const MIN_PARAM = "minPrice";
const MAX_PARAM = "maxPrice";
const SORT_PARAM = "sort";

export type SortKey = "newest" | "price_asc" | "price_desc" | "name_asc";

function Products() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = params.categoryId;
  const search = searchParams.get(SEARCH_PARAM) ?? "";
  const minPrice = Number(searchParams.get(MIN_PARAM) ?? 0);

  const maxPrice = Number(searchParams.get(MAX_PARAM) ?? "");
  const sort = (searchParams.get(SORT_PARAM) ?? "newest") as SortKey;
  const { error, status, products } = useAppSelector((state) => state.products);
  const { items } = useAppSelector((state) => state.cart);
  const { likedProductsIds } = useAppSelector((state) => state.wishlist);
  const { categories } = useAppSelector((state) => state.categories);

  const categoryName = useMemo(() => {
    const cat = categories.find(
      (category) => category.id === Number(categoryId),
    );
    return cat?.name ?? "Products";
  }, [categories, categoryId]);

  //{min, max}for products  prices
  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };
    const prices = products.map((product) => product.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const filteredProducts: Tproduct[] = useMemo(() => {
    //if user enter crazy value we handle that by using the max price from products as a fallback
    const effectiveMax =
      maxPrice === Infinity || maxPrice === 0 ? priceBounds.max : maxPrice;
    // normal products result
    const result = products
      .map((product) => ({
        ...product,
        quantity: items[product.id ?? 0],
        isLiked: likedProductsIds.includes(product.id!),
      }))
      //  text search
      .filter(
        (product) =>
          search.trim() === "" ||
          product.name.toLowerCase().includes(search.toLowerCase()),
      )
      // Price range
      .filter(
        (product) =>
          product.price >= minPrice &&
          product.price <= (effectiveMax || Infinity),
      );

    //  Sort
    switch (sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      //  newest is the default from supabase no sort needed
    }

    return result;
  }, [
    products,
    items,
    likedProductsIds,
    search,
    minPrice,
    maxPrice,
    sort,
    priceBounds,
  ]);

  // update a single URL param without wiping others
  const setParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const updatedParams = new URLSearchParams(prev);
        if (value === "" || value === "0") {
          updatedParams.delete(key);
        } else {
          updatedParams.set(key, value);
        }
        return updatedParams;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  useEffect(() => {
    const promise = dispatch(fetchProducts(Number(categoryId)));
    return () => {
      promise.abort();
      dispatch(productsCleanUp());
    };
  }, [dispatch, categoryId]);

  return (
    <Container className={styles.page}>
      <div className={styles.heading}>
        <h2 className={styles.headingTitle}>{categoryName} Products</h2>
        {status === "succeeded" && (
          <span className={styles.resultCount}>
            {filteredProducts.length} of {products.length} products
          </span>
        )}
      </div>

      <ProductsToolbar
        search={search}
        minPrice={minPrice || priceBounds.min}
        maxPrice={maxPrice || priceBounds.max}
        priceBounds={priceBounds}
        sort={sort}
        onSearchChange={(value) => setParam(SEARCH_PARAM, value)}
        onMinPriceChange={(value) => setParam(MIN_PARAM, String(value))}
        onMaxPriceChange={(value) => setParam(MAX_PARAM, String(value))}
        onSortChange={(value) => setParam(SORT_PARAM, value)}
        onReset={() => setSearchParams({}, { replace: true })}
        disabled={status !== "succeeded"}
      />

      <LoadingError error={error} status={status} type="products">
        <ProductsGrid products={filteredProducts} />
      </LoadingError>
    </Container>
  );
}

export default Products;
