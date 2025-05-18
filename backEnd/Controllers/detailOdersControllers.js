const db = require("../config/db");

class OrderDetailController {
  // Lấy chi tiết đơn hàng theo MaDonHang
  static async getOrderDetails(req, res) {
    const { MaDonHang } = req.params;
    const sql = `
      SELECT cth.MaChiTiet, sp.Ten, sp.HinhAnh, cth.SoLuong, cth.Gia, csp.Size, csp.MauSac
      FROM ChiTietDonHang cth
      JOIN ChiTietSanPham csp ON cth.MaChiTietSanPham = csp.MaChiTietSanPham
      JOIN SanPham sp ON csp.MaSanPham = sp.MaSanPham
      WHERE cth.MaDonHang = ?`;

    try {
      if (!MaDonHang || isNaN(parseInt(MaDonHang))) {
        return res.status(400).json({ error: "MaDonHang không hợp lệ" });
      }
      const [rows] = await db.execute(sql, [MaDonHang]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
      }
      res.status(200).json(rows);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      res.status(500).json({ error: "Lỗi khi lấy chi tiết đơn hàng", details: error.message });
    }
  }

  // Thêm chi tiết đơn hàng
  static async addOrderDetail(req, res) {
    const { MaDonHang } = req.params;
    const { MaChiTietSanPham, SoLuong, Gia } = req.body;

    const sql = `
      INSERT INTO ChiTietDonHang (MaDonHang, MaChiTietSanPham, SoLuong, Gia)
      VALUES (?, ?, ?, ?)`;

    try {
      if (!MaDonHang || !MaChiTietSanPham || !SoLuong || !Gia || isNaN(parseInt(MaDonHang)) || isNaN(parseInt(MaChiTietSanPham)) || isNaN(parseInt(SoLuong)) || isNaN(parseFloat(Gia))) {
        return res.status(400).json({ error: "Dữ liệu đầu vào không hợp lệ" });
      }
      if (parseInt(SoLuong) <= 0) {
        return res.status(400).json({ error: "Số lượng phải lớn hơn 0" });
      }
      if (parseFloat(Gia) <= 0) {
        return res.status(400).json({ error: "Giá phải lớn hơn 0" });
      }

      const [result] = await db.execute(sql, [MaDonHang, MaChiTietSanPham, SoLuong, Gia]);
      const [newDetail] = await db.execute(
        `SELECT * FROM ChiTietDonHang WHERE MaChiTiet = ?`,
        [result.insertId]
      );
      res.status(201).json({ message: "Sản phẩm đã được thêm vào chi tiết đơn hàng", data: newDetail[0] });
    } catch (error) {
      console.error("Lỗi khi thêm chi tiết đơn hàng:", error);
      res.status(500).json({ error: "Lỗi khi thêm chi tiết đơn hàng", details: error.message });
    }
  }

  // Cập nhật chi tiết đơn hàng
  static async updateOrderDetail(req, res) {
    const { MaDonHang } = req.params;
    const { MaChiTietSanPham, SoLuong } = req.body;

    const sql = `
      UPDATE ChiTietDonHang 
      SET SoLuong = ? 
      WHERE MaDonHang = ? AND MaChiTietSanPham = ?`;

    try {
      if (!MaDonHang || !MaChiTietSanPham || !SoLuong || isNaN(parseInt(MaDonHang)) || isNaN(parseInt(MaChiTietSanPham)) || isNaN(parseInt(SoLuong))) {
        return res.status(400).json({ error: "Dữ liệu đầu vào không hợp lệ" });
      }
      if (parseInt(SoLuong) <= 0) {
        return res.status(400).json({ error: "Số lượng phải lớn hơn 0" });
      }

      const [result] = await db.execute(sql, [SoLuong, MaDonHang, MaChiTietSanPham]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng để cập nhật" });
      }
      const [updatedDetail] = await db.execute(
        `SELECT * FROM ChiTietDonHang WHERE MaDonHang = ? AND MaChiTietSanPham = ?`,
        [MaDonHang, MaChiTietSanPham]
      );
      res.status(200).json({ message: "Số lượng sản phẩm đã được cập nhật", data: updatedDetail[0] });
    } catch (error) {
      console.error("Lỗi khi cập nhật chi tiết đơn hàng:", error);
      res.status(500).json({ error: "Lỗi khi cập nhật chi tiết đơn hàng", details: error.message });
    }
  }

  // Xóa chi tiết đơn hàng
  static async removeOrderDetail(req, res) {
    const { MaDonHang } = req.params;
    const { MaChiTietSanPham } = req.body;

    const sql = `
      DELETE FROM ChiTietDonHang 
      WHERE MaDonHang = ? AND MaChiTietSanPham = ?`;

    try {
      if (!MaDonHang || !MaChiTietSanPham || isNaN(parseInt(MaDonHang)) || isNaN(parseInt(MaChiTietSanPham))) {
        return res.status(400).json({ error: "Dữ liệu đầu vào không hợp lệ" });
      }

      const [result] = await db.execute(sql, [MaDonHang, MaChiTietSanPham]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng để xóa" });
      }
      res.status(200).json({ message: "Sản phẩm đã bị xóa khỏi đơn hàng" });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi đơn hàng:", error);
      res.status(500).json({ error: "Lỗi khi xóa sản phẩm khỏi đơn hàng", details: error.message });
    }
  }

  // Xóa tất cả chi tiết đơn hàng theo MaDonHang
  static async clearOrderDetails(req, res) {
    const { MaDonHang } = req.params;

    const sql = `
      DELETE FROM ChiTietDonHang 
      WHERE MaDonHang = ?`;

    try {
      if (!MaDonHang || isNaN(parseInt(MaDonHang))) {
        return res.status(400).json({ error: "MaDonHang không hợp lệ" });
      }

      const [result] = await db.execute(sql, [MaDonHang]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không có chi tiết đơn hàng để xóa" });
      }
      res.status(200).json({ message: "Tất cả sản phẩm đã bị xóa khỏi đơn hàng" });
    } catch (error) {
      console.error("Lỗi khi xóa chi tiết đơn hàng:", error);
      res.status(500).json({ error: "Lỗi khi xóa chi tiết đơn hàng", details: error.message });
    }
  }
}

module.exports = OrderDetailController;