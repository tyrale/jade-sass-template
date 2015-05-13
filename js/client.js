$(function() {
    $( "#palette-preview" ).sortable();
    $( "#palette-preview" ).disableSelection();
  });


var lastDataPull;
var selectedData = [];

function tapped(position) {
$.getJSON("json/full-swatches.aspx", function () { })
    .done(function (data) {
        if (data.length > 0) { 
            for (var i = 0; i < data.length; i++) {

                if (i == position) {
                    setRightBoxes(data[i]);
                }
            }
        }
    })
}

function setRightBoxes(data) {
    for (var i = 0; i <= 6; i++) {
        if ($('#palette'+i).css('background-image') == "none") {
        $('#palette'+i).css('background-image', 'url(http://uf.dev.ndandp.com/portals/0/skins/uf/css/images/color-tool/swatches/colorNumber/' + data.colorNumber + '.png)');

        selectedData.push(data);
        return;
     }
    }
    alert(selectedData);
}

function hoverHighRes(data){
    
}

$(document).ready(function() {
// COLOR WOW FNCTIONS
function colorWow() {
    $.getJSON("json/full-swatches.aspx", function () { })
    .done(function (data) {
        if (data.length > 0) { 
            processWowJson(data);
            lastDataPull = data; 
        } else { 
            alert('There was a problem loading the colors.', 'Error'); }
    })
    .fail(function () { alert('There was a problem loading the colors.', 'Error'); })
    .always(function () { });
}
colorWow();



function processWowJson(data) {
    var html = '';

    html += '<div class="color-wow-item-box">';
    for (var i = 0; i < data.length; i++) {
        html += '<div onclick="tapped('+ i +')" class="color-wow-item" data-id="' + data[i].colorNumber + '">';
        html += '<img class="thumb" alt="' + data[i].colorName + '" src="http://uf.dev.ndandp.com/portals/0/skins/uf/css/images/color-tool/swatches/colorNumber/thumbs/' + data[i].colorNumber + '.jpg" />';
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
});