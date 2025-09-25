import axios from "axios";

const API = "http://localhost:8080/api/cart";
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
// Add product to cart
export const addProduct = (product: Roba) => {
    return axios.post(`${API}/add`, product, { withCredentials: true });
};

// Get cart items
export const getCart = () => {
    return axios.get(API, { withCredentials: true });
};

// Remove product from cart
export const removeProduct = (product: Roba) => {
    return axios.post(`${API}/remove`, product, { withCredentials: true });
};

// Clear cart
export const clearCart = () => {
    return axios.post(`${API}/clear`, {}, { withCredentials: true });
};
