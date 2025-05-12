import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ThanhToan';

// Lấy danh sách tất cả thanh toán
export const getAllcheckouts = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách thanh toán.');
  }
};

// Lấy thông tin chi tiết thanh toán theo MaThanhToan
export const getcheckoutById = async (MaThanhToan) => {
  try {
    const response = await axios.get(`${API_URL}/${MaThanhToan}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết thanh toán.');
  }
};

// Lấy danh sách thanh toán theo MaDonHang
export const getcheckoutsByOrder = async (MaDonHang) => {
  try {
    const response = await axios.get(`${API_URL}/donhang/${MaDonHang}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thanh toán theo đơn hàng.');
  }
};

// Thêm thanh toán mới
export const addNewCheckout = async (checkoutData) => {
  try {
    const { MaDonHang, PhuongThuc, TrangThai } = checkoutData;
    const response = await axios.post(`${API_URL}`, {
      MaDonHang,
      PhuongThuc,
      TrangThai,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể thêm thanh toán.');
  }
};

// Cập nhật trạng thái thanh toán
export const updateCheckoutStatus = async (MaThanhToan, statusData) => {
  try {
    const { TrangThai } = statusData;
    const response = await axios.put(`${API_URL}/${MaThanhToan}`, {
      TrangThai,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán.');
  }
};

// Xóa thanh toán
export const deletecheckout = async (MaThanhToan) => {
  try {
    const response = await axios.delete(`${API_URL}/${MaThanhToan}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa thanh toán.');
  }
};

// Tạo đơn hàng (thêm API mới để hỗ trợ CheckoutScreen)
export const createOrder = async (orderData) => {
  try {
    const { MaNguoiDung, TongTien, selectedProducts } = orderData;
    const response = await axios.post(`${API_URL}`, {
      MaNguoiDung,
      TongTien,
      selectedProducts: selectedProducts.map(item => ({
        MaChiTietSanPham: item.MaChiTietSanPham,
        SoLuong: item.SoLuong,
        Gia: item.Gia,
      })),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tạo đơn hàng.');
  }
};

export default {
  getAllcheckouts,
  getcheckoutById,
  getcheckoutsByOrder,
  addNewCheckout,
  updateCheckoutStatus,
  deletecheckout,
  createOrder,
};