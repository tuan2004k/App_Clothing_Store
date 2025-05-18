import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const AdminDashboard = ({ navigation }) => {
  const [chartData, setChartData] = useState({
    productsByCategory: [],
    stockBySize: [],
    revenueOverTime: [],
  });

  // Sử dụng dữ liệu giả thay vì gọi API
  useEffect(() => {
    const fakeData = {
      productsByCategory: [
        { Ten: 'Áo', SoLuong: 15 },
        { Ten: 'Quần', SoLuong: 10 },
        { Ten: 'Giày', SoLuong: 8 },
        { Ten: 'Túi xách', SoLuong: 5 },
      ],
      stockBySize: [
        { Size: 'S', TongSoLuong: 20 },
        { Size: 'M', TongSoLuong: 30 },
        { Size: 'L', TongSoLuong: 25 },
        { Size: 'XL', TongSoLuong: 15 },
      ],
      revenueOverTime: [
        { Thang: '2023-01', DoanhThu: 5000000 },
        { Thang: '2023-02', DoanhThu: 7500000 },
        { Thang: '2023-03', DoanhThu: 6000000 },
        { Thang: '2023-04', DoanhThu: 9000000 },
      ],
    };

    // Chuyển đổi dữ liệu size sang định dạng PieChart
    const sizeData = fakeData.stockBySize.map(item => ({
      name: item.Size,
      population: parseInt(item.TongSoLuong),
      color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));

    setChartData({
      productsByCategory: fakeData.productsByCategory,
      stockBySize: sizeData,
      revenueOverTime: fakeData.revenueOverTime,
    });

    navigation.setOptions({

    });
  }, [navigation]);

  // Dữ liệu cho biểu đồ cột (Số lượng sản phẩm theo danh mục)
  const barChartData = {
    labels: chartData.productsByCategory.map(item => item.Ten || 'Không xác định'),
    datasets: [
      {
        data: chartData.productsByCategory.map(item => item.SoLuong || 0),
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn (Tồn kho theo size)
  const pieChartData = chartData.stockBySize;

  // Dữ liệu cho biểu đồ đường (Doanh thu theo thời gian)
  const lineChartData = {
    labels: chartData.revenueOverTime.map(item => item.Thang || 'N/A'),
    datasets: [
      {
        data: chartData.revenueOverTime.map(item => item.DoanhThu || 0),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard </Text>

      {/* Biểu đồ cột: Số lượng sản phẩm theo danh mục */}
      <Text style={styles.chartTitle}>Số Lượng Sản Phẩm Bán Chạy</Text>
      {chartData.productsByCategory.length > 0 ? (
        <BarChart
          data={barChartData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={styles.chart}
        />
      ) : (
        <Text>Đang tải...</Text>
      )}

      {/* Biểu đồ tròn: Tồn kho theo size */}
      <Text style={styles.chartTitle}>Tồn Kho Theo Size</Text>
      {chartData.stockBySize.length > 0 ? (
        <PieChart
          data={pieChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text>Đang tải...</Text>
      )}

      {/* Biểu đồ đường: Doanh thu theo thời gian */}
      <Text style={styles.chartTitle}>Doanh Thu Theo Tháng</Text>
      {chartData.revenueOverTime.length > 0 ? (
        <LineChart
          data={lineChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16, marginBottom: 50 },
          }}
          style={styles.chart}
        />
      ) : (
        <Text>Đang tải...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    padding: 20,
    marginBottom: 50
  },
  title:
  {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, textAlign: 'center'
  },
  chartTitle:
  {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginBottom: 20
  },
  chart:
  {
    marginVertical: 8,
    borderRadius: 16,
    marginBottom: 20
  },
  addButton:
  {
    color: '#4CAF50',
    fontSize: 16,
    marginRight: 10
  },
});

export default AdminDashboard;