!function(a,b){"use strict";var c=function(a,b){if(!b)return a;var c;return function(){clearTimeout(c),c=setTimeout(function(){a()},b)}};a.fn.imgLazyLoad=function(d){var e=this,f=a.extend({container:b,effect:"fadeIn",speed:600,delay:400,callback:function(){}},d),g=a(f.container),h=function(){if(!e.length)return g.off("scroll.lazyLoad");var c=g.outerHeight(),d=g.scrollTop();f.container!==b&&(d=g.offset().top),e.each(function(){var b,g=a(this),h=g.offset().top;d+c>h&&h+g.outerHeight()>d&&(e=e.not(g),b=g.attr("data-src"),a(new Image).prop("src",b).load(function(){g.hide().attr("src",b)[f.effect](f.speed,function(){f.callback.call(this)}).removeAttr("data-src")}))})};if(!g.length)throw f.container+" is not defined";return h(),g.on("scroll.imgLazyLoad",c(h,f.delay)),this}}(jQuery,window);
$('.movie-item img').imgLazyLoad({container:window,effect:'fadeIn',speed:600,delay:400,callback:function(){}});
$(document).ready(function() {
        $("#server1").click(function() {
            $('span.default-srv').removeClass('default-srv');
            $('#server1').addClass('default-srv');
        });
        $("#server2").click(function() {
            $('span.default-srv').removeClass('default-srv');
            $('#server2').addClass('default-srv');
        });
    });
    $(window).on("load", function() {
        play(1);
    });
    function play(sv) {
        const videoDiv = document.getElementById('video-player');
        const dataid = videoDiv.dataset.id;
        $.post("/", {
                sv: sv,
                video_id: dataid
            },
            function(data, status) {
                $("#video-player").attr("src", data);
            });
    }