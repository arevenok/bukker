﻿var express    = require('express'),
	router     = express.Router(),
	getSlug = require('speakingurl'),
	request = require('request'),
	cheerio = require('cheerio');

// litres  parser
router.get('/litres-ganres', function (req, res) {
	var db = req.db,
		ganres = db.get('ganres');

	url = 'http://www.litres.ru/zhanry/';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var ganre = {
				title:"",
				url:"",
				subGanres:{}
			};


			$('#genres_tree > li').each(function(i, elem) {
				ganre.title = $(this).find('.title').text();
				ganre.url = getSlug( ganre.title );
				$ul = $(this).find('ul');

				var subGanres = {};
				$( $ul ).each(function(i, elem) {
					var slug = getSlug( $(this).text() );
					subGanres[slug] = $(this).text();
				});

			});

			console.log(ganre);



			//ganres.url = getSlug(book.title);

			/* adding to DB
			ganres.insert({
				ganres: ganre
			}, function (error, curent) {
				if (error) {
					res.redirect(req.get('referer')+'#eroor');
				} else {
					res.location('/');
					res.redirect('/');
				}

			});//end insert to database

			 */

		}
	})
});


module.exports = router;
