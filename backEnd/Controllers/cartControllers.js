const db = require("../config/db");

exports.getCart = async (req, res) => {
  const { MaNguoiDung } = req.params;
  const sql = `
    SELECT gh.MaGioHang, gh.MaNguoiDung, gh.MaChiTietSanPham, gh.SoLuong, gh.NgayThem,
           sp.MaChiTietSanPham AS ChiTietSanPhamID, sp.MaSanPham, sp.Size, sp.MauSac, 
           COALESCE(sp.SoLuong, 0) AS SoLuongTon, COALESCE(sp.Gia, 0) AS Gia,
           p.Ten, p.HinhAnh
    FROM GioHang gh
    LEFT JOIN ChiTietSanPham sp ON gh.MaChiTietSanPham = sp.MaChiTietSanPham
    LEFT JOIN SanPham p ON sp.MaSanPham = p.MaSanPham
    WHERE gh.MaNguoiDung = ?`;

  try {
    const [rows] = await db.execute(sql, [MaNguoiDung]);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const { MaNguoiDung, MaChiTietSanPham, SoLuong } = req.body;

  // Kiểm tra tham số
  if (!MaNguoiDung || !MaChiTietSanPham || !SoLuong) {
    return res.status(400).json({ error: 'Thiếu tham số: MaNguoiDung, MaChiTietSanPham hoặc SoLuong' });
  }

  const sql = `
    INSERT INTO GioHang (MaNguoiDung, MaChiTietSanPham, SoLuong)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE SoLuong = SoLuong + ?`;

  try {
    await db.execute(sql, [MaNguoiDung, MaChiTietSanPham, SoLuong, SoLuong]);
    res.json({ message: "Sản phẩm đã được thêm vào giỏ hàng" });
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCart = async (req, res) => {
  const { MaNguoiDung, MaChiTietSanPham, SoLuong } = req.body;

  // Kiểm tra tham số
  if (!MaNguoiDung || !MaChiTietSanPham || !SoLuong) {
    return res.status(400).json({ error: 'Thiếu tham số: MaNguoiDung, MaChiTietSanPham hoặc SoLuong' });
  }

  const sql = `UPDATE GioHang SET SoLuong = ? WHERE MaNguoiDung = ? AND MaChiTietSanPham = ?`;

  try {
    const [result] = await db.execute(sql, [SoLuong, MaNguoiDung, MaChiTietSanPham]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    res.json({ message: "Số lượng sản phẩm đã được cập nhật" });
  } catch (error) {
    console.error('Lỗi khi cập nhật giỏ hàng:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { MaNguoiDung, MaChiTietSanPham } = req.body;

  // Kiểm tra tham số
  if (!MaNguoiDung || !MaChiTietSanPham) {
    return res.status(400).json({ error: 'Thiếu tham số: MaNguoiDung hoặc MaChiTietSanPham' });
  }

  const sql = `DELETE FROM GioHang WHERE MaNguoiDung = ? AND MaChiTietSanPham = ?`;

  try {
    const [result] = await db.execute(sql, [MaNguoiDung, MaChiTietSanPham]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    res.json({ message: "Sản phẩm đã bị xóa khỏi giỏ hàng" });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  const { MaNguoiDung } = req.params;

  const sql = `DELETE FROM GioHang WHERE MaNguoiDung = ?`;

  try {
    await db.execute(sql, [MaNguoiDung]);
    res.json({ message: "Giỏ hàng đã được xóa" });
  } catch (error) {
    console.error('Lỗi khi xóa giỏ hàng:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.checkout = async (req, res) => {
  const { MaNguoiDung, PhuongThuc } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Tính tổng tiền từ giỏ hàng
    const [cartTotal] = await connection.execute(
      `SELECT COALESCE(SUM(sp.Gia * gh.SoLuong), 0) AS TongTien
       FROM GioHang gh
       JOIN ChiTietSanPham sp ON gh.MaChiTietSanPham = sp.MaChiTietSanPham
       WHERE gh.MaNguoiDung = ?`,
      [MaNguoiDung]
    );

    const TongTien = cartTotal[0].TongTien;

    if (TongTien === 0) {
      throw new Error("Không có sản phẩm nào trong giỏ hàng để thanh toán.");
    }

    // Tạo đơn hàng
    const [orderResult] = await connection.execute(
      `INSERT INTO DonHang (MaNguoiDung, TongTien, TrangThai)
       VALUES (?, ?, 'ChoXacNhan')`,
      [MaNguoiDung, TongTien]
    );

    const MaDonHang = orderResult.insertId;

    // Thêm chi tiết đơn hàng
    await connection.execute(
      `INSERT INTO ChiTietDonHang (MaDonHang, MaChiTietSanPham, SoLuong, Gia)
       SELECT ?, gh.MaChiTietSanPham, gh.SoLuong, sp.Gia
       FROM GioHang gh
       JOIN ChiTietSanPham sp ON gh.MaChiTietSanPham = sp.MaChiTietSanPham
       WHERE gh.MaNguoiDung = ?`,
      [MaDonHang, MaNguoiDung]
    );

    // Thêm thanh toán
    await connection.execute(
      `INSERT INTO ThanhToan (MaDonHang, PhuongThuc, TrangThai)
       VALUES (?, ?, 'ThanhCong')`,
      [MaDonHang, PhuongThuc]
    );

    // Xóa giỏ hàng
    await connection.execute(`DELETE FROM GioHang WHERE MaNguoiDung = ?`, [MaNguoiDung]);

    await connection.commit();
    res.json({ message: "Đặt hàng thành công", MaDonHang });
  } catch (error) {
    await connection.rollback();
    console.error('Lỗi khi thanh toán:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};