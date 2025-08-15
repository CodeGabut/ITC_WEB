const { hasSubscribers } = require('diagnostics_channel');
const express = require('express') ;
const app = express() ; 
const port = 3000 ; 
const fs = require("fs") ;
const dep = require('./app');
const mongoose = require('mongoose');
const path = require('path');
const cloudinary = require('cloudinary').v2 ; 
const {CloudinaryStorage} = require('multer-storage-cloudinary') ;
const multer = require('multer');
const session = require("express-session");
const cherio = require('cheerio');
const { title } = require('process');
const cookieParser = require('cookie-parser') ; 
const rateLimit = require('express-rate-limit')





require('dotenv').config()

app.use(session({
  secret : "teknocihuy", 
  resave : false , 
  saveUninitialized : false 
}))

app.use(cookieParser());






app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));



mongoose.connect("mongodb+srv://itcmipaunsoed25:salamteknosaintis@database.ppcteph.mongodb.net/").then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Connection error:", err));






async function upload_img() {
  
  
  const db = await mongoose.connection.db;
  const collection = db.collection('password'); 
  console.log("Ini password");
  let [docs] = await collection.find({}).toArray()

  cloudinary.config({
  cloud_name: docs.CLOUD_NAME,
  api_key: docs.CLOUD_API_KEY,
  api_secret: docs.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gambar_article',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});


const upload = multer({
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024 
  }

})

console.log("berhasil ke upload");


return upload

}



  
  






    



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

async function passwordAndKey() {
  console.log("tes ini password");
  
  const db = await mongoose.connection.db;
  const collection = db.collection('password'); 
  console.log("Ini password");
  let [docs] = await collection.find({}).toArray()
  console.log(docs);
  return docs
}

function checkAuth(req,res,next) {
  if (req.session && req.session.loggedIn) {
    next()
  }
  else{
    res.redirect("/login")
  }
}

const loginLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5, 
  handler: (req, res) => {
    res.cookie("message", "⚠ Too many login attempts. Please wait 10 seconds.", { maxAge: 3000 });
    res.redirect("/login");
  },
  standardHeaders: true,
  legacyHeaders: false
});

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
    

  let data_article = await Article.find({isPublished : true}).sort({ _id: -1 }) ; 
    let data_sliced = pagination(req.query.page,4,data_article) ;
    let data_pagination = getPageRange(req.query.page, data_article.length, 4) ;
  
  
  if (!req.query.page) {
  res.redirect("/blog?page=1") ;
  }else if(req.query.page > Math.ceil(data_article.length/4) || isNaN(req.query.page)){
    res.send("No page found");
  }
  else{
    res.render('blog', {data_sliced,data_pagination,page : req.query.page, totalPages : Math.ceil(data_article.length / 4), cutDescription})  ;
  }

}) ;

app.get('/division', async (req, res) => {
  res.render('division')  ;
});


app.get('/dashboard_admin/search',checkAuth, async (req, res) => {
  console.log("Item Cari :");
  console.log(req.query);
  let data_article = await Article.find({
    title: { $regex: req.query.find, $options: "i" }
});

console.log(data_article);


    res.render('dashboard_admin_search', {data_article, total : data_article.length})  ;
  
});


app.get('/dashboard_admin',checkAuth, async (req, res) => {
  const db = await mongoose.connection.db;
  const stats = await db.stats();
  const totalBytes = stats.dataSize + stats.indexSize; 
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  


  let data_article = await Article.find() ; 
  let data_sliced = pagination(req.query.page,8,data_article) ; 
  let data_pagination = getPageRange(req.query.page, data_article.length, 8) ; 
  message = req.cookies.message

   if (!req.query.page) {
  res.redirect("/dashboard_admin?page=1") ;
  }else if(req.query.page > Math.ceil(data_article.length/8) || isNaN(req.query.page)){
    res.send("No page found") ; 
  }else{
    res.render('dashboard_admin', {data_sliced, page : req.query.page, pagination : data_pagination , data_length : data_article.length,message,totalMB})  ;
  }

  
});


app.get('/details_article/:slug',checkAuth, async (req, res) => {

  let data_article = await Article.findOne({slug : req.params.slug})


  
  res.render('details_article', {data_article})  ;
});


app.get('/login', async (req, res) => {

  

  const message = req.cookies.message;
  console.log("Ini pesan salah password");
  console.log(typeof message != 'undefined');
  
  
  res.render('login',{message})  ;
});

app.post('/login' , loginLimiter, async (req, res) => {

  
  let pass = await passwordAndKey() ; 

  
  if (req.body.password == pass.password) {
    req.session.loggedIn = true ; 
    res.redirect('/dashboard_admin')
  }else{
    res.cookie("message", "❌ Wrong username or password.", { maxAge: 3000 });
    res.redirect('/login');
  }

});





app.get('/article/:title', async (req, res) => {
  let data_article = await Article.findOne({slug : req.params.title})
  console.log(data_article);
  res.render('article', {data_article})  ;
});

app.post('/delete_article/:title', async (req, res) => {
  
  await Article.deleteOne({slug : req.params.title}) ;

  res.cookie("message", "Article deleted", { maxAge: 3000 });

  res.redirect(`/dashboard_admin?page=${req.body.page}`)  ;
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

app.post('/edit/:slug',checkAuth, async (req, res, next) => {
  const upload = await upload_img();
  upload.single('image')(req, res, next);
}, async (req, res) => {

console.log("Ini data :");

console.log(req.body);

let check_update = req.body.update == '' ; 

console.log(check_update);



const $ = cherio.load(req.body.content ); 
$('img').each(function () {
    $(this).addClass('img-quill');
  });

const newContent = $.html()
console.log(newContent);


  let data = {
  title : req.body.title , 
  description : req.body.description,
  content : newContent,
  image: typeof req.file == 'undefined' ? req.body.image  : req.file.path  ,
  author : req.body.author , 
  tags: req.body.categories,
  isPublished :  req.body.hide == 'hiden' ? false : true,
  }


  await Article.updateOne({slug: req.params.slug},data) ; 

  if (!check_update) {
  await Article.updateOne({ slug: req.params.slug }, { date: Date.now()});
}


  res.cookie("message", "Article Edited", { maxAge: 3000 });
  
 res.redirect("/dashboard_admin") ;
});

app.get('/hiden/:slug',checkAuth, async (req, res) =>{
  let data = await Article.findOne({slug: req.params.slug});

 
  await Article.updateOne({ slug: req.params.slug },{
    isPublished : !data.isPublished
  })

  if(data.isPublished){
    res.cookie("message", "Article Hiden",{ maxAge: 3000 });
    res.redirect('/dashboard_admin')
  }else{
    res.cookie("message", "Article Publish",{ maxAge: 3000 });
    res.redirect('/dashboard_admin')
  }
})


app.post('/create_article',checkAuth, async (req, res, next) => {
  const upload = await upload_img();
  upload.single('image')(req, res, next);
}, async (req, res) => {

  const $ = cherio.load(req.body.content ); 

$('img').each(function () {
    $(this).addClass('img-quill');
  });

const newContent = $.html()

console.log(newContent);


  

  const newArticle = new Article({
  title : req.body.title , 
  description : req.body.description,
  content : newContent,
  image: req.file.path, 
  author : req.body.author , 
  tags: req.body.categories.split(','),
  isPublished :  req.body.hide == 'hiden' ? false : true,
}) ; 


  await newArticle.save() ;

  res.cookie("message", "Article Added", { maxAge: 3000 });
  res.redirect('/dashboard_admin')  ;
});





app.get('/fakultas', async (req, res) => {
  
  res.render('fakultas')  ;
});


app.get('/gallery', async (req, res) => {
  
  res.render('gallery')  ;
});


app.get('/history', async (req, res) => {
  
  res.render('history')  ;
});


app.get('/', async (req, res) => {
  let data_article = await Article.find({isPublished : true}).sort({ _id: -1 }).limit(5) ; 
console.log(data_article);

  res.render('index', {data_article})  ;
});
app.get('/kabinet', async (req, res) => {
  
  res.render('kabinet')  ;
});

app.get('/divisi', async (req, res) => {
  
  res.render('division')  ;
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