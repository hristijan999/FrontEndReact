
import { useLocation, Navigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import Header from "../components/Header";
import styles from "./viewImage.module.css";
import  { useState } from "react";
import { addProduct } from "../api/bucket";
import { useCart } from "../context/CartContext";

import Footer from "../components/Footer";


interface Roba {
    id: number;
    type: string;
    price: number;
    opis: string;
    detalenOpis: string;
    lista_Sliki: string[];
    lista_Size: string[];
    sizePicked: string | null;
    popust: boolean;
    cenaSoPopust: number;
}

interface ViewImageState {
    product: Roba;
    filteredProducts: Roba[];
}

const ViewImage = () => {
    const location = useLocation() as { state?: ViewImageState };
    const { product, filteredProducts } = location.state ?? {};
    const [sizePicked, setSizePicked] = useState<string | null>(null);
    const [otvori, setOtvori] = useState(false);
    const { setCart } = useCart(); // ✅ get updater

    // If no product in location state, redirect back

    if (!product || !filteredProducts) {
        return <Navigate to="/eshop" replace />;
    }
    const [currentProduct, setCurrentProduct] = useState<Roba>(product);

    // local state for currently shown product
    const renderSizeButtons = (sizes: string[]) => (
        <div className="d-flex flex-wrap gap-2">
            {sizes.map((size) => (
                <button
                    key={size}
                    className={`btn ${sizePicked === size ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => setSizePicked(size)}
                >
                    {size}
                </button>
            ))}
        </div>
    );

    const handleAddToBucket = async () => {
        if (!sizePicked) return;

        if(!otvori)
        setOtvori(true);
        const productWithSize = {
            ...currentProduct,
            sizePicked,
        };

        try {
            const res = await addProduct(productWithSize);
            setCart(res.data);
            console.log("Cart after adding:", res.data);
        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    };

    const buttonBucket = (sizePicked: string | null) =>
        sizePicked ? (
            <button className="btn btn-outline-secondary" onClick={handleAddToBucket}>
                Add to bucket
            </button>
        ) : null;

    return (
        <Container fluid>
            <Header flag={otvori}/>

            <Row className="justify-content-center g-4 mt-4">
                <Col xs={12} md={3}></Col>

                <Col xs={12} md={3} className="d-flex">
                    <div className="shadow-sm w-100">
                        {/* show currentProduct images */}
                        <ProductCarousel images={currentProduct.lista_Sliki} />
                    </div>
                </Col>

                <Col xs={12} md={3}>
                    <div className={styles.opis}>
                        <Card.Body>
                            <Card.Title>{currentProduct.type}</Card.Title>
                            <Card.Text>
                                Price: {currentProduct.popust ? currentProduct.cenaSoPopust : currentProduct.price}
                            </Card.Text>
                            <Card.Text>{currentProduct.opis}</Card.Text>
                            <Card.Text>{currentProduct.detalenOpis}</Card.Text>
                        </Card.Body>
                        {renderSizeButtons(currentProduct.lista_Size)}
                        {buttonBucket(sizePicked)}
                    </div>
                </Col>
            </Row>

            <h5 className="mt-5 mb-3">Other Products</h5>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {filteredProducts
                    .filter((p: Roba) => p.id !== currentProduct.id)
                    .map((item: Roba) => (
                        <Col key={item.id}>
                            <div
                                className="h-100 shadow-sm"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setCurrentProduct(item); // swap shown product
                                    setSizePicked(null); // reset chosen size for new product
                                }}
                            >
                                <ProductCarousel images={item.lista_Sliki} />
                                <Card.Body>
                                    <Card.Title>{item.type}</Card.Title>
                                    <Card.Subtitle className="text-muted">
                                        {item.popust ? item.cenaSoPopust : item.price}
                                    </Card.Subtitle>
                                </Card.Body>
                            </div>
                        </Col>
                    ))}

                {filteredProducts.filter((p: Roba) => p.id !== currentProduct.id).length === 0 && (
                    <Col>
                        <p className="text-muted">No other products found matching the filter criteria.</p>
                    </Col>
                )}
            </Row>
            <Footer/>
        </Container>
    );
};

export default ViewImage;
