import axios from 'axios';

// Cấu hình base URL (đảm bảo khớp với backend của bạn)
const API_URL = 'http://172.16.16.189:5000/api/DonHang';

// Tạo instance Axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lấy chi tiết đơn hàng theo MaDonHang
export const getOrderDetails = async (MaDonHang) => {
  try {
    if (!MaDonHang || isNaN(parseInt(MaDonHang))) {
      throw new Error('MaDonHang không hợp lệ');
    }
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

// Thêm chi tiết đơn hàng
export const addOrderDetail = async (MaDonHang, detailData) => {
  try {
    if (!MaDonHang || isNaN(parseInt(MaDonHang)) || !detailData || !detailData.MaChiTietSanPham || !detailData.SoLuong || !detailData.Gia) {
      throw new Error('Dữ liệu đầu vào không hợp lệ');
    }
    const response = await axiosInstance.post(`/${MaDonHang}/add-detail`, detailData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm chi tiết đơn hàng:', {
      url: `${API_URL}/${MaDonHang}/add-detail`,
      data: detailData,
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể thêm chi tiết đơn hàng');
  }
};

// Cập nhật chi tiết đơn hàng
export const updateOrderDetail = async (MaDonHang, detailData) => {
  try {
    if (!MaDonHang || isNaN(parseInt(MaDonHang)) || !detailData || !detailData.MaChiTietSanPham || !detailData.SoLuong) {
      throw new Error('Dữ liệu đầu vào không hợp lệ');
    }
    const response = await axiosInstance.put(`/${MaDonHang}/update-detail`, detailData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật chi tiết đơn hàng:', {
      url: `${API_URL}/${MaDonHang}/update-detail`,
      data: detailData,
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể cập nhật chi tiết đơn hàng');
  }
};

// Xóa chi tiết đơn hàng
export const removeOrderDetail = async (MaDonHang, MaChiTietSanPham) => {
  try {
    if (!MaDonHang || isNaN(parseInt(MaDonHang)) || !MaChiTietSanPham || isNaN(parseInt(MaChiTietSanPham))) {
      throw new Error('Dữ liệu đầu vào không hợp lệ');
    }
    const response = await axiosInstance.delete(`/${MaDonHang}/remove-detail`, {
      data: { MaChiTietSanPham },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa chi tiết đơn hàng:', {
      url: `${API_URL}/${MaDonHang}/remove-detail`,
      data: { MaChiTietSanPham },
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể xóa chi tiết đơn hàng');
  }
};

// Xóa tất cả chi tiết đơn hàng
export const clearOrderDetails = async (MaDonHang) => {
  try {
    if (!MaDonHang || isNaN(parseInt(MaDonHang))) {
      throw new Error('MaDonHang không hợp lệ');
    }
    const response = await axiosInstance.delete(`/${MaDonHang}/clear-details`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa tất cả chi tiết đơn hàng:', {
      url: `${API_URL}/${MaDonHang}/clear-details`,
      error: error.response?.data || error.message,
    });
    throw new Error(error.response?.data?.message || 'Không thể xóa tất cả chi tiết đơn hàng');
  }
};