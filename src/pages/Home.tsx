import React from 'react';
import { Container, Card, Carousel, Button } from 'react-bootstrap';
import './Home.css';
        
const products = [
    {
        id: 1,
        name: 'Elegant Lace Wedding Dress',
        image: '/images/dress1.jpg',
        price: '€1,200',
        type: 'dress',
    },
    {
        id: 2,
        name: 'Classic Black Wedding Suit',
        image: '/images/suit1.jpg',
        price: '€850',
        type: 'suit',
    },
    {
        id: 3,
        name: 'Bohemian Ivory Gown',
        image: '/images/dress2.jpg',
        price: '€1,050',
        type: 'dress',
    },
    {
        id: 4,
        name: 'Modern Slim-fit Suit',
        image: '/images/suit2.jpg',
        price: '€920',
        type: 'suit',
    },
    {
        id: 5,
        name: 'Minimalist Silk Dress',
        image: '/images/dress3.jpg',
        price: '€1,180',
        type: 'dress',
    },
    {
        id: 6,
        name: 'Ivory Tuxedo',
        image: '/images/suit3.jpg',
        price: '€1,100',
        type: 'suit',
    },
];

const quotes = [
    "Elegance is the only beauty that never fades. — Audrey Hepburn",
    "A dress is not just a dress, it’s a story you wear.",
    "For the moments you’ll remember forever.",
    "Sophistication in every stitch.",
    "Your day, your dream, your dress.",
];

const Home: React.FC = () => (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Container fluid className="p-0">
            <div
                style={{
                    background: 'url(/images/hero.jpg) center/cover no-repeat',
                    minHeight: 350,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    position: 'relative',
                    marginBottom: 32,
                }}
            >
                <div
                    style={{
                        background: 'rgba(0,0,0,0.45)',
                        padding: '2rem 2.5rem',
                        borderRadius: 14,
                        textAlign: 'center',
                        maxWidth: 480,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    }}
                >
                    <h1
                        style={{
                            fontFamily: 'serif',
                            fontWeight: 600,
                            fontSize: '2.5rem',
                            letterSpacing: '0.05em',
                            textShadow: '0 2px 12px rgba(0,0,0,0.12)',
                        }}
                    >
                        Your Dream Wedding Starts Here
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginTop: 12, fontStyle: 'italic' }}>
                        “Where elegance meets modern love.”
                    </p>
                </div>
            </div>
        </Container>

        {/* Animated Quotes carousel */}
        <Container className="mb-4" style={{ maxWidth: 600 }}>
            <Carousel interval={5000} fade indicators={false}>
                {quotes.map((q, i) => (
                    <Carousel.Item key={i}>
                        <div className="text-center" style={{ color: '#444', fontSize: '1.15rem', fontStyle: 'italic', minHeight: 60 }}>
                            <span>❝ {q} ❞</span>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>

        {/* Horizontally scrollable Newest Products */}
        <Container fluid className="mb-5">
            <div className="d-flex align-items-center mb-3 px-3">
                <h2 className="fw-bold mb-0">Newest Arrivals</h2>
            </div>
            <div className="scrolling-wrapper px-3 pb-2">
                {products.map(product => (
                    <div className="scroll-card" key={product.id}>
                        <Card className="h-100 shadow-sm border-0">
                            <div style={{ height: 220, background: '#e9ecef', overflow: 'hidden' }}>
                                <Card.Img
                                    variant="top"
                                    src={product.image}
                                    alt={product.name}
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                />
                            </div>
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fw-semibold">{product.name}</Card.Title>
                                <Card.Text className="text-muted mb-2">{product.type === 'dress' ? 'Wedding Dress' : 'Wedding Suit'}</Card.Text>
                                <Card.Text className="fw-bold text-primary mb-3" style={{ fontSize: '1.15rem' }}>{product.price}</Card.Text>
                                <Button variant="outline-primary" className="mt-auto">View Details</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </Container>

        {/* Call to action at the bottom */}
        <Container className="text-center mt-5 mb-5">
            <h4>Book your fitting or consultation</h4>
            <p>
                Ready to find “the one”?{' '}
                <a href="/contact" style={{ color: '#007bff', fontWeight: 600, textDecoration: 'underline' }}>
                    Contact us
                </a>{' '}
                to schedule your visit!
            </p>
        </Container>
    </div>
);

export default Home;