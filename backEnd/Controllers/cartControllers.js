const db = require("../config/db");

exports.getCart = async (req, res) => {
    const { MaNguoiDung } = req.params;
    const sql = `
        SELECT gh.MaGioHang, sp.MaSanPham, sp.Ten, sp.HinhAnh, sp.Gia, gh.SoLuong
        FROM GioHang gh
        JOIN SanPham sp ON gh.MaSanPham = sp.MaSanPham
        WHERE gh.MaNguoiDung = ?`;
    
    try {
        const [rows] = await db.execute(sql, [MaNguoiDung]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    const { MaNguoiDung, MaSanPham, SoLuong } = req.body;
    const sql = `
        INSERT INTO GioHang (MaNguoiDung, MaSanPham, SoLuong)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE SoLuong = VALUES(SoLuong) + ?`;

    try {
        await db.execute(sql, [MaNguoiDung, MaSanPham, SoLuong, SoLuong]);
        res.json({ message: "Sản phẩm đã được thêm vào giỏ hàng" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCart = async (req, res) => {
    const { MaNguoiDung, MaSanPham, SoLuong } = req.body;
    const sql = `UPDATE GioHang SET SoLuong = ? WHERE MaNguoiDung = ? AND MaSanPham = ?`;

    try {
        await db.execute(sql, [SoLuong, MaNguoiDung, MaSanPham]);
        res.json({ message: "Số lượng sản phẩm đã được cập nhật" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removeFromCart = async (req, res) => {
    const { MaNguoiDung, MaSanPham } = req.body;
    const sql = `DELETE FROM GioHang WHERE MaNguoiDung = ? AND MaSanPham = ?`;

    try {
        await db.execute(sql, [MaNguoiDung, MaSanPham]);
        res.json({ message: "Sản phẩm đã bị xóa khỏi giỏ hàng" });
    } catch (error) {
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
        res.status(500).json({ error: error.message });
    }
};

exports.checkout = async (req, res) => {
    const { MaNguoiDung, PhuongThuc } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Tạo đơn hàng
        const [orderResult] = await connection.execute(
            `INSERT INTO DonHang (MaNguoiDung, TongTien, TrangThai, PhuongThucThanhToan) 
             SELECT ?, COALESCE(SUM(sp.Gia * gh.SoLuong), 0), 'ChoXacNhan', ? 
             FROM GioHang gh 
             JOIN SanPham sp ON gh.MaSanPham = sp.MaSanPham 
             WHERE gh.MaNguoiDung = ?`,
            [MaNguoiDung, PhuongThuc, MaNguoiDung]
        );

        if (orderResult.affectedRows === 0) {
            throw new Error("Không có sản phẩm nào trong giỏ hàng để thanh toán.");
        }

        const MaDonHang = orderResult.insertId;

        await connection.execute(
            `INSERT INTO ChiTietDonHang (MaDonHang, MaSanPham, SoLuong, Gia)
             SELECT ?, MaSanPham, SoLuong, Gia 
             FROM GioHang WHERE MaNguoiDung = ?`,
            [MaDonHang, MaNguoiDung]
        );

        await connection.execute(`DELETE FROM GioHang WHERE MaNguoiDung = ?`, [MaNguoiDung]);

        await connection.commit();
        res.json({ message: "Đặt hàng thành công", MaDonHang });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};