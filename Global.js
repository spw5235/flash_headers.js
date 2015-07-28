$j(function() {

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        $j('html').addClass('hasTouch');
    } else {
        $j('html').addClass('noTouch');
    }

    $j('#nav a').fsButtons({
        useOverview: false,
        minScreenWidth: 640
    });
    // $j('#nav a').fsMenus();

    $j('#nav a').each(function(i) {

        //add section title to menus & page content
        var btn = $j(this),
            txt = btn.text(),
            menu = btn.data('menu'),
            pid = btn.data('pid'),
            classes = 'section-title section_' + pid;

        $j('#' + menu).prepend('<h4 class="' + classes + '"><a href="page.cfm?p=' + pid + '">' + txt + '</a></h4><div class="section-desc">' + $j('.page-desc').eq(i).html() + '</div>');

        if (btn.hasClass('fsBtn_active')) {
            $j('.section-hdr .bannermodcontent').html('<h1 class="' + classes + '"><a href="page.cfm?p=' + pid + '">' + txt + '</a></h1>');
        }
    });


    //set up grid photos in topbanner
    if ($j('#topbanner .grid-photo').length > 0) {
        var photogrid = $j('<div class="photo-grid" />').prependTo('#contentdiv');
        $j('#topbanner .grid-photo .bannermodcontent').each(function(i) {
            $j(this).attr('class', 'grid-slot slot-' + i).appendTo(photogrid);
        });
    }

    if ($j('#topbanner .top-photos').length > 0 && $j('#topbanner .grid-photo').length == 0) {
        var photoHdr = $j('<div class="photo-hdr" />').prependTo('#contentdiv');
        $j('#topbanner .top-photos img').appendTo(photoHdr);
        $j('#topbanner .top-photos').html('');
    }

    $j('#ql-btn').fsButtons({
        menuPosition: 'below right',
        useOverview: false
    });


    $j('#search-btn label').on('click', function() {
        $j('#search-btn').toggleClass('active');
    });

    //remove software nav module styles
    $j('.navmod,.portalnavmod').removeAttr('id');


    //add class to directory page table
    $j('form[name="filter"]').next('table').addClass('fsDirList');

    //change text of button
    $j('form[name="filter"] .buttons').val('search');



    //set up mobile nav menu
    var mobileNav = $j('<div id="mobileNav" />').insertAfter('.main-nav .nav-link');
    $j('#search-btn form').clone().appendTo(mobileNav);
    $j('#search_keywords', mobileNav).attr('placeholder', '');
    $j('#nav').clone().attr('id', 'pageNav').appendTo(mobileNav);
    $j('#ql_menu').clone().attr('id', 'ql_mobile').removeClass('fsBtn_menu').appendTo(mobileNav);
    $j('<a href="userlogin.cfm" class="login-btn">Login</a>').appendTo(mobileNav);


    //main menu toggle for mobile
    $j('.nav-link').on('click', function() {
        $j('#mobileNav').toggleClass('active');
        return false;
    });


    //page specific functions
    if (pageid === 1) {
        homeInit();
    }
    itemZoom();

    if (pageid === 866) {
        customTwitter();
    }

    if (pageid === 1) {
        customTwitter();
    }



}); //end load function

function customTwitter() {
    var checkTwitter = setInterval(function() {
// commented out to display twitter feed on page - 07/13/2015 JM       
// if ($j('body').data('twttr-rendered') === true) {
            renderTweets();
         clearInterval(checkTwitter);
     //  }
   }, 100);

    function renderTweets() {

        var checkTweets = setInterval(function() {
            if ($j('#twitter-widget-0').contents().find('.tweet').length > 0) {
                clearInterval(checkTweets);
                var twt = $j('#twitter-widget-0').contents();
                var tweets = twt.find('.tweet');

                if (pageid == 866) {
                    twt.find(".avatar").css('display', 'none');
                    twt.find(".timeline-header").css('display', 'none');
                    twt.find(".tweet").css('padding', '12px 12px 10px 12px');
                    twt.find(".customisable-border").css('border', 'none');
                    twt.find(".timeline-footer").css('display', 'none');
                    twt.find(".stream").css('overflowY', 'hidden');
                } else {
                	var show = 0;
                    $j('.twitter-feed').append('<ul class="tweets">');

                    tweets.each(function(i) {
                        if (i < show + 1) {


                            $j(this).appendTo('.twitter-feed .tweets');
                        }
                    });

                }
            }
        }, 100);


    }
}

//remove facebook URL
$j('.facebook_title').each(function() {
    var fbookHref = $j(this).attr('href');
    $j(this).siblings('.facebook_thumb').wrap('<a href="' + fbookHref + '"></a>');
});


function homeInit() {

    //main photo carousel
    $j('#text1').append('<div class="carousel"><div class="stage"></div></div>');
    $j('.contentElementDiv').appendTo('#text1 .stage').eq(0).show();

    $j('.hp-updates .bannermodcontent').html('<div class="stage"></div>');

    $j('#text1 .carousel, .hp-updates .bannermodcontent').append('<div class="controls"><a href="#prev">Previous</a><a href="#next">Next</a></div>');


    $j('#text1, .hp-updates').on('click', '.controls a', function() {
        var stage = $j(this).parents('.carousel').find('.stage');
        var speed = 500;
        var slides = $j('.contentElementDiv', stage);
        if ($j(this).attr('href') === '#next') {
            var slide = slides.eq(0);
            var w = slide.outerWidth(true);
            slide.animate({
                'margin-left': -w
            }, speed, function() {
                slide.appendTo(stage).css('margin-left', '');
            });
        } else {
            var slide = slides.eq(-1);
            var w = slide.outerWidth(true);
            slide.css('margin-left', -w).prependTo(stage);
            slide.animate({
                'margin-left': 0
            }, speed, function() {
                slide.css('margin-left', '');
            });
        }
        return false;
    });

    // updates section
    var updatesURL = "page.cfm?p=962&pullcontent=true&LockSSL=true";
    $j.get(updatesURL, function(data) {
        $j('.contentElementDiv', data).appendTo('.hp-updates .stage');
        $j('.hp-updates .bannermodcontent').addClass('carousel');
        $j('.hp-updates .contentElementDiv').eq(0).show();

        // check posts for links and add click event on container
        $j('.hp-updates .contentElementDiv').each(function() {
            var links = $j('.contentElementDesc a', this);
            if (links.length > 0) {
                var href = links.eq(0).attr('href');
                $j(this).css('cursor', 'pointer').on('click', function() {
                    document.location = href;
                })
            }
        });

    });

    // news section
    $j('.hp-news').on('click', function() {
        window.location = 'page.cfm?p=866';
    })

    // insert "show more"
    $j('<a href="#" class="show-more">+</a>').appendTo('.hp-updates, .hp-news, #text1').on('click', function() {
        return false
    });

    // move button to allow hover effect
    $j('.hp-events, .hp-campus').each(function() {
        $j(this).find('.fs_style_23').insertAfter($j(this).find('.bannermodcontent'));
    });

    //link events & alumni box to button href
    /*var event_link = $j('.hp-events a.fs_style_23').attr('href');
	$j('.hp-events').on('click',function(){
		document.location.href = event_link;
	});*/

    var alum_link = $j('.hp-alumni a.fs_style_23').attr('href');
    $j('.hp-alumni').on('click', function() {
        document.location.href = alum_link;
    });

};

function itemZoom() {
    var item = $j('#contentdiv .photo-grid, #contentdiv .photo-hdr');
    var fullWidth = 776;
    var fullHeight = 289;
    // var fullWidth = 781;
    // var fullHeight = 260;
    item.css('-moz-transform-origin', 'top left');
    item.css('-webkit-transform-origin', 'top left');
    item.css('transform-origin', 'top left');


    $j(window).on('load resize', function() {

        if ($j(this).width() < 1072) {

            var zoomLev = $j('#contentdiv').width() / fullWidth;

            item.css('-moz-transform', 'scale(' + zoomLev + ')');
            item.css('-webkit-transform', 'scale(' + zoomLev + ')');
            item.css('-transform', 'scale(' + zoomLev + ')');
            item.css('height', fullHeight * zoomLev);
        } else {
            item.css('-moz-transform', '');
            item.css('-webkit-transform', '');
            item.css('-transform', '');
            item.css('height', '');
        }

    });

}

;
(function(e) {
    var t = {
        menuPause: 250,
        menuSpeed: 250,
        menuDelay: 0,
        animMenus: true,
        effect: "blind",
        easing: "swing",
        direction: "",
        menuPosition: "below left",
        sectionSubs: false,
        useOverview: true,
        hierOverview: true,
        getPages: false,
        hasMenuClass: "hasfsMenu",
        onClass: "fsBtn_on",
        selectClass: "fsBtn_active",
        menuClass: "fsBtn_menu",
        menuOnClass: "fsBtn_menu_on",
        menuPrefix: "dhtmlmenu_",
        useWithTouch: true,
        minScreenWidth: 0,
        hideEffect: null,
        hideSpeed: null,
        hideEasing: null,
        hideDirection: null,
        effectArgs: {},
        hideArgs: {}
    };
    e.fn.fsButtons = function(n) {
        e("#nav_menus").attr("style", "");
        e("#nav_menus > div, #ql_menu").css("visibility", "").removeAttr("onmouseover").removeAttr("onmouseout");
        var i = e.extend({}, t, n);
        i.hasTouch = "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
        i.useTouch = i.hasTouch ? i.useWithTouch : true;
        if (!i.animMenus) {
            i.menuSpeed = 1
        }
        i.hideEffect = i.hideEffect || i.effect;
        i.hideSpeed = i.hideSpeed || i.menuSpeed;
        i.hideEasing = i.hideEasing || i.easing;
        i.hideDirection = i.hideDirection || i.direction;
        return this.each(function() {
            var t = this;
            if (e(t).data("menu")) {
                r(t, i)
            } else {
                if (e(this).attr("href").indexOf("page.cfm") > -1) {
                    var n = e(this).attr("href").split("p=")[1].split("&")[0];
                    e(this).data("pid", n);
                    for (var s = 0; s < pagearray.length; s++) {
                        if (n == pagearray[s]) {
                            e(t).addClass(i.onClass + " " + i.selectClass)
                        }
                    }
                    if (e("#" + i.menuPrefix + n).length > 0) {
                        e(t).data("menu", i.menuPrefix + n);
                        r(t, i)
                    } else if (i.getPages) {
                        if (e("#nav_menus").length == 0) {
                            e("#bodydiv").after('<div id="nav_menus">')
                        }
                        $j.get("pagenavlist.cfm?pagelist=" + n, function(s) {
                            if (s.search("<li>") > 0) {
                                $j("#nav_menus").append('<div id="' + i.menuPrefix + n + '">' + s + "</div>");
                                e(t).data("menu", i.menuPrefix + n);
                                r(t, i)
                            }
                        })
                    }
                }
            }
        })
    };
    var r = function(t, r) {
        var o = e(t).data("menu") || false;
        if (o) {
            e(t).addClass(r.hasMenuClass)
        }
        var u = false;
        for (n = 0; n < pagearray.length; n++) {
            if (e(t).data("pid") == pagearray[n]) {
                u = true
            }
        }
        var a = u ? r.sectionSubs : true;
        var f = o && a && r.useTouch;
        var l = "#" + e(t).data("menu");
        e(l).addClass(r.menuClass);
        if (r.useOverview) {
            var c = e(l).find("a").eq(0).attr("href");
            e(t).attr("href", c);
            if (u && r.hierOverview) {
                e(".hier a").eq(0).attr("href", c)
            }
        }
        if (r.hasTouch) {
            e(t).on("mouseenter", function() {
                if (f && e(window).width() > r.minScreenWidth) {
                    i(t, r)
                }
            });
            e(t).on("click", function() {
                if ($j(this).attr("href") === "#") {
                    if (e(l).hasClass(r.menuOnClass)) {
                        s(t, r)
                    }
                    return false
                }
            });
            e("#bodydiv").on("click", function() {
                if (e(l).hasClass(r.menuOnClass)) {
                    s(t, r)
                }
            })
        } else {
            e(t).mouseenter(function() {
                clearTimeout(t.wait);
                if (f && e(window).width() > r.minScreenWidth && !e(l).hasClass(r.menuOnClass)) {
                    setTimeout(function() {
                        i(t, r)
                    }, r.menuDelay)
                }
            }).mouseleave(function() {
                if (f && e(window).width() > r.minScreenWidth) {
                    t.wait = setTimeout(function() {
                        s(t, r)
                    }, r.menuPause)
                }
            });
            e(l).mouseenter(function() {
                clearTimeout(t.wait)
            }).mouseleave(function() {
                t.wait = setTimeout(function() {
                    s(t, r)
                }, r.menuPause)
            })
        }
    };
    var i = function(t, n) {
        ele = e(t);
        ele.addClass(n.onClass);
        var r = "#" + ele.data("menu");
        e(r).css({
            top: "",
            left: "",
            margin: ""
        });
        var i = ele.offset().top;
        var s = ele.offset().left + ele.outerWidth();
        var o = ele.offset().top + ele.outerHeight();
        var u = ele.offset().left;
        var a = parseFloat(e(r).css("margin-top")) || 0;
        var f = parseFloat(e(r).css("margin-right")) || 0;
        var l = parseFloat(e(r).css("margin-bottom")) || 0;
        var c = parseFloat(e(r).css("margin-left")) || 0;
        var h = n.menuPosition.split(" ");
        var p, d;
        if (h[0].indexOf("#") > -1) {
            d = e(h[0]).offset().top
        } else if (h[0].search(/%|px|em/) > -1) {
            d = h[0]
        } else {
            switch (h[0]) {
                case "above":
                    d = i - l - e(r).outerHeight();
                    break;
                case "top":
                    d = i - l;
                    break;
                case "center":
                    var v = e(r).outerHeight() / 2 - e(ele).outerHeight() / 2;
                    d = i + a - v;
                    break;
                case "bottom":
                    d = o - l - e(r).outerHeight();
                    break;
                default:
                    d = o + a
            }
        }
        if (h[1].indexOf("#") > -1) {
            p = e(h[1]).offset().left
        } else if (h[1].search(/%|px|em/) > -1) {
            p = h[1]
        } else {
            switch (h[1]) {
                case "outsideleft":
                    p = u + c - e(r).outerWidth();
                    break;
                case "center":
                    var m = e(r).outerWidth() / 2 - e(ele).outerWidth() / 2;
                    p = u + c - m;
                    break;
                case "right":
                    p = s - f - e(r).outerWidth();
                    break;
                case "outsideright":
                    p = s + c;
                    break;
                default:
                    p = u + c
            }
        }
        e(r).addClass(n.menuOnClass);
        options = e.extend({
            queue: false,
            easing: n.easing,
            direction: n.direction
        }, n.effectArgs);
        if (e(r).outerWidth() + p > $j(window).width()) {
            p = $j(window).width() - e(r).outerWidth()
        }
        e(r).css({
            top: d,
            left: p,
            margin: 0
        }).show(n.effect, options, n.menuSpeed)
    };
    var s = function(t, n) {
        if (!e(t).hasClass(n.selectClass)) {
            e(t).removeClass(n.onClass)
        }
        var r = "#" + e(t).data("menu");
        e(r).removeClass(n.menuOnClass);
        options = e.extend({
            queue: false,
            easing: n.hideEasing,
            direction: n.hideDirection
        }, n.hideArgs);
        e(r).hide(n.hideEffect, options, n.hideSpeed)
    }
})(jQuery)
