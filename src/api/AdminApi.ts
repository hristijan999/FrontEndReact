// src/api/grubApi.ts
import axios from 'axios';

const API = "http://localhost:8080/Admin";

export const saveGrub = (roba: any) => {
    return axios.post(`${API}/eshopGRUD/save`, roba);
};

export const deleteGrub = (id: number) => {
    return axios.delete(`${API}/eshopGRUD/delete`, { params: { id } });
};

export const updateGrub = (roba: any) => {
    return axios.put(`${API}/eshopGRUD/update`, roba);
};


//OVA E ZA ADMIN
export const updatePassword = (password: string) => {
    return axios.post(`${API}/Admin/savePassword`, { password }, {
        headers: { "Content-Type": "application/json" }
    });
};

export const getAllChats = () => {
    return axios.get(`${API}/messages`);
};