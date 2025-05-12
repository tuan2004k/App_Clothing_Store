const db = require('../config/db');

// 🟢 Lấy danh sách tất cả đánh giá
exports.getAllfeedbacks = async (req, res) => {
  try {
    const query = `
      SELECT dg.MaDanhGia, dg.MaNguoiDung, dg.MaSanPham, dg.SoSao, dg.BinhLuan, dg.NgayDanhGia,
             nd.Ten AS TenNguoiDung, nd.Email,
             sp.Ten AS TenSanPham
      FROM DanhGia dg
      LEFT JOIN NguoiDung nd ON dg.MaNguoiDung = nd.MaNguoiDung
      LEFT JOIN SanPham sp ON dg.MaSanPham = sp.MaSanPham
      ORDER BY dg.NgayDanhGia DESC
    `;
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Lấy danh sách đánh giá theo MaSanPham
exports.getfeedbacksByProduct = async (req, res) => {
  try {
    const { MaSanPham } = req.params;
    const query = `
      SELECT dg.MaDanhGia, dg.MaNguoiDung, dg.SoSao, dg.BinhLuan, dg.NgayDanhGia,
             nd.Ten AS TenNguoiDung, nd.Email
      FROM DanhGia dg
      LEFT JOIN NguoiDung nd ON dg.MaNguoiDung = nd.MaNguoiDung
      WHERE dg.MaSanPham = ?
      ORDER BY dg.NgayDanhGia DESC
    `;
    const [rows] = await db.query(query, [MaSanPham]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy đánh giá theo sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Thêm đánh giá mới
exports.addfeedback = async (req, res) => {
  try {
    const { MaNguoiDung, MaSanPham, SoSao, BinhLuan } = req.body;

    // Xác thực dữ liệu
    if (!MaNguoiDung || !MaSanPham || !SoSao) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin đánh giá.' });
    }
    if (SoSao < 1 || SoSao > 5) {
      return res.status(400).json({ message: 'Số sao phải từ 1 đến 5.' });
    }

    // Kiểm tra người dùng tồn tại
    const [user] = await db.query('SELECT MaNguoiDung FROM NguoiDung WHERE MaNguoiDung = ?', [MaNguoiDung]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    // Kiểm tra sản phẩm tồn tại
    const [product] = await db.query('SELECT MaSanPham FROM SanPham WHERE MaSanPham = ?', [MaSanPham]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }

    // Kiểm tra người dùng đã đánh giá sản phẩm này chưa
    const [existing] = await db.query(
      'SELECT MaDanhGia FROM DanhGia WHERE MaNguoiDung = ? AND MaSanPham = ?',
      [MaNguoiDung, MaSanPham]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi.' });
    }

    // Thêm đánh giá
    const query = 'INSERT INTO DanhGia (MaNguoiDung, MaSanPham, SoSao, BinhLuan) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [MaNguoiDung, MaSanPham, SoSao, BinhLuan || null]);
    res.status(201).json({ MaDanhGia: result.insertId, message: 'Đánh giá đã được thêm thành công.' });
  } catch (error) {
    console.error('Lỗi khi thêm đánh giá:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Cập nhật đánh giá
exports.updatefeedback = async (req, res) => {
  try {
    const { MaDanhGia } = req.params;
    const { SoSao, BinhLuan } = req.body;

    // Xác thực dữ liệu
    if (!SoSao) {
      return res.status(400).json({ message: 'Vui lòng cung cấp số sao.' });
    }
    if (SoSao < 1 || SoSao > 5) {
      return res.status(400).json({ message: 'Số sao phải từ 1 đến 5.' });
    }

    // Kiểm tra đánh giá tồn tại
    const [review] = await db.query('SELECT MaDanhGia FROM DanhGia WHERE MaDanhGia = ?', [MaDanhGia]);
    if (review.length === 0) {
      return res.status(404).json({ message: 'Đánh giá không tồn tại.' });
    }

    // Cập nhật đánh giá
    const query = 'UPDATE DanhGia SET SoSao = ?, BinhLuan = ? WHERE MaDanhGia = ?';
    await db.query(query, [SoSao, BinhLuan || null, MaDanhGia]);
    res.status(200).json({ message: 'Đánh giá đã được cập nhật.' });
  } catch (error) {
    console.error('Lỗi khi cập nhật đánh giá:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Xóa đánh giá
exports.deletefeedback = async (req, res) => {
  try {
    const { MaDanhGia } = req.params;

    // Kiểm tra đánh giá tồn tại
    const [review] = await db.query('SELECT MaDanhGia FROM DanhGia WHERE MaDanhGia = ?', [MaDanhGia]);
    if (review.length === 0) {
      return res.status(404).json({ message: 'Đánh giá không tồn tại.' });
    }

    // Xóa đánh giá
    const query = 'DELETE FROM DanhGia WHERE MaDanhGia = ?';
    await db.query(query, [MaDanhGia]);
    res.status(200).json({ message: 'Đánh giá đã được xóa.' });
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};