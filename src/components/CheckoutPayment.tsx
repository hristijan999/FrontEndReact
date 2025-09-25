import { Form, Button } from "react-bootstrap";

interface Props {
    form: {
        name: string;
        surname: string;
        email: string;
        phone: string;
        location: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutPayment: React.FC<Props> = ({ form, onChange }) => {
    return (
        <>
            <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Име</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Внесете име"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSurname">
                <Form.Label>Презиме</Form.Label>
                <Form.Control
                    type="text"
                    name="surname"
                    value={form.surname}
                    onChange={onChange}
                    placeholder="Внесете презиме"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Е-пошта</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="Внесете е-пошта"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>Телефонски број</Form.Label>
                <Form.Control
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="xxx/xxx/xxx"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLocation">
                <Form.Label>Локација за достава</Form.Label>
                <Form.Control
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={onChange}
                    placeholder="Локација"
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
                Pay Now
            </Button>
            </>
    );
};

export default CheckoutPayment;
