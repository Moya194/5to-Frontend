const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 34567;
// Middleware
app.use(
  cors({
    origin: "*", // Permitir todas las conexiones en desarrollo
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
// Configuración de la conexión a MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// Verificar conexión a la base de datos
db.getConnection()
  .then(() => console.log("Conectado a la base de datos MySQL"))
  .catch((err) => console.error("Error de conexión a la base de datos:", err));
// Ruta para obtener todos los usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
});
// Ruta para buscar un usuario por cédula
app.get("/api/usuarios/:cedula", async (req, res) => {
  const { cedula } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE Cedula LIKE ?",
      [`${cedula}%`]
    );
    res.json(rows); // Devolvemos todos los resultados que coincidan
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    res.status(500).json({ error: "Error al buscar el usuario" });
  }
});
// Ruta para registrar un nuevo usuario
app.post("/api/usuarios", async (req, res) => {
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
    // Insertar en la tabla 'usuarios'
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, apellido, direccion, ocupacion, cedula, telefono, telefonoFijo, correo, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        apellido,
        direccion,
        ocupacion,
        cedula,
        telefono,
        telefonoFijo,
        correo,
        tipo,
      ]
    );
    // Obtener el ID del nuevo usuario insertado
    const usuarioId = result.insertId;
    // Insertar en la tabla 'cuentas' con la Cédula como 'Username' y 'Password'
    const hashedPassword = cedula; // En este caso, usamos la cédula como contraseña
    await db.query(
      "INSERT INTO cuentas (Username, Password, UsuarioId) VALUES (?, ?, ?)",
      [cedula, hashedPassword, usuarioId]
    );
    res.status(201).json({
      id: result.insertId,
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
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});
// Ruta para actualizar un usuario
app.put("/api/usuarios/:id", async (req, res) => {
  const userId = req.params.id;
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
    const [result] = await db.query(
      "UPDATE usuarios SET nombre = ?, apellido = ?, direccion = ?, ocupacion = ?, cedula = ?, telefono = ?, telefonoFijo = ?, correo = ?, tipo = ? WHERE id = ?",
      [
        nombre,
        apellido,
        direccion,
        ocupacion,
        cedula,
        telefono,
        telefonoFijo,
        correo,
        tipo,
        userId,
      ]
    );
    if (result.affectedRows > 0) {
      res.json({ message: "Usuario actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});
// Ruta para eliminar un usuario
app.delete("/api/usuarios/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [
      userId,
    ]);

    if (result.affectedRows > 0) {
      res.json({ message: "Usuario eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});
// Ruta para registrar una mascota
app.post("/api/registrar-mascota", async (req, res) => {
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
    vacunas, // Array con las vacunas
  } = req.body;
  const connection = await db.getConnection();
  await connection.beginTransaction();
  try {
    // Insertar mascota en la tabla `mascotas` sin el campo 'edad'
    const [result] = await connection.execute(
      `INSERT INTO mascotas 
          (Nombre, Color, Especie, FechaNacimiento, Sexo, Descripcion, Raza, Habitat, Alimento, OtroAlimento, Obtencion, Tenencia, Reproductivo, Imagen) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );
    const mascotaId = result.insertId;
    // Insertar relación en `usuariomascota`
    await connection.execute(
      "INSERT INTO usuariomascota (UsuarioId, MascotaId) VALUES (?, ?)",
      [usuarioId, mascotaId]
    );
    // Insertar vacunas si existen
    if (vacunas && vacunas.length > 0) {
      for (const vacuna of vacunas) {
        await connection.execute(
          "INSERT INTO vacunas (Nombre, Descripcion, FechaAplicacion, MascotaId) VALUES (?, ?, ?, ?)",
          [vacuna.nombre, vacuna.descripcion, vacuna.fechaAplicacion, mascotaId]
        );
      }
    }
    await connection.commit();
    res.json({ message: "Mascota registrada con éxito", mascotaId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Error al registrar la mascota" });
  } finally {
    connection.release();
  }
});
// Ruta para obtener las mascotas registradas
app.get("/api/mascotas-registradas", async (req, res) => {
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
    const [results] = await db.query(query); // Usar el pool de conexiones 'db'
    res.json(results);
  } catch (err) {
    console.error("Error al obtener las mascotas registradas:", err);
    return res
      .status(500)
      .json({ error: "Error al obtener las mascotas registradas" });
  }
});
// Ruta para el inicio de sesión
// Ruta para el inicio de sesión SIN bcrypt
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Buscar el usuario en la tabla `cuentas`
    const [cuenta] = await db.query(
      "SELECT * FROM cuentas WHERE Username = ? AND Password = ?",
      [username, password]
    );

    if (cuenta.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    // Obtener los datos del usuario relacionado
    const usuarioId = cuenta[0].UsuarioId;
    const [usuario] = await db.query("SELECT * FROM usuarios WHERE Id = ?", [
      usuarioId,
    ]);

    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Respuesta con datos del usuario
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
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});
// Ruta para obtener los datos completos del usuario por ID
app.get("/api/usuarios/:id", async (req, res) => {
  const usuarioId = parseInt(req.params.id, 10);

  if (isNaN(usuarioId)) {
    return res.status(400).json({ error: "ID de usuario no válido" });
  }
  try {
    console.log(`🔎 Buscando usuario con ID: ${usuarioId}`);
    // Consulta a la base de datos
    const [rows] = await db.query(
      "SELECT Id, Nombre, Apellido, Direccion, Ocupacion, Cedula, Telefono, TelefonoFijo, Correo, Tipo FROM usuarios WHERE Id = ?",
      [usuarioId]
    );
    console.log("📌 Resultado de la consulta:", rows);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Devolver el primer objeto del array en lugar de todo el array
    res.json(rows[0]);
  } catch (error) {
    console.error("🚨 Error en la consulta:", error);
    res.status(500).json({ error: "Error al obtener los datos del usuario" });
  }
});

// Ruta para obtener las mascotas de un usuario
app.get("/api/mascotas-usuario/:usuarioId", async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    // Consultar la base de datos para obtener las mascotas del usuario
    const [mascotas] = await db.query(
      `SELECT m.* 
       FROM mascotas m
       INNER JOIN usuariomascota um ON m.Id = um.MascotaId
       WHERE um.UsuarioId = ?`,
      [usuarioId]
    );

    if (mascotas.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron mascotas para este usuario" });
    }

    // Devolver las mascotas
    res.json(mascotas);
  } catch (error) {
    console.error("Error al obtener las mascotas del usuario:", error);
    res
      .status(500)
      .json({ error: "Error al obtener las mascotas del usuario" });
  }
});
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
