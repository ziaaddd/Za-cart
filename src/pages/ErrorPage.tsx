import { Link } from "react-router-dom";
import LottiesHandler from "../components/feedback/lotties/LottiesHandler";
import { Button, Container } from "react-bootstrap";

function ErrorPage() {
  return (
    <Container className="d-flex flex-column align-items-center text-center py-5">
      <LottiesHandler type="notfound" />
      <h2 className="fw-bold mb-2 mt-3">Page not found</h2>
      <p className="text-muted mb-4" style={{ maxWidth: 420 }}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="d-flex gap-3 flex-wrap justify-content-center">
        <Link to="/">
          <Button variant="info" className="text-white fw-semibold px-4">
            Go home
          </Button>
        </Link>
        <Link to="/categories">
          <Button variant="outline-info" className="fw-semibold px-4">
            Browse products
          </Button>
        </Link>
      </div>
    </Container>
  );
}

export default ErrorPage;
