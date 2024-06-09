import express from 'express';
import { Book } from "../models/bookModel.js";
const router = express.Router();

router.post('/', async (request, response) => {
    try{
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishedYear
        ){
            return response.status(400).send({
                message: 'Send all the required fields.',
            }); 
        }
        
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishedYear: request.body.publishedYear,
        };

        const book = await Book.create(newBook);

        return response.status(201).send(book);
    }catch (error){
        console.log(error);
        response.status(500).send({message: error.message});
    }
});

router.get('/', async (request, response) => {
    try{
        const books = await Book.find({});

        return response.status(200).json({
            count: books.length,
            data: books
        });
    }catch (error){
        console.log(error);
        response.status(500).send({message: error.message});
    }
});

router.get('/:id', async (request, response) => {
    try{
        const {id} = request.params;

        const book = await Book.findById(id);

        return response.status(200).json(book);
    }catch (error){
        console.log(error);
        response.status(500).send({message: error.message});
    }
});

router.put('/:id', async (request, response) => {
    try {
        const { title, author, publishedYear } = request.body;
        if (!title || !author || !publishedYear) {
            return response.status(400).send({
                message: 'Send all the required fields.',
            });
        }

        const { id } = request.params;
        const data = { $set: { title, author, publishedYear } };

        // Assuming the ID is the MongoDB ObjectID
        const result = await Book.updateOne({ _id: id }, { $set: { author, title, publishedYear } });

        // Check if any document was matched and updated
        if (result.matchedCount === 0) {
            return response.status(404).send({ message: 'Book not found' });
        }

        return response.status(200).send({ message: 'Book updated' });
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: error.message });
    }
});


router.delete('/:id', async (request, response) => {
    try{
        const { id } = request.params;

        const result = await Book.findByIdAndDelete(id, request.body);
        
        if(!result){
            return response.status(404).send({message: 'Book not found'});
        }

        return response.status(200).send({message: 'Book deleted'});
    }catch (error){
        console.log(error);
        response.status(500).send({message: error.message});
    }
});


export default router;