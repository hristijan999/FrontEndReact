import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import {sendMail} from "../api/Mail";

import Footer from "../components/Footer";
import { Row, Col, Container,Card} from "react-bootstrap";
import CheckoutPayment from "../components/CheckoutPayment";



const Checkout: React.FC = () => {
    const { cart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/eshop');
        }
    }, [cart, navigate]);



    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        location: ""
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        sendMail(form, cart)
            .then((res) => console.log("Mail sent successfully", res.data))
            .catch((err) => console.error("Error sending mail", err));
    };

    const renderCartItems = () => {



        return cart.map(item => (
            <div key={item.id} className="mb-2 d-flex align-items-center">
                <img
                    src={item.lista_Sliki[0]}
                    alt={item.opis}
                    style={{ width: 60, height: 80, objectFit: "cover", marginRight: 12 }}
                />
                <div>
                    <strong>{item.opis}</strong> ${item.price}
                </div>
            </div>
        ));
    };
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);



    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <Container className="flex-grow-1 my-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="p-4 shadow-sm">

                            <form onSubmit={handleSubmit}>
                                <CheckoutPayment form={form} onChange={handleChange} />
                            </form>
                        </Card>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <Card className="p-4 shadow-sm">
                            <h5>Your Cart</h5>
                            {renderCartItems()}
                            <hr />
                            <div className="text-end fw-bold">
                                Total: ${totalPrice}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </div>
    );
};

export default Checkout;
