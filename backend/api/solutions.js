const express = require("express");
const router = express.Router();
const pool = require("../config/db");

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

// CREATE
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const sql = `INSERT INTO solutions (title, image, hero_video, hero_description, service_title, client_title, bottom_title, bottom_description, video_title, video_url, content, client_images, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [data.title, data.image, data.hero_video, data.hero_description, data.service_title, data.client_title, data.bottom_title, data.bottom_description, data.video_title, data.video_url, data.content, data.client_images, data.link];
    const [result] = await pool.execute(sql, values);
    res.json({ message: "Thêm mới thành công", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const sql = `UPDATE solutions SET title = ?, image = ?, hero_video = ?, hero_description = ?, service_title = ?, client_title = ?, bottom_title = ?, bottom_description = ?, video_title = ?, video_url = ?, content = ?, client_images = ?, link = ? WHERE id = ?`;
    const values = [data.title, data.image, data.hero_video, data.hero_description, data.service_title, data.client_title, data.bottom_title, data.bottom_description, data.video_title, data.video_url, data.content, data.client_images, data.link, id];
    const [result] = await pool.execute(sql, values);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy ID giải pháp" });
    res.json({ message: "Cập nhật thành công!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
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