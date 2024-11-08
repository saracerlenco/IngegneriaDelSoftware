const Path = require('path');

const express= require('express');
const app = express();

// configurazione middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Definizione rotte
//TODO

//Esportazione apllicazione configurata
module.exports = app;