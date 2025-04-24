const db = require('../config/db'); // Đảm bảo đường dẫn đúng

// Lấy danh sách tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query("SELECT * FROM DonHang");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy danh sách đơn hàng", details: error.message });
    }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
    const { MaDonHang } = req.params;
    try {
        const [order] = await db.query("SELECT * FROM DonHang WHERE MaDonHang = ?", [MaDonHang]);

        if (order.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json(order[0]);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy đơn hàng", details: error.message });
    }
};

// Lấy đơn hàng theo mã người dùng
exports.getOrdersByUser = async (req, res) => {
    const { MaNguoiDung } = req.params;
    
    if (!MaNguoiDung) {
        return res.status(400).json({ error: "Thiếu MaNguoiDung trong request" });
    }

    try {
        const [orders] = await db.query("SELECT * FROM DonHang WHERE MaNguoiDung = ?", [MaNguoiDung]);

        if (orders.length === 0) {
            return res.status(404).json({ message: "Người dùng chưa có đơn hàng nào" });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy đơn hàng của người dùng", details: error.message });
    }
};

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
    const { MaNguoiDung, TongTien } = req.body;

    try {
        const query = "INSERT INTO DonHang (MaNguoiDung, TongTien) VALUES (?, ?)";
        const [result] = await db.query(query, [MaNguoiDung, TongTien]);

        res.status(201).json({ message: "Tạo đơn hàng thành công!", MaDonHang: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Lỗi tạo đơn hàng", details: error.message });
    }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    const { MaDonHang } = req.params;
    const { TrangThai } = req.body;

    try {
        const query = "UPDATE DonHang SET TrangThai = ? WHERE MaDonHang = ?";
        await db.query(query, [TrangThai, MaDonHang]);

        res.json({ message: "Cập nhật trạng thái đơn hàng thành công!" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi cập nhật đơn hàng", details: error.message });
    }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    const { MaDonHang } = req.params;

    try {
        await db.query("DELETE FROM DonHang WHERE MaDonHang = ?", [MaDonHang]);

        res.json({ message: "Đơn hàng đã được xóa!" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi xóa đơn hàng", details: error.message });
    }
};
