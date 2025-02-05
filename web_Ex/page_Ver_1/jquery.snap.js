$.fn.snap = function(){
    var passiveSupported=!1;try{var options={get passive(){passiveSupported=!0}};window.addEventListener("test",options,options),window.removeEventListener("test",options,options)}catch(t){passiveSupported=!1};
    if(passiveSupported === true){
        document.addEventListener("wheel", onWheel, {passive:false});
    }
    document.addEventListener("mousewheel", onWheel);
    var currentIndex = 0,
        isSliding = false,
        isEnabled = true;
    var _window = $(window),
        body = $("body"),
        snap = this,
        container = snap.find(".snap-container"),
        sections = container.find(".snap-section"),
        currentSection = sections.eq(currentIndex);
    sections.each(function(i){
        if(passiveSupported === true){
            this.addEventListener("wheel", onSectionWheel, {passive:false});
        }
        this.addEventListener("mousewheel", onSectionWheel);
        this.addEventListener("touchstart", onSectionWheel);
    });
    function onSectionWheel(e){
        if(isSliding === true || currentSection[0] !== e.currentTarget){
            e.preventDefault();
        }
    }
    var timer;
    function transitionend(){
        isSliding = false;
        container.css("transition", "");
        snap.trigger("snapEnd", [currentIndex, currentSection]);
    }
    function onWheel(e){
        var delta = e.wheelDelta / 120 * -1 || e.deltaY / 3;
        snap.trigger('directionChange', delta);
        checkScrollArea(delta);
    }
    function checkScrollArea(delta){
        if(body.hasClass("no-transition") === true)
            return false;
        if(isSliding === true || isEnabled === false)
            return false;
        if(currentSection.scrollTop() === 0 && currentSection.prop("scrollHeight") <= currentSection.outerHeight() || window.getComputedStyle(currentSection[0])["overflow-y"] === "hidden"){
            if(delta <= -.48) slideUp();
            else if(delta >= .48) slideDown();
        }else{
            var triggerTop = currentSection.scrollTop() * window.devicePixelRatio,
                edgeBottom = (currentSection.prop("scrollHeight") - currentSection.outerHeight()) * window.devicePixelRatio;
            if(Math.abs(edgeBottom - triggerTop) <= 4){
                edgeBottom = triggerTop;
            }
            // window.$debuger.text(triggerTop + '/' + edgeBottom);
            if(currentSection.scrollTop() <= 0 && delta <= -.48){ // 경계 상단
                slideUp();
            }else if(triggerTop >= edgeBottom && delta >= .48){
                slideDown();
            }
        }
    }
    function slideTo(index, transition){
        var posY = 0;
        sections.each(function(i){
            if(i < index){
                posY += ($(this).outerHeight() * -1);
            }
        });
        if((index === (sections.length - 1)) && (sections.eq(index).outerHeight() < _window.height())){
            posY += _window.height() - sections.eq(index).outerHeight();
        }
        var currentPosY = Number(window.getComputedStyle(container[0]).transform.replace(/(matrix\(|\))/gi, "").split(",").pop());
        if(posY === currentPosY){
            return false;
        }
        isSliding = true;
        if(transition === false){
            container.css("transition", "none");
        }
        currentSection = sections.eq(index);
        currentIndex = index;
        snap.trigger("snapStart", [currentIndex, currentSection]);
        clearTimeout(timer);
        timer = setTimeout(transitionend, parseInt(container.css("transition-duration")) * 1000);
        container.css("transform", "translateY(" + posY + "px)");
    }
    function slideUp(){
        if(currentIndex - 1 >= 0) slideTo(--currentIndex);
    }
    function slideDown(){
        if(currentIndex + 1 < sections.length) slideTo(++currentIndex);
    }
    var pos = {
        start:0,
        distance:0
    }
    snap.
        on("touchstart", onSwipeStart);
    function onSwipeStart(e){
        if(isSliding === true)
            return false;
        e = e.originalEvent;
        pos.start = e.touches[0].pageY;
        snap.
            on("touchmove", onSwipe).
            on("touchend", onSwipeStop);
    }
    function onSwipe(e){
        e = e.originalEvent;
        pos.distance = e.touches[0].pageY - pos.start;
    }
    function onSwipeStop(e){
        snap.
            off("touchmove", onSwipe).
            off("touchend", onSwipeStop);
        if(pos.distance > 128){
            snap.trigger('directionChange', -1);
            checkScrollArea(-1);
        }else if(pos.distance < -128){
            snap.trigger('directionChange', 1);
            checkScrollArea(1);
        }
    }
    _window.resize(function(e){
        slideTo(currentIndex, false);
    });
    $.fn.extend(snap, {
        enabled:function(){
            isEnabled = true;
        },
        disabled:function(){
            isEnabled = false;
        },
        isSliding:function(){
            return isSliding;
        },
        getSection:function(index){
            return sections.eq(index);
        },
        getCurrentIndex:function(){
            return currentIndex;
        },
        slideTo:function(index){
            slideTo(index, true);
        }
    });
    return snap;
}

// $(function(){
//     window.$debuger = $("<div style=\"position:fixed;top:8px;left:8px;z-index:9999;padding:8px 8px;background-color:rgba(0, 0, 0, .6);color:#fff;font-size:12px;font-weight:700;\">debuger</div>");
//     $("body").append(window.$debuger);
// });
