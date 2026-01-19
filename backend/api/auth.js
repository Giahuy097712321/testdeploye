const express = require("express");
const router = express.Router();
const db = require('../config/db'); // Đảm bảo đường dẫn đúng tới file config db của bạn
const bcrypt = require('bcryptjs');
const { generateToken, verifyTokenData } = require('../middleware/verifyToken'); // Đảm bảo đường dẫn đúng

// --- ĐĂNG KÝ ---
router.post("/register", async (req, res) => {
  const connection = await db.getConnection();
  try {
    // Bắt đầu Transaction (để đảm bảo lưu cả 2 bảng hoặc không lưu gì cả)
    await connection.beginTransaction();

    // 1. Nhận dữ liệu từ Frontend
    const {
      // Thông tin đăng nhập
      phone, email, password, fullName,
      
      // Thông tin cá nhân & CCCD
      birthDate, cccd, gender, 
      
      // Địa chỉ (Frontend gửi dạng chuỗi đã gộp sẵn với key 'final...')
      finalPermanentAddress, finalCurrentAddress,
      // Fallback nếu frontend gửi lẻ
      address, ward, district, city, 
      permanentAddress, permanentWard, permanentDistrict, permanentCity,

      // Liên hệ khẩn cấp
      emergencyName, emergencyPhone, emergencyRelation,

      // Thông tin UAV
      uavTypes,       // Mảng []
      uavPurpose,     // Chuỗi (Mục đích sử dụng)
      activityArea,   // Chuỗi (Khu vực)
      experience,     // Chuỗi (Kinh nghiệm bay)
      certificateType // Chuỗi (Hạng chứng chỉ)
    } = req.body;

    // 2. Kiểm tra user đã tồn tại chưa
    const [existing] = await connection.query("SELECT id FROM users WHERE phone = ? OR email = ?", [phone, email]);
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: "Số điện thoại hoặc Email đã tồn tại trong hệ thống." });
    }

    // 3. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 4. Insert vào bảng USERS (Bảng cha)
    const [userResult] = await connection.query(
      `INSERT INTO users (phone, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, 'student')`,
      [phone, email, password_hash, fullName]
    );
    const newUserId = userResult.insertId;

    // 5. Xử lý dữ liệu trước khi lưu vào User Profiles
    
    // - Chuyển mảng loại UAV thành chuỗi (VD: "DJI Mini, Autel")
    const uavTypeString = Array.isArray(uavTypes) ? uavTypes.join(', ') : uavTypes;
    
    // - Xử lý địa chỉ: Ưu tiên dùng chuỗi 'final' từ frontend, nếu không có thì tự gộp từ các trường lẻ
    const dbCurrentAddress = finalCurrentAddress || [address, ward, district, city].filter(Boolean).join(', ');
    const dbPermanentAddress = finalPermanentAddress || [permanentAddress, permanentWard, permanentDistrict, permanentCity].filter(Boolean).join(', ');

    // 6. Insert vào bảng USER_PROFILES
    // SQL này khớp chính xác với hình ảnh Database bạn cung cấp
    const insertProfileSql = `
      INSERT INTO user_profiles 
      (
        user_id, 
        address, 
        permanent_address, 
        identity_number, 
        birth_date, 
        gender,
        emergency_contact_name, 
        emergency_contact_phone, 
        emergency_contact_relation,
        uav_type, 
        usage_purpose, 
        operation_area, 
        uav_experience, 
        target_tier,
        identity_image_front, 
        identity_image_back
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.query(insertProfileSql, [
      newUserId,
      dbCurrentAddress,       // address
      dbPermanentAddress,     // permanent_address
      cccd,                   // identity_number
      birthDate || null,      // birth_date
      gender || null,         // gender
      emergencyName,          // emergency_contact_name
      emergencyPhone,         // emergency_contact_phone
      emergencyRelation,      // emergency_contact_relation (Khớp cột trong ảnh)
      uavTypeString,          // uav_type
      uavPurpose,             // usage_purpose (Khớp cột trong ảnh)
      activityArea,           // operation_area
      experience,             // uav_experience (Khớp cột trong ảnh)
      certificateType,        // target_tier
      null,                   // identity_image_front (Tạm để NULL do frontend đang gửi JSON không kèm file)
      null                    // identity_image_back (Tạm để NULL)
    ]);

    // 7. Hoàn tất Transaction
    await connection.commit();
    res.status(201).json({ message: "Đăng ký thành công", userId: newUserId });

  } catch (error) {
    // Nếu có lỗi, hủy toàn bộ thao tác db
    await connection.rollback();
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ error: "Lỗi server: " + error.message });
  } finally {
    connection.release();
  }
});

// --- ĐĂNG NHẬP (Giữ nguyên logic của bạn) ---
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body; 

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Tài khoản không tồn tại" });
    }

    const user = rows[0];

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) {
      return res.status(400).json({ error: "Mật khẩu không đúng" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "Tài khoản của bạn đã bị khóa" });
    }

    const token = generateToken({ id: user.id, role: user.role, fullName: user.full_name, email: user.email }, 'access');
    const refreshToken = generateToken({ id: user.id, role: user.role }, 'refresh');

    let responseData = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    };

    if (user.role === 'admin') {
      responseData.permissions = ['manage_users', 'manage_courses', 'manage_exams', 'manage_settings'];
    }

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      refreshToken,
      user: responseData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi đăng nhập" });
  }
});

// --- REFRESH TOKEN (Giữ nguyên logic của bạn) ---
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: "Refresh token không tìm thấy", code: 'NO_REFRESH_TOKEN' });
    }

    const decoded = verifyTokenData(refreshToken, 'refresh');

    const [rows] = await db.query("SELECT id, role, full_name, email FROM users WHERE id = ?", [decoded.id]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: "User không tồn tại", code: 'USER_NOT_FOUND' });
    }

    const user = rows[0];
    const newToken = generateToken({ id: user.id, role: user.role, fullName: user.full_name, email: user.email }, 'access');

    res.json({ success: true, message: "Token mới được tạo thành công", token: newToken });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: "Refresh token đã hết hạn", code: 'REFRESH_TOKEN_EXPIRED' });
    }
    res.status(401).json({ success: false, error: "Refresh token không hợp lệ", code: 'INVALID_REFRESH_TOKEN' });
  }
});

// --- VERIFY TOKEN (Giữ nguyên logic của bạn) ---
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, error: "Token không tìm thấy", code: 'NO_TOKEN' });
    }

    const decoded = verifyTokenData(token, 'access');
    const [rows] = await db.query("SELECT id, full_name, email, phone, role, avatar FROM users WHERE id = ?", [decoded.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "User không tồn tại", code: 'USER_NOT_FOUND' });
    }

    res.json({ success: true, message: "Token hợp lệ", user: rows[0] });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: "Token đã hết hạn", code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ success: false, error: "Token không hợp lệ", code: 'INVALID_TOKEN' });
  }
});

module.exports = router;