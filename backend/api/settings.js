const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const [rows] = await pool.execute("SELECT setting_value FROM settings WHERE setting_key = ?", [key]);
    if (rows.length > 0) res.json({ value: rows[0].setting_value });
    else res.status(404).json({ message: "Key not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { key, value } = req.body;
    const sql = "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?";
    await pool.execute(sql, [key, value, value]);
    res.json({ success: true, message: "Đã lưu cài đặt" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;