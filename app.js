const { hasSubscribers } = require('diagnostics_channel');
const express = require('express') ;
const app = express() ; 
const port = 3000 ; 
const fs = require("fs") ;
const mongoose = require('mongoose');
const path = require('path');
const cloudinary = require('cloudinary').v2 ; 
const {CloudinaryStorage} = require('multer-storage-cloudinary') ;
const multer = require('multer');
const session = require("express-session");
const { title } = require('process');



require('dotenv').config()

app.use(session({
  secret : "teknocihuy", 
  resave : false , 
  saveUninitialized : false 
}))

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gambar_article',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({storage})



app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));



mongoose.connect("mongodb+srv://itcmipaunsoed25:salamteknosaintis@database.ppcteph.mongodb.net/").then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Connection error:", err));

  
const mongoSchema = new mongoose.Schema({

  title : String , 
  content : String ,
  description : String , 
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
  slug: String
}); 


function checkAuth(req,res,next) {
  if (req.session && req.session.loggedIn) {
    next()
  }
  else{
    res.redirect("/login")
  }
}

function cutDescription(text) {
  console.log(text);
    return text.slice(0,120)+"..."
}
const slugify = (text) => {
  console.log("Ini bener?");
  console.log(text);
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, '')     // Hapus karakter non-word
    .replace(/\-\-+/g, '-');      // Hapus duplikat tanda -
};

function getPageRange(currentPage, totalItems, itemsPerPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let startPage, endPage;

  if (currentPage <= 2) {
    startPage = 1;
    endPage = Math.min(3, totalPages);
  } else if (currentPage >= totalPages - 1) {
    startPage = Math.max(totalPages - 2, 1);
    endPage = totalPages;
  } else {
    startPage = currentPage;
    endPage = currentPage + 2;
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
}
function pagination(page,limit,model) {
  page = parseInt(page)
  const startIndex = (page-1)*limit ; 
  const endIndex = page*limit ; 

  let prev = null;
  let next = null;
  if (startIndex > 0) {
    prev = {
      page : page-1,
      limit : limit
    }
  } 
  if (endIndex < model.length) {
     next = {
      page : page+1,
      limit : limit
    }
  } 
  const result = model.slice(startIndex,endIndex) ;
  return {prev,next,result,number: startIndex} ; 
}

mongoSchema.pre('save', function(next) {
 
  this.slug = slugify(this.title, { lower: true, strict: true });
  console.log(this.slug);
  
  next();
});

const Article = new mongoose.model('Article',mongoSchema) ; 










app.get('/tambah', async (req, res) => {
  newArticle.save() ;
  let data_article = await Article.find() ; 
  console.log(data_article);
  res.send("berhasil") ; 
}) ;

app.get('/blog', async (req, res) => {


  let data_article = await Article.find({isPublished : true}) ; 
  console.log(data_article);
    let data_sliced = pagination(req.query.page,4,data_article) ;
    let data_pagination = getPageRange(req.query.page, data_article.length, 4) ;
  
  
  if (!req.query.page) {
  res.redirect("/blog?page=1") ;
  }else if(req.query.page > Math.ceil(data_article.length/4) || isNaN(req.query.page)){
    res.send("No page found");
  }
  else{
     
    console.log(data_sliced);
    res.render('blog', {data_sliced,data_pagination,page : req.query.page, totalPages : Math.ceil(data_article.length / 4), cutDescription})  ;
  }

}) ;

app.get('/division', async (req, res) => {
  res.render('division')  ;
});


app.get('/dashboard_admin',checkAuth, async (req, res) => {
  let data_article = await Article.find() ; 
  let data_sliced = pagination(req.query.page,8,data_article) ; 
  let data_pagination = getPageRange(req.query.page, data_article.length, 8) ; 

   if (!req.query.page) {
  res.redirect("/dashboard_admin?page=1") ;
  }else if(req.query.page > Math.ceil(data_article.length/8) || isNaN(req.query.page)){
    res.send("No page found") ; 
  }else{
    res.render('dashboard_admin', {data_sliced, page : req.query.page, pagination : data_pagination , data_length : data_article.length,})  ;
  }

  

  
  
});


app.get('/details_article',checkAuth, async (req, res) => {
  newArticle.save().then(() => console.log('Artikel berhasil disimpan'))
  .catch(err => console.error('Gagal menyimpan artikel:', err));
  res.render('details_article')  ;
});


app.get('/login', async (req, res) => {

  res.render('login')  ;
});

app.post('/login' ,async (req, res) => {
  console.log(req.body);
  
  if (req.body.password == process.env.PASSWORD_DASHBOARD) {
    req.session.loggedIn = true ; 
    res.redirect('/dashboard_admin')
  }else{
    res.send("Salah password")
  }

});





app.get('/article/:title', async (req, res) => {
  console.log(req.params.title);
  let data_article = await Article.findOne({slug : req.params.title})
  console.log(data_article);
  res.render('article', {data_article})  ;
});

app.delete('/article/:title', async (req, res) => {
  console.log("Ini datanya  :"); console.log(req.params.title);
  
  
  let contoh = await Article.deleteOne({slug : req.params.title}) ;
  console.log("Ini data yang diapus");
  
  console.log(contoh);
  
  res.send('terhapus')  ;
});


app.get('/create_article',checkAuth, async (req, res) => {
  
  res.render('create_article', {edit : false, tags : undefined, slug : undefined, image : undefined})  ;
});


app.get('/edit/:slug',checkAuth, async (req, res) => {
 
 let [data_article] = await Article.find({slug:req.params.slug}) ; 
  console.log(data_article);
  console.log("Ini data tag");
  console.log(data_article.tags[0]);
  
  res.render('create_article',{edit : true,data_article, tags : data_article.tags[0] , slug : req.params.slug,image : data_article.image })  ;
});

app.post('/edit/:slug',checkAuth, upload.single('image'), async (req, res) => {



  let data = {
  title : req.body.title , 
  description : req.body.description,
  content : req.body.content,
  image: typeof req.file == 'undefined' ? req.body.image  : req.file.path  ,
  author : req.body.author , 
  tags: req.body.categories,
  isPublished :  req.body.hide == 'hiden' ? false : true,
  }


  await Article.updateOne({slug: req.params.slug},data)
  
  
 res.send("Berhasil") ;
});

app.get('/hiden/:slug',checkAuth, upload.single('image'), async (req, res) =>{
  let data = await Article.findOne({slug: req.params.slug});

  
  console.log(data);
  console.log(!data.isPublished);
  
  await Article.updateOne({ slug: req.params.slug },{
    isPublished : !data.isPublished
  })
  res.redirect('/dashboard_admin')
})


app.post('/create_article',checkAuth, upload.single('image'), async (req, res) => {

  console.log(req.body);
  
  console.log(req.body.categories);

  

  const newArticle = new Article({
  title : req.body.title , 
  description : req.body.description,
  content : req.body.content,
  image: req.file.path, 
  author : req.body.author , 
  tags: req.body.categories.split(','),
  isPublished :  req.body.hide == 'hiden' ? false : true,
}) ; 


  await newArticle.save()

  res.send('berhasil')  ;
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
