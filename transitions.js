$(document).ready(function() {
  $('.btn_nav').on('click', function() {
    // animate content
    $('.page__style').addClass('animate_content');
    $('.page__description').fadeOut(100).delay(1400).fadeIn();

    setTimeout(function() {
      $('.page__style').removeClass('animate_content');
    }, 1600);

    //remove fadeIn class after 1500ms
    setTimeout(function() {
      $('.page__style').removeClass('fadeIn');
    }, 750);
  });

  // on click show page after 1500ms
  $('.home_link').on('click', function() {
    setTimeout(function() {
      $('.home').addClass('fadeIn');
    }, 750);
  });

  $('.projects_link').on('click', function() {
    
    window.open('projects.html', "_self");
    /*
    setTimeout(function() {
      $('.projects').addClass('fadeIn');
    }, 750);
    */
  });

  $('.about_link').on('click', function() {
    setTimeout(function() {
      $('.about').addClass('fadeIn');
    }, 750);
  });
  
  $('.contact_link').on('click', function() {
    setTimeout(function() {
      $('.contact').addClass('fadeIn');
    }, 750);
  });

 
  
});
window.onload = function(){swapper();};
var isOverlayOn = true;
function swapper() {
  isOverlayOn = !isOverlayOn;
  var Image = document.getElementsByClassName('overlayToggle');
  var overlayed = document.getElementById('overlay');
  if (isOverlayOn) {
    overlayed.style.display = "block";
    for(let item of Image) {
      item.src = "images/stamp.png";
    }
  }
  else {
    overlayed.style.display = "none"; 
    for(let item of Image) {
      item.src = "images/stamp2.png";
    }
  }
}