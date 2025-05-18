const pool = require('../config/db');

class AdminController {
  // Lấy dữ liệu biểu đồ (số lượng sản phẩm theo danh mục, tồn kho theo size)
  static async getChartData(req, res) {
    try {
      const [productsByCategory] = await pool.query(
        `SELECT d.Ten, COUNT(s.MaSanPham) as SoLuong 
         FROM SanPham s 
         JOIN DanhMuc d ON s.MaDanhMuc = d.MaDanhMuc 
         GROUP BY d.MaDanhMuc`
      );

      const [stockBySize] = await pool.query(
        `SELECT Size, SUM(SoLuong) as TongSoLuong 
         FROM ChiTietSanPham 
         GROUP BY Size`
      );

      res.json({
        productsByCategory,
        stockBySize,
      });
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu biểu đồ:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Lấy doanh thu theo thời gian
  static async getRevenueOverTime(req, res) {
    try {
      const [revenueData] = await pool.query(
        `SELECT DATE_FORMAT(d.NgayDat, '%Y-%m') as Thang, SUM(d.TongTien) as DoanhThu
         FROM DonHang d
         JOIN ThanhToan t ON d.MaDonHang = t.MaDonHang
         WHERE t.TrangThai = 'ThanhCong'
         GROUP BY DATE_FORMAT(d.NgayDat, '%Y-%m')`
      );

      res.json(revenueData);
    } catch (error) {
      console.error('Lỗi khi lấy doanh thu:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Lấy tỷ lệ trạng thái đơn hàng (tùy chọn)
  static async getOrderStatus(req, res) {
    try {
      const [orderStatus] = await pool.query(
        `SELECT TrangThai, COUNT(*) as SoLuong
         FROM DonHang
         GROUP BY TrangThai`
      );

      res.json(orderStatus);
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái đơn hàng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Lấy đánh giá trung bình theo danh mục (tùy chọn)
  static async getAverageRatingByCategory(req, res) {
    try {
      const [ratings] = await pool.query(
        `SELECT d.Ten, AVG(dg.SoSao) as SoSaoTrungBinh
         FROM DanhGia dg
         JOIN SanPham s ON dg.MaSanPham = s.MaSanPham
         JOIN DanhMuc d ON s.MaDanhMuc = d.MaDanhMuc
         GROUP BY d.MaDanhMuc`
      );

      res.json(ratings);
    } catch (error) {
      console.error('Lỗi khi lấy đánh giá:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = AdminController;