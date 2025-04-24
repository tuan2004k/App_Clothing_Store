const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
const productRoutes = require('./backEnd/Routes/productRoutes');
const usersRoutes = require('./backEnd/Routes/usersRoutes');
const detailproductsRoutes = require('./backEnd/Routes/detailproductsRoutes');
const categoryRoutes = require('./backEnd/Routes/categoryRoutes');
const ordersRoutes = require('./backEnd/Routes/ordersRoutes');
const cartRoutes = require('./backEnd/Routes/cartRoutes');
const detailordersRoutes = require('./backEnd/Routes/detailodersRoutes');
  

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const port = process.env.PORT || 5000;


// Routes
app.use('/api/SanPham', productRoutes);
app.use('/api/NguoiDung', usersRoutes);
app.use('/api/ChiTietSanPham', detailproductsRoutes);
app.use('/api/DanhMuc', categoryRoutes);
app.use('/api/DonHang', ordersRoutes);
app.use('/api/GioHang', cartRoutes);
app.use('/api/ChiTietDonHang', detailordersRoutes);

app.get('/', (req, res) => {
    res.send(' API Server is running!');
});


app.listen(port, () => console.log("🚀 Server chạy tại http://localhost:5000"));
