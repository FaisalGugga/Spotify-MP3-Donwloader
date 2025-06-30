const express = require('express')
const cors = require("cors")
const ytdlp = require('yt-dlp-exec')
const axios = require("axios")

const app = express()
app.use(cors());
app.listen(3000, ()=>{
    console.log(`server is running at http://localhost:3000 or /api`);
})


app.get("/downloadMP3", async function (req,res){
    const youtubeURL = req.query.url;
    console.log(youtubeURL)
    const trackName = req.query.trackName
    const artistName = req.query.artistName

    if (!youtubeURL){
        return res.status(400).send("Missing URL")
    }

    const filename = `${trackName} - ${artistName}.mp3`
    res.setHeader("Content-Disposition",`attachment; filename="${filename}"`)
    res.setHeader("Content-Type","audio/mpeg")

    const options = {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        output: '-'
    }

    ytdlp.exec(youtubeURL,options).stdout.pipe(res)

})


app.get("/searchYoutube", async function(req,res){
    const query = req.query.search_query;

    if(!query){
        return res.status(400).send("Missing query")
    }

    try{

        const response = await axios.get("https://serpapi.com/search.json",{
            params: {
                engine: "youtube",
                search_query: query,
                api_key: "656b9092c11e0298d802435a59823ad72c929fe61fa77312670b99b8e0a06c3b"
            }
        })

        res.json(response.data)

    }catch(error){
        res.status(500).json({
        message: "SerpAPI request failed",
        error: error.message,
        });
    }
})