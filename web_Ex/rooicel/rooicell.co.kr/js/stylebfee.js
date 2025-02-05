$(function(){
	pageLayoutStyle1();
	
	tl.staggerFromTo($(".location_wrap"), 1, {opacity:0,y:'0%'}, {opacity: 1,y:'0%', delay:0.7, ease: Power1.easeInOut});
	$('.location_wrap .btn').on('click', function(){
		$(this).toggleClass('on');
		$(this).next('.location_list').stop().slideToggle(450);
		if($(this).hasClass('on')){
			tl.staggerFromTo($(".location_list li"), 1, {opacity:0,y:'0%'}, {opacity: 1,y:'0%', ease: Power1.easeInOut},0.1);
		}
	});


	$.each($("#subtop #page_title div"), function(i, v){
		var mainText = $(this);
		var animatedMainT = $(this).text().split("");

		mainText.empty();
		$.each(animatedMainT, function(i, v) {
			mainText.append($("<span>").text(v));
		});
	});

	tl.staggerFromTo($("#subtop #page_title div span"), 0.8, {opacity:0,y:'120%'}, {opacity: 1,y:'0%', delay:0.2, ease: Power1.easeInOut},0.05);
	tl.staggerFromTo($("#subtop .sub_bg .img"), 2.5, {scale:1.2}, {scale: 1, ease: Power1.easeOut});
});

function pageLayoutStyle1(){

	if(!$('#main').hasClass('page_layout_style1')) return;
	var productSlider = new Swiper('.product_slider', {
		grabCursor: true,
		speed: 700,
		slidesPerView: 'auto',
		centeredSlides:false,
		loop:false,
		scrollbar: {
			el: '.product_slider .swiper-scrollbar',
			hide: false,
			draggable: true,
		},
		draggable:false,
		mousewheel: false,
		breakpoints: {
			1279: {
				slidesPerView: 'auto',
			},
		},
	});
	

}