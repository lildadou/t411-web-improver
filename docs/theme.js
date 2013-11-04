/**
 * Torrent411 Ready script
 */
function Smilies(Smilie)
{
    document.getElementById('inputtext').value += Smilie + " ";
    document.getElementById('inputtext').focus();
}

/**
 * enable/disable chat
 * @param data
 * @constructor
 */
function Chat(data)
{
    if (data.enable == 'on') {
        var shoutbox = $('<iframe name="shout_frame" src="http://www.t411.me/chati/" frameborder="0" width="100%" height="580px" scrolling="no" align="middle"></iframe>');

        $('#shoutbox').append(shoutbox);
        $('#shoutbox h2 a.shoutboxlink').show();
        $('#shoutbox p').hide();
    } else {
        $('#shoutbox iframe').remove();
        $('#shoutbox h2 a.shoutboxlink').hide();
        $('#shoutbox p').show();
    }
}

var limitMargin = 0;
var overlay;

/**
 * Update ratio logic
 * @param response
 */
function updateRatio(response) {

    $('.loginBar .up').html('&uarr; ' + response.data.up);
    $('.loginBar .down').html('&darr; ' + response.data.down);
    $('.loginBar .rate').html(response.data.rate);
}

function overlayShow() {
    if (overlay) {
        overlay.load();
    } else {
        overlay = $('#info').overlay({
            top: 160,
            target:'#info',
            effect: 'apple',
            api:true
        });

        overlay.load();
    }
}

function overlayIframe (name, address)
{
//    console.log(address);
    var content = '<iframe name="'+name+'" src="'+address+'" frameborder="0" width="100%" height="486px" scrolling="no" align="middle"></iframe>';
    $('#info').find('.inner').html(content);
    overlayShow();
}

//window.postMessage = true;
//
//$(window).bind('message', function(msg){
//    console.log(msg);
//});


(function($, undefined) {
    $(document).ready(function(){
        // Lavamenu
        if ($("#lavamenu ul").length > 0) {
            $('#lavamenu > li li').addClass("noLava");
        }

        $("#lavamenu li > a").hover(function(){
            $(this).attr('title', '');
        });

        if (window.location.pathname != '/') {
            var path = window.location.pathname.replace(/\//g,'\\/');
            path = path.replace(/\./g,'\\.');

            try {
                var selected = $("#lavamenu li ul:has(a[href^="+ path +"])");

                if (selected.length > 0 ) {
                    selected.parent().addClass('selectedLava');
                }
            } catch (err) {
                // nothing for bad URLs
            }

        }


        // enable lavalamp
        $("#lavamenu").lavaLamp({fx: "easeInOutQuad", speed: 400});

        // menu drop-down
        if ($("#lavamenu ul").length > 0) {
            var menuTo;
            $("#lavamenu li:has(ul)").hover(function(){
                var $ul = $(this).children('ul');

                if (menuTo) clearTimeout(menuTo);

                menuTo = setTimeout(function(){
                    $ul
                        .stop(true,true)
                        .show('slow');
                }, 400);
            }, function(){
                if (menuTo) clearTimeout(menuTo);
                $(this)
                    .children('ul')
                    .hide('fast')
                ;
            });
        }

        // Search autocomplete
        var cache = {},
            lastXhr;
        $('#bar-search .searchInput, #search-query').autocomplete({
            minLength: 3,
            source: function( request, response ) {
                var term = request.term;
                if ( term in cache ) {
                    response( cache[ term ] );
                    return;
                }

                lastXhr = $.getJSON("/torrents/suggest/", request, function( data, status, xhr ) {
                    var e = document.createElement('div');

                    data = $.map(data, function(text){
                        e.innerHTML = text;
                        return e.childNodes[0].nodeValue;
                    });

                    cache[ term ] = data;
                    if ( xhr === lastXhr ) {
                        response( data );
                    }
                });
            }
        });

        // User autocomplete
        $('#receiverName, #search-username').autocomplete({
            minLength: 3,
            source: function( request, response ) {
                var term = request.term;
                if ( term in cache ) {
                    response( cache[ term ] );
                    return;
                }

                lastXhr = $.getJSON("/users/suggest/", request, function( data, status, xhr ) {
                    var e = document.createElement('div');

                    data = $.map(data, function(text){
                        e.innerHTML = text;
                        return e.childNodes[0].nodeValue;
                    });

                    cache[ term ] = data;
                    if ( xhr === lastXhr ) {
                        response( data );
                    }
                });
            }
        });

        // Scroll banners
        var leftBanner = $('#left');
//        var rightBanner = $('#right');
//        var timeoutScroll = null;

        // to global scope
        limitMargin = $('.content').height() - leftBanner.height();

        // TODO: workaround for issue #
        setTimeout(function(){
            limitMargin = $('.content').height() - leftBanner.height();
        },500);


        if ($('iframe[id^=vanilla]').length) {
            setInterval(function(){
                limitMargin = $('.content').height() - leftBanner.height();
            },200);
        }
        /*
         // resize on vanilla page
         $(window).ajaxComplete(function(){
         limitMargin = $('.content').height() - leftBanner.height();
         });
         if ($('iframe[id^=vanilla]').length) {
         limitMargin = $('.content').height() - leftBanner.height();
         };

         var offsetTop = $('.content').offset().top;


         $(window).scroll(function () {
         if ($('.content').height() < 800) return;

         var scroll = $(this).scrollTop() - offsetTop + 140; // it's header height

         if (scroll < 0) scroll = 0;
         if (scroll > limitMargin) scroll = limitMargin;

         if (timeoutScroll) {
         clearTimeout(timeoutScroll);
         }
         timeoutScroll = setTimeout(function() {
         leftBanner.stop().animate({'marginTop':scroll+'px'}, 1000, 'easeOutExpo');
         rightBanner.stop().animate({'marginTop':scroll+'px'}, 1000, 'easeOutExpo');
         }, 300);
         });
         */
        // Slide user panel
        function toggleSlidePanel() {
            $(".headerPlace").toggleClass('active');
            $(".slideToo").toggleClass('active');
            return false;
        }
        function openSlidePanel() {
            $(".headerPlace").addClass('active');
            $(".slideToo").addClass('active');
            return false;
        }
        function closeSlidePanel() {
            $(".headerPlace").removeClass('active');
            $(".slideToo").removeClass('active');
            //return false;
        }

        $("#slide-panel").click(openSlidePanel);
        $("#slide-up-panel").click(openSlidePanel);

        $('.slide, .slideToo').click(toggleSlidePanel);
        $('.wrapper').click(closeSlidePanel);

        // Accordion
        //(".torrentDetails .accordion h3.title:first").addClass("active");
        $(".accordion div.open").show().prev().addClass('active');
        $(".accordion h3.title").click(function(){
            var $this = $(this);
            $this.next("div").slideToggle(500)
                .siblings("div:visible").slideUp(500);
            $this.toggleClass("active");
            $this.siblings("h3.title").removeClass("active");
            return false;
        });

        $(".spoiler h4").click(function(){
            var $this = $(this);
            $this.toggleClass("active");
            $this.next().slideToggle(500);
            return false;
        });

        $(".rssinfo h3").click(function(){
            var $this = $(this);
            $this.toggleClass("active");
            $this.next().slideToggle(500);
            return false;
        });

        var ajaxSuccess = function(data) {
            Messages.clear();

            var toTime = 100;
            if (data.response) {
                if (data.status == "OK") {
                    Messages.addNotice(data.response);
                } else {
                    Messages.addWarning(data.response);
                }
                toTime = 3000;
            }

            if (data.redirect) {
                setTimeout(function(){
                    if (data.redirect === true) {
                        // reload current page
                        window.location.reload();
                    } else {
                        // redirect to another page
                        window.location = data.redirect;
                    }
                }, toTime);
            }

            if (data.callback) {
                window[data.callback](data);
            }
        };

        // User login form
        $('#loginform').submit(function(){
            $.ajax({
                url: '/users/auth/',
                type: 'post',
                data: $('#loginform').serialize(),
                dataType:'json',
                success:ajaxSuccess
            });
            return false;
        });

        // Comments Form
        $('#comment-form').submit(function(){
            var textarea = $('#inputtext')
                , comment = textarea.val().trim();
            if (comment == '') {
                Messages.addWarning('Merci de saisir votre commentaire');
            } else if (comment.length < 10
                || comment.length < 20 && comment.match(/merci/i)
                ) {
                Messages.addWarning(
                    "Votre commentaire est trop court pour être publié.<br/>"+
                        "Pour simplement remercier l'uploader, veuillez utiliser le bouton \"Dire merci!\".<br/>"+
                        "Les commentaires doivent privilégier les avis utiles, les aides à l'exploitation du contenu, etc.");
            } else {
                var url, id;

                if ($('#torrent-id').length > 0) {
                    url = '/torrents/comments/';
                    id  = $('#torrent-id').val();
                } else if ($('#news-id').length > 0) {
                    url = '/news/comments/';
                    id  = $('#news-id').val();
                }

                var text = textarea.val();

                $.ajax({
                    url:url,
                    type: 'post',
                    data:{
                        id: id,
                        comment: text
                    },
                    dataType:'json',
                    success:ajaxSuccess,
                    complete: function() {
                        textarea.val('');
                    }
                });
            }

            return false;
        });

        // Request Form
        $('#requestform').submit(function(){
            if ($('#request-query').val() == '') {
                Messages.addWarning('Please write more than nothing');
            } else {
                $.ajax({
                    url:'/requests/create/',
                    type: 'post',
                    data:{
                        cat: $(this).find('select').val(),
                        query: $('#request-query').val(),
                        descr: $('#request-descr').val()

                    },
                    dataType:'json',
                    success:ajaxSuccess
                });
            }

            return false;
        });

        // Ajax links
        // jquery tools overlay
        overlay = $('a.ajax').overlay({
            top: 160,
            target:'#info',
            effect: 'apple',
            api:true,
            onBeforeLoad: function() {
                var href = this.getTrigger().attr("href");
                $('#info').find('.inner').html('<span class="loading">Loading...</span>');
                $.ajax({
                    url:href,
                    dataType:'json',
                    success:function(data) {
                        if (data.status == "OK") {
                            $('#info').find('.inner').html(data.response);
                            //$('#info').overlay({target:'#info'});
                        } else {
                            $('#info').find('.inner').html(data.response);
                            //$('#info').overlay({target:'#info'});
                        }
                    }
                });
            }
        });

        $('a.call').click(function(){
            var $this = $(this);
            if ($this.hasClass('noactive')) {
                // request in progress
                return false;
            }

            if ($this.data('confirm')) {
                if (!confirm($this.data('confirm'))) {
                    return false;
                }
            }

            $this.addClass('noactive');
            $.ajax({
                url:$this.attr('href'),
                type: 'post',
                dataType:'json',
                complete:function() {
                    $this.removeClass('noactive');
                },
                success:ajaxSuccess
            });
            return false;
        });

        $('a.request-screen').click(function(){
            if(!confirm("Confirmez l'action.")){
                return false;
            }

            var $this = $(this);

            $this.addClass('noactive');
            $.ajax({
                url:$this.attr('href'),
                type: 'post',
                dataType:'json',
                complete:function() {
                    $this.removeClass('noactive');
                },
                success:ajaxSuccess
            });
            return false;
        });

        // report user abuse
        $('a.report').click(function(){
            var reason = prompt('Êtes-vous certain de vouloir signaler ce membre?\nMerci de ne pas nous avertir pour un ratio trop bas. Le site gère cela automatiquement.');

            var $this = $(this);
            if ($this.hasClass('noactive')) {
                // request in progress
                return false;
            }

            if (!reason) {
                return false;
            }

            $this.addClass('noactive');
            $.ajax({
                url:$this.attr('href'),
                type: 'post',
                data: {reason:reason},
                dataType:'json',
                complete:function() {
                    $this.removeClass('noactive');
                },
                success:ajaxSuccess
            });
            return false;
        });

        // ajax form
        $('form.ajaxform').live('submit', function() {
            var $this = $(this);

            if (overlay) {
                // some problem with api
                // overlay.close();
                $('#info .close').click();
            }
            $.ajax({
                url:$this.attr('action'),
                type: 'post',
                data: $this.serializeArray(),
                dataType:'json',
                success:ajaxSuccess
            });
            return false;
        });

        $('.torrent-delete').click(function(){
            var reason = prompt('Raison pour l\'effacement.');

            var $this = $(this);
            if ($this.hasClass('noactive')) {
                // request in progress
                return false;
            }

            if(reason == null) {
                return false;
            }

            $this.addClass('noactive');
            $.ajax({
                url:$this.attr('href'),
                type: 'post',
                data: {reason:reason},
                dataType:'json',
                complete:function() {
                    $this.removeClass('noactive');
                },
                success:ajaxSuccess
            });
            return false;
        });

        $('.delete').click(function(){
            var $this = $(this);
            if ($this.hasClass('noactive')) {
                // request in progress
                return false;
            }

            if (!confirm('Êtes-vous sûr?')) {
                return false;
            }

            $this.addClass('noactive');
            $.ajax({
                url:$this.attr('href'),
                type: 'post',
                dataType:'json',
                complete:function() {
                    $this.removeClass('noactive');
                },
                success:ajaxSuccess
            });
            return false;
        });

        $('#user-self-delete').click(function(){

            var $this = $(this);

            var saveTorrent = 0;
            if ($this.hasClass('torrents')) {
                if (!confirm('Voulez-vous supprimer vos uploads? Si vous les laissez, ils seront rattachés à un compte dédié afin que leur exploitation puisse continuer.')) {
                    saveTorrent = 1;
                }
            }

            if (!confirm('Compte va être supprimé définitivement ainsi que toute information relative à celui-ci. Êtes-vous sûr?')) {
                return false;
            }

            if ($this.hasClass('noactive')) {
                // request in progress
                return false;
            }

            $this.addClass('noactive');
            $.ajax({
                url:$this.attr('href'),
                type: 'post',
                data: {saveTorrent:saveTorrent, token:$this.attr('data-token')},
                dataType:'json',
                complete:function() {
                    $this.removeClass('noactive');
                },
                success:ajaxSuccess
            });
            return false;
        });

        $('#user-delete').click(function(){
            var reason = prompt('Raison pour l\'effacement');

            var $this = $(this);
            if ($this.hasClass('noactive')) {
                // request in progress
                return false;
            }

            if (!reason) {
                return false;
            }

            $this.addClass('noactive');
            $.ajax({
                url:$this.attr('href'),
                type: 'post',
                data: {reason:reason, token:$this.attr('data-token')},
                dataType:'json',
                complete:function() {
                    $this.removeClass('noactive');
                },
                success:ajaxSuccess
            });
            return false;
        });

        // search results
        $('.switcher').click(function(){
            $(this).parent().find('dl, blockquote').toggleClass('active');
            $(this).toggleClass('active');
            return false;
        });

        if ($('#messages').length > 0) {
            var el = $('#messages');
            el.fadeIn(500);
            var delay = 3000 + el.text().length*12;
            setTimeout(function(){
                el.fadeOut(500);
            }, delay);
        }

        // browseform - pending and browse page
        $('#browseform li.parent > label input').click(function(){
            $(this)
                .parent().next()
                .find('input[type=checkbox]')
                .prop('checked', $(this).is(':checked'));
        });
        $('#browseform span').click(function(){
            $(this).toggleClass('active');
            $(this)
                .prev()
                .toggle();
            return false;
        });

        $('.shortlink').overlay({
            top:160,
            target:'#shortlink',
            effect:'apple',
            onBeforeLoad: function() {
                var href = this.getTrigger().attr("href");
                $('#shortlink').find('.shorthref').val(href);
            },
            onLoad: function() {
                $('.shortcopy').zclip({
                    path:'/flash/ZeroClipboard.swf',
                    beforeCopy:function(){},
                    copy: function(){
                        return $('#shortlink').find('.shorthref').val();
                    },
                    afterCopy:function(){
                        $('.shorthref').css('background','green');
                        $('#shortlink .close').click();
                    }
                });
            }
        });

        /*$('.redactor_file_link').click(function(){
         window.location = '/images/news/'+$(this).text();
         return false;
         });*/
    });

    // Due to a major bug in jQuery you should not load overlays with the Apple effect upon document.ready() event when
    // using external stylesheets. This causes unpredictable behaviour in Safari 3+ and Chrome (WebKit-based browsers).
    // http://bugs.jquery.com/ticket/4187
//    $(window).ready(function(){
//
//    });
})(jQuery);
