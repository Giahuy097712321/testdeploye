const express = require("express");
const router = express.Router();
const db = require("../config/db");

/**
 * GET: Lấy danh sách tỉnh
 * GET /api/location/provinces
 */
router.get("/provinces", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM provinces ORDER BY name ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi lấy danh sách tỉnh" });
  }
});

/**
 * GET: Lấy xã/phường theo tỉnh
 * GET /api/location/wards?province_id=1
 */
router.get("/wards", async (req, res) => {
  try {
    const { province_id } = req.query;

    if (!province_id) {
      return res.status(400).json({ error: "province_id is required" });
    }

    const [rows] = await db.query(
      `SELECT id, name 
       FROM wards 
       WHERE province_id = ?
       ORDER BY name ASC`,
      [province_id]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi lấy danh sách xã/phường" });
  }
});

module.exports = router;
