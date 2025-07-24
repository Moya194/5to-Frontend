const express = require("express");
const router = express.Router();
const { sql, getConnection } = require("../db");

// Login de usuario
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await getConnection();

    const cuentaResult = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .query("SELECT * FROM cuentas WHERE Username = @username AND Password = @password");

    const cuenta = cuentaResult.recordset;

    if (cuenta.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const usuarioId = cuenta[0].UsuarioId;

    const usuarioResult = await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .query("SELECT * FROM usuarios WHERE Id = @usuarioId");

    const usuario = usuarioResult.recordset;

    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      message: "Inicio de sesión exitoso",
      usuario: {
        id: usuario[0].Id,
        nombre: usuario[0].Nombre,
        apellido: usuario[0].Apellido,
        correo: usuario[0].Correo,
      },
    });
  } catch (error) {
    console.error("❌ Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
