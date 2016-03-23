$( document ).ready(function() {

	$(".bookPage .info .stars .totalCount").on('click', function(){
		$(this).children().toggle();
	});

	$(".main .pagination .disabled a").on('click', function(e){
		e.preventDefault();
	});

	if( $("#bukker").length ){

		$("#bukker .sub").on('click', function(e){
			e.preventDefault();
			var selected = $(".visible").removeClass("visible");
			if ( $(selected).next().addClass("visible").length == 0 ){
				$(selected).siblings().first().addClass("visible");
				console.log( $(selected).next().addClass("visible").length );
			}
		});

	}
	//Cookies.set('sorting', 'test');

	tinymce.init({
		selector: '#newsContent',
		height: 500,
		theme: 'modern',
		plugins: [
			'advlist autolink lists link image charmap print preview hr anchor pagebreak',
			'searchreplace wordcount visualblocks visualchars code fullscreen',
			'insertdatetime media nonbreaking save table contextmenu directionality',
			'emoticons template paste textcolor colorpicker textpattern imagetools'
		],
		toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
		toolbar2: 'print preview media | forecolor backcolor emoticons',
		image_advtab: true,
		templates: [
			{ title: 'Test template 1', content: 'Test 1' },
			{ title: 'Test template 2', content: 'Test 2' }
		],
		content_css: [
			'//fast.fonts.net/cssapi/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
			'//www.tinymce.com/css/codepen.min.css'
		]
	});
});


(function ($) {
	'use strict';

	if( window.location.hash === '#exist' ){
		alert('Уже есть в базе.')
	}
	if( window.location.hash === '#eroor' ){
		alert('Произошла ошибка.')
	}


	$(".ganre > a").on('click', function(e){
		e.preventDefault();
		$(this).parent().toggleClass("active");
	});


	//rating UI part
	$(".ratingBox").each(function(){
		var $emptyStars = '<div class="no-rate"><i class="ion-android-star-outline"></i><i class="ion-android-star-outline"></i><i class="ion-android-star-outline"></i><i class="ion-android-star-outline"></i><i class="ion-android-star-outline"></i></div>',
			$star = '<i class="ion-android-star"></i>',
			$starHalf = '<i class="ion-android-star-half"></i>',
			$starEmpty = '<i class="ion-android-star-outline"></i>';

		//find generated meta tags
		var	title = $(this).children().attr("ratingtitle"),
			scale = $(this).children().next().attr("ratingscale"),
			value = $(this).children().next().next().attr("ratingvalue"),
			count = $(this).children().next().next().next().attr("ratingcount");

		if(!title || title == "") {
			return $(this).html($emptyStars);
		}

		if(!value || value == "") {
			return $(this).html($emptyStars);
		}
		// 5 - rate scale
		if(scale == 5){
			var TotalCount = parseInt(count);// console.log( TotalCount ); // всего голосов
			var decimial = parseFloat(value) - parseInt(value); //console.log( decimial ); // остаток
			var fullStars = parseInt(value); //console.log( fullStars ); // целая часть
			var $dom = "";
			var step = 0;

			for (var i= 0; i < fullStars; i++){
				$dom = $dom + $star;
				step++;
			}

			if(decimial > 0.19){
				$dom = $dom + $starHalf;
				step++;
			}

			if(step < scale) {
				while(step!=scale){
					$dom = $dom + $starEmpty;
					step++;
				}
			}
		}
		// 10 - rate scale
		if(scale == 10){

		}
		var $end = "<span class='count'>"+value+"</span><span class='totalCount arrow_box'>"+ TotalCount+" <span style='display: none'> оценок от <strong>"+title+"</strong></span></span>";
		//update html
		$(this).html($dom + $end);
	});


	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-75411734-1', 'auto');
	ga('send', 'pageview');


}($));