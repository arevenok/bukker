﻿var express    = require('express'),
	router     = express.Router(),
	getSlug = require('speakingurl'),
	request = require('request'),
	fs = require('fs'),
	basic_auth = require('basic-auth'),
	path = require('path'),
	cheerio = require('cheerio');


// litres parser
router.get('/litres', function (req, res, next) {
	var user = basic_auth(req);
	if (!user || !user.name || !user.pass)
		return req.app.locals.unauthorized(res);

	if (user.name != 'nick' && user.pass != 'nick')
		return req.app.locals.unauthorized(res);



	var db = req.db,
		books = db.get('books');

	//url = req.params.url;
	url = 'http://www.litres.ru/artem-kamenistyy/chuzhih-gor-plenniki/';

	//function to download cover
	var download = function(uri, filename, callback){
		request.head(uri, function(err, res, body){
			console.log('content-type:', res.headers['content-type']);
			console.log('content-length:', res.headers['content-length']);

			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	};

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var litresRefID = "156223639";

			var book = {
				title:"",
				description:"",
				year:"",
				authors:[""],
				ganres:[""],
				tags:[""],
				date:"",
				cover:"",
				litresid:"",
				url:""
			};

			book.title = $('#main-div .book-title').text();
			book.description = $('#main-div .book_annotation').text();
			book.year = $('#main-div dd[itemprop=datePublished]').text();

			//authors get all
			var authors = [];
			$('#main-div .book-author a').each(function(i, elem) {
				authors[i] = $(this).text();
			});
			book.authors = authors.join(', ');

			//ganres get all
			var ganres = [];
			$('#main-div dd a[itemprop=genre]').each(function(i, elem) {
				ganres[i] = $(this).text();
			});
			book.ganres = ganres.join(', ');

			//tags get all
			var tags = [];
			$('#main-div dd:nth-child(6)').each(function(i, elem) {
				tags[i] = $(this).text();
			});
			book.tags = tags.join(', ');

			var cover = $('#main-div .bookpage-cover img:nth-child(2)').attr("src");
			var newName = 'cover-' + Date.now() + path.extname(cover);
			download(cover, 'covers/'+newName, function(){
				console.log('done');
			});
			book.cover = newName;

			var litresid = $('link[rel=shortlink]').attr("href");
			book.litresid = litresid.slice(21);

			book.url = getSlug(book.title);

			/* adding to DB */

			books.insert({
				'title' : book.title,
				'description' : book.description,
				'year': book.year,
				'authors' : book.authors.split(','),
				'ganres': book.ganres.split(','),
				'tags': book.tags.split(','),
				'date': new Date(),
				'cover' : book.cover,
				'litresid' : book.litresid,
				'url' : book.url
			}, function (error, curent) {
				if (error) {
					res.send("Could not create new book.");
				} else {
					console.log("Inserted");
					//res.location('/');
					//res.redirect('/');
				}

			});

			console.log(book);
			next();

		}
	})
});


module.exports = router;
