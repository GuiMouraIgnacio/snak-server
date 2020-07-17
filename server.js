require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
const recipeFilter = require('./src/recipeFilter')

app.use(cors());
app.use(bodyParser.json());

app.post('/recipe', (req, res) => {
    const bestRecipe = recipeFilter(req.body.ingredients);
    res.send({bestRecipe});
})

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))