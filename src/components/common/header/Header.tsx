import { NavLink } from "react-router-dom";
import HeaderBasket from "../../ecommerce/header-basket/HeaderBasket";
import {
  Navbar,
  Nav,
  Container,
  Badge,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { logOut } from "../../../store/auth/AuthSlice";

import styles from "./Header.module.css";
import HeaderWishList from "../../ecommerce/header-whishlist/HeaderWishList";
import { useEffect } from "react";
import actGetLikedProducts from "../../../store/wishlist/actGetLikedProducts";
const { headerContainer, headerLogo, basket, iconscontainer, brand } = styles;
import { useTheme } from "../../../context/ThemeContext";

const Header = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const wishlistStatus = useAppSelector((state) => state.wishlist.status);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!token) return;
    if (wishlistStatus !== "idle") return;

    const promise = dispatch(actGetLikedProducts("productsIds"));
    return () => promise.abort();
  }, [dispatch, token, wishlistStatus]);
  return (
    <header>
      <div className={headerContainer}>
        <div className={iconscontainer}>
          <div className={brand}>
            <h1 className={headerLogo}>
              <span>
                Za<Badge bg="info">Cart</Badge>
              </span>
            </h1>
            <div className={iconscontainer}>
              <div className={basket}>
                <HeaderBasket />
              </div>
            </div>
          </div>

          <HeaderWishList />
        </div>
      </div>
      <Navbar
        expand="lg"
        className={`bg-body-tertiary py-3 ${styles.secondHeader}`}
        bg="dark"
        data-bs-theme="dark"
      >
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="categories">
                Categories
              </Nav.Link>
              <Nav.Link as={NavLink} to="about-us">
                About
              </Nav.Link>
            </Nav>

            {token ? (
              <Nav>
                <NavDropdown
                  title={`Hello ${user?.firstName} `}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item as={NavLink} to="profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="orders">
                    Orders
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => dispatch(logOut())}
                    as={NavLink}
                    to="/"
                  >
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link as={NavLink} to="login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="register">
                  Register
                </Nav.Link>
              </Nav>
            )}
            <Nav>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={toggleTheme}
                title={theme === "light" ? " dark mode" : "light mode"}
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 38, height: 38, fontSize: 16, flexShrink: 0 }}
              >
                {theme === "light" ? "🌙" : "☀️"}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
