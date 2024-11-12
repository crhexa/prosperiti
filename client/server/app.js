import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('build')); 

app.post('/api/process-input', (req, res) => {
    const userInput = req.body.userInput;
    const budget = req.body.budget;
    console.log("Received input:", userInput); 
    const fillerText = `You're looking for: ${userInput}. Your monthly budget is $${budget}.`;
    res.json({ response: fillerText });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});