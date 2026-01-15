const express = require("express");
const cors = require("cors"); // Nhớ bật lại dòng này
const bodyParser = require("body-parser");
const compression = require("compression");
const { UPLOAD_ROOT } = require("./utils/fileHelpers");

const app = express();
const PORT = process.env.PORT || 5000; 

// --- CẤU HÌNH CORS CHUẨN (KHUYÊN DÙNG) ---
app.use(cors({
  origin: function (origin, callback) {
    // 1. Cho phép request không có origin (Postman, Server-to-Server)
    if (!origin) return callback(null, true);

    // 2. Tự động cho phép tất cả các port localhost (Dev Mode)
    // Giúp bạn không lo Vite đổi port 5173, 5174, 5175...
    if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
      return callback(null, true);
    }

    // 3. Cho phép domain thật (Production)
    const allowedOrigins = [
      "https://trungtamdaotaouav.vn",
      "https://www.trungtamdaotaouav.vn"
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // 4. Chặn các nguồn lạ khác
    console.log("Blocked CORS:", origin);
    return callback(new Error('CORS not allowed'), false);
  },
  credentials: true,
}));

app.use(compression());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/uploads", express.static(UPLOAD_ROOT, { 
    maxAge: "7d",
    immutable: true 
}));

// ... (Giữ nguyên phần import routes phía dưới của bạn) ...
const filesRoute = require("./api/files");
const pointsRoute = require("./api/points");
const solutionsRoute = require("./api/solutions");
const notificationsRoute = require("./api/notifications");
const settingsRoute = require("./api/settings");
const utilsRoute = require("./api/utils");
const examsRouter = require('./api/exams');
const coursesRoute = require("./api/courses"); 
const authRoute = require("./api/auth"); 
const usersRouter = require("./api/users");

app.use("/api/users", usersRouter);
app.use("/api", filesRoute);
app.use("/api/points", pointsRoute);
app.use("/api/solutions", solutionsRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/settings", settingsRoute);
app.use("/api", utilsRoute);
app.use('/api/exams', examsRouter);
app.use("/api/courses", coursesRoute); 
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  console.log(`Upload Storage Path: ${UPLOAD_ROOT}`);
});