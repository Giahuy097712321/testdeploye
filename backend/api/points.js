const express = require("express");
const router = express.Router();
const pool = require("../config/db"); 

// GET ALL
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM points ORDER BY created_at DESC");
    const formatted = rows.map((row) => ({
      ...row,
      position: [row.pos_x, row.pos_y, row.pos_z],
      posX: row.pos_x, posY: row.pos_y, posZ: row.pos_z,
      schedule: typeof row.schedule === "string" ? JSON.parse(row.schedule || "{}") : row.schedule,
      contact: typeof row.contact === "string" ? JSON.parse(row.contact || "{}") : row.contact,
      enableSchedule: (row.enableSchedule === 1 || row.enableSchedule === true),
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Lỗi GET points:", err);
    res.status(500).json({ message: err.message });
  }
});

// CREATE (POST) - ĐÃ SỬA LỖI SYNTAX (THÊM BACKTICK)
router.post("/", async (req, res) => {
  try {
    console.log("👉 [API] Nhận request POST tạo point:", req.body);

    const { id, title, lead, description, website, logoSrc, imageSrc, panoramaUrl, posX, posY, posZ, schedule, contact, enableSchedule } = req.body;

    if (!id || !title) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập ID và Tiêu đề." });
    }

    const isEnable = (enableSchedule === true || enableSchedule === "true" || enableSchedule === 1) ? 1 : 0;
    const x = isNaN(Number(posX)) ? 0 : Number(posX);
    const y = isNaN(Number(posY)) ? 0 : Number(posY);
    const z = isNaN(Number(posZ)) ? 0 : Number(posZ);

    // --- SỬA LỖI Ở ĐÂY: Thêm dấu ` bao quanh tên cột ---
    const sql = `INSERT INTO points (
      \`id\`, \`title\`, \`lead\`, \`description\`, \`website\`, 
      \`logoSrc\`, \`imageSrc\`, \`panoramaUrl\`, 
      \`pos_x\`, \`pos_y\`, \`pos_z\`, 
      \`schedule\`, \`contact\`, \`enableSchedule\`
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      id,
      title,
      lead || "", 
      description || "", 
      website || "", 
      logoSrc || "/images/logo-default.svg", 
      imageSrc || "/images/img-default.jpg", 
      panoramaUrl || "", 
      x, y, z, 
      JSON.stringify(schedule || {}), 
      JSON.stringify(contact || {}), 
      isEnable
    ];

    await pool.execute(sql, values);
    
    console.log("✅ [API] Đã tạo point thành công:", id);
    res.status(201).json({ success: true, message: "Tạo mới thành công" });

  } catch (err) {
    console.error("❌ [API] LỖI SERVER KHI TẠO POINT:", err); 
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: `ID '${req.body.id}' đã tồn tại.` });
    }
    res.status(500).json({ success: false, message: "Lỗi Server: " + err.message });
  }
});

// UPDATE (PUT) - CŨNG CẦN SỬA LỖI TƯƠNG TỰ
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, lead, description, website, logoSrc, imageSrc, panoramaUrl, posX, posY, posZ, schedule, contact, enableSchedule } = req.body;

    const isEnable = (enableSchedule === true || enableSchedule === "true" || enableSchedule === 1) ? 1 : 0;
    const x = isNaN(Number(posX)) ? 0 : Number(posX);
    const y = isNaN(Number(posY)) ? 0 : Number(posY);
    const z = isNaN(Number(posZ)) ? 0 : Number(posZ);

    // --- SỬA LỖI Ở ĐÂY: Thêm dấu ` ---
    const sql = `UPDATE points SET 
      \`title\`=?, \`lead\`=?, \`description\`=?, \`website\`=?, 
      \`logoSrc\`=?, \`imageSrc\`=?, \`panoramaUrl\`=?, 
      \`pos_x\`=?, \`pos_y\`=?, \`pos_z\`=?, 
      \`schedule\`=?, \`contact\`=?, \`enableSchedule\`=? 
      WHERE \`id\`=?`;

    const values = [title, lead, description, website, logoSrc, imageSrc, panoramaUrl, x, y, z, JSON.stringify(schedule || {}), JSON.stringify(contact || {}), isEnable, id];
    
    const [result] = await pool.execute(sql, values);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy Point ID" });
    
    console.log("✅ [API] Cập nhật point thành công:", id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ [API] Lỗi UPDATE:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.execute("DELETE FROM points WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Point not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;