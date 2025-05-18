const db = require('../config/db'); // Kết nối database
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Đăng ký người dùng
exports.registerUser = async (req, res) => {
    try {
        console.log("📥 Dữ liệu nhận từ client:", req.body); // Kiểm tra dữ liệu nhận được

        const { Ten, Email, MatKhau, VaiTro = 'NguoiDung' } = req.body;

        // Kiểm tra VaiTro hợp lệ
        const validRoles = ['NguoiDung', 'QuanTri'];
        if (!validRoles.includes(VaiTro)) {
            console.log("🚨 Vai trò không hợp lệ:", VaiTro);
            return res.status(400).json({ error: "Vai trò không hợp lệ" });
        }

        // Kiểm tra Email đã tồn tại chưa
        const [existingUser] = await db.query('SELECT * FROM NguoiDung WHERE Email = ?', [Email]);
        console.log("🔍 Kiểm tra email tồn tại:", existingUser);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email đã tồn tại!" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(MatKhau, 10);
        console.log("🔑 Mật khẩu đã mã hóa:", hashedPassword);

        // Thêm vào database
        const query = 'INSERT INTO NguoiDung (Ten, Email, MatKhau, VaiTro) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [Ten, Email, hashedPassword, VaiTro]);
        console.log("🔥 Kết quả INSERT:", result);

        console.log("✅ Đăng ký thành công:", result);
        res.status(201).json({ id: result.insertId, Ten, Email, VaiTro });

    } catch (error) {
        console.error("❌ Lỗi server khi đăng ký:", error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};



// 2. Đăng nhập người dùng
exports.loginUser = async (req, res) => {
    const { Email, MatKhau } = req.body;
    console.log("📩 Dữ liệu nhận từ client:", { Email, MatKhau });

    try {
        // Truy vấn thông tin người dùng từ cơ sở dữ liệu theo email
        const [user] = await db.query("SELECT * FROM NguoiDung WHERE Email = ?", [Email]);
        console.log("🔍 Kết quả truy vấn:", user);

        if (user.length > 0) {
            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(MatKhau, user[0].MatKhau);
            console.log("🔑 Kiểm tra mật khẩu:", isMatch);

            if (isMatch) {
                // Xác định vai trò của người dùng
                let VaiTro = user[0].VaiTro || "NguoiDung"; // Nếu cột VaiTro không tồn tại, mặc định là "NguoiDung"
                if (user[0].Email === "admin@example.com") {
                    VaiTro = "admin"; // Xử lý vai trò admin nếu email là admin
                }

                // Trả về thông tin người dùng sau khi đăng nhập thành công
                const userData = {
                    id: user[0].MaNguoiDung,
                    Ten: user[0].Ten,
                    Email: user[0].Email,
                    VaiTro: VaiTro // Vai trò của người dùng
                };

                // Tạo token JWT
                const token = jwt.sign(
                    { id: user[0].MaNguoiDung, VaiTro: VaiTro },
                    process.env.JWT_SECRET,  // Biến môi trường chứa khóa bí mật
                    { expiresIn: '1h' } // Token hết hạn trong 1 giờ
                );

                console.log("✅ Đăng nhập thành công:", userData);
                console.log("🔐 JWT Token:", token);

                return res.status(200).json({
                    message: "Đăng nhập thành công",
                    user: userData,
                    token  // Trả về token trong response
                });
            } else {
                // Nếu mật khẩu không đúng
                return res.status(401).json({ error: "Mật khẩu không đúng!" });
            }
        } else {
            // Nếu email không tồn tại trong cơ sở dữ liệu
            return res.status(404).json({ error: "Email không tồn tại!" });
        }
    } catch (error) {
        // Xử lý lỗi hệ thống
        console.error("🔥 Lỗi đăng nhập:", error);
        return res.status(500).json({ error: "Lỗi đăng nhập thất bại", details: error.message });
    }
};


// 3. Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM NguoiDung");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy danh sách người dùng thất bại" });
    }
};

// 4. Lấy chi tiết người dùng theo ID
exports.getUserById = async (req, res) => {
    const { MaNguoiDung } = req.params;
    if (isNaN(MaNguoiDung)) {
        return res.status(400).json({ error: "ID không hợp lệ" });
    }
    try {
        const [users] = await db.query("SELECT * FROM NguoiDung WHERE MaNguoiDung = ?", [parseInt(MaNguoiDung)]);
        if (users.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy người dùng thất bại", details: error.message });
    }
};

// 5. Cập nhật người dùng
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    console.log('🏷️ ID nhận được:', id);
    console.log('📦 Body nhận được:', req.body);

    try {
        // Kiểm tra user tồn tại trước
        const [user] = await db.query('SELECT * FROM NguoiDung WHERE MaNguoiDung = ?', [id]);
        if (user.length === 0) {
            console.log('❌ User không tồn tại');
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }

        // Xây dựng câu lệnh SQL động
        const updates = [];
        const params = [];

        // Danh sách trường có thể cập nhật
        const fields = ['Ten', 'Email', 'SoDienThoai', 'DiaChi', 'AnhDaiDien', 'VaiTro'];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = ?`);
                params.push(req.body[field]);
            }
        });

        // Xử lý mật khẩu riêng (nếu có)
        if (req.body.MatKhau) {
            const hashedPassword = await bcrypt.hash(req.body.MatKhau, 10);
            updates.push('MatKhau = ?');
            params.push(hashedPassword);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'Không có trường nào để cập nhật' });
        }

        const query = `UPDATE NguoiDung SET ${updates.join(', ')} WHERE MaNguoiDung = ?`;
        params.push(id);

        console.log('🔍 Query cuối cùng:', query);
        console.log('📌 Params:', params);

        const [result] = await db.query(query, params);
        console.log('✅ Kết quả update:', result);

        if (result.affectedRows > 0) {
            // Lấy lại thông tin mới nhất
            const [updatedUser] = await db.query('SELECT * FROM NguoiDung WHERE MaNguoiDung = ?', [id]);
            res.json({
                message: 'Cập nhật thành công',
                user: updatedUser[0]
            });
        } else {
            res.status(500).json({ error: 'Cập nhật không thành công' });
        }
    } catch (error) {
        console.error('💥 Lỗi chi tiết:', error);
        res.status(500).json({
            error: 'Lỗi server',
            details: error.message,
            sqlError: error.sqlMessage // Lỗi từ MySQL nếu có
        });
    }
};

// 6. Xóa người dùng
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM NguoiDung WHERE MaNguoiDung = ?', [id]);
        res.json({ message: 'Người dùng đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ error: "Lỗi xóa người dùng thất bại", details: error.message });
    }
};
