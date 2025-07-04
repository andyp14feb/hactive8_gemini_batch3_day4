import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


//gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

app.listen(port, () => {
    console.log('Gemini Chatbot running on http://localhost: ',port)
});



app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  if(!userMessage){
    return res.status(400).json({error: 'No message provided'});
  }

  try{
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();
    res.json({response: text});
  }
  catch(error){
    console.error('Error generating response:', error);
    res.status(500).json({error: 'An error occurred while generating the response'});

  }



});

