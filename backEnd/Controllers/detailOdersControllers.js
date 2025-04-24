const db = require("../config/db");

exports.getOrderDetails = async (req, res) => {
    const { MaDonHang } = req.params;
    const sql = `
        SELECT cth.MaChiTiet, sp.Ten, sp.HinhAnh, cth.SoLuong, cth.Gia
        FROM ChiTietDonHang cth
        JOIN SanPham sp ON cth.MaSanPham = sp.MaSanPham
        WHERE cth.MaDonHang = ?`;

    try {
        const [rows] = await db.execute(sql, [MaDonHang]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy chi tiết đơn hàng" });
    }
};

exports.addOrderDetail = async (req, res) => {
    const { MaDonHang } = req.params;
    const { MaSanPham, SoLuong, Gia } = req.body;

    const sql = `
        INSERT INTO ChiTietDonHang (MaDonHang, MaSanPham, SoLuong, Gia)
        VALUES (?, ?, ?, ?)`;

    try {
        await db.execute(sql, [MaDonHang, MaSanPham, SoLuong, Gia]);
        res.json({ message: "Sản phẩm đã được thêm vào chi tiết đơn hàng" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi thêm chi tiết đơn hàng" });
    }
};

exports.updateOrderDetail = async (req, res) => {
    const { MaDonHang } = req.params;
    const { MaSanPham, SoLuong } = req.body;

    const sql = `
        UPDATE ChiTietDonHang 
        SET SoLuong = ? 
        WHERE MaDonHang = ? AND MaSanPham = ?`;

    try {
        await db.execute(sql, [SoLuong, MaDonHang, MaSanPham]);
        res.json({ message: "Số lượng sản phẩm đã được cập nhật" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi cập nhật chi tiết đơn hàng" });
    }
};
exports.removeOrderDetail = async (req, res) => {
    const { MaDonHang } = req.params;
    const { MaSanPham } = req.body;

    const sql = `
        DELETE FROM ChiTietDonHang 
        WHERE MaDonHang = ? AND MaSanPham = ?`;

    try {
        await db.execute(sql, [MaDonHang, MaSanPham]);
        res.json({ message: "Sản phẩm đã bị xóa khỏi đơn hàng" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xóa sản phẩm khỏi đơn hàng" });
    }
};


exports.clearOrderDetails = async (req, res) => {
    const { MaDonHang } = req.params;

    const sql = `
        DELETE FROM ChiTietDonHang 
        WHERE MaDonHang = ?`;

    try {
        await db.execute(sql, [MaDonHang]);
        res.json({ message: "Tất cả sản phẩm đã bị xóa khỏi đơn hàng" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xóa chi tiết đơn hàng" });
    }
};
