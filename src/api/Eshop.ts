// src/api/merchApi.js
import axios from 'axios';

const API = "http://localhost:8080/eshop";





export const fetchAll = (page = 0, size = 2) => {
    return axios.get(`${API}/findAll`, {
        params: { page, size }
    });
};

export const fetchByType = (type:string , page = 0, size = 6) => {
    return axios.get(`${API}/findAllByType`, {
        params: { type, page, size }
    });
};

export const fetchByPriceRange = (minPrice:string, maxPrice:string, page = 0, size = 6) => {
    return axios.get(`${API}/findAllByPriceBetween`, {
        params: { minPrice, maxPrice, page, size }
    });
};

export const fetchByPriceAsc = (minPrice:string, maxPrice:string, page = 0, size = 6) => {
    return axios.get(`${API}/findAllByPriceBetweenOrderByPriceAsc`, {
        params: { minPrice, maxPrice, page, size }
    });
};

export const fetchByPriceDesc = (minPrice:string , maxPrice:string, page = 0, size = 6) => {
    return axios.get(`${API}/findAllByPriceBetweenOrderByPriceDesc`, {
        params: { minPrice, maxPrice, page, size }
    });
};



