import mongoose  from "mongoose";

const bookSchema = new mongoose.Schema({
    title:String,
    author:String,
    gender:String,
    publication_date:String
})

// Crear el modelo basado en el esquema
const Book = mongoose.model('Book', bookSchema);

export default Book;