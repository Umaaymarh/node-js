const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./model/blogSchema');
// express app
const app = express();

const db = 'mongodb+srv://Umaima:auwalhajara@cluster0.qbt0pxi.mongodb.net/Node?retryWrites=true&w=majority'

mongoose.connect(db,{useNewUrlparser:true, UseUnifiedTopology:
true}).then((result) =>{
    console.group('listen to port @ 8080');
    app.listen(8080);
}).catch((err) =>console.log(err))

// app.listen(8080);

app.set('view engine', 'ejs');

//== use of morgan==//
app.use(morgan('dev'))
 
// static file
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))

app.use((req,res,next)=>{
    console.log('host:', req.hostname);
    next();
})
app.use((req,res,next)=>{
    console.log('morgan');
    next();
})
app.use((req,res,next)=>{
    console.log(res.locals.path = req.path)
    next()
})
//==end of use of morgan middleware==//

 /////////testing db
 app.get('/add-blog', (req, res) =>{
    const blog = new Blog({
        title: 'new blog 3',
        Snippet: 'About new blog',
        body: 'More about new blog'
    })
    blog.save().then(result =>{
        res.send(result)
    })
    .catch(err =>{
        console.log(err)
    })
 });

 app.get('/all-blogs',(req,res) =>{
    Blog.find().then(result =>{
        res.send(result);
    }).catch(err =>{
        console.log(err);
    })
 });
app.get('/single-blog', (req,res) => {
    Blog.findById('655282b1f097e5ed5394df99')
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    }); 
})


////////////////===========////////////
app.get('/', (req,res) => {
    res.redirect('/blogs');
})
app.get('/about', (req,res)=>{
    res.render('about', {title: 'about'})
})
app.get('/blogs/create', (req,res) =>{
res.render('create',{title: 'Create new blog'})
});
app.get('/blogs', (req,res) =>{
    Blog.find().then(result => {
        res.render('index',{blogs: result, title: 'All blogs'})
    }).catch(err => {
        console.log(err)
    })
});
// form
app.post('/blogs', (req,res) =>{
    console.log(req.body);
// const {title} = req.body
    const blog = new Blog(req.body)
    blog.save().then(result =>{
        res.redirect('/blogs')
    }).catch(err => {
        console.log(err);
    })
});
app.get('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findById(id).then(result => {
        res.render('detail',{blog: result, title: 'Blog Detail'});


    }).catch(err => {
            console.log(err);
        });
})
// delete
app.delete('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id).then(result => res.json({redirect: '/blogs'})).catch(err => {
        console.log(err)
    })
})
// app.get('/',(req,res)=>{
//     const blogs = [
//         {title: 'Nodejs class', snippet: 'this is nodejs class'},
//         {title: 'Nodejs Hiit', snippet: 'this is nodejs class'},
//         {title: 'Nodejs developers', snippet: 'this is nodejs class'}
//     ];
//     res.render('index', {title: 'Home', blogs})
// })

// app.get('/about', (req,res)=>{
//     res.render('about', {title: 'about'})
// })

// app.get('/blogs/create', (req,res)=>{
//     res.render('create', {title: 'create new blog'})
// })

// app.get('/blogs/contact', (req,res)=>{
//     res.render('contact', {title: 'contact page'})
// })

// app.get('/blogs/login',(req,res)=>{
//     res.render('login', {title: 'login page'})
// })

app.use((req,res)=>{
    res.status(404).render('404', {title: 'Page not found'})
 })





// app.get('/',(req,res)=>{
//     res.sendFile('./views/homepage.html',{ root: __dirname})

// })

// app.get('/about',(req,res)=>{
//     res.sendFile('./views/about.html', { root: __dirname})
// })

// app.get('/about-us', (req,res)=>{
//     res.redirect('./views/about.html', {root: __dirname});
// })

// app.get('*', (req,res)=>{
//     res.send('<p>page not found</p>');
// })

// app.use((req,res)=>{
//     res.sendFile('./views/404.html', {root: __dirname})
// })

