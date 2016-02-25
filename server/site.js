var express    = require('express'),
	router     = express.Router(),
	bodyparser = require('body-parser'),
	nodemailer = require('nodemailer'),
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
	var db = req.db;
	var collection = db.get('books');
	collection.find({},{},function(err, books){
		if (err) throw err;
		res.render('home', res.locals.template_data = {
			layout: 'main',
			meta_title: 'Bukker2',
			book: books
		});
		//res.json(docs);
	});
});

router.use(bodyparser.urlencoded({
	extended: false
}));

router.post('/', upload.single('cover'), function(req, res) {
	var db = req.db,
		title = req.body.title,
		description = req.body.description,
		author = req.body.author;
		console.log(req.file.filename);
		books = db.get('books');
	books.insert({
		'title' : title,
		'description' : description,
		'author' : author,
		'cover' : req.file.filename
	}, function (error, curent) {
		if (error) {
			res.send("Could not create new book.");
		} else {
			res.location('/');
			res.redirect('/');
		}

	});
});




module.exports = router;
