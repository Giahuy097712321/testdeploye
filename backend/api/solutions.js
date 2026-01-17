const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ... (Giữ nguyên phần GET ALL và GET ONE cũ) ...
// GET ALL
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM solutions ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ONE
router.get("/:id", async (req, res) => {
  try {
    const param = req.params.id;
    let sql = "SELECT * FROM solutions WHERE id = ?";
    let values = [param];
    
    // Logic thông minh: Nếu ID không phải số, tìm theo Link (Slug)
    if (isNaN(param)) {
        sql = "SELECT * FROM solutions WHERE link = ? OR link = ?";
        values = [`/${param}`, param];
    }
    const [rows] = await pool.execute(sql, values);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ message: "Không tìm thấy giải pháp này" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === PHẦN SỬA LỖI Ở ĐÂY ===

// CREATE (POST)
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    
    // FIX: React gửi biến 'id' (slug), nhưng DB cần 'link'.
    // Ta lấy data.id gán cho biến link_val
    const link_val = data.link || data.id; 

    const sql = `INSERT INTO solutions 
      (title, image, hero_video, hero_description, service_title, client_title, bottom_title, bottom_description, video_title, video_url, content, client_images, link) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
    const values = [
      data.title, 
      data.image, 
      data.hero_video, 
      data.hero_description, 
      data.service_title, 
      data.client_title, 
      data.bottom_title, 
      data.bottom_description, 
      data.video_title, 
      data.video_url, 
      data.content, 
      data.client_images, 
      link_val // Sử dụng biến đã fix
    ];
    
    const [result] = await pool.execute(sql, values);
    res.json({ message: "Thêm mới thành công", id: result.insertId });
  } catch (err) {
    console.error("Lỗi POST:", err); // Log ra terminal để dễ debug
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
});

// UPDATE (PUT)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID trên URL (có thể là số hoặc slug cũ)
    const data = req.body;
    
    // FIX: Lấy id từ form React làm link mới
    const link_val = data.link || data.id;

    // QUAN TRỌNG: Cần xác định cập nhật theo ID số hay theo Link (Slug)
    let sql, values;
    
    // Mảng giá trị chung cho các cột cần update
    const updateColumns = [
        data.title, data.image, data.hero_video, data.hero_description, 
        data.service_title, data.client_title, data.bottom_title, 
        data.bottom_description, data.video_title, data.video_url, 
        data.content, data.client_images, link_val
    ];

    if (!isNaN(id)) {
        // Trường hợp 1: URL là ID số (VD: /api/solutions/15)
        sql = `UPDATE solutions SET title=?, image=?, hero_video=?, hero_description=?, service_title=?, client_title=?, bottom_title=?, bottom_description=?, video_title=?, video_url=?, content=?, client_images=?, link=? WHERE id=?`;
        values = [...updateColumns, id];
    } else {
        // Trường hợp 2: URL là Slug (VD: /api/solutions/mavic-3)
        sql = `UPDATE solutions SET title=?, image=?, hero_video=?, hero_description=?, service_title=?, client_title=?, bottom_title=?, bottom_description=?, video_title=?, video_url=?, content=?, client_images=?, link=? WHERE link=?`;
        values = [...updateColumns, id];
    }

    const [result] = await pool.execute(sql, values);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy ID giải pháp để sửa" });
    res.json({ message: "Cập nhật thành công!" });
  } catch (err) {
    console.error("Lỗi PUT:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
});

// ... (Giữ nguyên phần DELETE) ...
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.execute("DELETE FROM solutions WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy để xóa" });
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;