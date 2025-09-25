// src/api/grubApi.ts
import axios from 'axios';

const API = "http://localhost:8080/Admin/eshopGRUD";

export const saveGrub = (roba: any) => {
    return axios.post(`${API}/save`, roba);
};

export const deleteGrub = (id: number) => {
    return axios.delete(`${API}/delete`, { params: { id } });
};

export const updateGrub = (roba: any) => {
    return axios.put(`${API}/update`, roba);
};
