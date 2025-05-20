import axios from 'axios';

const API_URL = 'http://172.16.16.189:5000/api/DonHang'; // Thay đổi nếu cần

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Lấy tất cả đơn hàng
export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', {
      url: API_URL,
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
  }
};

// Lấy đơn hàng theo MaDonHang
export const getOrderById = async (MaDonHang) => {
  try {
    const response = await axiosInstance.get(`/${MaDonHang}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', {
      url: `${API_URL}/${MaDonHang}`,
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể lấy đơn hàng');
  }
};

// Lấy danh sách đơn hàng theo MaNguoiDung
export const getOrdersByUser = async (MaNguoiDung) => {
  try {
    const response = await axiosInstance.get(`/user/${MaNguoiDung}`);
    return response.data.data || response.data; // Xử lý trường hợp API trả về data trong "data"
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng của người dùng:', {
      url: `${API_URL}/user/${MaNguoiDung}`,
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể lấy đơn hàng của người dùng');
  }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    console.log('Gửi yêu cầu createOrder với URL:', API_URL, 'Dữ liệu:', JSON.stringify(orderData, null, 2));
    const response = await axiosInstance.post('/', orderData);
    console.log('Phản hồi từ server:', response.data);
    if (!response.data || !response.data.MaDonHang) {
      throw new Error('Phản hồi từ server không hợp lệ');
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', {
      url: API_URL,
      data: orderData,
      error: error.message,
      errorDetails: error.response?.data || error.stack,
    });
    throw new Error(error.response?.data?.message || 'Không thể tạo đơn hàng');
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (MaDonHang, TrangThai) => {
  try {
    const response = await axiosInstance.put(`/${MaDonHang}/status`, { TrangThai });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', {
      url: `${API_URL}/${MaDonHang}/status`,
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
  }
};

// Xóa đơn hàng
export const deleteOrder = async (MaDonHang) => {
  try {
    const response = await axiosInstance.delete(`/${MaDonHang}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa đơn hàng:', {
      url: `${API_URL}/${MaDonHang}`,
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể xóa đơn hàng');
  }
};

// Lấy chi tiết đơn hàng theo MaDonHang
export const getOrderDetails = async (MaDonHang) => {
  try {
    const response = await axiosInstance.get(`/${MaDonHang}/details`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', {
      url: `${API_URL}/${MaDonHang}/details`,
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết đơn hàng');
  }
};