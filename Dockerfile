# Sử dụng image Node.js phiên bản LTS
FROM node:18

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build frontend (nếu cần)
# RUN npm run build

# Expose port mà ứng dụng chạy (thường là 3000 hoặc 5000)
EXPOSE 3000

# Câu lệnh khởi chạy ứng dụng
CMD ["npm", "start"]