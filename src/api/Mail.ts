import axios from 'axios';

const API = "http://localhost:8080/";

interface FormData {
    name: string;
    surname: string;
    email: string;
    phone: string;
    location: string;
}

export const sendMail = (form: FormData, cart: any[]) => {
    // Combine form and cart into one object
    const dataToSend = {
        ...form,
        cart, // include cart array
    };

    return axios.post(`${API}Mail`, dataToSend); // send JSON body
};
