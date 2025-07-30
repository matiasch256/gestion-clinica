const express = require("express");
const factory = require("../config/database");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await factory.createConnection("sqlserver").connect();
    const result = await db.query("SELECT * FROM proveedores");
    res.json(result.recordset);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).send("Error en el servidor");
  }
});

module.exports = router;
