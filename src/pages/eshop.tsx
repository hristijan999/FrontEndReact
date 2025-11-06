import React, { useState, useEffect } from "react";
import { useFetchAll } from "../hooks/useMerche";
import { Row, Col, Container, Card, Form, Pagination } from "react-bootstrap";
import styles from "./Eshop.module.css";
import ProductCarousel from "../components/ProductCarousel";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SliderSizes from "../components/PriceSlider";
import Footer from "../components/Footer";
import { useUser } from "../hooks/useUser.ts";
import { deleteGrub } from "../api/AdminApi";
import Chat from "../components/Chat.tsx";

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

const Eshop = () => {
    const [page, setPage] = useState(0);
    const [size] = useState(6);
    const [totalPages, setTotalPages] = useState(1);

    const { user } = useUser();
    const isAdmin = user && user.roles?.includes("ROLE_ADMIN");

    const { data, isLoading, isError } = useFetchAll(page, size);
    const prices =
        data?.content?.map((p: Roba) => (p.popust ? p.cenaSoPopust : p.price)) ||
        [];

    useEffect(() => {
        if (data) {
            setTotalPages(data.totalPages);
        }
    }, [data]);

    const handleAdminAction = async (product: Roba) => {
        // Ask for confirmation before deleting
        const confirmed = window.confirm(`Are you sure you want to delete the product "${product.type}" (ID: ${product.id})?`);
        if (!confirmed) return;
        try {
            await deleteGrub(product.id);
            alert("Product deleted!");
            // optionally, refresh your products list here!
        } catch (_err) {
            alert("Failed to delete product.");
        }
    };

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

    const navigate = useNavigate();

    useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);

    if (isLoading) return <div>Loading…</div>;
    if (isError || !data) return <div>Error loading products.</div>;

    const filteredProducts = (data?.content || []).filter((product: Roba) => {
        const productPrice = product.popust
            ? product.cenaSoPopust
            : product.price;

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.type);

        const matchesPrice =
            productPrice >= priceRange[0] && productPrice <= priceRange[1];

        return matchesCategory && matchesPrice;
    });

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <Pagination className="mt-4 justify-content-center">
                <Pagination.Prev
                    onClick={() => setPage(Math.max(page - 1, 0))}
                    disabled={page === 0}
                />
                {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                        key={i}
                        active={i === page}
                        onClick={() => setPage(i)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
                    disabled={page === totalPages - 1}
                />
            </Pagination>
        );
    };

    const FilterPanel: React.FC = () => (
        <Card className={`${styles.filter} p-3 sticky-top`}>
            <h5>Filter Products</h5>
            <Form>
                <Form.Group controlId="genderFilter">
                    <Form.Label>Gender</Form.Label>
                    <Form.Check
                        type="radio"
                        label="Male"
                        name="gender"
                        checked={selectedGender === "male"}
                        onChange={() => {
                            setSelectedGender("male");
                            setSelectedCategories([]);
                        }}
                    />
                    <Form.Check
                        type="radio"
                        label="Female"
                        name="gender"
                        checked={selectedGender === "female"}
                        onChange={() => {
                            setSelectedGender("female");
                            setSelectedCategories([]);
                        }}
                    />
                </Form.Group>
                {selectedGender && (
                    <Form.Group controlId="categoryFilter" className="mt-3">
                        <Form.Label>Category</Form.Label>
                        {(selectedGender === "male"
                                ? ["sako", "kostum","konduri","vratovrski"]
                                : ["fustan", "sako","nevestinski fustan"]
                        ).map((category) => (
                            <Form.Check
                                key={category}
                                type="checkbox"
                                label={category}
                                checked={selectedCategories.includes(category)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedCategories((prev) => [
                                            ...prev,
                                            category,
                                        ]);
                                    } else {
                                        setSelectedCategories((prev) =>
                                            prev.filter((c) => c !== category)
                                        );
                                    }
                                }}
                            />
                        ))}
                    </Form.Group>
                )}
                <Form.Group controlId="priceFilter" className="mt-3">
                    <Form.Label>Price Range</Form.Label>
                    <SliderSizes
                        value={priceRange}
                        min={minPrice}
                        max={maxPrice}
                        onFinalChange={(val) => setPriceRange(val as [number, number])}
                    />
                    <div className="d-flex justify-content-between mt-2 ">
                        <span>{priceRange[0]} den.</span>
                        <span>{priceRange[1]} den.</span>
                    </div>
                </Form.Group>
            </Form>
        </Card>
    );

    return (
        <Container fluid className={`${styles.ajde}`}>
            <Header />
            <Row>
                <Col xs="auto">
                    <FilterPanel />
                </Col>
                <Col>
                    <Row xs="auto" className="g-4">
                        {filteredProducts.map((product: Roba) => (
                            <Col key={product.id}>
                                <Card
                                    className="h-100 shadow-sm"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        navigate("/viewImage", {
                                            state: { product, filteredProducts },
                                        })
                                    }
                                >
                                    <ProductCarousel images={product.lista_Sliki} />
                                    <Card.Body>
                                        <Card.Title>{product.type}</Card.Title>
                                        <Card.Subtitle className="text-muted">
                                            {product.popust
                                                ? product.cenaSoPopust
                                                : product.price}{" "}
                                            €
                                        </Card.Subtitle>
                                    </Card.Body>
                                </Card>
                                {isAdmin && (
                                    <>
                                        <button
                                            className="btn btn-danger mt-2"
                                            onClick={() => handleAdminAction(product)}
                                        >
                                            Delete Product
                                        </button>
                                        <button
                                            className="btn btn-info mt-2"
                                            onClick={() =>
                                                navigate("/AdminEdit", {
                                                    state: { product, filteredProducts },
                                                })
                                            }
                                        >
                                            Edit Product
                                        </button>
                                    </>
                                )}
                            </Col>
                        ))}
                        {filteredProducts.length === 0 && (
                            <Col>
                                <p>
                                    No products found matching the filter
                                    criteria.
                                </p>
                            </Col>
                        )}
                    </Row>
                    {renderPagination()}
                </Col>
            </Row>
            <Footer />
            <Chat />
        </Container>
    );
};

export default Eshop;
