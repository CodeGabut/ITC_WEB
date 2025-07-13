const express = require('express') ;
const app = express() ; 
const port = 3000 ; 
const fs = require("fs") ;
const mongoose = require('mongoose');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://daffahaibanmuzakki:majalengkaraharja@cluster0.eimhiyd.mongodb.net/Database_ITC").then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Connection error:", err));


const mongoSchema = new mongoose.Schema({
  title : String , 
  date : {
    type: Date,
    default: Date.now 
  },
  image: String, 
  author : String , 
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  },
  slug: {
  type: String,
  unique: true 
}
}); 

const Article = new mongoose.model('Article',mongoSchema) ; 

const newArticle = new Article({
  title : "Ini adalah Judul Percobaan" , 
  image: "misalkan dulu", 
  author : "dedi mulyadi" , 
  tags: ["gacor"],
}) ; 


app.get('/blog', async (req, res) => {
  let [data1,data2] = await misal_db.find()
  res.render('blog',{name : data1.nama})  ;
}) ;
app.get('/division', async (req, res) => {
  newArticle.save().then(() => console.log('Artikel berhasil disimpan'))
  .catch(err => console.error('Gagal menyimpan artikel:', err));
  res.render('division')  ;
});
app.get('/fakultas', async (req, res) => {
  
  res.render('fakultas')  ;
});
app.get('/gallery', async (req, res) => {
  
  res.render('gallery')  ;
});
app.get('/index', async (req, res) => {
  
  res.render('index')  ;
});
app.get('/kabinet', async (req, res) => {
  
  res.render('kabinet')  ;
});
app.get('/pengurus', async (req, res) => {
  
  res.render('pengurus')  ;
});
app.get('/profil', async (req, res) => {
  
  res.render('profil')  ;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
