import { Outlet } from "react-router-dom";
import Header from "../../components/common/header/Header";
import Footer from "../../components/common/footer/Footer";
import styles from "./MainLayout.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";
import BackToTop from "../../components/common/back-top-btn/BackToTop";

const { wrapper } = styles;

const MainLayout = () => {
  usePageTitle();

  return (
    <>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <main className={wrapper} style={{ flex: 1 }}>
          <Outlet />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
};

export default MainLayout;
