import axios from 'axios';

// Định nghĩa base URL cho API (thay bằng URL của server của bạn)
const API_URL = 'http://172.16.16.189:5000/api/YeuThich'; // Giả sử endpoint là /api/favorite

// Lấy danh sách tất cả sản phẩm yêu thích
export const getAllFavorites = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu thích:', error);
    throw error;
  }
};

// Lấy danh sách sản phẩm yêu thích theo MaNguoiDung
export const getFavoritesByUser = async (MaNguoiDung) => {
  try {
    const response = await axios.get(`${API_URL}/NguoiDung/${MaNguoiDung}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy yêu thích theo người dùng:', error);
    throw error;
  }
};

// Thêm sản phẩm vào danh sách yêu thích
export const addFavorite = async (MaNguoiDung, MaSanPham) => {
  try {
    const response = await axios.post(`${API_URL}/`, {
      MaNguoiDung,
      MaSanPham,
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm yêu thích:', error);
    throw error;
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const deleteFavorite = async (MaYeuThich) => {
  try {
    const response = await axios.delete(`${API_URL}/${MaYeuThich}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa yêu thích:', error);
    throw error;
  }
};