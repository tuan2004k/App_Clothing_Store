import axios from 'axios';

const API_URL = 'http://192.168.1.4:5000/api/ChiTietSanPham'; 

// 🟢 Thêm chi tiết sản phẩm
export const addProductDetail = async (detail) => {
  try {
    const response = await axios.post(`${API_URL}/`, detail);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 🟢 Lấy tất cả chi tiết sản phẩm
export const getAllProductDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 🟢 Lấy chi tiết theo mã sản phẩm
export const getProductDetailsByProductId = async (MaSanPham) => {
  try {
    const response = await axios.get(`${API_URL}/${MaSanPham}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 🟢 Cập nhật chi tiết sản phẩm
export const updateProductDetail = async (MaChiTiet, updatedDetail) => {
  try {
    const response = await axios.put(`${API_URL}/${MaChiTiet}`, updatedDetail);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 🟢 Xóa chi tiết sản phẩm
export const deleteProductDetail = async (MaChiTiet  ) => {
  try {
    const response = await axios.delete(`${API_URL}/${MaChiTiet}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
