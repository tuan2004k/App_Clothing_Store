const db = require('../config/db'); // Đảm bảo import db nếu chưa có

exports.getAllcheckouts = async (req, res) => {
  try {
    const query = `
      SELECT tt.MaThanhToan, tt.MaDonHang, tt.PhuongThuc, tt.TrangThai, tt.NgayThanhToan,
             dh.MaNguoiDung, dh.TongTien, nd.Ten AS TenNguoiDung, nd.Email
      FROM ThanhToan tt
      LEFT JOIN DonHang dh ON tt.MaDonHang = dh.MaDonHang
      LEFT JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
      ORDER BY tt.NgayThanhToan DESC
    `;
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

exports.getcheckoutById = async (req, res) => {
  try {
    const { MaThanhToan } = req.params;
    const query = `
      SELECT tt.MaThanhToan, tt.MaDonHang, tt.PhuongThuc, tt.TrangThai, tt.NgayThanhToan,
             dh.MaNguoiDung, dh.TongTien, dh.TrangThai AS TrangThaiDonHang,
             nd.Ten AS TenNguoiDung, nd.Email
      FROM ThanhToan tt
      LEFT JOIN DonHang dh ON tt.MaDonHang = dh.MaDonHang
      LEFT JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
      WHERE tt.MaThanhToan = ?
    `;
    const [rows] = await db.query(query, [MaThanhToan]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Thanh toán không tồn tại.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};


exports.getcheckoutsByOrder = async (req, res) => {
  try {
    const { MaDonHang } = req.params;

    // Kiểm tra MaDonHang hợp lệ
    const donHangId = parseInt(MaDonHang, 10);
    if (isNaN(donHangId)) {
      return res.status(400).json({ message: 'MaDonHang phải là số nguyên hợp lệ.' });
    }

    const query = `
      SELECT 
        tt.MaThanhToan, 
        tt.PhuongThuc, 
        tt.TrangThai, 
        tt.NgayThanhToan,
        dh.MaNguoiDung, 
        dh.TongTien, 
        nd.Ten AS TenNguoiDung, 
        nd.Email
      FROM ThanhToan tt
      INNER JOIN DonHang dh ON tt.MaDonHang = dh.MaDonHang
      INNER JOIN NguoiDung nd ON dh.MaNguoiDung = nd.MaNguoiDung
      WHERE tt.MaDonHang = ?
      ORDER BY tt.NgayThanhToan DESC
    `;
    const [rows] = await db.query(query, [donHangId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thanh toán cho đơn hàng này.' });
    }

    // Trả về phản hồi với cấu trúc nhất quán
    res.status(200).json({
      message: 'Lấy thông tin thanh toán thành công.',
      data: rows,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thanh toán theo đơn hàng:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: 'Có lỗi xảy ra khi lấy thông tin thanh toán.',
      details: error.message,
    });
  }
};

exports.addNewCheckout = async (req, res) => {
  try {
    const { MaDonHang, PhuongThuc, TrangThai } = req.body;
    console.log('Dữ liệu nhận được từ frontend:', req.body); // Debug log

    // Kiểm tra các trường bắt buộc
    if (!MaDonHang || !PhuongThuc) {
      console.log('Lỗi: Thiếu MaDonHang hoặc PhuongThuc');
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin thanh toán (MaDonHang, PhuongThuc).' });
    }

    // Đảm bảo MaDonHang là số
    const donHangId = parseInt(MaDonHang, 10);
    if (isNaN(donHangId)) {
      console.log('Lỗi: MaDonHang không phải là số hợp lệ:', MaDonHang);
      return res.status(400).json({ message: 'MaDonHang phải là số.' });
    }

    // Kiểm tra phương thức thanh toán hợp lệ
    const validMethods = ['TienMat', 'ChuyenKhoan', 'TheTinDung'];
    if (!validMethods.includes(PhuongThuc)) {
      console.log('Lỗi: PhuongThuc không hợp lệ:', PhuongThuc);
      return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ.' });
    }

    // Kiểm tra trạng thái hợp lệ (nếu được cung cấp)
    const statusToUse = TrangThai || 'ChoXacNhan';
    const validStatuses = ['ChoXacNhan', 'ThanhCong', 'ThatBai'];
    if (!validStatuses.includes(statusToUse)) {
      console.log('Lỗi: TrangThai không hợp lệ:', statusToUse);
      return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ.' });
    }

    // Kiểm tra đơn hàng tồn tại
    const [order] = await db.query('SELECT MaDonHang FROM DonHang WHERE MaDonHang = ?', [donHangId]);
    if (order.length === 0) {
      console.log('Lỗi: Đơn hàng không tồn tại:', donHangId);
      return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
    }

    // Chèn dữ liệu vào bảng ThanhToan
    const query = 'INSERT INTO ThanhToan (MaDonHang, PhuongThuc, TrangThai) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [donHangId, PhuongThuc, statusToUse]);
    console.log('Thêm thanh toán thành công với MaThanhToan:', result.insertId);

    // Cập nhật trạng thái đơn hàng nếu thanh toán thành công
    if (statusToUse === 'ThanhCong') {
      await db.query('UPDATE DonHang SET TrangThai = "DaThanhToan" WHERE MaDonHang = ?', [donHangId]);
      console.log('Đã cập nhật trạng thái đơn hàng thành DaThanhToan');
    }

    res.status(201).json({
      MaThanhToan: result.insertId,
      message: 'Thanh toán đã được tạo thành công.'
    });
  } catch (error) {
    console.error('Lỗi khi thêm thanh toán:', error.message, 'Stack:', error.stack);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', details: error.message });
  }
};

exports.updateCheckoutStatus = async (req, res) => {
  try {
    const { MaThanhToan } = req.params;
    const { TrangThai } = req.body;

    const validStatuses = ['ChoXacNhan', 'ThanhCong', 'ThatBai'];
    if (!TrangThai || !validStatuses.includes(TrangThai)) {
      return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ.' });
    }

    const [payment] = await db.query('SELECT MaThanhToan, MaDonHang FROM ThanhToan WHERE MaThanhToan = ?', [MaThanhToan]);
    if (payment.length === 0) {
      return res.status(404).json({ message: 'Thanh toán không tồn tại.' });
    }

    const query = 'UPDATE ThanhToan SET TrangThai = ? WHERE MaThanhToan = ?';
    await db.query(query, [TrangThai, MaThanhToan]);

    // Cập nhật trạng thái đơn hàng nếu thanh toán thành công
    if (TrangThai === 'ThanhCong') {
      await db.query('UPDATE DonHang SET TrangThai = "DaThanhToan" WHERE MaDonHang = ?', [payment[0].MaDonHang]);
    }

    res.status(200).json({ message: 'Trạng thái thanh toán đã được cập nhật.' });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

exports.deletecheckout = async (req, res) => {
  try {
    const { MaThanhToan } = req.params;

    const [payment] = await db.query('SELECT MaThanhToan FROM ThanhToan WHERE MaThanhToan = ?', [MaThanhToan]);
    if (payment.length === 0) {
      return res.status(404).json({ message: 'Thanh toán không tồn tại.' });
    }

    const query = 'DELETE FROM ThanhToan WHERE MaThanhToan = ?';
    await db.query(query, [MaThanhToan]);
    res.status(200).json({ message: 'Thanh toán đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};