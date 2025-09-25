import axios from 'axios';

const API = "http://localhost:8080/viewImage";


export const fetchViewImagesByType = (
    type: string,
    page: number = 0,
    size: number = 6
) => {
    return axios.get(`${API}/viewImage/findAllByType`, {
        params: { type, page, size },
    });
};


export const fetchImageById = (id: number) => {
    return axios.get(`${API}/viewImage/findById`, {
        params: { id },
    });
};

