const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const query = `
      SELECT s.*, c.*
      FROM SanPham s
      LEFT JOIN ChiTietSanPham c ON s.MaSanPham = c.MaSanPham
      ORDER BY s.MaSanPham
    `;
    const [rows] = await connection.query(query);

    const products = {};
    rows.forEach(row => {
      if (!products[row.MaSanPham]) {
        products[row.MaSanPham] = {
          MaSanPham: row.MaSanPham,
          Ten: row.Ten,
          MoTa: row.MoTa,
          Gia: row.Gia,
          SoLuong: row.SoLuong,
          HinhAnh: row.HinhAnh,
          MaDanhMuc: row.MaDanhMuc,
          NgayTao: row.NgayTao,
          ChiTietSanPham: [],
        };
      }
      if (row.MaChiTietSanPham) {
        products[row.MaSanPham].ChiTietSanPham.push({
          MaChiTietSanPham: row.MaChiTietSanPham,
          Size: row.Size,
          MauSac: row.MauSac,
          Gia: row.Gia,
          SoLuong: row.SoLuong,
        });
      }
    });

    res.status(200).json(Object.values(products));
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  } finally {
    if (connection) connection.release();
  }
};

exports.getProductById = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { MaSanPham } = req.params;
    const query = `
      SELECT s.*, c.*
      FROM SanPham s
      LEFT JOIN ChiTietSanPham c ON s.MaSanPham = c.MaSanPham
      WHERE s.MaSanPham = ?
    `;
    const [rows] = await connection.query(query, [MaSanPham]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }

    const product = {
      MaSanPham: rows[0].MaSanPham,
      Ten: rows[0].Ten,
      MoTa: rows[0].MoTa,
      Gia: rows[0].Gia,
      SoLuong: rows[0].SoLuong,
      HinhAnh: rows[0].HinhAnh,
      MaDanhMuc: rows[0].MaDanhMuc,
      NgayTao: rows[0].NgayTao,
      ChiTietSanPham: [],
    };
    rows.forEach(row => {
      if (row.MaChiTietSanPham) {
        product.ChiTietSanPham.push({
          MaChiTietSanPham: row.MaChiTietSanPham,
          Size: row.Size,
          MauSac: row.MauSac,
          Gia: row.Gia,
          SoLuong: row.SoLuong,
        });
      }
    });

    res.status(200).json(product);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  } finally {
    if (connection) connection.release();
  }
};

exports.addProduct = async (req, res) => {
  let connection;
  try {
    const { Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc, ChiTietSanPham } = req.body;

    if (!Ten || !Gia || !SoLuong || !MaDanhMuc) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sản phẩm!' });
    }

    // Kiểm tra kích thước chuỗi HinhAnh (giới hạn 5MB cho an toàn)
    if (HinhAnh && HinhAnh.length > 5 * 1024 * 1024) { // 5MB
      return res.status(400).json({ message: 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.' });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Kiểm tra MaDanhMuc có tồn tại không
    const [category] = await connection.query('SELECT MaDanhMuc FROM DanhMuc WHERE MaDanhMuc = ?', [MaDanhMuc]);
    if (!category || category.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Danh mục không tồn tại.' });
    }

    const query = 'INSERT INTO SanPham (Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await connection.query(query, [Ten, MoTa, Gia, SoLuong, HinhAnh || null, MaDanhMuc]);
    const newProductId = result.insertId;

    if (ChiTietSanPham && Array.isArray(ChiTietSanPham)) {
      for (const detail of ChiTietSanPham) {
        if (isNaN(detail.Gia) || isNaN(detail.SoLuong)) {
          await connection.rollback();
          return res.status(400).json({ message: 'Giá và số lượng của biến thể phải là số hợp lệ.' });
        }
      }
      const detailQuery = 'INSERT INTO ChiTietSanPham (MaSanPham, Size, MauSac, Gia, SoLuong) VALUES ?';
      const values = ChiTietSanPham.map(detail => [
        newProductId,
        detail.Size,
        detail.MauSac,
        detail.Gia || Gia,
        detail.SoLuong,
      ]);
      await connection.query(detailQuery, [values]);
    }

    await connection.commit();
    const newProduct = { MaSanPham: newProductId, Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc };
    res.status(201).json(newProduct);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Chi tiết lỗi khi thêm sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm sản phẩm.', error: error.message });
  } finally {
    if (connection) connection.release();
  }
};

exports.updateProduct = async (req, res) => {
  let connection;
  try {
    const { MaSanPham } = req.params;
    const { Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc, ChiTietSanPham } = req.body;
    if (!Ten || !Gia || !SoLuong || !MaDanhMuc) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sản phẩm!' });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const updateQuery = 'UPDATE SanPham SET Ten = ?, MoTa = ?, Gia = ?, SoLuong = ?, HinhAnh = ?, MaDanhMuc = ? WHERE MaSanPham = ?';
    const [updateResult] = await connection.query(updateQuery, [Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc, MaSanPham]);
    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }

    if (ChiTietSanPham && Array.isArray(ChiTietSanPham)) {
      const existingVariants = await connection.query('SELECT MaChiTietSanPham FROM ChiTietSanPham WHERE MaSanPham = ?', [MaSanPham]);
      const existingIds = existingVariants[0].map(v => v.MaChiTietSanPham);
      const newIds = ChiTietSanPham.filter(v => v.MaChiTietSanPham).map(v => v.MaChiTietSanPham);
      const toDelete = existingIds.filter(id => !newIds.includes(id));
      if (toDelete.length > 0) {
        await connection.query('DELETE FROM ChiTietSanPham WHERE MaChiTietSanPham IN (?)', [toDelete]);
      }

      const detailQuery = 'INSERT INTO ChiTietSanPham (MaChiTietSanPham, MaSanPham, Size, MauSac, Gia, SoLuong) VALUES ? ON DUPLICATE KEY UPDATE Size = VALUES(Size), MauSac = VALUES(MauSac), Gia = VALUES(Gia), SoLuong = VALUES(SoLuong)';
      const values = ChiTietSanPham.map(detail => [
        detail.MaChiTietSanPham || null,
        MaSanPham,
        detail.Size,
        detail.MauSac,
        detail.Gia || Gia,
        detail.SoLuong,
      ]);
      await connection.query(detailQuery, [values]);
    }

    await connection.commit();
    const updatedProduct = { MaSanPham, Ten, MoTa, Gia, SoLuong, HinhAnh, MaDanhMuc };
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  } finally {
    if (connection) connection.release();
  }
};

exports.deleteProduct = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { MaSanPham } = req.params;
    const query = 'DELETE FROM SanPham WHERE MaSanPham = ?';
    const [result] = await connection.query(query, [MaSanPham]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }
    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  } finally {
    if (connection) connection.release();
  }
};

exports.getProductsByCategory = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { MaDanhMuc } = req.params;
    const query = `
      SELECT s.*, c.*
      FROM SanPham s
      LEFT JOIN ChiTietSanPham c ON s.MaSanPham = c.MaSanPham
      WHERE s.MaDanhMuc = ?
    `;
    const [rows] = await connection.query(query, [MaDanhMuc]);
    const products = {};
    rows.forEach(row => {
      if (!products[row.MaSanPham]) {
        products[row.MaSanPham] = {
          MaSanPham: row.MaSanPham,
          Ten: row.Ten,
          MoTa: row.MoTa,
          Gia: row.Gia,
          SoLuong: row.SoLuong,
          HinhAnh: row.HinhAnh,
          MaDanhMuc: row.MaDanhMuc,
          NgayTao: row.NgayTao,
          ChiTietSanPham: [],
        };
      }
      if (row.MaChiTietSanPham) {
        products[row.MaSanPham].ChiTietSanPham.push({
          MaChiTietSanPham: row.MaChiTietSanPham,
          Size: row.Size,
          MauSac: row.MauSac,
          Gia: row.Gia,
          SoLuong: row.SoLuong,
        });
      }
    });
    res.json(Object.values(products));
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lọc sản phẩm theo danh mục', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};

exports.getProductsByPrice = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { min, max } = req.query;
    const query = `
      SELECT s.*, c.*
      FROM SanPham s
      LEFT JOIN ChiTietSanPham c ON s.MaSanPham = c.MaSanPham
      WHERE s.Gia BETWEEN ? AND ?
    `;
    const [rows] = await connection.query(query, [min, max]);
    const products = {};
    rows.forEach(row => {
      if (!products[row.MaSanPham]) {
        products[row.MaSanPham] = {
          MaSanPham: row.MaSanPham,
          Ten: row.Ten,
          MoTa: row.MoTa,
          Gia: row.Gia,
          SoLuong: row.SoLuong,
          HinhAnh: row.HinhAnh,
          MaDanhMuc: row.MaDanhMuc,
          NgayTao: row.NgayTao,
          ChiTietSanPham: [],
        };
      }
      if (row.MaChiTietSanPham) {
        products[row.MaSanPham].ChiTietSanPham.push({
          MaChiTietSanPham: row.MaChiTietSanPham,
          Size: row.Size,
          MauSac: row.MauSac,
          Gia: row.Gia,
          SoLuong: row.SoLuong,
        });
      }
    });
    res.json(Object.values(products));
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lọc sản phẩm theo giá', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};

exports.addProductDetail = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { MaSanPham, Size, MauSac, Gia, SoLuong } = req.body;
    const query = `INSERT INTO ChiTietSanPham (MaSanPham, Size, MauSac, Gia, SoLuong) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await connection.query(query, [MaSanPham, Size, MauSac, Gia, SoLuong]);
    res.status(201).json({ message: 'Chi tiết sản phẩm đã được thêm!', MaChiTietSanPham: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi thêm chi tiết sản phẩm', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};

exports.getAllCategories = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [categories] = await connection.query('SELECT * FROM DanhMuc');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách danh mục', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};