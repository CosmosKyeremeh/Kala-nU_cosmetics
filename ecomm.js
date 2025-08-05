$(document).ready(function() {  

  $('#search, .fa-search').on('mouseenter', function() {  
    $('.logo').hide();  
  });  

  $('#search, .fa-search').on('mouseleave', function() {  
    $('.logo').show();  
  });  

  $('.fa-bars').click(function() {  
    $('.navbar').toggle();  
    $(this).toggleClass('fa-times');  
  });  

});