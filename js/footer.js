/*jslint browser: true */
/*jslint unparam: true */
/*global jQuery, $, bootbox */

var timer;
$("#cont_close,.guides,.services,.donate,#footer_close").hover(function () {
  timer = setTimeout(function () {
    $('#searchput').removeClass("result_hover");
  }, 700);
});
$(".hovercolor").hover(function () {
  clearTimeout(timer);
  $('#searchput').addClass("result_hover");
}, function () {
  timer = setTimeout(function () {
    if ($("#drop-area").is(":visible")) {
      $("#searchput").addClass("result_hover");
    } else {
      $('#searchput').removeClass("result_hover");
    }
  }, 700);
});
$(document).ready(function () {
  $('.js-activated').dropdownHover().dropdown();
});

$('a[href$="top"]').click(function (event) {
  event.preventDefault();
  $('html, body').animate({scrollTop: $(this.hash).offset().top - 50}, 1000);
});