// Header.tsx

import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from "./Header.module.css";

import Korpa from "./Korpa";
import { useUser } from '../context/UserContext';
interface HeaderProps {
    flag?: boolean; // optional
}
const Header:React.FC<HeaderProps> = ({flag}) => {

    const SomeComponent = () => {
        const { user } = useUser();
        return <div>Welcome, {user?.username} {user?.roles}</div>;
    };
    const navigate = useNavigate();

    return (
        <Navbar bg="light" variant="light" expand="xl" className="mb-4 shadow-sm">
            <Container fluid className="d-flex justify-content-between align-items-center">
                {/* Centered Logo */}
                <Nav
                    className="mx-auto"
                    style={{ cursor: "pointer", fontWeight: "bold", fontSize: "1.5rem" }}
                    onClick={() => navigate("/eshop")}
                >
                    <Image
                        src="https://purple-gigantic-kangaroo-197.mypinata.cloud/ipfs/QmTwebymmmakVNnkmSsTVPNu6H5rLBosFLJZbiw2sUYmuS"
                        alt="Company Logo"
                        className={`d-inline-block align-top ${styles.logo}`}
                    />
                </Nav>

                {/*login button*/}
                <Nav>
                    <SomeComponent />
                    <Button
                        className={`me-3 ${styles.Dugme}`}
                        variant="outline-secondary"
                        onClick={() => navigate("/logIn")}
                    >
                        <i className={`bi bi-person ${styles.fondot}`}></i>
                    </Button>
                </Nav>

                {/* Basket Button */}
                <Nav>
                    <Korpa flag={flag}
                    />
                </Nav>

            </Container>
        </Navbar>
    );
};

export default Header;
