var API_BASE_URL = 'https://api.spotify.com'

$('.form-horizontal').on('submit', function(event){
	event.preventDefault();

	var data = $('.form-control.inputSongText').val();
	var searchUrl = API_BASE_URL + '/v1/search?type=track&query='
	+ data;

	$.ajax({
        type: "GET",
        url: searchUrl,
        data: '',
        success: displayFirstSong,
        error: handleError,
        dataType: "json"
    });   
});


function displayFirstSong (response) {
	var track = response.tracks.items[0];
    var trackName = track.name;
    var artistName = track.artists[0]["name"];
    var artistId = track.artists[0]["id"];
    var coverUrl = track.album.images[0].url;
    var trackUrl = track.preview_url;
 	
    getArtistInfo(artistId);    
    

    $('p.title').html(trackName);  
    $('p.author').html('<a id="artistInfo" data-toggle="modal" href="#artistModal">' 
    	+ artistName + '</a>');
    $('.cover > img').attr("src", coverUrl);
    $('audio').attr('src', trackUrl);
}

function handleError (error) {
    console.log(error);
}

function getArtistInfo(id){
	var artistUrl = API_BASE_URL + "/v1/artists/" + id;
	$.ajax({
        type: "GET",
        url: artistUrl,
        data: '',
        success: processArtistInfo,
        error: handleError,
        dataType: "json"
    }); 

}

function processArtistInfo(response){
	$('.artist-data-list').empty();
	$('.artist-data-list').append('<li class="artist-data-item">Name: '
		+ response["name"] 
		+ '</li>'
		+ '<li class="artist-data-item">Genres: '
		+ response["genres"]
		+ '</li>');
}

$('.btn-play').on('click', function(){
	if($(this).hasClass('playing')){
		$('.js-player').trigger('pause');

	} else {
		$('.js-player').trigger('play');
	}
	$(this).toggleClass('playing');
	$(this).removeClass('disabled');
})

$('.js-player').on('timeupdate', printTime);

function printTime () {
  var current = $('.js-player').prop('currentTime');
  console.debug('Current time: ' + current);

  $('progress').attr("value", current);
  if (current >= $('progress').attr("max")){
  	$('.js-player').trigger('pause');
  	$('.btn-play').removeClass('playing');
  	$('.btn-play').addClass('disabled');
  }
}

