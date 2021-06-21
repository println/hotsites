function linkGoogleMaps() {
    var src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.607166231906!2d-43.09118578503522!3d-22.85401888503867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9984a49151855f%3A0x67c5ae7f7930474c!2sConstrular%20Material%20de%20Constru%C3%A7%C3%A3o%20e%20Bazar!5e0!3m2!1spt-BR!2sbr!4v1624304137532!5m2!1spt-BR!2sbr'
    var attr = 'src'
    if ($('#google-map-frame').is(":visible") && !($('#google-map-frame').attr(attr))) {
        $('#google-map-frame').attr(attr, src)
    }
}


$(document).ready(function () {
    linkGoogleMaps();
    $(window).on('resize', function () {
        linkGoogleMaps();
    })
});
