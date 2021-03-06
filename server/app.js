require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const main = async () => {

  await mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qlg2b.mongodb.net/certificate?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        // useFindAndModify: false,
        useUnifiedTopology: true,
      }
    )
    .then((result) => {
      console.log('Connected to db');
    });
  app.use('/', require('./routes/'));
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
};

main().catch((err) => console.log(err));
