const db = require('../config/db');

// 🟢 Lấy danh sách tất cả thanh toán
exports.getAllcheckouts = async (req, res) => {
  try {
    const query = `
      SELECT tt.MaThanhToan, tt.MaDonHang, tt.PhuongThuc, tt.TrangThai, tt.NgayThanhToan,
             dh.MaNguoiDung, dh.TongTien, nd.Ten AS TenNguoiDung, nd.Email
      FROM ThanhToan tt
      LEFT JOIN DonHang dh ON tt.MaDonHang = dh.MaDonHang
      LEFT JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
      ORDER BY tt.NgayThanhToan DESC
    `;
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Lấy thông tin chi tiết thanh toán theo MaThanhToan
exports.getcheckoutById = async (req, res) => {
  try {
    const { MaThanhToan } = req.params;
    const query = `
      SELECT tt.MaThanhToan, tt.MaDonHang, tt.PhuongThuc, tt.TrangThai, tt.NgayThanhToan,
             dh.MaNguoiDung, dh.TongTien, dh.TrangThai AS TrangThaiDonHang,
             nd.Ten AS TenNguoiDung, nd.Email
      FROM ThanhToan tt
      LEFT JOIN DonHang dh ON tt.MaDonHang = dh.MaDonHang
      LEFT JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
      WHERE tt.MaThanhToan = ?
    `;
    const [rows] = await db.query(query, [MaThanhToan]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Thanh toán không tồn tại.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Lấy danh sách thanh toán theo MaDonHang
exports.getcheckoutsByOrder = async (req, res) => {
  try {
    const { MaDonHang } = req.params;
    const query = `
      SELECT tt.MaThanhToan, tt.PhuongThuc, tt.TrangThai, tt.NgayThanhToan,
             dh.MaNguoiDung, dh.TongTien, nd.Ten AS TenNguoiDung, nd.Email
      FROM ThanhToan tt
      LEFT JOIN DonHang dh ON tt.MaDonHang = dh.MaDonHang
      LEFT JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
      WHERE tt.MaDonHang = ?
      ORDER BY tt.NgayThanhToan DESC
    `;
    const [rows] = await db.query(query, [MaDonHang]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thanh toán cho đơn hàng này.' });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy thanh toán theo đơn hàng:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Thêm thanh toán mới
exports.addNewCheckout = async (req, res) => {
  try {
    const { MaDonHang, PhuongThuc, TrangThai } = req.body;

    // Xác thực dữ liệu
    if (!MaDonHang || !PhuongThuc) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin thanh toán.' });
    }

    // Kiểm tra phương thức thanh toán hợp lệ
    const validMethods = ['TienMat', 'ChuyenKhoan', 'TheTinDung'];
    if (!validMethods.includes(PhuongThuc)) {
      return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ.' });
    }

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ['ChoXacNhan', 'ThanhCong', 'ThatBai'];
    if (TrangThai && !validStatuses.includes(TrangThai)) {
      return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ.' });
    }

    // Kiểm tra đơn hàng tồn tại
    const [order] = await db.query('SELECT MaDonHang FROM DonHang WHERE MaDonHang = ?', [MaDonHang]);
    if (order.length === 0) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
    }

    // Thêm thanh toán
    const query = 'INSERT INTO ThanhToan (MaDonHang, PhuongThuc, TrangThai) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [MaDonHang, PhuongThuc, TrangThai || 'ChoXacNhan']);
    res.status(201).json({ MaThanhToan: result.insertId, message: 'Thanh toán đã được tạo thành công.' });
  } catch (error) {
    console.error('Lỗi khi thêm thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Cập nhật trạng thái thanh toán
exports.updateCheckoutStatus = async (req, res) => {
  try {
    const { MaThanhToan } = req.params;
    const { TrangThai } = req.body;

    // Xác thực trạng thái
    const validStatuses = ['ChoXacNhan', 'ThanhCong', 'ThatBai'];
    if (!TrangThai || !validStatuses.includes(TrangThai)) {
      return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ.' });
    }

    // Kiểm tra thanh toán tồn tại
    const [payment] = await db.query('SELECT MaThanhToan FROM ThanhToan WHERE MaThanhToan = ?', [MaThanhToan]);
    if (payment.length === 0) {
      return res.status(404).json({ message: 'Thanh toán không tồn tại.' });
    }

    // Cập nhật trạng thái
    const query = 'UPDATE ThanhToan SET TrangThai = ? WHERE MaThanhToan = ?';
    const [result] = await db.query(query, [TrangThai, MaThanhToan]);
    res.status(200).json({ message: 'Trạng thái thanh toán đã được cập nhật.' });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Xóa thanh toán
exports.deletecheckout = async (req, res) => {
  try {
    const { MaThanhToan } = req.params;

    // Kiểm tra thanh toán tồn tại
    const [payment] = await db.query('SELECT MaThanhToan FROM ThanhToan WHERE MaThanhToan = ?', [MaThanhToan]);
    if (payment.length === 0) {
      return res.status(404).json({ message: 'Thanh toán không tồn tại.' });
    }

    // Xóa thanh toán
    const query = 'DELETE FROM ThanhToan WHERE MaThanhToan = ?';
    await db.query(query, [MaThanhToan]);
    res.status(200).json({ message: 'Thanh toán đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};