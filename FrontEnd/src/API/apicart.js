import axios from 'axios';

const API_URL = 'http://172.16.17.135:5000/api/GioHang'; // Thêm '/cart' vào base URL

export const getCart = async (MaNguoiDung) => {
  try {
    const response = await axios.get(`${API_URL}/${MaNguoiDung}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addToCart = async (MaNguoiDung, MaChiTietSanPham, SoLuong) => {
  try {
    const response = await axios.post(`${API_URL}/add`, {
      MaNguoiDung,
      MaChiTietSanPham,
      SoLuong,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateCart = async (MaNguoiDung, MaChiTietSanPham, SoLuong) => {
  try {
    const response = await axios.put(`${API_URL}/update`, {
      MaNguoiDung,
      MaChiTietSanPham,
      SoLuong,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeFromCart = async (MaNguoiDung, MaChiTietSanPham) => {
  try {
    const response = await axios.delete(`${API_URL}/remove`, {
      data: { MaNguoiDung, MaChiTietSanPham }, // DELETE yêu cầu gửi body qua data
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const clearCart = async (MaNguoiDung) => {
  try {
    const response = await axios.delete(`${API_URL}/clear/${MaNguoiDung}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkout = async (MaNguoiDung, PhuongThuc) => {
  try {
    const response = await axios.post(`${API_URL}/checkout`, {
      MaNguoiDung,
      PhuongThuc,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};