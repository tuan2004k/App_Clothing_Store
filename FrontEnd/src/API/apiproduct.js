import axios from "axios";

const API_URL = "http://192.168.1.4:5000/api/SanPham"; // Thay bằng URL API backend của bạn

// 🟢 Lấy danh sách sản phẩm
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Thêm header xác thực nếu cần
        // 'Authorization': `Bearer ${yourToken}`ưư
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Dữ liệu không đúng định dạng');
    }

    return data; // Dữ liệu đã bao gồm ChiTietSanPham
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    throw new Error('Không thể lấy danh sách sản phẩm');
  }
};

// 🟢 Lấy sản phẩm theo ID
export const getProductById = async (MaSanPham) => {
  try {
    const response = await fetch(`${API_URL}/${MaSanPham}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    throw new Error('Không thể lấy chi tiết sản phẩm');
  }
};

// 🟢 Thêm sản phẩm
export const addProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    throw new Error('Không thể thêm sản phẩm');
  }
};

// 🟢 Cập nhật sản phẩm
export const updateProduct = async (MaSanPham, productData) => {
  try {
    const response = await fetch(`${`${API_URL}/`}/${MaSanPham}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    throw new Error('Không thể cập nhật sản phẩm');
  }
};

// 🟢 Xóa sản phẩm
export const deleteProduct = async (MaSanPham) => {
  try {
    const response = await fetch(`${`${API_URL}/`}/${MaSanPham}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    throw new Error('Không thể xóa sản phẩm');
  }
};

// 🟢 Lọc sản phẩm theo danh mục
export const getProductsByCategory = async (maDanhMuc) => {
  try {
    const response = await fetch(`${`${API_URL}/`}/DanhMuc/${maDanhMuc}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lọc sản phẩm theo danh mục:', error);
    throw new Error('Không thể lọc sản phẩm theo danh mục');
  }
};

// 🟢 Lọc sản phẩm theo giá
export const getProductsByPrice = async (min, max) => {
  try {
    const response = await fetch(`${`${API_URL}/`}/Gia?min=${min}&max=${max}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lọc sản phẩm theo giá:', error);
    throw new Error('Không thể lọc sản phẩm theo giá');
  }
};

// 🟢 Thêm chi tiết sản phẩm
export const addProductDetail = async (variantData) => {
  try {
    const response = await fetch(`${`${API_URL}/`}/ChiTietSanPham`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variantData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi thêm chi tiết sản phẩm:', error);
    throw new Error('Không thể thêm chi tiết sản phẩm');
  }
};

// 🟢 Lấy danh sách danh mục
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${`${API_URL}/`}/DanhMuc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    throw new Error('Không thể lấy danh sách danh mục');
  }
};


