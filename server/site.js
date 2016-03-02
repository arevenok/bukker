﻿var express    = require('express'),
	router     = express.Router(),
	bodyparser = require('body-parser'),
	nodemailer = require('nodemailer'),
	getSlug = require('speakingurl'),
	multer = require('multer'),
	mime = require('mime'),
	upload = multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, 'covers');
			},
			filename: function (req, file, cb) {
				cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
			}
		})
	});

// Home page.
/*
router.get('/', function (req, res) {
	res.render('home', res.locals.template_data);
});
*/

/* GET BOOKS list. */
router.get('/', function(req, res) {
	var db = req.db,
		collection = db.get('books');

	collection.find({},{},function(err, books){
		if (err) throw err;
		res.render('home', res.locals.template_data = {
			layout: 'main',
			meta_title: 'Буккер',
			book: books
		});
		//res.json(books);
	});
});

/* GET BOOK by url slug */
router.get('/book/:url', function(req, res) {
	var db = req.db,
		url = req.params.url,
		collection = db.get('books');

	collection.findOne({ url: url }, function (err, book) {
		if (err) { /* handle err */ }

		if (book) {
			 /*res.render('home', res.locals.template_data = {
				 layout: 'main',
				 meta_title: 'Буккер',
				 book: book
			 });*/
			res.json(book);
		} else {
			res.status(404);
		}

	});
});

/* ADD BOOK */
router.get('/addbook', function (req, res) {
	res.render('addbook', res.locals.template_data = {
		layout: 'main',
		meta_title: 'Добавление книги в Буккер'
	});
});


router.use(bodyparser.urlencoded({
	extended: false
}));


router.post('/addbook', upload.single('cover'), function(req, res) {
	var db = req.db,
		books = db.get('books');
		//validation
		title = req.body.title,
		description = req.body.description,
		author = req.body.author,
		year = parseInt(req.body.year),
		ganre = req.body.ganre,
		url = getSlug(title),
		cover = 'default.png';
		if(req.file){
			cover = req.file.filename
		}
	//books.index('url', { unique: true });
	//insert to database
	books.insert({
		'title' : title,
		'description' : description,
		'author' : author,
		'year': year,
		'ganre': ganre,
		'date': new Date(),
		'cover' : cover,
		'url' : url
	}, function (error, curent) {
		if (error) {
			res.send("Could not create new book.");
		} else {
			console.log("Inserted");
			res.location('/');
			res.redirect('/');
		}

	});
});




module.exports = router;
