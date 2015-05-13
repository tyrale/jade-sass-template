$(document).ready(function () {

    // Always do
    $('.carousel').carousel({ interval: 10000 });
    handleNewsBand();
    productCapabilitiesNav();
    setActivePage();
    readParameters();
    addColorToolCTAs();

    // Execute conditionally
    if (($(window).width() > 480) && ($('html').hasClass('no-touch'))) { setTimeout("hotModalAction()", 1000); }
    if (thisTabID == 56) { $('.little-font-block').show(); }
    if (thisTabID == 260) { newColorPageFunctions(); }
    if ((thisTabID == 96) || (thisTabID == 264)) { colorWow(); }
})

$(window).resize(function () {
    if ((thisTabID == 96) || (thisTabID == 264)) {
        waitForFinalEvent(function () {
            resetColorWowItemBoxMargins();
        }, 100, "color wow box resize");
    }
});

// CORE SITE Javascript
var currentPCElement = 1, pcAnimateSpeed = 600, largeWindow = 1050;
function productCapabilitiesNav() {
    $('.pc-nav').click(function () {
        var pID = $(this).attr('data-id');
        var windowSize = $(window).width();

        if (pID !== currentPCElement) {
            currentPCElement = pID;

            $('.pc-content').hide();
            $('.pc-content-' + pID).fadeIn(pcAnimateSpeed * 2);
            $('.cheeky-overlay').css({ opacity: 0, top: '', left: '', width: '', height: '' });

            if (windowSize >= largeWindow) {
                $('.co-' + pID).animate({ opacity: 1, top: '285px', left: '-50px', width: '250px', height: '250px' }, pcAnimateSpeed);
            }
        }
    });
}
function setActivePage() {
    var thisURL = location.href.toLowerCase();

    if (thisURL.indexOf('/company') > 0) {
        $('#nav.nav-tier-1 > li > a').eq(0).addClass('active');
    }
    else if (thisURL.indexOf('/products-capabilities') > 0) {
        $('#nav.nav-tier-1 > li > a').eq(1).addClass('active');
    }
    else if (thisURL.indexOf('/color') > 0) {
        $('#nav.nav-tier-1 > li > a').eq(2).addClass('active');
    }
    else if (thisURL.indexOf('/chemistries') > 0) {
        $('#nav.nav-tier-1 > li > a').eq(3).addClass('active');
    }
    else if (thisURL.indexOf('/sustainability') > 0) {
        $('#nav.nav-tier-1 > li > a').eq(4).addClass('active');
    }
    else if (thisURL.indexOf('/news-resources') > 0) {
        $('#nav.nav-tier-1 > li > a').eq(5).addClass('active');
    }

}

function hotModalAction() {

    if (getCookieValue("ufMODAL")) {
        //They've been here before. Don't show the overlay
    } else {

        writePersistentCookie("ufMODAL", 1, "days", 6);

        var thisURL = location.href;
        if (thisURL.indexOf("login.aspx") == -1) {
            $('#userPathModal').modal('show');
            if ($('#userPathModal').length) {
                $('.uf-main-logo').hide();
            }

            $('.upm-link-table a').click(function (e) {
                e.preventDefault();
                $('.upm-home').hide();
                $('.' + $(this).attr('href')).fadeIn(500);
                $('.modal-back-button').fadeIn(500);
                $('.modal-logo').hide();
            });
            $('.modal-back-button').click(function (e) {
                e.preventDefault();
                $('.modal-back-button').hide();
                $('.modal-logo').show();
                $('.upm-home').fadeIn(500);
                $('.upm-carpet, .upm-facility, .upm-diverse, .upm-transportation').hide();
            });
        }

    }

    $('#userPathModal').on('hidden.bs.modal', function (e) {
        $('.uf-main-logo').show();
    });

}

function handleNewsBand() {

    $('.link-expand').click(function (e) {
        e.preventDefault();

        $('.latest-headline, .link-expand').hide();
        $('.link-collapse').show();
        $('.news-carousel').show(500);
    })

    $('.link-collapse').click(function (e) {
        e.preventDefault();

        $('.latest-headline, .link-expand').show();
        $('.link-collapse').hide();
        $('.news-carousel').hide();
    })

    setTimeout(function () {
        rotateNewsArticle(1);
    }, 5000);

}
function rotateNewsArticle(id) {
    $('.latest-headline').hide().html($('.latest-links li').eq(id).html()).fadeIn(500);
    if ((id + 1) >= $('.latest-links li').size()) {
        setTimeout(function () {
            rotateNewsArticle(0);
        }, 5000);
    } else {
        setTimeout(function () {
            rotateNewsArticle(id + 1);
        }, 5000);
    }
}

function doSiteSearch() {
    location.href = '/SearchResults/tabid/86/Default.aspx?Search=' + $('#siteSearch').val();
}
function evalSearch(e) {
    if (e.keyCode == 13) {
        doSiteSearch();
        return false;
    }
}

var COLOR_TOOL_CTA_IMG_URL = '/portals/0/skins/uf/css/images/exploreColor.png';
//isUniversal,isRise,isPrestiva,isRefreshEU,isRefreshAsia
function addColorToolCTAs() {
    switch (thisTabID) {
        //Refresh
        case 115: $('#dnn_ContentPane').append('<a class="color-tool-cta" href="http://uf.dev.ndandp.com/new-color?type=isUniversal"><img src="' + COLOR_TOOL_CTA_IMG_URL + '" /></a>'); break;
        //Prestive
        case 117: $('#dnn_ContentPane').append('<a class="color-tool-cta" href="http://uf.dev.ndandp.com/new-color?type=isPrestiva"><img src="' + COLOR_TOOL_CTA_IMG_URL + '" /></a>'); break;

    }
}













// NEW COLOR PAGE FUNCTIONS - NEEDS TO BE REFACTORED AND POSSIBLY CONVERTED TO ANGULAR
var lastSavedPalette, 
    currentProductLine = 'isUniversal',
    colorArray = ['', '', '', '', '', '', '', '', '', '', '', ''];

function newColorPageFunctions() {
    $('.palette-box').append('<div class="color-choice"><div class="c"><img /><div class="color-choice-close">X</div></div></div>');
    loadMyPalettes();
    fadeInUniversalImgsOnLoad();
    checkForStartingColor();
    checkForColorCategory();

    /* CHANGE PRODUCT LINE */
    $('.product-line li').click(function () {
        var that = $(this);
        var newColorSet = that.attr('data-class');
        changeWhichColorsAreShowing(newColorSet);
    });

    /* POPULAR PALETTES */
    addPopularPaletteListeners();

    /* SHARE PALETTE */
    $('.social-buttons .print').click(function () {
        if (lastSavedPalette) { printPalette(lastSavedPalette); }
        else { toastr.info('Please save your palette first', 'Print Called'); }
    });
    $('.social-buttons .email').click(function () {
        if (lastSavedPalette) { emailPalette(lastSavedPalette); }
        else { toastr.info('Please save your palette first', 'Email Called'); }
    });
    $('.social-buttons .facebook').click(function () {
        if (lastSavedPalette) { sharePaletteOnFacebook(lastSavedPalette); }
        else { toastr.info('Please save your palette first', 'Facebook Share Called'); }
    });
    $('.social-buttons .twitter').click(function () {
        if (lastSavedPalette) { sharePaletteOnTwitter(lastSavedPalette); }
        else { toastr.info('Please save your palette first', 'Twitter Share Called'); }
    });

    /* SAVE PALETTE */
    $('#savePalette').click(function () {

        var paletteTitle = $('#paletteTitle').val();
        var paletteEmail = $('#paletteEmail').val();

        if ((colorsInPalette() > 0) && (paletteTitle.length > 0) && (paletteEmail.length > 0) && (validateEmail(paletteEmail))) {

            var arrayForPalettes = [];
            for (var i = 0; i < colorArray.length; i++) {
                if (colorArray[i] != '') {
                    var colorObj = $('.picker-box[data-colorNumber="' + colorArray[i] + '"]').eq(0);
                    arrayForPalettes.push(new paletteEntry(colorObj.attr('data-colorName'), colorObj.attr('data-colorNumber'), colorObj.attr('data-id'), createPathFromColorNumber(colorObj.attr('data-colorNumber'),true)));
                }
            }
            lastSavedPalette = new savedPalette(paletteTitle, paletteEmail, arrayForPalettes);
            savePalette(lastSavedPalette,true);

            toastr.success("Palette saved to 'My Palettes'", "Palette Saved");
            $('.social-button').animate({ opacity: 1, backgroundColor: '#FFF' }, 500).css('cursor', 'pointer');

            setTimeout(function () { loadMyPalettes(); addPopularPaletteListeners(); resetColorSelectionProcess(); }, 300);

        } else {
            toastr.error('Please add at least one color to your palette and provide a palette name and valid email address.', 'Save Error');
        }
    });

    /* CHOOSE PALETTE COLORS */
    var pickedAPickerBefore = false;
    $('.picker-box').mouseover(function () {
        var that = $(this);

        var tmpImg = new Image();
        tmpImg.onload = function () {
            $('.color-demo').css('height', 'auto').html('<img src="' + createPathFromColorNumber(that.attr('data-colorNumber'), true) + '" />');
            $('.color-title').html(that.attr('data-colorName'));
            $('.color-identifier').html(that.attr('data-colorNumber'));
        }
        tmpImg.src = createPathFromColorNumber(that.attr('data-colorNumber'), true);


    });
    $('.picker-box').click(function () {
        var that = $(this);
        if (colorsInPalette() == 0) { $('.palette-box').slice(2).fadeOut(500); }
        addColorToPaletteArray(that.attr('data-id'));
        if (pickedAPickerBefore == false) {
            $('html, body').stop().animate({ scrollTop: $('#paletteScrollPoint').offset().top - 300 }, 600);
            pickedAPickerBefore = true;
        }
    });
    $('.color-choice-close').click(function () {
        var that = $(this);
        var superParent = that.parent().parent().parent();
        $('.color-choice', superParent).animate({ top: '-143px' }, 500);
        $('.palette-placeholder', superParent).animate({ top: '0', opacity: 1 }, 500);
        $('.color-name-number', superParent).html('');

        colorArray[$('.palette-box').index(superParent)] = '';
    });

    /* CANVAS IMAGE UPLOADER */
    $('.dropzone').html5imageupload({
        onAfterProcessImage: function () {
            var canvas = document.getElementById('canvas_thumb');
            $('#imgFromCanvas').attr('src', canvas.toDataURL());

            var tmpImg = new Image();
            tmpImg.onload = function () {
                resetColorSelectionProcess();

                var colorThief = new ColorThief();
                var image = tmpImg;
                var color = colorThief.getColor(image);
                var palette = colorThief.getPalette(image);

                $('#colorGrab1').css('backgroundColor', 'rgb(' + color["0"] + ',' + color["1"] + ',' + color["2"] + ')');
                $('#colorGrab2').css('backgroundColor', 'rgb(' + palette[0]["0"] + ',' + palette[0]["1"] + ',' + palette[0]["2"] + ')');
                $('#colorGrab3').css('backgroundColor', 'rgb(' + palette[1]["0"] + ',' + palette[1]["1"] + ',' + palette[1]["2"] + ')');
                $('#colorGrab4').css('backgroundColor', 'rgb(' + palette[2]["0"] + ',' + palette[2]["1"] + ',' + palette[2]["2"] + ')');
                $('#colorGrab5').css('backgroundColor', 'rgb(' + palette[3]["0"] + ',' + palette[3]["1"] + ',' + palette[3]["2"] + ')');

                var capturedRGBArray = [];
                capturedRGBArray.push(new RGB(color["0"], color["1"], color["2"]));
                capturedRGBArray.push(new RGB(palette[0]["0"], palette[0]["1"], palette[0]["2"]));
                capturedRGBArray.push(new RGB(palette[1]["0"], palette[1]["1"], palette[1]["2"]));
                capturedRGBArray.push(new RGB(palette[2]["0"], palette[2]["1"], palette[2]["2"]));
                capturedRGBArray.push(new RGB(palette[3]["0"], palette[3]["1"], palette[3]["2"]));

                for (var i = 0; i < capturedRGBArray.length; i++) {
                    var deviation = 999999,
                        matchingColorID = 2,
                        currentColorToMatch = capturedRGBArray[i];

                    $('.picker-box.' + currentProductLine).each(function () {
                        var that = $(this);

                        var thisRGB = new RGB(that.attr('data-rgbr'), that.attr('data-rgbg'), that.attr('data-rgbb'));
                        var curDev = compareColors(currentColorToMatch, thisRGB);

                        if (curDev < deviation) {
                            deviation = curDev;
                            matchingColorID = that.attr('data-id');
                        }
                    });

                    addColorToPaletteArray(matchingColorID);
                }

                $('.color-chooser-tabs a[href="#colorLine"]').tab('show');
                $('.image-from-upload').fadeIn(1000);
            }
            tmpImg.src = canvas.toDataURL();
        },
        onAfterCancel: function () {
            $('.image-from-upload').hide();
        }
    });
    $('#editCanvasImg').click(function () {
        $('.color-chooser-tabs a[href="#photoUpload"]').tab('show');
    });
}
function compareColors(colorA, colorB) {
    return Math.abs((parseInt(colorA.R) - parseInt(colorB.R))) + Math.abs((parseInt(colorA.G) - parseInt(colorB.G))) + Math.abs((parseInt(colorA.B) - parseInt(colorB.B)));
}

function addColorToPaletteArray(dbID) {
    var colorObj = $('.picker-box[data-id="' + dbID + '"]').eq(0);
    var colorAdded = false,
        colorNumber = colorObj.attr('data-colorNumber'),
        colorName = colorObj.attr('data-colorName'),
        path = createPathFromColorNumber(colorNumber, true);


    for (var i = 0; i < colorArray.length; i++) {
        if (colorArray[i] == '') {
            $('.palette-box').eq(i + 1).removeClass('hidden').fadeIn(500);
            $('.palette-placeholder').eq(i).animate({ top: '143px', opacity: 0 }, 500);
            $('.color-choice img').eq(i).attr('alt', colorNumber).attr('src', path).attr('data-colorName', colorName).attr('data-colorNumber', colorNumber).attr('data-id', dbID);
            $('.color-choice').eq(i).animate({ top: '0' }, 500);
            $('.color-name-number').eq(i).html('<p><strong>' + colorName + '</strong> (' + colorNumber + ')</p>');
            colorAdded = true;
            colorArray[i] = colorNumber;
            break;
        }
    }

    if (colorAdded == false) {
        toastr.info('You can only have up to ' + colorArray.length + ' colors in your palette.', 'Palette Max Reached');
    }
}
function colorsInPalette() {
    var count = 0;
    for (var i = 0; i < colorArray.length; i++) { if (colorArray[i] != '') { count += 1; } }
    return count;
}
function resetColorSelectionProcess() {
    $('.palette-box').slice(2).fadeOut(500);
    $('.color-choice').animate({ top: '-143px' }, 500);
    $('.palette-placeholder').animate({ top: '0', opacity: 1 }, 500);
    for (var i = 0; i < colorArray.length; i++) { colorArray[i] = ''; }
    $('.image-from-upload').hide();
    $('#paletteTitle').val('');
    $('#paletteEmail').val('');
    $('.color-name-number').html('');
}
function addPopularPaletteListeners() {

    // COPY A SAVED PALETTE TO WORKSPACE
    $('.poppal-controls li.copy a').unbind('click').click(function (e) {
        e.preventDefault();
        var that = $(this),
            storedColorArray = copyPaletteForEdit(that.attr('data-uniqueKey'));
        
        if (storedColorArray != null) {

            toastr.info('Saved palette copied to work area', 'Palette Copied');
            resetColorSelectionProcess();

            for (var i = 0; i < storedColorArray.length; i++) {
                var storedObj = storedColorArray[i];
                addColorToPaletteArray(storedObj.dbID);
            }

            $('.explore-create-saved a[href="#colorCreate"]').tab('show');
            setTimeout(function () { $('html, body').stop().animate({ scrollTop: $('#paletteScrollPoint').offset().top - 300 }, 500); }, 500);

        } else {
            toastr.warning('Your palette could not be copied.', 'Palette Copy Error');
        }

    });

    // DELETE A SAVED PALETTE
    $('.poppal-controls li.delete a').unbind('click').click(function (e) {
        e.preventDefault();

        var that = $(this);
        deleteSavedPalette(that.attr('data-uniqueKey'));

        toastr.info('Saved Palette Deleted.', 'Palette Delete Called');
        var superParent = $(this).parent().parent().parent().parent().parent().parent();
        superParent.fadeOut(500);
    });

    // SHARE A SAVED PALETTE
    $('.poppal-controls li.new-share li').unbind('click').click(function (e) {
        e.preventDefault();
        var that = $(this);
        var savedPalette = getSavedPaletteByUniqueKey(that.parent().attr('data-uniqueKey'));
        
        switch (that.attr('data-method')) {
            case 'fb': sharePaletteOnFacebook(savedPalette); break;
            case 'tw': sharePaletteOnTwitter(savedPalette); break;
            case 'em': emailPalette(savedPalette); break;
        }
    });

    // DOWNLOAD SAVED PALETTES
    $('#downloadPalettes').unbind('click').click(function (e) {
        e.preventDefault();
        var emailAddress = $('#downloadPalettesEmail').val();

        if ((emailAddress.length > 0) && (validateEmail(emailAddress))) {
            $.ajax({
                type: 'GET',
                url: '/portals/0/skins/uf/app_services/getSavedPalettes.aspx?email=' + emailAddress,
                success: function (data) {
                    var dataPull = JSON.parse(data);
                    if (dataPull.length > 0) {
                        for (var i = 0; i < dataPull.length; i++) {
                            var dataObj = JSON.parse(dataPull[i].storedObject);
                            savePalette(dataObj, false);
                        }
                        loadMyPalettes();
                        addPopularPaletteListeners();
                        $('#noPalettes').hide();
                    } else {
                        toastr.info('No palettes found for email address "' + emailAddress + '."', 'Retrieval Error')
                    }
                }
            });


        }
        else { toastr.info('Please supply a valid email address.', 'Retrieval Warning'); }
    });

}

function sharePaletteOnFacebook(palette) {
    toastr.success('Sharing palette sheet on Facebook', 'Facebook Share Called');
    $.magnificPopup.open({
        items: {
            src: '/portals/0/skins/uf/css/images/next-step/facebook.png'
        },
        type: 'image'
    });
}
function sharePaletteOnTwitter(palette) {
    toastr.success('Sharing palette sheet on twitter', 'Twitter Share Called');
    $.magnificPopup.open({
        items: {
            src: '/portals/0/skins/uf/css/images/next-step/facebook.png'
        },
        type: 'image'
    });
}
function printPalette(palette) {
    toastr.success('Printing palette sheet', 'Print Called');
    $.magnificPopup.open({
        items: {
            src: '/portals/0/skins/uf/css/images/next-step/print.png'
        },
        type: 'image'
    });
}
function emailPalette(palette) {
    toastr.success('Emailing palette link', 'Email Called');
    $.magnificPopup.open({
        items: {
            src: '/portals/0/skins/uf/css/images/next-step/email.png'
        },
        type: 'image'
    });
}

function changeWhichColorsAreShowing(type) {
    if (type != currentProductLine) {

        if (colorsInPalette() > 0) { resetColorSelectionProcess(); }
        $('.picker-box').hide();
        $('.' + type).fadeIn(1000);
        currentProductLine = type;

        $('.product-line li').each(function () {
            var that = $(this);
            if (that.attr('data-class') == type) { $('#selectedProductLine').html(that.attr('data-line')); }
        });
    }
}
function checkForColorCategory() {
    var urlParam = getParam('type');
    if (urlParam) { setTimeout(function () { changeWhichColorsAreShowing(urlParam); }, 500); }
}
function checkForStartingColor() {
    var urlParam = getParam('startWith');
    if (urlParam) {
        setTimeout(function () {
            var colorObj = $('.picker-box[data-colorNumber="' + urlParam + '"]').eq(0);
            addColorToPaletteArray(colorObj.attr('data-id'));
            $('html, body').stop().animate({ scrollTop: $('#paletteScrollPoint').offset().top - 300 }, 600);
        }, 500);
    }
}

function createPathFromColorNumber(colorNumber, useBackSlash) {
    if (useBackSlash) { return '\\portals\\0\\skins\\uf\\css\\images\\color-tool\\swatches\\colorNumber\\' + colorNumber + '.png'; }
    else { return '/portals/0/skins/uf/css/images/color-tool/swatches/colorNumber/' + colorNumber + '.png'; }
}
function fadeInUniversalImgsOnLoad() {
    $('.isUniversal img').each(function () {
        var that = $(this);
        var img = new Image();
        img.onload = function () { that.parent().fadeIn(300); }
        img.src = that.attr('src');
    });
}




// COLOR WOW FNCTIONS
var lastDataPull;
function colorWow() {
    $.getJSON("/portals/0/skins/uf/app_services/getcolors.aspx", function () { })
    .done(function (data) {
        if (data.length > 0) { processWowJson(data); lastDataPull = data; }
        else { toastr.error('There was a problem loading the colors.', 'Error'); }
    })
    .fail(function () { toastr.error('There was a problem loading the colors.', 'Error'); })
    .always(function () { });
}
function processWowJson(data) {
    var html = '';

    html += '<div class="color-wow-item-box">';
    for (var i = 0; i < data.length; i++) {
        html += '<div class="color-wow-item" data-id="' + data[i].colorNumber + '">';
        html += '<img class="thumb" alt="' + data[i].colorName + '" src="/portals/0/skins/uf/css/images/color-tool/swatches/colorNumber/thumbs/' + data[i].colorNumber + '.jpg" />';
        html += '<div class="white-info-box" style="border-left: solid 1px rgb(' + parseInt(data[i].rgbR) + ',' + parseInt(data[i].rgbG) + ',' + parseInt(data[i].rgbB) + ');">';
        html += '<div class="sample-box" style="background-image: url(\'/portals/0/skins/uf/css/images/color-tool/swatches/colorNumber/thumbs/' + data[i].colorNumber + '.jpg\');"></div>';
        html += '<p>' + data[i].colorName + '</p><p>' + data[i].colorNumber + '</p>';
        html += '<a href="/new-color?startWith=' + data[i].colorNumber + '">Create Palette</a>';
        html += '</div>';
        html += '</div>';
    }
    html += '</div>';

    $('.color-wow-box').append(html).waitForImages(function () {
        setTimeout(function () {
            $('.color-wow-item-box').css("display", "block").animate({ opacity: 1.0 }, 1000, function () { $('.color-wow-box').addClass('loaded'); });
            $('.color-wow-item').zoomTarget({ targetsize: 0.3, duration: 600, closeclick: true });
            $('.color-wow-item .white-info-box a').click(function (e) {
                location.href = $(this).attr('href');
                e.stopPropagation();
                e.preventDefault();
            });
            onWowBoxHoverLoadHighRestImg();
        }, 700);
        setTimeout(function () { resetColorWowItemBoxMargins(); }, 1000);
    });
}
function resetColorWowItemBoxMargins() {
    var wWidth = $(window).width();
    var wWowBox = 49;
    var gap = wWidth - (parseInt(wWidth / wWowBox) * wWowBox);
    var sMargin = '0 ' + parseInt(gap / 2) + 'px 0 ' + parseInt(gap / 2) + 'px';
    $('.color-wow-item-box').css({ margin: sMargin });
}
function onWowBoxHoverLoadHighRestImg() {
    $('.color-wow-item').mouseover(function () { loadHighRes($(this)); });
    $('.color-wow-item').click(function () { loadHighRes($(this)); });
}
function loadHighRes(that) {
    if ($('img.thumb', that).attr('src').indexOf('.png') == -1) {
        var img = new Image();
        img.onload = function () {
            $('img.thumb', that).attr('src', img.src);
            $('.sample-box', that).css('backgroundImage', 'url("' + img.src + '")');
        }
        img.src = '/portals/0/skins/uf/css/images/color-tool/swatches/colorNumber/' + that.attr('data-id') + '.png';
    }
}










/* Local RGB Object */
function RGB(_r, _g, _b) {
    this.R = parseInt(_r);
    this.G = parseInt(_g);
    this.B = parseInt(_b);
}

// Validate Email Address
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

//** URL PARAMETER HANDLING
var urlParams = {};
function readParameters() {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q)) { urlParams[d(e[1])] = d(e[2]); }
}
function alertParam(id) { alert(urlParams[id]); }
function getParam(id) { return urlParams[id]; }

var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();

/* http://keith-wood.name/backgroundPos.html
Background position animation for jQuery v1.1.1.
Written by Keith Wood (kbwood{at}iinet.com.au) November 2010.
Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license. 
Please attribute the author if you use it. */
(function ($) { var g = !!$.Tween; if (g) { $.Tween.propHooks['backgroundPosition'] = { get: function (a) { return parseBackgroundPosition($(a.elem).css(a.prop)) }, set: setBackgroundPosition } } else { $.fx.step['backgroundPosition'] = setBackgroundPosition }; function parseBackgroundPosition(c) { var d = (c || '').split(/ /); var e = { center: '50%', left: '0%', right: '100%', top: '0%', bottom: '100%' }; var f = function (a) { var b = (e[d[a]] || d[a] || '50%').match(/^([+-]=)?([+-]?\d+(\.\d*)?)(.*)$/); d[a] = [b[1], parseFloat(b[2]), b[4] || 'px'] }; if (d.length == 1 && $.inArray(d[0], ['top', 'bottom']) > -1) { d[1] = d[0]; d[0] = '50%' } f(0); f(1); return d } function setBackgroundPosition(a) { if (!a.set) { initBackgroundPosition(a) } $(a.elem).css('background-position', ((a.pos * (a.end[0][1] - a.start[0][1]) + a.start[0][1]) + a.end[0][2]) + ' ' + ((a.pos * (a.end[1][1] - a.start[1][1]) + a.start[1][1]) + a.end[1][2])) } function initBackgroundPosition(a) { a.start = parseBackgroundPosition($(a.elem).css('backgroundPosition')); a.end = parseBackgroundPosition(a.end); for (var i = 0; i < a.end.length; i++) { if (a.end[i][0]) { a.end[i][1] = a.start[i][1] + (a.end[i][0] == '-=' ? -1 : +1) * a.end[i][1] } } a.set = true } })(jQuery);

function writeSessionCookie(e, t) { if (testSessionCookie()) { document.cookie = escape(e) + "=" + escape(t) + "; path=/"; return true } else return false } function getCookieValue(e) { var t = new RegExp(escape(e) + "=([^;]+)"); if (t.test(document.cookie + ";")) { t.exec(document.cookie + ";"); return unescape(RegExp.$1) } else return false } function testSessionCookie() { document.cookie = "testSessionCookie=Enabled"; if (getCookieValue("testSessionCookie") == "Enabled") return true; else return false } function testPersistentCookie() { writePersistentCookie("testPersistentCookie", "Enabled", "minutes", 1); if (getCookieValue("testPersistentCookie") == "Enabled") return true; else return false } function writePersistentCookie(e, t, n, r) { var i = new Date; r = r / 1; var s = n; switch (s.toLowerCase()) { case "years": var o = i.getYear(); if (o < 1e3) o = o + 1900; i.setYear(o + r); break; case "months": i.setMonth(i.getMonth() + r); break; case "days": i.setDate(i.getDate() + r); break; case "hours": i.setHours(i.getHours() + r); break; case "minutes": i.setMinutes(i.getMinutes() + r); break; default: alert("Invalid periodType parameter for writePersistentCookie()"); break } document.cookie = escape(e) + "=" + escape(t) + "; expires=" + i.toGMTString() + "; path=/" } function deleteCookie(e) { if (getCookieValue(e)) writePersistentCookie(e, "Pending delete", "years", -1); return true }

/*! waitForImages jQuery Plugin 2014-11-14 */
!function (a) { var b = "waitForImages"; a.waitForImages = { hasImageProperties: ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage", "cursor"], hasImageAttributes: ["srcset"] }, a.expr[":"].uncached = function (b) { if (!a(b).is('img[src][src!=""]')) return !1; var c = new Image; return c.src = b.src, !c.complete }, a.fn.waitForImages = function () { var c, d, e, f = 0, g = 0, h = a.Deferred(); if (a.isPlainObject(arguments[0]) ? (e = arguments[0].waitForAll, d = arguments[0].each, c = arguments[0].finished) : 1 === arguments.length && "boolean" === a.type(arguments[0]) ? e = arguments[0] : (c = arguments[0], d = arguments[1], e = arguments[2]), c = c || a.noop, d = d || a.noop, e = !!e, !a.isFunction(c) || !a.isFunction(d)) throw new TypeError("An invalid callback was supplied."); return this.each(function () { var i = a(this), j = [], k = a.waitForImages.hasImageProperties || [], l = a.waitForImages.hasImageAttributes || [], m = /url\(\s*(['"]?)(.*?)\1\s*\)/g; e ? i.find("*").addBack().each(function () { var b = a(this); b.is("img:uncached") && j.push({ src: b.attr("src"), element: b[0] }), a.each(k, function (a, c) { var d, e = b.css(c); if (!e) return !0; for (; d = m.exec(e) ;) j.push({ src: d[2], element: b[0] }) }), a.each(l, function (c, d) { var e, f = b.attr(d); return f ? (e = f.split(","), void a.each(e, function (c, d) { d = a.trim(d).split(" ")[0], j.push({ src: d, element: b[0] }) })) : !0 }) }) : i.find("img:uncached").each(function () { j.push({ src: this.src, element: this }) }), f = j.length, g = 0, 0 === f && (c.call(i[0]), h.resolveWith(i[0])), a.each(j, function (e, j) { var k = new Image, l = "load." + b + " error." + b; a(k).one(l, function m(b) { var e = [g, f, "load" == b.type]; return g++, d.apply(j.element, e), h.notifyWith(j.element, e), a(this).off(l, m), g == f ? (c.call(i[0]), h.resolveWith(i[0]), !1) : void 0 }), k.src = j.src }) }), h.promise() } }(jQuery);

/* Toastr - Project: https://github.com/CodeSeven/toastr */
!function (e) { e(["jquery"], function (e) { return function () { function t(e, t, n) { return f({ type: O.error, iconClass: g().iconClasses.error, message: e, optionsOverride: n, title: t }) } function n(t, n) { return t || (t = g()), v = e("#" + t.containerId), v.length ? v : (n && (v = c(t)), v) } function i(e, t, n) { return f({ type: O.info, iconClass: g().iconClasses.info, message: e, optionsOverride: n, title: t }) } function o(e) { w = e } function s(e, t, n) { return f({ type: O.success, iconClass: g().iconClasses.success, message: e, optionsOverride: n, title: t }) } function a(e, t, n) { return f({ type: O.warning, iconClass: g().iconClasses.warning, message: e, optionsOverride: n, title: t }) } function r(e) { var t = g(); v || n(t), l(e, t) || u(t) } function d(t) { var i = g(); return v || n(i), t && 0 === e(":focus", t).length ? void h(t) : void (v.children().length && v.remove()) } function u(t) { for (var n = v.children(), i = n.length - 1; i >= 0; i--) l(e(n[i]), t) } function l(t, n) { return t && 0 === e(":focus", t).length ? (t[n.hideMethod]({ duration: n.hideDuration, easing: n.hideEasing, complete: function () { h(t) } }), !0) : !1 } function c(t) { return v = e("<div/>").attr("id", t.containerId).addClass(t.positionClass).attr("aria-live", "polite").attr("role", "alert"), v.appendTo(e(t.target)), v } function p() { return { tapToDismiss: !0, toastClass: "toast", containerId: "toast-container", debug: !1, showMethod: "fadeIn", showDuration: 300, showEasing: "swing", onShown: void 0, hideMethod: "fadeOut", hideDuration: 1e3, hideEasing: "swing", onHidden: void 0, extendedTimeOut: 1e3, iconClasses: { error: "toast-error", info: "toast-info", success: "toast-success", warning: "toast-warning" }, iconClass: "toast-info", positionClass: "toast-top-right", timeOut: 5e3, titleClass: "toast-title", messageClass: "toast-message", target: "body", closeHtml: '<button type="button">&times;</button>', newestOnTop: !0, preventDuplicates: !1, progressBar: !1 } } function m(e) { w && w(e) } function f(t) { function i(t) { return !e(":focus", l).length || t ? (clearTimeout(O.intervalId), l[r.hideMethod]({ duration: r.hideDuration, easing: r.hideEasing, complete: function () { h(l), r.onHidden && "hidden" !== b.state && r.onHidden(), b.state = "hidden", b.endTime = new Date, m(b) } })) : void 0 } function o() { (r.timeOut > 0 || r.extendedTimeOut > 0) && (u = setTimeout(i, r.extendedTimeOut), O.maxHideTime = parseFloat(r.extendedTimeOut), O.hideEta = (new Date).getTime() + O.maxHideTime) } function s() { clearTimeout(u), O.hideEta = 0, l.stop(!0, !0)[r.showMethod]({ duration: r.showDuration, easing: r.showEasing }) } function a() { var e = (O.hideEta - (new Date).getTime()) / O.maxHideTime * 100; f.width(e + "%") } var r = g(), d = t.iconClass || r.iconClass; if ("undefined" != typeof t.optionsOverride && (r = e.extend(r, t.optionsOverride), d = t.optionsOverride.iconClass || d), r.preventDuplicates) { if (t.message === C) return; C = t.message } T++, v = n(r, !0); var u = null, l = e("<div/>"), c = e("<div/>"), p = e("<div/>"), f = e("<div/>"), w = e(r.closeHtml), O = { intervalId: null, hideEta: null, maxHideTime: null }, b = { toastId: T, state: "visible", startTime: new Date, options: r, map: t }; return t.iconClass && l.addClass(r.toastClass).addClass(d), t.title && (c.append(t.title).addClass(r.titleClass), l.append(c)), t.message && (p.append(t.message).addClass(r.messageClass), l.append(p)), r.closeButton && (w.addClass("toast-close-button").attr("role", "button"), l.prepend(w)), r.progressBar && (f.addClass("toast-progress"), l.prepend(f)), l.hide(), r.newestOnTop ? v.prepend(l) : v.append(l), l[r.showMethod]({ duration: r.showDuration, easing: r.showEasing, complete: r.onShown }), r.timeOut > 0 && (u = setTimeout(i, r.timeOut), O.maxHideTime = parseFloat(r.timeOut), O.hideEta = (new Date).getTime() + O.maxHideTime, r.progressBar && (O.intervalId = setInterval(a, 10))), l.hover(s, o), !r.onclick && r.tapToDismiss && l.click(i), r.closeButton && w && w.click(function (e) { e.stopPropagation ? e.stopPropagation() : void 0 !== e.cancelBubble && e.cancelBubble !== !0 && (e.cancelBubble = !0), i(!0) }), r.onclick && l.click(function () { r.onclick(), i() }), m(b), r.debug && console && console.log(b), l } function g() { return e.extend({}, p(), b.options) } function h(e) { v || (v = n()), e.is(":visible") || (e.remove(), e = null, 0 === v.children().length && (v.remove(), C = void 0)) } var v, w, C, T = 0, O = { error: "error", info: "info", success: "success", warning: "warning" }, b = { clear: r, remove: d, error: t, getContainer: n, info: i, options: {}, subscribe: o, success: s, version: "2.1.0", warning: a }; return b }() }) }("function" == typeof define && define.amd ? define : function (e, t) { "undefined" != typeof module && module.exports ? module.exports = t(require("jquery")) : window.toastr = t(window.jQuery) });

// Magnific Popup v0.9.6 by Dmitry Semenov
// http://bit.ly/magnific-popup#build=inline+image+ajax+iframe+gallery+retina+imagezoom+fastclick
(function (a) { var b = "Close", c = "BeforeClose", d = "AfterClose", e = "BeforeAppend", f = "MarkupParse", g = "Open", h = "Change", i = "mfp", j = "." + i, k = "mfp-ready", l = "mfp-removing", m = "mfp-prevent-close", n, o = function () { }, p = !!window.jQuery, q, r = a(window), s, t, u, v, w, x = function (a, b) { n.ev.on(i + a + j, b) }, y = function (b, c, d, e) { var f = document.createElement("div"); return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f }, z = function (b, c) { n.ev.triggerHandler(i + b, c), n.st.callbacks && (b = b.charAt(0).toLowerCase() + b.slice(1), n.st.callbacks[b] && n.st.callbacks[b].apply(n, a.isArray(c) ? c : [c])) }, A = function () { (n.st.focus ? n.content.find(n.st.focus).eq(0) : n.wrap).focus() }, B = function (b) { if (b !== w || !n.currTemplate.closeBtn) n.currTemplate.closeBtn = a(n.st.closeMarkup.replace("%title%", n.st.tClose)), w = b; return n.currTemplate.closeBtn }, C = function () { a.magnificPopup.instance || (n = new o, n.init(), a.magnificPopup.instance = n) }, D = function (b) { if (a(b).hasClass(m)) return; var c = n.st.closeOnContentClick, d = n.st.closeOnBgClick; if (c && d) return !0; if (!n.content || a(b).hasClass("mfp-close") || n.preloader && b === n.preloader[0]) return !0; if (b !== n.content[0] && !a.contains(n.content[0], b)) { if (d && a.contains(document, b)) return !0 } else if (c) return !0; return !1 }, E = function () { var a = document.createElement("p").style, b = ["ms", "O", "Moz", "Webkit"]; if (a.transition !== undefined) return !0; while (b.length) if (b.pop() + "Transition" in a) return !0; return !1 }; o.prototype = { constructor: o, init: function () { var b = navigator.appVersion; n.isIE7 = b.indexOf("MSIE 7.") !== -1, n.isIE8 = b.indexOf("MSIE 8.") !== -1, n.isLowIE = n.isIE7 || n.isIE8, n.isAndroid = /android/gi.test(b), n.isIOS = /iphone|ipad|ipod/gi.test(b), n.supportsTransition = E(), n.probablyMobile = n.isAndroid || n.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), s = a(document.body), t = a(document), n.popupsCache = {} }, open: function (b) { var c; if (b.isObj === !1) { n.items = b.items.toArray(), n.index = 0; var d = b.items, e; for (c = 0; c < d.length; c++) { e = d[c], e.parsed && (e = e.el[0]); if (e === b.el[0]) { n.index = c; break } } } else n.items = a.isArray(b.items) ? b.items : [b.items], n.index = b.index || 0; if (n.isOpen) { n.updateItemHTML(); return } n.types = [], v = "", b.mainEl && b.mainEl.length ? n.ev = b.mainEl.eq(0) : n.ev = t, b.key ? (n.popupsCache[b.key] || (n.popupsCache[b.key] = {}), n.currTemplate = n.popupsCache[b.key]) : n.currTemplate = {}, n.st = a.extend(!0, {}, a.magnificPopup.defaults, b), n.fixedContentPos = n.st.fixedContentPos === "auto" ? !n.probablyMobile : n.st.fixedContentPos, n.st.modal && (n.st.closeOnContentClick = !1, n.st.closeOnBgClick = !1, n.st.showCloseBtn = !1, n.st.enableEscapeKey = !1), n.bgOverlay || (n.bgOverlay = y("bg").on("click" + j, function () { n.close() }), n.wrap = y("wrap").attr("tabindex", -1).on("click" + j, function (a) { D(a.target) && n.close() }), n.container = y("container", n.wrap)), n.contentContainer = y("content"), n.st.preloader && (n.preloader = y("preloader", n.container, n.st.tLoading)); var h = a.magnificPopup.modules; for (c = 0; c < h.length; c++) { var i = h[c]; i = i.charAt(0).toUpperCase() + i.slice(1), n["init" + i].call(n) } z("BeforeOpen"), n.st.showCloseBtn && (n.st.closeBtnInside ? (x(f, function (a, b, c, d) { c.close_replaceWith = B(d.type) }), v += " mfp-close-btn-in") : n.wrap.append(B())), n.st.alignTop && (v += " mfp-align-top"), n.fixedContentPos ? n.wrap.css({ overflow: n.st.overflowY, overflowX: "hidden", overflowY: n.st.overflowY }) : n.wrap.css({ top: r.scrollTop(), position: "absolute" }), (n.st.fixedBgPos === !1 || n.st.fixedBgPos === "auto" && !n.fixedContentPos) && n.bgOverlay.css({ height: t.height(), position: "absolute" }), n.st.enableEscapeKey && t.on("keyup" + j, function (a) { a.keyCode === 27 && n.close() }), r.on("resize" + j, function () { n.updateSize() }), n.st.closeOnContentClick || (v += " mfp-auto-cursor"), v && n.wrap.addClass(v); var l = n.wH = r.height(), m = {}; if (n.fixedContentPos && n._hasScrollBar(l)) { var o = n._getScrollbarSize(); o && (m.paddingRight = o) } n.fixedContentPos && (n.isIE7 ? a("body, html").css("overflow", "hidden") : m.overflow = "hidden"); var p = n.st.mainClass; return n.isIE7 && (p += " mfp-ie7"), p && n._addClassToMFP(p), n.updateItemHTML(), z("BuildControls"), a("html").css(m), n.bgOverlay.add(n.wrap).prependTo(document.body), n._lastFocusedEl = document.activeElement, setTimeout(function () { n.content ? (n._addClassToMFP(k), A()) : n.bgOverlay.addClass(k), t.on("focusin" + j, function (b) { if (b.target !== n.wrap[0] && !a.contains(n.wrap[0], b.target)) return A(), !1 }) }, 16), n.isOpen = !0, n.updateSize(l), z(g), b }, close: function () { if (!n.isOpen) return; z(c), n.isOpen = !1, n.st.removalDelay && !n.isLowIE && n.supportsTransition ? (n._addClassToMFP(l), setTimeout(function () { n._close() }, n.st.removalDelay)) : n._close() }, _close: function () { z(b); var c = l + " " + k + " "; n.bgOverlay.detach(), n.wrap.detach(), n.container.empty(), n.st.mainClass && (c += n.st.mainClass + " "), n._removeClassFromMFP(c); if (n.fixedContentPos) { var e = { paddingRight: "" }; n.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e) } t.off("keyup" + j + " focusin" + j), n.ev.off(j), n.wrap.attr("class", "mfp-wrap").removeAttr("style"), n.bgOverlay.attr("class", "mfp-bg"), n.container.attr("class", "mfp-container"), n.st.showCloseBtn && (!n.st.closeBtnInside || n.currTemplate[n.currItem.type] === !0) && n.currTemplate.closeBtn && n.currTemplate.closeBtn.detach(), n._lastFocusedEl && a(n._lastFocusedEl).focus(), n.currItem = null, n.content = null, n.currTemplate = null, n.prevHeight = 0, z(d) }, updateSize: function (a) { if (n.isIOS) { var b = document.documentElement.clientWidth / window.innerWidth, c = window.innerHeight * b; n.wrap.css("height", c), n.wH = c } else n.wH = a || r.height(); n.fixedContentPos || n.wrap.css("height", n.wH), z("Resize") }, updateItemHTML: function () { var b = n.items[n.index]; n.contentContainer.detach(), n.content && n.content.detach(), b.parsed || (b = n.parseEl(n.index)); var c = b.type; z("BeforeChange", [n.currItem ? n.currItem.type : "", c]), n.currItem = b; if (!n.currTemplate[c]) { var d = n.st[c] ? n.st[c].markup : !1; z("FirstMarkupParse", d), d ? n.currTemplate[c] = a(d) : n.currTemplate[c] = !0 } u && u !== b.type && n.container.removeClass("mfp-" + u + "-holder"); var e = n["get" + c.charAt(0).toUpperCase() + c.slice(1)](b, n.currTemplate[c]); n.appendContent(e, c), b.preloaded = !0, z(h, b), u = b.type, n.container.prepend(n.contentContainer), z("AfterChange") }, appendContent: function (a, b) { n.content = a, a ? n.st.showCloseBtn && n.st.closeBtnInside && n.currTemplate[b] === !0 ? n.content.find(".mfp-close").length || n.content.append(B()) : n.content = a : n.content = "", z(e), n.container.addClass("mfp-" + b + "-holder"), n.contentContainer.append(n.content) }, parseEl: function (b) { var c = n.items[b], d = c.type; c.tagName ? c = { el: a(c) } : c = { data: c, src: c.src }; if (c.el) { var e = n.types; for (var f = 0; f < e.length; f++) if (c.el.hasClass("mfp-" + e[f])) { d = e[f]; break } c.src = c.el.attr("data-mfp-src"), c.src || (c.src = c.el.attr("href")) } return c.type = d || n.st.type || "inline", c.index = b, c.parsed = !0, n.items[b] = c, z("ElementParse", c), n.items[b] }, addGroup: function (a, b) { var c = function (c) { c.mfpEl = this, n._openClick(c, a, b) }; b || (b = {}); var d = "click.magnificPopup"; b.mainEl = a, b.items ? (b.isObj = !0, a.off(d).on(d, c)) : (b.isObj = !1, b.delegate ? a.off(d).on(d, b.delegate, c) : (b.items = a, a.off(d).on(d, c))) }, _openClick: function (b, c, d) { var e = d.midClick !== undefined ? d.midClick : a.magnificPopup.defaults.midClick; if (!e && (b.which === 2 || b.ctrlKey || b.metaKey)) return; var f = d.disableOn !== undefined ? d.disableOn : a.magnificPopup.defaults.disableOn; if (f) if (a.isFunction(f)) { if (!f.call(n)) return !0 } else if (r.width() < f) return !0; b.type && (b.preventDefault(), n.isOpen && b.stopPropagation()), d.el = a(b.mfpEl), d.delegate && (d.items = c.find(d.delegate)), n.open(d) }, updateStatus: function (a, b) { if (n.preloader) { q !== a && n.container.removeClass("mfp-s-" + q), !b && a === "loading" && (b = n.st.tLoading); var c = { status: a, text: b }; z("UpdateStatus", c), a = c.status, b = c.text, n.preloader.html(b), n.preloader.find("a").on("click", function (a) { a.stopImmediatePropagation() }), n.container.addClass("mfp-s-" + a), q = a } }, _addClassToMFP: function (a) { n.bgOverlay.addClass(a), n.wrap.addClass(a) }, _removeClassFromMFP: function (a) { this.bgOverlay.removeClass(a), n.wrap.removeClass(a) }, _hasScrollBar: function (a) { return (n.isIE7 ? t.height() : document.body.scrollHeight) > (a || r.height()) }, _parseMarkup: function (b, c, d) { var e; d.data && (c = a.extend(d.data, c)), z(f, [b, c, d]), a.each(c, function (a, c) { if (c === undefined || c === !1) return !0; e = a.split("_"); if (e.length > 1) { var d = b.find(j + "-" + e[0]); if (d.length > 0) { var f = e[1]; f === "replaceWith" ? d[0] !== c[0] && d.replaceWith(c) : f === "img" ? d.is("img") ? d.attr("src", c) : d.replaceWith('<img src="' + c + '" class="' + d.attr("class") + '" />') : d.attr(e[1], c) } } else b.find(j + "-" + a).html(c) }) }, _getScrollbarSize: function () { if (n.scrollbarSize === undefined) { var a = document.createElement("div"); a.id = "mfp-sbm", a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), n.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a) } return n.scrollbarSize } }, a.magnificPopup = { instance: null, proto: o.prototype, modules: [], open: function (b, c) { return C(), b ? b = a.extend(!0, {}, b) : b = {}, b.isObj = !0, b.index = c || 0, this.instance.open(b) }, close: function () { return a.magnificPopup.instance && a.magnificPopup.instance.close() }, registerModule: function (b, c) { c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b) }, defaults: { disableOn: 0, key: null, midClick: !1, mainClass: "", preloader: !0, focus: "", closeOnContentClick: !1, closeOnBgClick: !0, closeBtnInside: !0, showCloseBtn: !0, enableEscapeKey: !0, modal: !1, alignTop: !1, removalDelay: 0, fixedContentPos: "auto", fixedBgPos: "auto", overflowY: "auto", closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>', tClose: "Close (Esc)", tLoading: "Loading..." } }, a.fn.magnificPopup = function (b) { C(); var c = a(this); if (typeof b == "string") if (b === "open") { var d, e = p ? c.data("magnificPopup") : c[0].magnificPopup, f = parseInt(arguments[1], 10) || 0; e.items ? d = e.items[f] : (d = c, e.delegate && (d = d.find(e.delegate)), d = d.eq(f)), n._openClick({ mfpEl: d }, c, e) } else n.isOpen && n[b].apply(n, Array.prototype.slice.call(arguments, 1)); else b = a.extend(!0, {}, b), p ? c.data("magnificPopup", b) : c[0].magnificPopup = b, n.addGroup(c, b); return c }; var F = "inline", G, H, I, J = function () { I && (H.after(I.addClass(G)).detach(), I = null) }; a.magnificPopup.registerModule(F, { options: { hiddenClass: "hide", markup: "", tNotFound: "Content not found" }, proto: { initInline: function () { n.types.push(F), x(b + "." + F, function () { J() }) }, getInline: function (b, c) { J(); if (b.src) { var d = n.st.inline, e = a(b.src); if (e.length) { var f = e[0].parentNode; f && f.tagName && (H || (G = d.hiddenClass, H = y(G), G = "mfp-" + G), I = e.after(H).detach().removeClass(G)), n.updateStatus("ready") } else n.updateStatus("error", d.tNotFound), e = a("<div>"); return b.inlineElement = e, e } return n.updateStatus("ready"), n._parseMarkup(c, {}, b), c } } }); var K = "ajax", L, M = function () { L && s.removeClass(L) }, N = function () { M(), n.req && n.req.abort() }; a.magnificPopup.registerModule(K, { options: { settings: null, cursor: "mfp-ajax-cur", tError: '<a href="%url%">The content</a> could not be loaded.' }, proto: { initAjax: function () { n.types.push(K), L = n.st.ajax.cursor, x(b + "." + K, N), x("BeforeChange." + K, N) }, getAjax: function (b) { L && s.addClass(L), n.updateStatus("loading"); var c = a.extend({ url: b.src, success: function (c, d, e) { var f = { data: c, xhr: e }; z("ParseAjax", f), n.appendContent(a(f.data), K), b.finished = !0, M(), A(), setTimeout(function () { n.wrap.addClass(k) }, 16), n.updateStatus("ready"), z("AjaxContentAdded") }, error: function () { M(), b.finished = b.loadError = !0, n.updateStatus("error", n.st.ajax.tError.replace("%url%", b.src)) } }, n.st.ajax.settings); return n.req = a.ajax(c), "" } } }); var O, P = function (b) { if (b.data && b.data.title !== undefined) return b.data.title; var c = n.st.image.titleSrc; if (c) { if (a.isFunction(c)) return c.call(n, b); if (b.el) return b.el.attr(c) || "" } return "" }; a.magnificPopup.registerModule("image", { options: { markup: '<div class="mfp-figure"><div class="mfp-close"></div><div class="mfp-img"></div><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></div>', cursor: "mfp-zoom-out-cur", titleSrc: "title", verticalFit: !0, tError: '<a href="%url%">The image</a> could not be loaded.' }, proto: { initImage: function () { var a = n.st.image, c = ".image"; n.types.push("image"), x(g + c, function () { n.currItem.type === "image" && a.cursor && s.addClass(a.cursor) }), x(b + c, function () { a.cursor && s.removeClass(a.cursor), r.off("resize" + j) }), x("Resize" + c, n.resizeImage), n.isLowIE && x("AfterChange", n.resizeImage) }, resizeImage: function () { var a = n.currItem; if (!a || !a.img) return; if (n.st.image.verticalFit) { var b = 0; n.isLowIE && (b = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", n.wH - b) } }, _onImageHasSize: function (a) { a.img && (a.hasSize = !0, O && clearInterval(O), a.isCheckingImgSize = !1, z("ImageHasSize", a), a.imgHidden && (n.content && n.content.removeClass("mfp-loading"), a.imgHidden = !1)) }, findImageSize: function (a) { var b = 0, c = a.img[0], d = function (e) { O && clearInterval(O), O = setInterval(function () { if (c.naturalWidth > 0) { n._onImageHasSize(a); return } b > 200 && clearInterval(O), b++, b === 3 ? d(10) : b === 40 ? d(50) : b === 100 && d(500) }, e) }; d(1) }, getImage: function (b, c) { var d = 0, e = function () { b && (b.img[0].complete ? (b.img.off(".mfploader"), b === n.currItem && (n._onImageHasSize(b), n.updateStatus("ready")), b.hasSize = !0, b.loaded = !0, z("ImageLoadComplete")) : (d++, d < 200 ? setTimeout(e, 100) : f())) }, f = function () { b && (b.img.off(".mfploader"), b === n.currItem && (n._onImageHasSize(b), n.updateStatus("error", g.tError.replace("%url%", b.src))), b.hasSize = !0, b.loaded = !0, b.loadError = !0) }, g = n.st.image, h = c.find(".mfp-img"); if (h.length) { var i = document.createElement("img"); i.className = "mfp-img", b.img = a(i).on("load.mfploader", e).on("error.mfploader", f), i.src = b.src, h.is("img") && (b.img = b.img.clone()), b.img[0].naturalWidth > 0 && (b.hasSize = !0) } return n._parseMarkup(c, { title: P(b), img_replaceWith: b.img }, b), n.resizeImage(), b.hasSize ? (O && clearInterval(O), b.loadError ? (c.addClass("mfp-loading"), n.updateStatus("error", g.tError.replace("%url%", b.src))) : (c.removeClass("mfp-loading"), n.updateStatus("ready")), c) : (n.updateStatus("loading"), b.loading = !0, b.hasSize || (b.imgHidden = !0, c.addClass("mfp-loading"), n.findImageSize(b)), c) } } }); var Q, R = function () { return Q === undefined && (Q = document.createElement("p").style.MozTransform !== undefined), Q }; a.magnificPopup.registerModule("zoom", { options: { enabled: !1, easing: "ease-in-out", duration: 300, opener: function (a) { return a.is("img") ? a : a.find("img") } }, proto: { initZoom: function () { var a = n.st.zoom, d = ".zoom", e; if (!a.enabled || !n.supportsTransition) return; var f = a.duration, g = function (b) { var c = b.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"), d = "all " + a.duration / 1e3 + "s " + a.easing, e = { position: "fixed", zIndex: 9999, left: 0, top: 0, "-webkit-backface-visibility": "hidden" }, f = "transition"; return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, c.css(e), c }, h = function () { n.content.css("visibility", "visible") }, i, j; x("BuildControls" + d, function () { if (n._allowZoom()) { clearTimeout(i), n.content.css("visibility", "hidden"), e = n._getItemToZoom(); if (!e) { h(); return } j = g(e), j.css(n._getOffset()), n.wrap.append(j), i = setTimeout(function () { j.css(n._getOffset(!0)), i = setTimeout(function () { h(), setTimeout(function () { j.remove(), e = j = null, z("ZoomAnimationEnded") }, 16) }, f) }, 16) } }), x(c + d, function () { if (n._allowZoom()) { clearTimeout(i), n.st.removalDelay = f; if (!e) { e = n._getItemToZoom(); if (!e) return; j = g(e) } j.css(n._getOffset(!0)), n.wrap.append(j), n.content.css("visibility", "hidden"), setTimeout(function () { j.css(n._getOffset()) }, 16) } }), x(b + d, function () { n._allowZoom() && (h(), j && j.remove(), e = null) }) }, _allowZoom: function () { return n.currItem.type === "image" }, _getItemToZoom: function () { return n.currItem.hasSize ? n.currItem.img : !1 }, _getOffset: function (b) { var c; b ? c = n.currItem.img : c = n.st.zoom.opener(n.currItem.el || n.currItem); var d = c.offset(), e = parseInt(c.css("padding-top"), 10), f = parseInt(c.css("padding-bottom"), 10); d.top -= a(window).scrollTop() - e; var g = { width: c.width(), height: (p ? c.innerHeight() : c[0].offsetHeight) - f - e }; return R() ? g["-moz-transform"] = g.transform = "translate(" + d.left + "px," + d.top + "px)" : (g.left = d.left, g.top = d.top), g } } }); var S = "iframe", T = "//about:blank", U = function (a) { if (n.currTemplate[S]) { var b = n.currTemplate[S].find("iframe"); b.length && (a || (b[0].src = T), n.isIE8 && b.css("display", a ? "block" : "none")) } }; a.magnificPopup.registerModule(S, { options: { markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>', srcAction: "iframe_src", patterns: { youtube: { index: "youtube.com", id: "v=", src: "//www.youtube.com/embed/%id%?autoplay=1" }, vimeo: { index: "vimeo.com/", id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1" }, gmaps: { index: "//maps.google.", src: "%id%&output=embed" } } }, proto: { initIframe: function () { n.types.push(S), x("BeforeChange", function (a, b, c) { b !== c && (b === S ? U() : c === S && U(!0)) }), x(b + "." + S, function () { U() }) }, getIframe: function (b, c) { var d = b.src, e = n.st.iframe; a.each(e.patterns, function () { if (d.indexOf(this.index) > -1) return this.id && (typeof this.id == "string" ? d = d.substr(d.lastIndexOf(this.id) + this.id.length, d.length) : d = this.id.call(this, d)), d = this.src.replace("%id%", d), !1 }); var f = {}; return e.srcAction && (f[e.srcAction] = d), n._parseMarkup(c, f, b), n.updateStatus("ready"), c } } }); var V = function (a) { var b = n.items.length; return a > b - 1 ? a - b : a < 0 ? b + a : a }, W = function (a, b, c) { return a.replace("%curr%", b + 1).replace("%total%", c) }; a.magnificPopup.registerModule("gallery", { options: { enabled: !1, arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', preload: [0, 2], navigateByImgClick: !0, arrows: !0, tPrev: "Previous (Left arrow key)", tNext: "Next (Right arrow key)", tCounter: "%curr% of %total%" }, proto: { initGallery: function () { var c = n.st.gallery, d = ".mfp-gallery", e = Boolean(a.fn.mfpFastClick); n.direction = !0; if (!c || !c.enabled) return !1; v += " mfp-gallery", x(g + d, function () { c.navigateByImgClick && n.wrap.on("click" + d, ".mfp-img", function () { if (n.items.length > 1) return n.next(), !1 }), t.on("keydown" + d, function (a) { a.keyCode === 37 ? n.prev() : a.keyCode === 39 && n.next() }) }), x("UpdateStatus" + d, function (a, b) { b.text && (b.text = W(b.text, n.currItem.index, n.items.length)) }), x(f + d, function (a, b, d, e) { var f = n.items.length; d.counter = f > 1 ? W(c.tCounter, e.index, f) : "" }), x("BuildControls" + d, function () { if (n.items.length > 1 && c.arrows && !n.arrowLeft) { var b = c.arrowMarkup, d = n.arrowLeft = a(b.replace("%title%", c.tPrev).replace("%dir%", "left")).addClass(m), f = n.arrowRight = a(b.replace("%title%", c.tNext).replace("%dir%", "right")).addClass(m), g = e ? "mfpFastClick" : "click"; d[g](function () { n.prev() }), f[g](function () { n.next() }), n.isIE7 && (y("b", d[0], !1, !0), y("a", d[0], !1, !0), y("b", f[0], !1, !0), y("a", f[0], !1, !0)), n.container.append(d.add(f)) } }), x(h + d, function () { n._preloadTimeout && clearTimeout(n._preloadTimeout), n._preloadTimeout = setTimeout(function () { n.preloadNearbyImages(), n._preloadTimeout = null }, 16) }), x(b + d, function () { t.off(d), n.wrap.off("click" + d), n.arrowLeft && e && n.arrowLeft.add(n.arrowRight).destroyMfpFastClick(), n.arrowRight = n.arrowLeft = null }) }, next: function () { n.direction = !0, n.index = V(n.index + 1), n.updateItemHTML() }, prev: function () { n.direction = !1, n.index = V(n.index - 1), n.updateItemHTML() }, goTo: function (a) { n.direction = a >= n.index, n.index = a, n.updateItemHTML() }, preloadNearbyImages: function () { var a = n.st.gallery.preload, b = Math.min(a[0], n.items.length), c = Math.min(a[1], n.items.length), d; for (d = 1; d <= (n.direction ? c : b) ; d++) n._preloadItem(n.index + d); for (d = 1; d <= (n.direction ? b : c) ; d++) n._preloadItem(n.index - d) }, _preloadItem: function (b) { b = V(b); if (n.items[b].preloaded) return; var c = n.items[b]; c.parsed || (c = n.parseEl(b)), z("LazyLoad", c), c.type === "image" && (c.img = a('<img class="mfp-img" />').on("load.mfploader", function () { c.hasSize = !0 }).on("error.mfploader", function () { c.hasSize = !0, c.loadError = !0, z("LazyLoadError", c) }).attr("src", c.src)), c.preloaded = !0 } } }); var X = "retina"; a.magnificPopup.registerModule(X, { options: { replaceSrc: function (a) { return a.src.replace(/\.\w+$/, function (a) { return "@2x" + a }) }, ratio: 1 }, proto: { initRetina: function () { if (window.devicePixelRatio > 1) { var a = n.st.retina, b = a.ratio; b = isNaN(b) ? b() : b, b > 1 && (x("ImageHasSize." + X, function (a, c) { c.img.css({ "max-width": c.img[0].naturalWidth / b, width: "100%" }) }), x("ElementParse." + X, function (c, d) { d.src = a.replaceSrc(d, b) })) } } } }), function () { var b = 1e3, c = "ontouchstart" in window, d = function () { r.off("touchmove" + f + " touchend" + f) }, e = "mfpFastClick", f = "." + e; a.fn.mfpFastClick = function (e) { return a(this).each(function () { var g = a(this), h; if (c) { var i, j, k, l, m, n; g.on("touchstart" + f, function (a) { l = !1, n = 1, m = a.originalEvent ? a.originalEvent.touches[0] : a.touches[0], j = m.clientX, k = m.clientY, r.on("touchmove" + f, function (a) { m = a.originalEvent ? a.originalEvent.touches : a.touches, n = m.length, m = m[0]; if (Math.abs(m.clientX - j) > 10 || Math.abs(m.clientY - k) > 10) l = !0, d() }).on("touchend" + f, function (a) { d(); if (l || n > 1) return; h = !0, a.preventDefault(), clearTimeout(i), i = setTimeout(function () { h = !1 }, b), e() }) }) } g.on("click" + f, function () { h || e() }) }) }, a.fn.destroyMfpFastClick = function () { a(this).off("touchstart" + f + " click" + f), c && r.off("touchmove" + f + " touchend" + f) } }() })(window.jQuery || window.Zepto)

// Modernizr
window.Modernizr = function (e, t, n) { function r(e) { b.cssText = e } function o(e, t) { return r(S.join(e + ";") + (t || "")) } function i(e, t) { return typeof e === t } function a(e, t) { return !!~("" + e).indexOf(t) } function c(e, t) { for (var r in e) { var o = e[r]; if (!a(o, "-") && b[o] !== n) return "pfx" == t ? o : !0 } return !1 } function s(e, t, r) { for (var o in e) { var a = t[e[o]]; if (a !== n) return r === !1 ? e[o] : i(a, "function") ? a.bind(r || t) : a } return !1 } function u(e, t, n) { var r = e.charAt(0).toUpperCase() + e.slice(1), o = (e + " " + k.join(r + " ") + r).split(" "); return i(t, "string") || i(t, "undefined") ? c(o, t) : (o = (e + " " + T.join(r + " ") + r).split(" "), s(o, t, n)) } function l() { m.input = function (n) { for (var r = 0, o = n.length; o > r; r++) M[n[r]] = !!(n[r] in E); return M.list && (M.list = !(!t.createElement("datalist") || !e.HTMLDataListElement)), M }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), m.inputtypes = function (e) { for (var r, o, i, a = 0, c = e.length; c > a; a++) E.setAttribute("type", o = e[a]), r = "text" !== E.type, r && (E.value = w, E.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(o) && E.style.WebkitAppearance !== n ? (g.appendChild(E), i = t.defaultView, r = i.getComputedStyle && "textfield" !== i.getComputedStyle(E, null).WebkitAppearance && 0 !== E.offsetHeight, g.removeChild(E)) : /^(search|tel)$/.test(o) || (r = /^(url|email)$/.test(o) ? E.checkValidity && E.checkValidity() === !1 : E.value != w)), P[e[a]] = !!r; return P }("search tel url email datetime date month week time datetime-local number range color".split(" ")) } var f, d, p = "2.6.2", m = {}, h = !0, g = t.documentElement, v = "modernizr", y = t.createElement(v), b = y.style, E = t.createElement("input"), w = ":)", x = {}.toString, S = " -webkit- -moz- -o- -ms- ".split(" "), C = "Webkit Moz O ms", k = C.split(" "), T = C.toLowerCase().split(" "), j = { svg: "http://www.w3.org/2000/svg" }, N = {}, P = {}, M = {}, A = [], L = A.slice, $ = function (e, n, r, o) { var i, a, c, s, u = t.createElement("div"), l = t.body, f = l || t.createElement("body"); if (parseInt(r, 10)) for (; r--;) c = t.createElement("div"), c.id = o ? o[r] : v + (r + 1), u.appendChild(c); return i = ["&#173;", '<style id="s', v, '">', e, "</style>"].join(""), u.id = v, (l ? u : f).innerHTML += i, f.appendChild(u), l || (f.style.background = "", f.style.overflow = "hidden", s = g.style.overflow, g.style.overflow = "hidden", g.appendChild(f)), a = n(u, e), l ? u.parentNode.removeChild(u) : (f.parentNode.removeChild(f), g.style.overflow = s), !!a }, z = function () { function e(e, o) { o = o || t.createElement(r[e] || "div"), e = "on" + e; var a = e in o; return a || (o.setAttribute || (o = t.createElement("div")), o.setAttribute && o.removeAttribute && (o.setAttribute(e, ""), a = i(o[e], "function"), i(o[e], "undefined") || (o[e] = n), o.removeAttribute(e))), o = null, a } var r = { select: "input", change: "input", submit: "form", reset: "form", error: "img", load: "img", abort: "img" }; return e }(), D = {}.hasOwnProperty; d = i(D, "undefined") || i(D.call, "undefined") ? function (e, t) { return t in e && i(e.constructor.prototype[t], "undefined") } : function (e, t) { return D.call(e, t) }, Function.prototype.bind || (Function.prototype.bind = function (e) { var t = this; if ("function" != typeof t) throw new TypeError; var n = L.call(arguments, 1), r = function () { if (this instanceof r) { var o = function () { }; o.prototype = t.prototype; var i = new o, a = t.apply(i, n.concat(L.call(arguments))); return Object(a) === a ? a : i } return t.apply(e, n.concat(L.call(arguments))) }; return r }), N.flexbox = function () { return u("flexWrap") }, N.canvas = function () { var e = t.createElement("canvas"); return !(!e.getContext || !e.getContext("2d")) }, N.canvastext = function () { return !(!m.canvas || !i(t.createElement("canvas").getContext("2d").fillText, "function")) }, N.webgl = function () { return !!e.WebGLRenderingContext }, N.touch = function () { var n; return "ontouchstart" in e || e.DocumentTouch && t instanceof DocumentTouch ? n = !0 : $(["@media (", S.join("touch-enabled),("), v, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function (e) { n = 9 === e.offsetTop }), n }, N.geolocation = function () { return "geolocation" in navigator }, N.postmessage = function () { return !!e.postMessage }, N.websqldatabase = function () { return !!e.openDatabase }, N.indexedDB = function () { return !!u("indexedDB", e) }, N.hashchange = function () { return z("hashchange", e) && (t.documentMode === n || t.documentMode > 7) }, N.history = function () { return !(!e.history || !history.pushState) }, N.draganddrop = function () { var e = t.createElement("div"); return "draggable" in e || "ondragstart" in e && "ondrop" in e }, N.websockets = function () { return "WebSocket" in e || "MozWebSocket" in e }, N.rgba = function () { return r("background-color:rgba(150,255,150,.5)"), a(b.backgroundColor, "rgba") }, N.hsla = function () { return r("background-color:hsla(120,40%,100%,.5)"), a(b.backgroundColor, "rgba") || a(b.backgroundColor, "hsla") }, N.multiplebgs = function () { return r("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(b.background) }, N.backgroundsize = function () { return u("backgroundSize") }, N.borderimage = function () { return u("borderImage") }, N.borderradius = function () { return u("borderRadius") }, N.boxshadow = function () { return u("boxShadow") }, N.textshadow = function () { return "" === t.createElement("div").style.textShadow }, N.opacity = function () { return o("opacity:.55"), /^0.55$/.test(b.opacity) }, N.cssanimations = function () { return u("animationName") }, N.csscolumns = function () { return u("columnCount") }, N.cssgradients = function () { var e = "background-image:", t = "gradient(linear,left top,right bottom,from(#9f9),to(white));", n = "linear-gradient(left top,#9f9, white);"; return r((e + "-webkit- ".split(" ").join(t + e) + S.join(n + e)).slice(0, -e.length)), a(b.backgroundImage, "gradient") }, N.cssreflections = function () { return u("boxReflect") }, N.csstransforms = function () { return !!u("transform") }, N.csstransforms3d = function () { var e = !!u("perspective"); return e && "webkitPerspective" in g.style && $("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function (t) { e = 9 === t.offsetLeft && 3 === t.offsetHeight }), e }, N.csstransitions = function () { return u("transition") }, N.fontface = function () { var e; return $('@font-face {font-family:"font";src:url("https://")}', function (n, r) { var o = t.getElementById("smodernizr"), i = o.sheet || o.styleSheet, a = i ? i.cssRules && i.cssRules[0] ? i.cssRules[0].cssText : i.cssText || "" : ""; e = /src/i.test(a) && 0 === a.indexOf(r.split(" ")[0]) }), e }, N.generatedcontent = function () { var e; return $(["#", v, "{font:0/0 a}#", v, ':after{content:"', w, '";visibility:hidden;font:3px/1 a}'].join(""), function (t) { e = t.offsetHeight >= 3 }), e }, N.video = function () { var e = t.createElement("video"), n = !1; try { (n = !!e.canPlayType) && (n = new Boolean(n), n.ogg = e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), n.h264 = e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), n.webm = e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")) } catch (r) { } return n }, N.audio = function () { var e = t.createElement("audio"), n = !1; try { (n = !!e.canPlayType) && (n = new Boolean(n), n.ogg = e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), n.mp3 = e.canPlayType("audio/mpeg;").replace(/^no$/, ""), n.wav = e.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), n.m4a = (e.canPlayType("audio/x-m4a;") || e.canPlayType("audio/aac;")).replace(/^no$/, "")) } catch (r) { } return n }, N.localstorage = function () { try { return localStorage.setItem(v, v), localStorage.removeItem(v), !0 } catch (e) { return !1 } }, N.sessionstorage = function () { try { return sessionStorage.setItem(v, v), sessionStorage.removeItem(v), !0 } catch (e) { return !1 } }, N.webworkers = function () { return !!e.Worker }, N.applicationcache = function () { return !!e.applicationCache }, N.svg = function () { return !!t.createElementNS && !!t.createElementNS(j.svg, "svg").createSVGRect }, N.inlinesvg = function () { var e = t.createElement("div"); return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) == j.svg }, N.smil = function () { return !!t.createElementNS && /SVGAnimate/.test(x.call(t.createElementNS(j.svg, "animate"))) }, N.svgclippaths = function () { return !!t.createElementNS && /SVGClipPath/.test(x.call(t.createElementNS(j.svg, "clipPath"))) }; for (var F in N) d(N, F) && (f = F.toLowerCase(), m[f] = N[F](), A.push((m[f] ? "" : "no-") + f)); return m.input || l(), m.addTest = function (e, t) { if ("object" == typeof e) for (var r in e) d(e, r) && m.addTest(r, e[r]); else { if (e = e.toLowerCase(), m[e] !== n) return m; t = "function" == typeof t ? t() : t, "undefined" != typeof h && h && (g.className += " " + (t ? "" : "no-") + e), m[e] = t } return m }, r(""), y = E = null, function (e, t) { function n(e, t) { var n = e.createElement("p"), r = e.getElementsByTagName("head")[0] || e.documentElement; return n.innerHTML = "x<style>" + t + "</style>", r.insertBefore(n.lastChild, r.firstChild) } function r() { var e = v.elements; return "string" == typeof e ? e.split(" ") : e } function o(e) { var t = g[e[m]]; return t || (t = {}, h++, e[m] = h, g[h] = t), t } function i(e, n, r) { if (n || (n = t), l) return n.createElement(e); r || (r = o(n)); var i; return i = r.cache[e] ? r.cache[e].cloneNode() : p.test(e) ? (r.cache[e] = r.createElem(e)).cloneNode() : r.createElem(e), i.canHaveChildren && !d.test(e) ? r.frag.appendChild(i) : i } function a(e, n) { if (e || (e = t), l) return e.createDocumentFragment(); n = n || o(e); for (var i = n.frag.cloneNode(), a = 0, c = r(), s = c.length; s > a; a++) i.createElement(c[a]); return i } function c(e, t) { t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function (n) { return v.shivMethods ? i(n, e, t) : t.createElem(n) }, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + r().join().replace(/\w+/g, function (e) { return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")' }) + ");return n}")(v, t.frag) } function s(e) { e || (e = t); var r = o(e); return !v.shivCSS || u || r.hasCSS || (r.hasCSS = !!n(e, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), l || c(e, r), e } var u, l, f = e.html5 || {}, d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, p = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, m = "_html5shiv", h = 0, g = {}; !function () { try { var e = t.createElement("a"); e.innerHTML = "<xyz></xyz>", u = "hidden" in e, l = 1 == e.childNodes.length || function () { t.createElement("a"); var e = t.createDocumentFragment(); return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement }() } catch (n) { u = !0, l = !0 } }(); var v = { elements: f.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video", shivCSS: f.shivCSS !== !1, supportsUnknownElements: l, shivMethods: f.shivMethods !== !1, type: "default", shivDocument: s, createElement: i, createDocumentFragment: a }; e.html5 = v, s(t) }(this, t), m._version = p, m._prefixes = S, m._domPrefixes = T, m._cssomPrefixes = k, m.hasEvent = z, m.testProp = function (e) { return c([e]) }, m.testAllProps = u, m.testStyles = $, m.prefixed = function (e, t, n) { return t ? u(e, t, n) : u(e, "pfx") }, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (h ? " js " + A.join(" ") : ""), m }(this, this.document), function (e, t, n) { function r(e) { return "[object Function]" == g.call(e) } function o(e) { return "string" == typeof e } function i() { } function a(e) { return !e || "loaded" == e || "complete" == e || "uninitialized" == e } function c() { var e = v.shift(); y = 1, e ? e.t ? m(function () { ("c" == e.t ? d.injectCss : d.injectJs)(e.s, 0, e.a, e.x, e.e, 1) }, 0) : (e(), c()) : y = 0 } function s(e, n, r, o, i, s, u) { function l(t) { if (!p && a(f.readyState) && (b.r = p = 1, !y && c(), f.onload = f.onreadystatechange = null, t)) { "img" != e && m(function () { w.removeChild(f) }, 50); for (var r in T[n]) T[n].hasOwnProperty(r) && T[n][r].onload() } } var u = u || d.errorTimeout, f = t.createElement(e), p = 0, g = 0, b = { t: r, s: n, e: i, a: s, x: u }; 1 === T[n] && (g = 1, T[n] = []), "object" == e ? f.data = n : (f.src = n, f.type = e), f.width = f.height = "0", f.onerror = f.onload = f.onreadystatechange = function () { l.call(this, g) }, v.splice(o, 0, b), "img" != e && (g || 2 === T[n] ? (w.insertBefore(f, E ? null : h), m(l, u)) : T[n].push(f)) } function u(e, t, n, r, i) { return y = 0, t = t || "j", o(e) ? s("c" == t ? S : x, e, t, this.i++, n, r, i) : (v.splice(this.i++, 0, e), 1 == v.length && c()), this } function l() { var e = d; return e.loader = { load: u, i: 0 }, e } var f, d, p = t.documentElement, m = e.setTimeout, h = t.getElementsByTagName("script")[0], g = {}.toString, v = [], y = 0, b = "MozAppearance" in p.style, E = b && !!t.createRange().compareNode, w = E ? p : h.parentNode, p = e.opera && "[object Opera]" == g.call(e.opera), p = !!t.attachEvent && !p, x = b ? "object" : p ? "script" : "img", S = p ? "script" : x, C = Array.isArray || function (e) { return "[object Array]" == g.call(e) }, k = [], T = {}, j = { timeout: function (e, t) { return t.length && (e.timeout = t[0]), e } }; d = function (e) { function t(e) { var t, n, r, e = e.split("!"), o = k.length, i = e.pop(), a = e.length, i = { url: i, origUrl: i, prefixes: e }; for (n = 0; a > n; n++) r = e[n].split("="), (t = j[r.shift()]) && (i = t(i, r)); for (n = 0; o > n; n++) i = k[n](i); return i } function a(e, o, i, a, c) { var s = t(e), u = s.autoCallback; s.url.split(".").pop().split("?").shift(), s.bypass || (o && (o = r(o) ? o : o[e] || o[a] || o[e.split("/").pop().split("?")[0]]), s.instead ? s.instead(e, o, i, a, c) : (T[s.url] ? s.noexec = !0 : T[s.url] = 1, i.load(s.url, s.forceCSS || !s.forceJS && "css" == s.url.split(".").pop().split("?").shift() ? "c" : n, s.noexec, s.attrs, s.timeout), (r(o) || r(u)) && i.load(function () { l(), o && o(s.origUrl, c, a), u && u(s.origUrl, c, a), T[s.url] = 2 }))) } function c(e, t) { function n(e, n) { if (e) { if (o(e)) n || (f = function () { var e = [].slice.call(arguments); d.apply(this, e), p() }), a(e, f, t, 0, u); else if (Object(e) === e) for (s in c = function () { var t, n = 0; for (t in e) e.hasOwnProperty(t) && n++; return n }(), e) e.hasOwnProperty(s) && (!n && !--c && (r(f) ? f = function () { var e = [].slice.call(arguments); d.apply(this, e), p() } : f[s] = function (e) { return function () { var t = [].slice.call(arguments); e && e.apply(this, t), p() } }(d[s])), a(e[s], f, t, s, u)) } else !n && p() } var c, s, u = !!e.test, l = e.load || e.both, f = e.callback || i, d = f, p = e.complete || i; n(u ? e.yep : e.nope, !!l), l && n(l) } var s, u, f = this.yepnope.loader; if (o(e)) a(e, 0, f, 0); else if (C(e)) for (s = 0; s < e.length; s++) u = e[s], o(u) ? a(u, 0, f, 0) : C(u) ? d(u) : Object(u) === u && c(u, f); else Object(e) === e && c(e, f) }, d.addPrefix = function (e, t) { j[e] = t }, d.addFilter = function (e) { k.push(e) }, d.errorTimeout = 1e4, null == t.readyState && t.addEventListener && (t.readyState = "loading", t.addEventListener("DOMContentLoaded", f = function () { t.removeEventListener("DOMContentLoaded", f, 0), t.readyState = "complete" }, 0)), e.yepnope = l(), e.yepnope.executeStack = c, e.yepnope.injectJs = function (e, n, r, o, s, u) { var l, f, p = t.createElement("script"), o = o || d.errorTimeout; p.src = e; for (f in r) p.setAttribute(f, r[f]); n = u ? c : n || i, p.onreadystatechange = p.onload = function () { !l && a(p.readyState) && (l = 1, n(), p.onload = p.onreadystatechange = null) }, m(function () { l || (l = 1, n(1)) }, o), s ? p.onload() : h.parentNode.insertBefore(p, h) }, e.yepnope.injectCss = function (e, n, r, o, a, s) { var u, o = t.createElement("link"), n = s ? c : n || i; o.href = e, o.rel = "stylesheet", o.type = "text/css"; for (u in r) o.setAttribute(u, r[u]); a || (h.parentNode.insertBefore(o, h), m(n, 0)) } }(this, document), Modernizr.load = function () { yepnope.apply(window, [].slice.call(arguments, 0)) };