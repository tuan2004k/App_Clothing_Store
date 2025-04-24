const db = require('../config/db');

exports.createProductDetail = async (req, res) => {
    const { MaSanPham, Size, MauSac, Gia, SoLuong } = req.body;
    try {   
        const query = `INSERT INTO ChiTietSanPham (MaSanPham, Size, MauSac, Gia, SoLuong) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [MaSanPham, Size, MauSac, Gia, SoLuong]);
        res.status(201).json({ message: "Chi tiết sản phẩm đã được thêm!", MaChiTiet: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Lỗi thêm chi tiết sản phẩm", details: error.message });
    }
};
exports.getAllProductDetails = async (req, res) => {
    try {
        const [details] = await db.query("SELECT * FROM ChiTietSanPham");
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy danh sách chi tiết sản phẩm", details: error.message });
    }
};

exports.getProductDetailsByProductId = async (req, res) => {
    const { MaSanPham } = req.params;
    try {
        const [details] = await db.query("SELECT * FROM ChiTietSanPham WHERE MaSanPham = ?", [MaSanPham]);

        if (details.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy chi tiết sản phẩm" });
        }

        res.json(details);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy chi tiết sản phẩm", details: error.message });
    }
};

exports.updateProductDetail = async (req, res) => {
    const { MaChiTietSanPham } = req.params;
    const { Size, MauSac, Gia, SoLuong } = req.body;
    try {
        const query = `UPDATE ChiTietSanPham SET Size = ?, MauSac = ?, Gia = ?, SoLuong = ? WHERE MaChiTietSanPham = ?`;
        await db.query(query, [Size, MauSac, Gia, SoLuong, MaChiTietSanPham]);
        res.json({ message: "Chi tiết sản phẩm đã được cập nhật" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi cập nhật chi tiết sản phẩm", details: error.message });
    }
};

exports.deleteProductDetail = async (req, res) => {
    const { MaChiTietSanPham } = req.params;
    try {
        await db.query('DELETE FROM ChiTietSanPham WHERE MaChiTietSanPham = ?', [MaChiTietSanPham]);
        res.json({ message: "Chi tiết sản phẩm đã được xóa" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi xóa chi tiết sản phẩm", details: error.message });
    }
};
