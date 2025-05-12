import axios from 'axios';

const API_URL = "http://172.16.17.135:5000/api/NguoiDung";

// Đăng ký
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        console.log("✅ Server response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi API:", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: "Lỗi không xác định" };
    }
};


// Đăng nhập
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// 2. Lấy người dùng theo ID
export const getUserById = async (MaNguoiDung) => {
    try {
        const response = await axios.get(`${API_URL}/${MaNguoiDung}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// 3. Cập nhật người dùng
export const updateUser = async (MaNguoiDung, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${MaNguoiDung}`, updatedData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// 4. Xóa người dùng
export const deleteUser = async (MaNguoiDung) => {
    try {
        const response = await axios.delete(`${API_URL}/${MaNguoiDung}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


