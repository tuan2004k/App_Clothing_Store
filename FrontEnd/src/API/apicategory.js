// src/api/apiCategory.js
import axios from "axios";

const API_URL = "http://172.16.16.189:5000/api/DanhMuc"; 

export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/`);
        return response.data;
    } catch (error) {
        throw new Error("Lỗi lấy danh sách danh mục");
    }
};

export const addCategory = async (category) => {
    try {
        const response = await axios.post(`${API_URL}/`, category);
        return response.data;
    } catch (error) {
        throw new Error("Lỗi thêm danh mục");
    }
};
export const deleteCategory = async (MaDanhMuc) => {
    try {
        await axios.delete(`${API_URL}/${MaDanhMuc}`);
    } catch (error) {
        throw new Error("Lỗi xóa danh mục: " + error.message);
    }
};
export const updateCategory = async (MaDanhMuc, category) => {
    try {
        await axios.put(`${API_URL}/${MaDanhMuc}`, category);
    } catch (error) {
        throw new Error("Lỗi cập nhật danh mục: " + error.message);
    }
};
