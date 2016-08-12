
(function () {
    $("#app-wrapper").on("click", "#menu-toggle", function (e) {
        e.preventDefault();
        $("#app-wrapper #sidebar-wrapper").toggleClass("toggled");
    });

    $("#app-wrapper").on("click", "#menu-toggle", function () {
        $("#glyphToggle").toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
    });

})();
$( document ).ready(function() {
    $('.glyphFeeds').on("click", function () {
        $(this).children('span.glyphicon').toggleClass("glyphicon-chevron-down");
    });
});
