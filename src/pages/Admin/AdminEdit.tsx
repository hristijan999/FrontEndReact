import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useLocation, Navigate } from "react-router-dom";
import {
    Button, Checkbox, FormControlLabel, Input, MenuItem, Select, TextField
} from "@mui/material";
import { Row, Col, Form } from "react-bootstrap";
import {updateGrub}from "../../api/AdminApi";
// Your Roba type
interface Roba {
    id?: number;
    opis: string;
    detalenOpis: string;
    type: string;
    price: number;
    cenaSoPopust: number;
    lista_Sliki: string[];
    lista_Size: string[];
    popust: boolean;
}

// Type for the navigation state
type AdminEditLocationState = {
    product: Roba;
    filteredProducts: Roba[];
};

const TYPE_OPTIONS = ["Shirt", "Jeans", "Shoes", "Accessory", "Jacket"];

const AdminEdit = () => {
    // Typesafe access to location.state
    const location = useLocation();
    const state = location.state as AdminEditLocationState | undefined;

    // If navigated without state, redirect (optional safety)
    if (!state?.product) {
        return <Navigate to="/eshop" replace />;
    }
    const { product, filteredProducts } = state;

    // Prefill form with product data
    const [formData, setFormData] = useState<Roba>({
        id: product.id, // Include id for possible update
        opis: product.opis || "",
        detalenOpis: product.detalenOpis || "",
        type: product.type || "",
        price: product.price ?? 0,
        lista_Sliki: product.lista_Sliki?.length ? product.lista_Sliki : [""],
        lista_Size: product.lista_Size?.length ? product.lista_Size : [""],
        cenaSoPopust: product.cenaSoPopust ?? 0,
        popust: product.popust ?? false
    });

    // If navigation changes, also update form data
    useEffect(() => {
        setFormData({
            id: product.id,
            opis: product.opis || "",
            detalenOpis: product.detalenOpis || "",
            type: product.type || "",
            price: product.price ?? 0,
            lista_Sliki: product.lista_Sliki?.length ? product.lista_Sliki : [""],
            lista_Size: product.lista_Size?.length ? product.lista_Size : [""],
            cenaSoPopust: product.cenaSoPopust ?? 0,
            popust: product.popust ?? false
        });
    }, [product]);

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (["price", "cenaSoPopust"].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTypeChange = (e: ChangeEvent<{ value: unknown }>) => {
        setFormData(prev => ({ ...prev, type: e.target.value as string }));
    };

    const handleArrayChange = (field: "lista_Sliki" | "lista_Size", idx: number, value: string) => {
        const updated = [...formData[field]];
        updated[idx] = value;
        setFormData(prev => ({ ...prev, [field]: updated }));
    };

    const addArrayField = (field: "lista_Sliki" | "lista_Size") => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeArrayField = (field: "lista_Sliki" | "lista_Size", idx: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== idx)
        }));
    };

    // (Optional) Form submit logic
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateGrub(formData);
        alert(JSON.stringify(formData, null, 2));
    };

    return (
        <Form style={{ maxWidth: 600, margin: "0 auto", marginTop: 32 }} onSubmit={handleSubmit}>
            <h4>Edit product (Roba)</h4>

            <Row className="mb-3">
                <Col>
                    <TextField
                        label="Opis"
                        name="opis"
                        value={formData.opis}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <TextField
                        label="Detailed Opis"
                        name="detalenOpis"
                        value={formData.detalenOpis}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                        required
                    />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Col>
                <Col>
                    <TextField
                        label="Cena so Popust"
                        name="cenaSoPopust"
                        type="number"
                        value={formData.cenaSoPopust}
                        onChange={handleChange}
                        fullWidth
                    />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <Select
                        name="type"
                        value={formData.type}
                        onChange={handleTypeChange}
                        displayEmpty
                        fullWidth
                        required
                    >
                        <MenuItem value="">Select Type</MenuItem>
                        {TYPE_OPTIONS.map(t => (
                            <MenuItem value={t} key={t}>{t}</MenuItem>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="popust"
                                checked={formData.popust}
                                onChange={handleChange}
                            />
                        }
                        label="Popust?"
                    />
                </Col>
            </Row>

            {/* lista_Sliki */}
            <Row className="mb-3">
                <Col>
                    <label>Sliki (Images):</label>
                    {formData.lista_Sliki.map((url, idx) => (
                        <div
                            style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}
                            key={idx}
                        >
                            <Input
                                placeholder="Image URL"
                                value={url}
                                onChange={e => handleArrayChange("lista_Sliki", idx, e.target.value)}
                                fullWidth
                            />
                            {url && (
                                <img
                                    src={url}
                                    alt={`Preview ${idx}`}
                                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
                                />
                            )}
                            {formData.lista_Sliki.length > 1 && (
                                <Button
                                    variant="outlined"
                                    onClick={() => removeArrayField("lista_Sliki", idx)}
                                    size="small"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button variant="text" onClick={() => addArrayField("lista_Sliki")} size="small">
                        Add image
                    </Button>
                </Col>
            </Row>

            {/* lista_Size */}
            <Row className="mb-3">
                <Col>
                    <label>Sizes:</label>
                    {formData.lista_Size.map((size, idx) => (
                        <div style={{ display: "flex", gap: 8, marginBottom: 5 }} key={idx}>
                            <Input
                                placeholder="Size (S/M/L/XL/...)"
                                value={size}
                                onChange={e => handleArrayChange("lista_Size", idx, e.target.value)}
                                fullWidth
                            />
                            {formData.lista_Size.length > 1 && (
                                <Button variant="outlined" onClick={() => removeArrayField("lista_Size", idx)} size="small">
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button variant="text" onClick={() => addArrayField("lista_Size")} size="small">
                        Add size
                    </Button>
                </Col>
            </Row>

            <Button variant="contained" color="primary" type="submit">
                Update Roba
            </Button>
        </Form>
    );
};

export default AdminEdit;