

$(document).on('click', 'a[href="#none"]', function(e) {
	e.preventDefault();
});

//기본js
function startJs(){

	$(document).on('click', 'a[href="#none"]', function(e) {e.preventDefault()});

	if($('html').is('.ie67, .ie7, .ie8, .ie9')) {
		$('div.ie_alert_text').show().html('현재 사이트는 IE9 미만의 하위브라우저를 지원하지 않습니다. <br />브라우저를 최신 버전으로 <b>업데이트</b>해 주세요.');
	}

	WebFont.load({google: {families: ['Noto Sans KR', 'Montserrat']}});
	
	//모바일구분
	$(window).resize(function(){
		windowWidth = $(window).width();
		if(windowWidth < 1279){
			$('body').removeClass('pc');
			$('#wrap').removeClass('pc');
			$('#wrap').addClass('mobile');
		}else{
			$('body').addClass('pc');
			$('#wrap').addClass('pc');
			$('#wrap').removeClass('mobile');
		}
	}).resize();

	function resetHeight(){
		$('#scroll_wrap').css('height', $(window).innerHeight());
	}
	window.addEventListener("resize", resetHeight);
	resetHeight();
}

function popup() {

	//레이어팝업
	var bg = $("#bg");

	$(document).on('click',' #bg, .close ', function () {
		bg.fadeOut();
		$('div[id*="-popup"] div.inner').html('');
		$('div[id*="-popup"]').hide();
	});

	$(document).on('click','.layer-',
		function () {
		var ClassName = $(this).data('link');

		bg.show();
		$('#layer-popup').show();
		$('#layer-popup').html(
			'<div class="popup-close">'+
			'<img src="/img/common/popup_close_icon.png" alt="close" class="close"></div>'+
			'<div class="inner">'+
			'</div>'
		);

		//foot 메뉴 클릭시
		switch (ClassName) {
			case "privacy1":
				$("#layer-popup div.inner").load("/_privacy1.php");
			break;
			case "terms":
				$("#layer-popup div.inner").load("/_terms.php");
			break;
		}

	}); //click

}



function custom_cursor(){


	var $cursor_primary = $('#custom_cursor');
	var $circle = $cursor_primary.find('.custom_cursor_circle');

	$('body').mousemove(function(e) {
		tl.to($cursor_primary, 0.7, {opacity:1, x: e.clientX,y: e.clientY,ease: Power3.easeOut});
	});



	$(document).on('mouseenter', '.custom_mousemove', function(){
		$(this).addClass('move_on');
		var $this = $(this);
		var words = ( $this.data('hover') != undefined ) ? $this.data('hover') : '';
		var size = ( $this.data('size') != undefined ) ? $this.data('size') : '100%';

		if( $this.hasClass('small_h') ){
			$cursor_primary.addClass('small');
		}else{
			$cursor_primary.removeClass('small');
		}
		tl.killTweensOf($circle);
		tl.to($circle, .3, {width: size,height: size,autoAlpha: 1,ease: Power0.easeNone});
	});

	$(document).on('mouseleave', '.custom_mousemove', function(){
		var $this = $(this);
		tl.killTweensOf($circle);
		tl.to($circle, .2, {width: '15px',height: '15px',ease: Power0.easeNone});
		$(this).removeClass('move_on');
	});

	

	$('.follow_btn').each(function(){
		var $this = $(this);
		var $pointer = $this.find('.i');
		var pointer_size = ( $this.data('size') != undefined ) ? $this.data('size') : parseInt($this.width());
		var $pointer_extend = null;
		if( $this.find('.follow').length > 0 ) {
			$pointer_extend = $this.find('.follow');
		}
		$this.on({
			mouseenter: function(){
				$this.bind('mousemove', function(e){
					var center_x = $pointer.offset().left + $pointer.width()/10;
					var center_y = $pointer.offset().top + $pointer.height()/10;
					var tween_x = e.pageX - center_x;
					var tween_y = e.pageY - center_y;
					if( $pointer_extend != null ) {
						tl.to($pointer_extend, .3, {x: tween_x / 5.0,y: tween_y /5.0,ease: Power3.easeOut});
					}
				});
			},
			mouseleave: function(){
				if( $pointer_extend != null ) {
					tl.to($pointer_extend, .2, {x: 0,y: 0,ease: Power0.easeNone});
				}

				$this.unbind('mousemove');
			}
		});
	});
	
}


function allMenuJs(){
	$('#allmenu .all_gnb_wrap .all_gnb .menu .sub_menu > li a').addClass('custom_mousemove small_h');
	var $navStatus = 0;
	$(document).on("click","header .hamburger_btn",function(){
		if($navStatus == 0) {
			$navStatus = 1;
			$('body').stop().addClass('menu_open');
			$("#allmenu").stop().fadeIn(500);
			var ClassName = $('body').attr('class');
			if(ClassName == ClassName) {
				tl.staggerFromTo($("#allmenu .menu_bg .bg"), 1, {scale:1.1,rotate:'-5deg', x:'-20px', y:'50px',opacity:0}, { scale:1, rotate:'0deg', x:'0px', y:'0px', opacity: 1,ease: Power1.easeOut});
				tl.staggerFromTo($("#allmenu .menu_bg .i"), 1, {scale:1.1,rotate:'5deg', x:'20px', y:'-50px',opacity:0}, { scale:1, rotate:'0deg', x:'0px', y:'0px', opacity: 1,ease: Power1.easeOut});
				tl.staggerFromTo($("#allmenu .slogan"), 1, {opacity:0}, {opacity: 1,delay:0.7, ease: Power1.easeInOut});
				tl.staggerFromTo($("#allmenu .all_gnb_wrap .all_gnb .menu"), 0.7, {opacity:0,y:'50%'}, {opacity: 1,y:'0%', ease: Power1.easeInOut},0.1);
			}else{
				$navStatus = 0;
			}
		}
	});
	
	$(document).on("click","#allmenu .close",function(){
		$navStatus = 0;
		$('body').stop().removeClass('menu_open');
		$("#allmenu").stop().hide();
	});
	

}


function menuJs(){
	$("#nav>ul>li").mouseenter(function(){
		var menuNum = $(this).index()+1;
		if(menuNum === menuNum){
			$('header').addClass('dark on');
			$('header h1.logo').addClass('dark');
			$(".lnb").stop().hide().removeClass('on');
			$(".lnb.sub"+menuNum+"").stop().show();
			tl.staggerFromTo($(".lnb.sub"+menuNum+" .dep2"), 0.5, {opacity:0, x:'10px'}, {opacity: 1,x:'0%', delay:0.1, ease: Power1.easeInOut});
		}else{
			$(".lnb").stop().hide();
		}
	});
	$("#nav").mouseleave(function(){
		$(".lnb").stop().hide();
		$('header h1.logo').removeClass('dark');
		if($('header').hasClass('fix_style')){
			$('header').removeClass('on');
		}else{
			$('header').removeClass('dark on');
		}
	});
	//언어선택 셀렉박스
	$(document).on("click","header .language > button",function(){
		$(this).parent(".language").toggleClass("open");
		if($(this).parent(".language").hasClass("open")){
			$(".language").find("ul").stop().slideDown(500);
		}else{
			$(".language").find("ul").stop().slideUp(300);
		}
	});
	$("header .language ul").mouseleave(function(){
		$("header .language").removeClass("open");
		$(this).stop().slideUp(300);
	});
}


$(function(){
	tl = TweenMax;
	startJs();
	popup();
	allMenuJs();
	menuJs();
	custom_cursor();
});
