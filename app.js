const { hasSubscribers } = require('diagnostics_channel');
const express = require('express') ;
const app = express() ; 
const port = 3000 ; 
const fs = require("fs") ;
const mongoose = require('mongoose');
const path = require('path');

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




const newArticle = new Article({
  title : "apa harus beda ya Percobaan ya yaa211dsad lala" , 
  description : "Misalnya ini deskripsi",
  content : "Percobaan ini contentnnya",
  image: "laasdsadhh", 
  author : "dedi mulyadi" , 
  tags: ["gacor123"],
  
}) ; 





app.get('/tambah', async (req, res) => {
  newArticle.save() ;
  let data_article = await Article.find() ; 
  console.log(data_article);
  res.send("berhasil") ; 
}) ;

app.get('/blog', async (req, res) => {
  let data_article = await Article.find() ; 
  let data_sliced = pagination(req.query.page,4,data_article) ;
  let data_pagination = getPageRange(req.query.page, data_article.length, 4) ; 
  console.log(data_sliced);
  res.render('blog', {data_sliced,data_pagination,page : req.query.page, totalPages : Math.ceil(data_article.length / 4)})  ;
}) ;
app.get('/division', async (req, res) => {
  res.render('division')  ;
});


app.get('/dashboard_admin', async (req, res) => {
  let data_article = await Article.find() ; 
  let data_sliced = pagination(req.query.page,8,data_article) ; 
  let data_pagination = getPageRange(req.query.page, data_article.length, 8) ; 

  console.log(data_sliced);
  res.render('dashboard_admin', {data_sliced, page : req.query.page, pagination : data_pagination , data_length : data_article.length})  ;
});


app.get('/details_article', async (req, res) => {
  newArticle.save().then(() => console.log('Artikel berhasil disimpan'))
  .catch(err => console.error('Gagal menyimpan artikel:', err));
  res.render('details_article')  ;
});


app.get('/login', async (req, res) => {
  res.render('login')  ;
});
app.post('/login', async (req, res) => {
  
  res.send(req.body.password)  ;
});





app.get('/article', async (req, res) => {
  
  res.render('article')  ;
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
