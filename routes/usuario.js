const express = require("express");
const router = express.Router();
const { sql, getConnection } = require("../db");

// Obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM usuarios");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
});

// Buscar usuario por cédula
router.get("/usuarios/cedula/:cedula", async (req, res) => {
  const { cedula } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("cedula", sql.VarChar, `${cedula}%`)
      .query("SELECT * FROM usuarios WHERE Cedula LIKE @cedula");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    res.status(500).json({ error: "Error al buscar el usuario" });
  }
});

// Obtener usuario por ID
router.get("/usuarios/:id", async (req, res) => {
  const usuarioId = parseInt(req.params.id, 10);

  if (isNaN(usuarioId)) {
    return res.status(400).json({ error: "ID de usuario no válido" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .query(`
        SELECT Id, Nombre, Apellido, Direccion, Ocupacion, Cedula, Telefono, Correo, Tipo 
        FROM usuarios 
        WHERE Id = @usuarioId
      `);

    const rows = result.recordset;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];
    const usuarioCompleto = {
      id: usuario.Id,
      nombre: usuario.Nombre || "No proporcionado",
      apellido: usuario.Apellido || "No proporcionado",
      direccion: usuario.Direccion || "No proporcionada",
      ocupacion: usuario.Ocupacion || "No proporcionada",
      cedula: usuario.Cedula || "No proporcionada",
      telefono: usuario.Telefono || "No proporcionado",
      correo: usuario.Correo || "No proporcionado",
      tipo: usuario.Tipo || "No proporcionado",
    };

    res.json(usuarioCompleto);
  } catch (error) {
    console.error("🚨 Error en la consulta:", error);
    res.status(500).json({ error: "Error al obtener los datos del usuario" });
  }
});

// Crear usuario
router.post("/usuarios", async (req, res) => {
  const {
    nombre,
    apellido,
    direccion,
    ocupacion,
    cedula,
    telefono,
    telefonoFijo,
    correo,
    tipo,
  } = req.body;

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("direccion", sql.VarChar, direccion)
      .input("ocupacion", sql.VarChar, ocupacion)
      .input("cedula", sql.VarChar, cedula)
      .input("telefono", sql.VarChar, telefono)
      .input("telefonoFijo", sql.VarChar, telefonoFijo)
      .input("correo", sql.VarChar, correo)
      .input("tipo", sql.VarChar, tipo)
      .query(`
        INSERT INTO usuarios (nombre, apellido, direccion, ocupacion, cedula, telefono, telefonoFijo, correo, tipo)
        OUTPUT INSERTED.Id
        VALUES (@nombre, @apellido, @direccion, @ocupacion, @cedula, @telefono, @telefonoFijo, @correo, @tipo)
      `);

    const usuarioId = result.recordset[0].Id;

    await pool.request()
      .input("username", sql.VarChar, cedula)
      .input("password", sql.VarChar, cedula)
      .input("usuarioId", sql.Int, usuarioId)
      .query(`
        INSERT INTO cuentas (Username, Password, UsuarioId)
        VALUES (@username, @password, @usuarioId)
      `);

    res.status(201).json({
      id: usuarioId,
      nombre,
      apellido,
      direccion,
      ocupacion,
      cedula,
      telefono,
      telefonoFijo,
      correo,
      tipo,
      mensaje: "Usuario registrado exitosamente",
    });

  } catch (error) {
    console.error("❌ Error al registrar el usuario:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

// Actualizar usuario
router.put("/usuarios/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const {
    nombre,
    apellido,
    direccion,
    ocupacion,
    cedula,
    telefono,
    telefonoFijo,
    correo,
    tipo,
  } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("id", sql.Int, userId)
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("direccion", sql.VarChar, direccion)
      .input("ocupacion", sql.VarChar, ocupacion)
      .input("cedula", sql.VarChar, cedula)
      .input("telefono", sql.VarChar, telefono)
      .input("telefonoFijo", sql.VarChar, telefonoFijo)
      .input("correo", sql.VarChar, correo)
      .input("tipo", sql.VarChar, tipo)
      .query(`
        UPDATE usuarios
        SET nombre = @nombre,
            apellido = @apellido,
            direccion = @direccion,
            ocupacion = @ocupacion,
            cedula = @cedula,
            telefono = @telefono,
            telefonoFijo = @telefonoFijo,
            correo = @correo,
            tipo = @tipo
        WHERE id = @id
      `);

    if (result.rowsAffected[0] > 0) {
      res.json({ message: "Usuario actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

// Eliminar usuario
router.delete("/usuarios/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("id", sql.Int, userId)
      .query("DELETE FROM usuarios WHERE id = @id");

    if (result.rowsAffected[0] > 0) {
      res.json({ message: "Usuario eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

module.exports = router;
