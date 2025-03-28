import express from 'express'
import  Book  from '../models/book.model.js'

const route = express.Router();
//Middlewate
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID del libro no es válido'
            }
        )
    }

    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json(
                {
                    message: 'El libro no fue encontrado'
                }
            )
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                
                message: error.message
            }
        )
    }

    res.book = book;
    next()
}
//Obtener todos los libros
 route.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('Get All',books)
        console.log(books.length)
        if(books.length===0){
          return   res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})


//Crear un nuevo libro  (recurso)
route.post('/',async(req,res)=>{
    const {title,author,gender,publication_date}=req?.body
    console.log(req?.body)
    if(!title || !author|| !gender || !publication_date){
        return res.status(400).json({message:'Los campos son obligatorios'})
    }

    const  book = new Book({
        title,author,gender,publication_date
    })
    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({message: error.message})

    }

})

route.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
})

route.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

route.patch('/:id', getBook, async (req, res) => {

    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
        res.status(400).json({
            message: 'Al menos uno de estos campos debe ser enviado: Título, Autor, Género o fecha de publicación'
        })

    }

    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.gender = req.body.gender || book.gender;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})
route.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})
export default route;