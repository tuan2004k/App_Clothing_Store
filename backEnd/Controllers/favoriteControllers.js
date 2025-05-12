const db = require('../config/db');

// 🟢 Lấy danh sách tất cả sản phẩm yêu thích
exports.getAllFavorites = async (req, res) => {
  try {
    const query = `
      SELECT yt.MaYeuThich, yt.MaNguoiDung, yt.MaSanPham, yt.NgayThem,
             nd.Ten AS TenNguoiDung, nd.Email,
             sp.Ten AS TenSanPham, sp.HinhAnh
      FROM YeuThich yt
      LEFT JOIN NguoiDung nd ON yt.MaNguoiDung = nd.MaNguoiDung
      LEFT JOIN SanPham sp ON yt.MaSanPham = sp.MaSanPham
      ORDER BY yt.NgayThem DESC
    `;
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu thích:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Lấy danh sách sản phẩm yêu thích theo MaNguoiDung
exports.getFavoritesByUser = async (req, res) => {
  try {
    const { MaNguoiDung } = req.params;
    const query = `
      SELECT yt.MaYeuThich, yt.MaSanPham, yt.NgayThem,
             sp.Ten AS TenSanPham, sp.HinhAnh, sp.Gia, sp.MoTa,
             dm.Ten AS TenDanhMuc
      FROM YeuThich yt
      LEFT JOIN SanPham sp ON yt.MaSanPham = sp.MaSanPham
      LEFT JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
      WHERE yt.MaNguoiDung = ?
      ORDER BY yt.NgayThem DESC
    `;
    const [rows] = await db.query(query, [MaNguoiDung]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy yêu thích theo người dùng:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Thêm sản phẩm vào danh sách yêu thích
exports.addFavorite = async (req, res) => {
  try {
    const { MaNguoiDung, MaSanPham } = req.body;

    // Xác thực dữ liệu
    if (!MaNguoiDung || !MaSanPham) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
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

    // Kiểm tra sản phẩm đã có trong danh sách yêu thích
    const [existing] = await db.query(
      'SELECT MaYeuThich FROM YeuThich WHERE MaNguoiDung = ? AND MaSanPham = ?',
      [MaNguoiDung, MaSanPham]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích.' });
    }

    // Thêm vào danh sách yêu thích
    const query = 'INSERT INTO YeuThich (MaNguoiDung, MaSanPham) VALUES (?, ?)';
    const [result] = await db.query(query, [MaNguoiDung, MaSanPham]);
    res.status(201).json({ MaYeuThich: result.insertId, message: 'Đã thêm sản phẩm vào danh sách yêu thích.' });
  } catch (error) {
    console.error('Lỗi khi thêm yêu thích:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

// 🟢 Xóa sản phẩm khỏi danh sách yêu thích
exports.deleteFavorite = async (req, res) => {
  try {
    const { MaYeuThich } = req.params;

    // Kiểm tra yêu thích tồn tại
    const [favorite] = await db.query('SELECT MaYeuThich FROM YeuThich WHERE MaYeuThich = ?', [MaYeuThich]);
    if (favorite.length === 0) {
      return res.status(404).json({ message: 'Yêu thích không tồn tại.' });
    }

    // Xóa yêu thích
    const query = 'DELETE FROM YeuThich WHERE MaYeuThich = ?';
    await db.query(query, [MaYeuThich]);
    res.status(200).json({ message: 'Đã xóa sản phẩm khỏi danh sách yêu thích.' });
  } catch (error) {
    console.error('Lỗi khi xóa yêu thích:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};