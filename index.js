// const express = require('express')
import express from "express"
const app = express()

app.listen(3000, () => {
    console.log("running on port 3000");
});

app.get("/", (req, res) => {
    res.send("hello from api");
});