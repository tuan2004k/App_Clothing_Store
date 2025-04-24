const db = require('../config/db');

// 🟢 Thêm sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    // Lấy tất cả sản phẩm từ bảng SanPham
    const querySanPham = 'SELECT * FROM SanPham';
    const [products] = await db.query(querySanPham);

    // Lấy chi tiết sản phẩm cho mỗi sản phẩm
    for (let product of products) {
      const queryChiTiet = 'SELECT * FROM ChiTietSanPham WHERE MaSanPham = ?';
      const [variants] = await db.query(queryChiTiet, [product.MaSanPham]);
      product.ChiTietSanPham = variants; // Thêm mảng ChiTietSanPham vào sản phẩm
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { MaSanPham } = req.params;
    const query = 'SELECT * FROM SanPham WHERE MaSanPham = ?';
    const [rows] = await db.query(query, [MaSanPham]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};


exports.addProduct = async (req, res) => {
  try {
    const { Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc } = req.body;
    if (!Ten || !Gia || !SoLuong || !MaDanhMuc) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sản phẩm!' });
    }
    const query = 'INSERT INTO SanPham (Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc]);
    const newProduct = { MaSanPham: result.insertId, Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc };
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { MaSanPham } = req.params;
    const { Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc } = req.body;
    if (!Ten || !Gia || !SoLuong || !MaDanhMuc) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sản phẩm!' });
    }
    const query = 'UPDATE SanPham SET Ten = ?, MoTa = ?, Gia = ?, SoLuong = ?, HinhAnh = ?, MaDanhMuc = ? WHERE MaSanPham = ?';
    const [result] = await db.query(query, [Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc, MaSanPham]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }
    const updatedProduct = { MaSanPham: MaSanPham, Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc };
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { MaSanPham } = req.params;
    const query = 'DELETE FROM SanPham WHERE MaSanPham = ?';
    const [result] = await db.query(query, [MaSanPham]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }
    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};


// 🟢 Lọc sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
  const { MaDanhMuc } = req.params;
  try {
    const [products] = await db.query("SELECT * FROM SanPham WHERE MaDanhMuc = ?", [MaDanhMuc]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lọc sản phẩm theo danh mục", details: error.message });
  }
};

// 🟢 Lọc sản phẩm theo giá
exports.getProductsByPrice = async (req, res) => {
  const { min, max } = req.query;
  try {
    const [products] = await db.query("SELECT * FROM SanPham WHERE Gia BETWEEN ? AND ?", [min, max]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lọc sản phẩm theo giá", details: error.message });
  }
};

// 🟢 Thêm chi tiết sản phẩm
exports.addProductDetail = async (req, res) => {
  const { MaSanPham, Size, MauSac, Gia, SoLuong } = req.body;
  try {
    const query = `INSERT INTO ChiTietSanPham (MaSanPham, Size, MauSac, Gia, SoLuong) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, [MaSanPham, Size, MauSac, Gia, SoLuong]);
    res.status(201).json({ message: "Chi tiết sản phẩm đã được thêm!", MaChiTiet: result.insertMaSanPham });
  } catch (error) {
    res.status(500).json({ error: "Lỗi thêm chi tiết sản phẩm", details: error.message });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    const query = 'SELECT * FROM DanhMuc';
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};