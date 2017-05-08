
$( document ).ready(function() {

    var $grid = $('.grid').isotope({
        // options...
        masonry: {


        }
    });
// layout Isotope after each image loads
    $grid.imagesLoaded().progress( function() {
        $grid.isotope('layout');
    });



});

/* Side Navigation */
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {

    $('#mySidenav').toggleClass('sideNav-active');
    $('#main').toggleClass('sideNav-active-main');
    $('.grid').isotope();

}

$( ".sidenav a" ).on( "click", function() {
    $( ".sidenav a" ).not($(this)).removeClass('filter-clicked');
    if($(this).hasClass('filter-clicked')){
        $('.grid').isotope({ filter: '' });
        $(this).removeClass('filter-clicked');
    }else{
        var filterValue = $(this).attr('data-filter');
        $('.grid').isotope({ filter: filterValue });
        $(this).addClass('filter-clicked');
    }
});
var isactive = false;
function Overlay() {

    if(!isactive){
        $('#upload-overlay').css("display", "block");
        isactive = true;
    }else{
        $('#upload-overlay').css("display", "none");
        isactive = false;
    }

}

$('.grid-item').on('click',function(){
    $( ".grid-item" ).not($(this)).removeClass('enlarged');
    $(this).toggleClass('enlarged');
    $('.grid').isotope();

});

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#preview-image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#upload-input").change(function(){
    readURL(this);
    $('#preview-image').show();
});
