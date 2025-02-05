$(function(){
	var splitElem = $(".split");
	var textSplit = splitElem.text().split("");
	splitElem.empty();
	$.each(textSplit, function(i, v) {
		splitElem.append(
			'<span>'+v+'</span>'
		);
	});
	$("header").hide();
	setTimeout(function() { 
		$("header").show();
		tl.staggerFromTo($("header"), 1, {opacity:0}, {opacity: 1, ease: Power1.easeInOut});
	}, 700);
	
	function resetHeight(){
		$('.main_visual').css('height', $(window).innerHeight());
		$('.main_visual .cover_height').css('height', $(window).innerHeight());
	}
	window.addEventListener("resize", resetHeight);
	resetHeight();


	tl.staggerFromTo($(".main_visual .sec_title_g .title1 span"), 1, {opacity:0,y:'100%'}, {opacity: 1,y:'0%', ease: Power1.easeInOut},0.05);

	
	if($(window).width() <= 1279){
		$('.instagram_feed').slick({
			speed: 700,
			slidesToShow: 1,
			variableWidth: true,
			infinite: false,
			arrows: false,
			touchMove:true,
			swipe:true,
		});
	}

	$(window).on('resize', _.debounce(function() {
		if($(window).width() <= 1279){
			$('.instagram_feed').slick({
				speed: 700,
				slidesToShow: 1,
				variableWidth: true,
				infinite: false,
				arrows: false,
				touchMove:true,
				swipe:true,
			});
		}else{
			$('.instagram_feed').slick('unslick');
		}
	}, 0));



});