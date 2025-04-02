import express from 'express'; 
import axios from 'axios'; 

const app = express(); 
const port = 3000 || process.env.PORT; 
app.use(express.json()); 

const NEWS_API_ENDPOINT = "https://newsapi.org/v2/top-headlines";
const API_KEY = "Genrate Your API Key From NewsAPI.org";

app.get("/", async (req, res) => {
    const  country  = req.query.country || "us";
    try {
        const news = await axios.get(
            `${NEWS_API_ENDPOINT}?country=${country}&apiKey=${API_KEY}`
        );
        res.status(200).json(news.data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.listen(port, async () => {
    console.log(`Server Start At http://localhost:${port}/`);
})