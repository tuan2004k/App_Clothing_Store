import axios from 'axios';

// Lưu ý: KHÔNG có dấu / cuối cùng
const API_URL = 'http://192.168.1.4:5000/api/ThanhToan';

// Cấu hình chung cho axios
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

// Lấy danh sách tất cả thanh toán
export const getAllCheckouts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thanh toán:', error);
    throw {
      message: error.response?.data?.message || 'Lỗi khi lấy danh sách thanh toán',
      details: error.response?.data || error.message
    };
  }
};

// Lấy thông tin thanh toán theo MaThanhToan
export const getCheckoutById = async (MaThanhToan) => {
  try {
    const response = await axios.get(`${API_URL}/${MaThanhToan}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin thanh toán:', error);
    throw {
      message: error.response?.data?.message || 'Lỗi khi lấy thông tin thanh toán',
      details: error.response?.data || error.message
    };
  }
};

// Lấy danh sách thanh toán theo MaDonHang
export const getCheckoutsByOrder = async (MaDonHang) => {
  try {
    const response = await axios.get(`${API_URL}/donhang/${MaDonHang}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thanh toán theo đơn hàng:', error);
    throw {
      message: error.response?.data?.message || 'Lỗi khi lấy thanh toán theo đơn hàng',
      details: error.response?.data || error.message
    };
  }
};

// Thêm thanh toán mới - QUAN TRỌNG: Sửa lại phần này
export const addNewCheckout = async (checkoutData) => {
  try {
    const response = await axios.post(API_URL, checkoutData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm thanh toán:', error);
    throw {
      message: error.response?.data?.message || 'Lỗi khi thêm thanh toán',
      details: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

// Cập nhật trạng thái thanh toán
export const updateCheckoutStatus = async (MaThanhToan, TrangThai) => {
  try {
    const response = await axios.put(`${API_URL}/${MaThanhToan}`, { TrangThai });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    throw {
      message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái',
      details: error.response?.data || error.message
    };
  }
};

// Xóa thanh toán
export const deleteCheckout = async (MaThanhToan) => {
  try {
    const response = await axios.delete(`${API_URL}/${MaThanhToan}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa thanh toán:', error);
    throw {
      message: error.response?.data?.message || 'Lỗi khi xóa thanh toán',
      details: error.response?.data || error.message
    };
  }
};