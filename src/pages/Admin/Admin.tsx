
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useUser } from '../../hooks/useUser';
import { useNavigate } from "react-router-dom";
import { saveGrub,updatePassword } from "../../api/AdminApi";
import { Input, MenuItem, Select, Checkbox, FormControlLabel, Button, TextField } from "@mui/material";
import { Form, Row, Col } from "react-bootstrap";

interface Roba {
    opis: string;
    detalenOpis: string;
    type: string;
    price: number;
    cenaSoPopust: number;
    lista_Sliki: string[];
    lista_Size: string[];
    popust: boolean;
}

const TYPE_OPTIONS = [
    "Shirt",
    "Jeans",
    "Shoes",
    "Accessory",
    "Jacket",

];

const Admin = () => {
    const navigate = useNavigate();
    const { user, loading } = useUser();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            console.log(password);
            await updatePassword(password);
            alert("Password updated successfully!");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(err);
            alert("Failed to update password.");
        }
    };
    const [formData, setFormData] = useState<Roba>({
        opis: "",
        detalenOpis: "",
        type: "",
        price: 0,
        lista_Sliki: [""],
        lista_Size: [""],
        cenaSoPopust: 0,
        popust: false
    });

    useEffect(() => {
        if (loading) return;
        if (!user || !user.roles?.includes('ROLE_ADMIN')) {
            navigate('/eshop');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !user.roles?.includes('ROLE_ADMIN')) {
        return null;
    }

    // Handle input changes for all fields incl. arrays
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

    // Handle Select change for Type
    const handleTypeChange = (e: ChangeEvent<{ value: unknown }>) => {
        setFormData(prev => ({ ...prev, type: e.target.value as string }));
    };

    // For multi-value fields (arrays)
    const handleArrayChange = (field: "lista_Sliki" | "lista_Size", idx: number, value: string) => {
        const updated = [...formData[field]];
        updated[idx] = value;
        setFormData(prev => ({ ...prev, [field]: updated }));
    };

    // For adding/removing inputs for images/sizes
    const addArrayField = (field: "lista_Sliki" | "lista_Size") => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
    };
    const removeArrayField = (field: "lista_Sliki" | "lista_Size", idx: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== idx)
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // sanitize: remove empty strings from images/sizes array
        const data: Roba = {
            ...formData,
            lista_Sliki: formData.lista_Sliki.filter(x => x.trim() !== ""),
            lista_Size: formData.lista_Size.filter(x => x.trim() !== "")
        };
        console.log("Submitting data:", data);
        saveGrub(data);
    };

    return (
        <>
            {/* === FORM 1: Add new product === */}
            <Form style={{ maxWidth: 600, margin: "0 auto", marginTop: 32 }} onSubmit={handleSubmit}>
                <h4>Add new product (Roba)</h4>

                {/* --- existing roba inputs --- */}
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
                            label="Type"
                            value={formData.type}
                            onChange={handleTypeChange}
                            displayEmpty
                            fullWidth
                            required
                            style={{ minWidth: 120 }}
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
                            <div style={{ display: "flex", gap: 8, marginBottom: 5 }} key={idx}>
                                <Input
                                    placeholder="Image URL"
                                    value={url}
                                    onChange={e => handleArrayChange("lista_Sliki", idx, e.target.value)}
                                    fullWidth
                                />
                                {formData.lista_Sliki.length > 1 && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => removeArrayField("lista_Sliki", idx)}
                                        size="small"
                                    >Remove</Button>
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
                                    <Button
                                        variant="outlined"
                                        onClick={() => removeArrayField("lista_Size", idx)}
                                        size="small"
                                    >Remove</Button>
                                )}
                            </div>
                        ))}
                        <Button variant="text" onClick={() => addArrayField("lista_Size")} size="small">
                            Add size
                        </Button>
                    </Col>
                </Row>

                <Button variant="contained" color="primary" type="submit">
                    Save Roba
                </Button>
            </Form>

            {/* === FORM 2: Change password === */}
            <Form style={{ maxWidth: 600, margin: "32px auto" }} onSubmit={handlePasswordSubmit}>
                <h4>Change Admin Password</h4>

                <Row className="mb-3">
                    <Col>
                        <TextField
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            required
                        />
                    </Col>
                </Row>

                <Button variant="contained" color="secondary" type="submit">
                    Update Password
                </Button>
            </Form>
        </>
    );

};

export default Admin;