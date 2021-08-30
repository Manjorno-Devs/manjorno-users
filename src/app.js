const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.status(418).json({title:"Teapot"});
})

console.log("Listening...");

app.listen(process.env.PORT || 3100);