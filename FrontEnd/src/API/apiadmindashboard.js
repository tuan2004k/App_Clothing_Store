const API_URL = "http://192.168.1.4:5000/api/admin"; // Thay bằng IP của server

export const getChartData = async () => {
  try {
    const response = await fetch(`${API_URL}/chart-data`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu biểu đồ:', error);
    throw error;
  }
};

export const getRevenueOverTime = async () => {
  try {
    const response = await fetch(`${API_URL}/revenue-over-time`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu:', error);
    throw error;
  }
};