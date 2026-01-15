const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM notifications ORDER BY created_at DESC");
    const formatted = rows.map(row => ({
      ...row,
      isNew: (row.is_new === 1 || row.is_new === true)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, date, description, link, isNew } = req.body;
    const isNewVal = (isNew === true || isNew === "true" || isNew === 1) ? 1 : 0;
    
    const sql = "INSERT INTO notifications (title, date, description, link, is_new) VALUES (?, ?, ?, ?, ?)";
    await pool.execute(sql, [title, date, description, link, isNewVal]);
    
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, description, link, isNew } = req.body;
    const isNewVal = (isNew === true || isNew === "true" || isNew === 1) ? 1 : 0;

    const sql = "UPDATE notifications SET title=?, date=?, description=?, link=?, is_new=? WHERE id=?";
    const [result] = await pool.execute(sql, [title, date, description, link, isNewVal, id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy ID" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute("DELETE FROM notifications WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy ID" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;