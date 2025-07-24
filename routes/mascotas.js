const express = require("express");
const router = express.Router();
const { sql, getConnection } = require("../db");

// Registrar nueva mascota
router.post("/registrar-mascota", async (req, res) => {
  const {
    nombre,
    color,
    especie,
    fechaNacimiento,
    sexo,
    descripcion,
    raza,
    habitat,
    alimento,
    otroAlimento,
    obtencion,
    tenencia,
    reproductivo,
    imagen,
    usuarioId,
    vacunas,
  } = req.body;

  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    const insertMascotaResult = await request
      .input("Nombre", sql.NVarChar, nombre)
      .input("Color", sql.NVarChar, color)
      .input("Especie", sql.NVarChar, especie)
      .input("FechaNacimiento", sql.Date, fechaNacimiento)
      .input("Sexo", sql.NVarChar, sexo)
      .input("Descripcion", sql.NVarChar, descripcion)
      .input("Raza", sql.NVarChar, raza)
      .input("Habitat", sql.NVarChar, habitat)
      .input("Alimento", sql.NVarChar, alimento)
      .input("OtroAlimento", sql.NVarChar, otroAlimento)
      .input("Obtencion", sql.NVarChar, obtencion)
      .input("Tenencia", sql.NVarChar, tenencia)
      .input("Reproductivo", sql.NVarChar, reproductivo)
      .input("Imagen", sql.NVarChar, imagen)
      .query(`
        INSERT INTO mascotas 
        (Nombre, Color, Especie, FechaNacimiento, Sexo, Descripcion, Raza, Habitat, Alimento, OtroAlimento, Obtencion, Tenencia, Reproductivo, Imagen)
        OUTPUT INSERTED.Id
        VALUES (@Nombre, @Color, @Especie, @FechaNacimiento, @Sexo, @Descripcion, @Raza, @Habitat, @Alimento, @OtroAlimento, @Obtencion, @Tenencia, @Reproductivo, @Imagen)
      `);

    const mascotaId = insertMascotaResult.recordset[0].Id;

    await new sql.Request(transaction)
      .input("UsuarioId", sql.Int, usuarioId)
      .input("MascotaId", sql.Int, mascotaId)
      .query("INSERT INTO usuariomascota (UsuarioId, MascotaId) VALUES (@UsuarioId, @MascotaId)");

    if (vacunas && vacunas.length > 0) {
      for (const vacuna of vacunas) {
        await new sql.Request(transaction)
          .input("Nombre", sql.NVarChar, vacuna.nombre)
          .input("Descripcion", sql.NVarChar, vacuna.descripcion)
          .input("FechaAplicacion", sql.Date, vacuna.fechaAplicacion)
          .input("MascotaId", sql.Int, mascotaId)
          .query(`
            INSERT INTO vacunas (Nombre, Descripcion, FechaAplicacion, MascotaId)
            VALUES (@Nombre, @Descripcion, @FechaAplicacion, @MascotaId)
          `);
      }
    }

    await transaction.commit();
    res.status(201).json({ message: "Mascota registrada con éxito", mascotaId });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error al registrar la mascota:", error);
    res.status(500).json({ error: "Error al registrar la mascota" });
  }
});

// Obtener todas las mascotas registradas
router.get("/mascotas-registradas", async (req, res) => {
  const query = `
    SELECT 
      m.Id, m.Nombre, m.Color, m.Especie, m.FechaNacimiento, m.Sexo, 
      m.Descripcion, m.Raza, m.Habitat, m.Alimento, m.OtroAlimento, 
      m.Obtencion, m.Tenencia, m.Reproductivo, m.Imagen,
      u.Nombre AS NombrePropietario, u.Cedula, u.Telefono
    FROM 
      mascotas m
    JOIN 
      usuariomascota um ON um.MascotaId = m.Id
    JOIN 
      usuarios u ON u.Id = um.UsuarioId;
  `;

  try {
    const pool = await getConnection();
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener las mascotas registradas:", err);
    res.status(500).json({ error: "Error al obtener las mascotas registradas" });
  }
});

// Obtener mascotas de un usuario
router.get("/mascotas-usuario/:usuarioId", async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);

  if (isNaN(usuarioId)) {
    return res.status(400).json({ error: "ID de usuario no válido" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .query(`
        SELECT m.* 
        FROM mascotas m
        INNER JOIN usuariomascota um ON m.Id = um.MascotaId
        WHERE um.UsuarioId = @usuarioId
      `);

    const mascotas = result.recordset;

    if (mascotas.length === 0) {
      return res.status(404).json({
        error: "No se encontraron mascotas para este usuario",
      });
    }

    res.json(mascotas);
  } catch (error) {
    console.error("Error al obtener las mascotas del usuario:", error);
    res.status(500).json({ error: "Error al obtener las mascotas del usuario" });
  }
});

module.exports = router;
