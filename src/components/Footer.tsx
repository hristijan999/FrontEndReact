// Footer.tsx
import { Container, Row, Col } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Footer: React.FC = () => {
    return (
        <footer className="bg-light text-dark mt-5 shadow-sm border-top">
            <Container fluid className="py-4">
                <Row className="text-center text-md-start">
                    {/* Company Info */}
                    <Col md={4} className="mb-3">
                        <h5 className="fw-bold">About Us</h5>
                        <p className="text-muted mb-0">
                            Your trusted e-shop for quality products.
                            Fast delivery & great support.
                        </p>
                    </Col>

                    {/* Quick Links */}
                    <Col md={4} className="mb-3">
                        <h5 className="fw-bold">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/eshop" className="text-decoration-none text-muted">Home</a></li>
                            <li><a href="/shop" className="text-decoration-none text-muted">Shop</a></li>
                            <li><a href="/contact" className="text-decoration-none text-muted">Contact</a></li>
                            <li><a href="/logIn" className="text-decoration-none text-muted">Login</a></li>
                        </ul>
                    </Col>

                    {/* Social Media */}
                    <Col md={4} className="mb-3">
                        <h5 className="fw-bold">Follow Us</h5>
                        <div>
                            <a href="#" className="text-muted me-3 fs-5"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-muted me-3 fs-5"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="text-muted me-3 fs-5"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="text-muted fs-5"><i className="bi bi-linkedin"></i></a>
                        </div>
                    </Col>
                </Row>

                {/* Copyright */}
                <Row>
                    <Col className="text-center text-muted mt-3">
                        <small>&copy; {new Date().getFullYear()} Emilly. All rights reserved.</small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
