$(function() {
    window.lenis = new Lenis({
        autoRaf: true
    });

    function clockUpdate() {
        var hh = (new Date()).getHours().toString().padStart(2, '0'),
            mm = (new Date()).getMinutes().toString().padStart(2, '0');
        $('#header .clock .hh').text(hh);
        $('#header .clock .mm').text(mm);
    }
    clockUpdate();
    setInterval(clockUpdate, 1000);

    var $window = $(window),
        $document = $(document),
        $sidebar = $('#sidebar');

    var scrollDelayTimer;

    $window.on('mousemove', function(e) {
        $('.cursor').css('transform', 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)')
    });

    $('.sidebar-open').on('click', function(e) {
        $sidebar.addClass('is-visible');
    });
    $('.sidebar-close').on('click', function(e) {
        $sidebar.removeClass('is-visible');
    });

    $window.on('scroll', function(e) {
        $('.brief-quick-mo').addClass('is-hidden');
        clearTimeout(scrollDelayTimer);
        scrollDelayTimer = setTimeout(function() {
            $('.brief-quick-mo').removeClass('is-hidden');
        }, 400);
    });

    $document.on('mouseenter', '.input-text input, .input-textarea textarea', function(e) {
        var $wrapper = $(this).parent();
        $wrapper.addClass('is-hover');
    });
    $document.on('mouseleave', '.input-text input, .input-textarea textarea', function(e) {
        var $wrapper = $(this).parent();
        $wrapper.removeClass('is-hover');
    });
    $document.on('focus', '.input-text input, .input-textarea textarea', function(e) {
        var $wrapper = $(this).parent();
        $wrapper.addClass('is-focus');
    });
    $document.on('blur', '.input-text input, .input-textarea textarea', function(e) {
        var $wrapper = $(this).parent();
        $wrapper.removeClass('is-focus');
    });
    $document.on('keypress keydown keyup', '.input-text input, .input-textarea textarea', function(e) {
        var $wrapper = $(this).parent(),
            $input = $(this);
        if ($input.val() !== '') {
            $wrapper.addClass('is-fill');
        } else {
            $wrapper.removeClass('is-fill');
        }
    });
    $('.autoresize').autoResize();
    $('.input-select select').selectric({
        maxHeight: 180,
        nativeOnMobile: false,
        arrowButtonMarkup: '<b class="button"></button>'
    });

    $document.on('click', '.modal-open', function(e) {
        var target = $($(this).attr('href'));
        target.addClass('is-visible');
        return false;
    });
    $document.on('click', '.modal-close', function(e) {
        $(this).closest('.modal').removeClass('is-visible');
    });

    AOS.init({
        duration: 800
    });

    setTimeout(function() {
        $(".loader").remove();
    }, 1000);
});