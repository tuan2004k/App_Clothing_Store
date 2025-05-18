const db = require('../config/db');

class OrderController {
  // Lấy tất cả đơn hàng
  static async getAllOrders(req, res) {
    try {
      const [orders] = await db.query('SELECT * FROM DonHang');
      res.status(200).json(orders);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error.message, 'Stack:', error.stack);
      res.status(500).json({ error: 'Lỗi lấy danh sách đơn hàng', details: error.message });
    }
  }

  // Lấy đơn hàng theo MaDonHang
  static async getOrderById(req, res) {
    const { MaDonHang } = req.params;
    const donHangId = parseInt(MaDonHang, 10);
    if (isNaN(donHangId)) {
      return res.status(400).json({ error: 'MaDonHang phải là số nguyên.' });
    }
    try {
      const query = `
        SELECT 
          dh.MaDonHang, dh.MaNguoiDung, dh.TongTien, dh.NgayDat, dh.TrangThai,
          nd.DiaChi, nd.SoDienThoai
        FROM DonHang dh
        LEFT JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
        WHERE dh.MaDonHang = ?
      `;
      const [rows] = await db.query(query, [donHangId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', {
        message: error.message,
        stack: error.stack,
      });
      res.status(500).json({ error: 'Lỗi lấy đơn hàng', details: error.message });
    }
  }

  // Lấy danh sách đơn hàng theo MaNguoiDung
  static async getOrdersByUser(req, res) {
    const { MaNguoiDung } = req.params;
    const nguoiDungId = parseInt(MaNguoiDung, 10);
    if (isNaN(nguoiDungId)) {
      return res.status(400).json({ error: 'MaNguoiDung phải là số nguyên.' });
    }
    try {
      const [orders] = await db.query('SELECT * FROM DonHang WHERE MaNguoiDung = ?', [nguoiDungId]);
      if (orders.length === 0) {
        return res.status(200).json({ message: 'Người dùng chưa có đơn hàng nào', data: [] });
      }
      res.status(200).json(orders);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng của người dùng:', error.message, 'Stack:', error.stack);
      res.status(500).json({ error: 'Lỗi lấy đơn hàng của người dùng', details: error.message });
    }
  }

  // Tạo đơn hàng mới
  static async createOrder(req, res) {
    const { MaNguoiDung, TongTien, selectedProducts } = req.body;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Kiểm tra input
      if (!MaNguoiDung || !TongTien || !selectedProducts || !Array.isArray(selectedProducts)) {
        throw new Error('Dữ liệu đầu vào không hợp lệ: Thiếu MaNguoiDung, TongTien, hoặc selectedProducts không phải là mảng.');
      }

      const nguoiDungId = parseInt(MaNguoiDung, 10);
      if (isNaN(nguoiDungId)) {
        throw new Error('MaNguoiDung phải là số nguyên.');
      }

      // Kiểm tra MaNguoiDung tồn tại
      const [user] = await connection.query('SELECT MaNguoiDung FROM NguoiDung WHERE MaNguoiDung = ?', [nguoiDungId]);
      if (user.length === 0) {
        throw new Error('Người dùng không tồn tại.');
      }

      // Kiểm tra selectedProducts
      for (const item of selectedProducts) {
        if (!item.MaChiTietSanPham || !item.SoLuong || !item.Gia) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ: Thiếu MaChiTietSanPham, SoLuong, hoặc Gia.');
        }
        const soLuong = parseInt(item.SoLuong, 10);
        if (isNaN(soLuong) || soLuong <= 0) {
          throw new Error('Số lượng sản phẩm phải là số nguyên dương.');
        }
      }

      // Kiểm tra tồn kho
      for (const item of selectedProducts) {
        const [product] = await connection.query(
          'SELECT SoLuong FROM ChiTietSanPham WHERE MaChiTietSanPham = ?',
          [item.MaChiTietSanPham]
        );
        if (product.length === 0) {
          throw new Error(`Sản phẩm với MaChiTietSanPham ${item.MaChiTietSanPham} không tồn tại.`);
        }
        if (product[0].SoLuong < item.SoLuong) {
          throw new Error(`Sản phẩm với MaChiTietSanPham ${item.MaChiTietSanPham} không đủ số lượng tồn kho.`);
        }
      }

      // Tạo đơn hàng mới
      const [orderResult] = await connection.query(
        'INSERT INTO DonHang (MaNguoiDung, TongTien) VALUES (?, ?)',
        [nguoiDungId, TongTien]
      );
      const MaDonHang = orderResult.insertId;

      // Thêm chi tiết đơn hàng
      const detailValues = selectedProducts.map(item => [
        MaDonHang,
        item.MaChiTietSanPham,
        item.HinhAnh,
        item.SoLuong,
        item.Gia,
      ]);

      const detailQuery = 'INSERT INTO ChiTietDonHang (MaDonHang, MaChiTietSanPham, SoLuong, Gia) VALUES ?';
      await connection.query(detailQuery, [detailValues]);

      // Cập nhật số lượng tồn kho
      for (const item of selectedProducts) {
        await connection.query(
          'UPDATE ChiTietSanPham SET SoLuong = SoLuong - ? WHERE MaChiTietSanPham = ?',
          [item.SoLuong, item.MaChiTietSanPham]
        );
      }

      await connection.commit();

      // Lấy thông tin đơn hàng vừa tạo
      const [newOrder] = await db.query('SELECT * FROM DonHang WHERE MaDonHang = ?', [MaDonHang]);
      res.status(201).json({ message: 'Tạo đơn hàng thành công!', ...newOrder[0] });
    } catch (error) {
      await connection.rollback();
      console.error('Lỗi khi tạo đơn hàng:', error.message, 'Stack:', error.stack);
      res.status(500).json({ error: 'Lỗi tạo đơn hàng', details: error.message });
    } finally {
      connection.release();
    }
  }

  // Cập nhật trạng thái đơn hàng
  static async updateOrderStatus(req, res) {
    const { MaDonHang } = req.params;
    const { TrangThai } = req.body;
    const donHangId = parseInt(MaDonHang, 10);
    if (isNaN(donHangId)) {
      return res.status(400).json({ error: 'MaDonHang phải là số nguyên.' });
    }
    try {
      const validStatuses = ['ChoXacNhan', 'DangGiao', 'HoanThanh', 'Huy','DaThanhToan'];
      if (!validStatuses.includes(TrangThai)) {
        return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
      }

      // Kiểm tra trạng thái hiện tại
      const [currentOrder] = await db.query('SELECT TrangThai FROM DonHang WHERE MaDonHang = ?', [donHangId]);
      if (currentOrder.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng để cập nhật' });
      }

      const currentStatus = currentOrder[0].TrangThai;
      if (currentStatus === 'Huy') {
        return res.status(400).json({ error: 'Đơn hàng đã bị hủy, không thể cập nhật trạng thái.' });
      }
      if (currentStatus === 'HoanThanh') {
        return res.status(400).json({ error: 'Đơn hàng đã hoàn thành, không thể cập nhật trạng thái.' });
      }

      const [result] = await db.query(
        'UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?',
        [TrangThai, donHangId]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng để cập nhật' });
      }
      const [updatedOrder] = await db.query('SELECT * FROM DonHang WHERE MaDonHang = ?', [donHangId]);
      res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công!', ...updatedOrder[0] });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error.message, 'Stack:', error.stack);
      res.status(500).json({ error: 'Lỗi cập nhật đơn hàng', details: error.message });
    }
  }

  // Xóa đơn hàng
  static async deleteOrder(req, res) {
    const { MaDonHang } = req.params;
    const donHangId = parseInt(MaDonHang, 10);
    if (isNaN(donHangId)) {
      return res.status(400).json({ error: 'MaDonHang phải là số nguyên.' });
    }
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Kiểm tra đơn hàng tồn tại
      const [order] = await connection.query('SELECT * FROM DonHang WHERE MaDonHang = ?', [donHangId]);
      if (order.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng để xóa' });
      }

      // Lấy chi tiết đơn hàng để hoàn lại số lượng tồn kho
      const [details] = await connection.query(
        'SELECT MaChiTietSanPham, SoLuong FROM ChiTietDonHang WHERE MaDonHang = ?',
        [donHangId]
      );

      // Hoàn lại số lượng tồn kho
      for (const detail of details) {
        await connection.query(
          'UPDATE ChiTietSanPham SET SoLuong = SoLuong + ? WHERE MaChiTietSanPham = ?',
          [detail.SoLuong, detail.MaChiTietSanPham]
        );
      }

      // Xóa chi tiết đơn hàng
      await connection.query('DELETE FROM ChiTietDonHang WHERE MaDonHang = ?', [donHangId]);

      // Xóa đơn hàng
      const [result] = await connection.query('DELETE FROM DonHang WHERE MaDonHang = ?', [donHangId]);
      if (result.affectedRows === 0) {
        throw new Error('Không thể xóa đơn hàng');
      }

      await connection.commit();
      res.status(200).json({ message: 'Đơn hàng đã được xóa!' });
    } catch (error) {
      await connection.rollback();
      console.error('Lỗi khi xóa đơn hàng:', error.message, 'Stack:', error.stack);
      res.status(500).json({ error: 'Lỗi xóa đơn hàng', details: error.message });
    } finally {
      connection.release();
    }
  }

  // Lấy chi tiết đơn hàng theo MaDonHang
  static async getOrderDetails(req, res) {
    const { MaDonHang } = req.params;
    const donHangId = parseInt(MaDonHang, 10);
    if (isNaN(donHangId)) {
      return res.status(400).json({ error: 'MaDonHang phải là số nguyên.' });
    }
    try {
      const [details] = await db.query(
        `
      SELECT ctdh.*, sp.Ten, sp.HinhAnh, csp.Size, csp.MauSac
      FROM ChiTietDonHang ctdh
      JOIN ChiTietSanPham csp ON ctdh.MaChiTietSanPham = csp.MaChiTietSanPham
      JOIN SanPham sp ON csp.MaSanPham = sp.MaSanPham
      WHERE ctdh.MaDonHang = ?
      `,
        [donHangId]
      );
      if (details.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
      }
      res.status(200).json(details);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error.message, 'Stack:', error.stack);
      res.status(500).json({ error: 'Lỗi lấy chi tiết đơn hàng', details: error.message });
    }
  }
}

module.exports = OrderController;