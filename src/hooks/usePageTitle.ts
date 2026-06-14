import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const TITLES: {
  pattern: RegExp;
  title: string;
}[] = [
  { pattern: /^\/$/, title: "Za-Cart — Shop everything you need" },
  {
    pattern: /^\/categories\/products\/[^/]+\/[^/]+$/,
    title: "Product details — Za-Cart",
  },
  { pattern: /^\/categories\/products\/[^/]+$/, title: "Products — Za-Cart" },
  { pattern: /^\/categories$/, title: "Categories — Za-Cart" },
  { pattern: /^\/cart$/, title: "Your cart — Za-Cart" },
  { pattern: /^\/checkout$/, title: "Checkout — Za-Cart" },
  { pattern: /^\/orders$/, title: "My orders — Za-Cart" },
  { pattern: /^\/wishlist$/, title: "Wishlist — Za-Cart" },
  { pattern: /^\/profile$/, title: "My profile — Za-Cart" },
  { pattern: /^\/login$/, title: "Log in — Za-Cart" },
  { pattern: /^\/register$/, title: "Sign up — Za-Cart" },
  { pattern: /^\/about-us$/, title: "About us — Za-Cart" },
];

const DEFAULT_TITLE = "Za-Cart";
const NOT_FOUND_TITLE = "Page not found — Za-Cart";

export function usePageTitle() {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const match = TITLES.find(({ pattern }) => pattern.test(location.pathname));

    if (match) {
      document.title = match.title;
    } else {
      document.title =
        location.pathname === "/" ? DEFAULT_TITLE : NOT_FOUND_TITLE;
    }
  }, [location.pathname, params]);
}
