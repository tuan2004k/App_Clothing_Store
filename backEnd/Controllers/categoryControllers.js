const db = require('../config/db');

exports.createCategory = async (req, res) => {
    const { Ten, MoTa } = req.body;
    try {
        const query = `INSERT INTO DanhMuc (Ten, MoTa) VALUES (?, ?)`;
        const [result] = await db.query(query, [Ten, MoTa]);
        res.status(201).json({ message: "Danh mục đã được thêm!", MaDanhMuc: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Lỗi thêm danh mục", details: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query("SELECT * FROM DanhMuc");
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy danh sách danh mục", details: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    const { MaDanhMuc } = req.params;
    try {
        const [category] = await db.query("SELECT * FROM DanhMuc WHERE MaDanhMuc = ?", [MaDanhMuc]);

        if (category.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        res.json(category[0]);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy danh mục", details: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { MaDanhMuc } = req.params;
    const { Ten, MoTa } = req.body;
    try {
        const query = `UPDATE DanhMuc SET Ten = ?, MoTa = ? WHERE MaDanhMuc = ?`;
        await db.query(query, [Ten, MoTa, MaDanhMuc]);
        res.json({ message: "Danh mục đã được cập nhật" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi cập nhật danh mục", details: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const { MaDanhMuc } = req.params;
    try {
        await db.query('DELETE FROM DanhMuc WHERE MaDanhMuc = ?', [MaDanhMuc]);
        res.json({ message: "Danh mục đã được xóa" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi xóa danh mục", details: error.message });
    }
};
