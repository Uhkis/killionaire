$(document).ready(function() {

  // When first time loading the page, check if hash is given
  // and do a search accordingly.
  if (location.hash) {
    hashSearch();
  }

  // If the hash changes during the visit.
  $(window).on('hashchange', function() {
    hashSearch();
  });

  // Show options div if region div is clicked.
  $('#region').on('click', function(e) {
    $('#options').toggle();
  });

  // If element with option class (regions) is clicked,
  // set the text of region selector and hide the region
  // options.
  $('.option').on('click', function() {
    $('#region').text($(this).text());
    $('#options').hide();
  });

  // When form is submitted..
  $('#summonerForm').on('submit', function(e) {
    e.preventDefault(); // Don't do a real form submit

    // Fade out the result div, there should be new data coming in.
    $('#result').fadeOut(400);

    // Get the values needed for search from text input
    // and the custom made region selector.
    var summoner = $('input[name="summonerName"]').val();
    var region = $('#region').text().toLowerCase();

    // Change the address bar location, this triggers the
    // hashchange event which was bound earlier.
    location.hash = region + ':' + summoner;
  });

  function hashSearch() {
    // Get the search parameters from the hash,
    // formatted region:summonername
    var params = location.hash.replace('#', '').split(':');

    // Set the values in the UI so it doesn't have some old values in it.
    // Region is uppercased here because it looks better on the selector,
    // perhaps this should be done with css text-transform instead.
    $('#region').text(params[0].toUpperCase());
    $('input[name="summonerName"]').val(params[1]);
    getData(params[0].toLowerCase(), params[1]);
  }

  // The actual search is done here.
  function getData(region, summoner) {
    // Get the summoner name input to a variable since
    // we're gonna use it multiple times later on.
    var $input = $('input[name="summonerName"]');

    // Every time we do this search, we show spinner on
    // the inputs background.
    var spincss = {
      'background-image': 'url(img/spinner.gif)',
      'background-position': '97% center',
      'background-repeat': 'no-repeat'
    }
    $input.css(spincss);

    // POST data for the AJAX call.
    var post = 'region=' + region + '&summonerName=' + summoner;

    // The AJAX call itself
    $.post('search', post) // POST the data
    .done(function(data) { // When the call is successful..
      // Put the response HTML to our result div.
      $('#result').html(data);
      // Hide the two elements containing the results first...
      $('#summoner').hide();
      $('#result table').hide();
      // ..so we can show them here with nice little animation.
      $('#result').show(0, function() { // Instant showing of result div
        // 400ms fade in for summoner info div after result is shown.
        $('#summoner').fadeIn(400, function() {
          // 400ms fade in for the champions table after
          // previous animation is done.
          $('#result table').fadeIn(400);
        });
      });

      // Construct a hash link for this search.
      var hash = '#' + region + ':' + summoner;
      $link = $('<a>').attr('href', hash).text('Permalink');
      // Append the link after summoner name.
      $('#summoner h1').after($link);
    }).fail(function(xhr, status, error) { // Error handler
      // Get and show the error in question. No animation here.
      $('#result').html(xhr.responseText).show();
    }).always(function() { // This happens on every request, result ignored.
      // Hide the spinner from the text input.
      $input.css('background-image', '');
    });
  }

});
