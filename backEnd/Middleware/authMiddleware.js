const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.loginUser = async (req, res) => {
  const { Email, MatKhau } = req.body;

  try {
    // Tìm người dùng trong database
    const sql = "SELECT * FROM NguoiDung WHERE Email = ?";
    db.query(sql, [Email], async (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi server!" });
      if (result.length === 0) return res.status(400).json({ error: "Email không tồn tại!" });

      const user = result[0];

      // Kiểm tra mật khẩu với bcrypt
      const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
      if (!isMatch) return res.status(400).json({ error: "Mật khẩu không đúng!" });

      // Tạo token JWT
      const token = jwt.sign({ MaNguoiDung: user.MaNguoiDung, VaiTro: user.VaiTro }, "SECRET_KEY", { expiresIn: "1h" });

      res.json({ message: "Đăng nhập thành công!", user: { ...user, MatKhau: undefined }, token });
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server!" });
  }
};
