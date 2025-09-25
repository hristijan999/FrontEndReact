import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Offcanvas, OffcanvasHeader, OffcanvasTitle } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import styles from "./Header.module.css";
import { removeProduct, getCart } from "../api/bucket";
import {useNavigate} from "react-router-dom";

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
interface HeaderProps {
    flag?: boolean;
}



const Korpa: React.FC<HeaderProps> = ({ flag }) => {
    const [show, setShow] = useState(false);
    const { cart, setCart } = useCart();
    const navigate = useNavigate();
    useEffect(() => {
        if (flag) setShow(true);
    }, [flag]);

    useEffect(() => {
        getCart()
            .then((res) => setCart(res.data))
            .catch((err) => console.error("Failed to load cart:", err));
    }, [setCart]);

    const handleClose = useCallback(() => setShow(false), []);
    const handleShow = useCallback(() => setShow(true), []);

    const removeCartItem = useCallback(
        (item: Roba) => {
            removeProduct(item)
                .then((res) => setCart(res.data))
                .catch((err) => console.error("Error removing from cart:", err));
        },
        [setCart]
    );

    const cartCount = useMemo(() => cart.length, [cart]);

    return (
        <>
            <Button variant="outline-danger" onClick={handleShow}>
                <i className={`bi bi-cart ${styles.fondot}`}></i>
                {cartCount > 0 && <span className="ms-2">({cartCount})</span>}
            </Button>

            <Offcanvas show={show} onHide={handleClose} placement="end" scroll backdrop={false}>
                <OffcanvasHeader closeButton className="d-flex justify-content-between align-items-center">
                    <OffcanvasTitle>Korpa</OffcanvasTitle>
                </OffcanvasHeader>
                <Offcanvas.Body>
                    {cartCount === 0 ? (
                        <p className="text-muted">Your cart is empty</p>
                    ) : (
                        <ul className="list-group">
                            {cart.map((item) => (
                                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {item.lista_Sliki?.length > 0 && (
                                        <img src={item.lista_Sliki[0]} alt={item.type} width="80" className="me-2" />
                                    )}
                                    <div className="flex-grow-1">
                                        <strong>{item.type}</strong>
                                        <br />
                                        <small>Size: {item.sizePicked}</small>
                                    </div>
                                    <span>{item.popust ? item.cenaSoPopust : item.price} €</span>
                                    <button
                                        className="btn btn-outline-danger ms-2"
                                        onClick={() => removeCartItem(item)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Offcanvas.Body>
                {/*<Checkout hasItems={cartCount > 0} />*/}
                {cartCount > 0 && (
                    <button onClick={() =>
                        navigate("/Checkout", {

                        })
                    } className="btn btn-danger rounded-0">Checkout</button>
                )}
            </Offcanvas>
        </>
    );
};

export default Korpa;