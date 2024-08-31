const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { conexion } = require("./basededatos/conexion.js"); // Importar la función de conexión
const Articulo = require("./modelos/articulo"); // Importar el modelo Articulo

// Inicializar la APP
console.log("App arrancada");

// Inicializar la BD
conexion();

// Crear un servidor Node
const app = express();
const puerto = 3900;

// Configurar los CORS
app.use(cors());

// Convertir body a objeto js
app.use(express.json());

// Escuchar peticiones del servidor 
app.listen(puerto, () => {
    console.log("Servidor Node corriendo en el puerto:" + puerto);
});

// Ruta para insertar datos en la colección 'articulos'
app.get("/insert", async (req, res) => {
    console.log("Se ha realizado una inserción");
    try {
        // Datos de ejemplo, ya que no estás enviando parámetros en la URL
        const data = {
            titulo: "Título de Ejemplo",
            contenido: "Contenido de Ejemplo"
        };

        await Articulo.create(data);

        return res.status(200).send(`
            <div>
                <h1>Datos insertados</h1>
            </div>
        `);
    } catch (error) {
        console.error("Error al insertar los datos:", error);
        return res.status(500).send("Error al insertar los datos");
    }
});


// Ruta para eliminar datos en la colección 'articulos'
app.get("/delete", async (req, res) => {
    console.log("Se ha realizado una eliminación");
    try {
        const id = "ID_DE_EJEMPLO"; // Reemplaza con un ID válido de tu base de datos

        // Validar que el ID sea un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID inválido");
        }

        // Crear un ObjectId con el ID proporcionado
        const objectId = new mongoose.Types.ObjectId(id);

        const result = await Articulo.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return res.status(404).send("No se encontró el documento con el ID proporcionado");
        }

        return res.status(200).send(`
            <div>
                <h1>Datos eliminados</h1>
            </div>
        `);
    } catch (error) {
        console.error("Error al eliminar los datos:", error);
        return res.status(500).send("Error al eliminar los datos");
    }
});



// Ruta para actualizar datos en la colección 'articulos'
app.get("/update", async (req, res) => {
    console.log("Se ha realizado una actualización");

    const id = req.query.id;
    const nuevoTitulo = req.query.titulo;
    const nuevoContenido = req.query.contenido;

    console.log("ID recibido:", id);
    console.log("Nuevo título recibido:", nuevoTitulo);
    console.log("Nuevo contenido recibido:", nuevoContenido);

    if (!id || !nuevoTitulo || !nuevoContenido) {
        return res.status(400).send("ID, título o contenido no proporcionados");
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID inválido");
        }

        const updateData = {
            $set: {
                titulo: nuevoTitulo,
                contenido: nuevoContenido
            }
        };

        const result = await Articulo.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            updateData
        );

        if (result.matchedCount === 0) {
            return res.status(404).send("No se encontró el documento con el ID proporcionado");
        }

        return res.status(200).send(`
            <div>
                <h1>Datos actualizados</h1>
            </div>
        `);
    } catch (error) {
        console.error("Error al actualizar los datos:", error);
        return res.status(500).send("Error al actualizar los datos");
    }
});

// Ruta para buscar datos en la colección 'articulos'
app.get("/find", async (req, res) => {
    console.log("Se ha realizado una búsqueda");
    try {
        const data = await Articulo.find().exec();
        return res.status(200).send(`
            <div>
                <h1>Datos encontrados</h1>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `);
    } catch (error) {
        console.error("Error al buscar los datos:", error);
        return res.status(500).send("Error al buscar los datos");
    }
});





