var IMGPATH = 'https://image.tmdb.org/t/p/w1280'

function getMovieInfo(id) {
	var url = `https://api.themoviedb.org/3/movie/${id}?api_key=04c35731a5ee918f014970082a0088b1`
	fetch(url).then(res => res.json())
	.then(function(data) {
		return data
	})
}

// show overlay
function openOverlay() {
	$('#overlay').css('visibility', 'visible')
		.css('opacity', 1)
		.css('z-index', 50)
	$('#infobox').addClass('visible')
}

// close overlay
function closeOverlay() {
	$('#overlay').css('visibility', 'hidden')
		.css('opacity', 0)
		.css('z-index', 0)
	$('#infobox').toggleClass('visible')
}
$('.close-button, #overlay').on('click', closeOverlay)
$('#infobox').on('click', (e) => {
	// don't trigger #overlay click event if click on infobox
	e.stopPropagation()
})

// change overlay details
function loadOverlay(movie) {
	// get movie details
	var id = $(movie).attr('data-id')
	var url = `https://api.themoviedb.org/3/movie/${id}?api_key=04c35731a5ee918f014970082a0088b1`
	fetch(url).then(res => res.json())
	.then(function(movie_data) {
		// prepare data
		var genres = movie_data.genres.map(function (el) { return el.name })

		var languages = movie_data.spoken_languages.map(function (el) { return el.name })
		if (languages.length === 0) $('.languages-container').css('visibility', 'hidden')
		else $('.languages-container').css('visibility', 'visible')
		languages = languages.join(', ')

		var companies = movie_data.production_companies.map(function (el) { return el.name })
		if (companies.length === 0) $('.companies-container').css('visibility', 'hidden')
		else $('.companies-container').css('visibility', 'visible')
		companies = companies.join(', ')

		var hours = Math.floor(movie_data.runtime / 60)
		var minutes = movie_data.runtime - 60 * hours
		var runtime = hours + 'hr ' + minutes + 'min'

		// show movies poster and backdrop
		$('#infobox').css('background-image', `linear-gradient(0deg, rgba(10, 71, 74, 0.9), rgba(0, 0, 0, 0.7)), url(${IMGPATH + movie_data.backdrop_path})`)
		$('#infobox .poster').attr('src', IMGPATH + movie_data.poster_path)
		// show movie details
		$('#infobox .title').html(movie_data.title)
		$('#infobox .runtime').html(runtime)
		$('#infobox .year').html(movie_data.release_date.slice(0,4))
		$('#infobox .rating').html(movie_data.vote_average)
		$('#infobox .num-ratings').html(movie_data.vote_count)
		$('#infobox .genres').html('')
		for (var i in genres) {
			$('#infobox .genres').append(`<span class='genre'>${genres[i]}</span>`)
		}
		$('#infobox .description').html(movie_data.overview)
		$('#infobox .languages').html(languages)
		$('#infobox .companies').html(companies)
		// console.log(movie_data, genres, languages, companies)
	})
}

// show movies for a particular genre
function showMovies(genre_id, genre_name) {
	var URL = `https://api.themoviedb.org/3/discover/movie?with_genres=${genre_id}&sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1`
	fetch(URL).then(res => res.json())
	.then(function(data) {
		var genre_container = document.createElement('div')
		$(genre_container).addClass('genre_container')
		// for each movie
		data.results.forEach(item => {
			if (item.poster_path == null) return
			// show movie poster
			var image = document.createElement('img')
			$(image).addClass('movie')
				.attr('src', IMGPATH + item.poster_path)
				.attr('data-id', item.id)
			$(genre_container).append(image)
		})
		$('#main').append(`<h3 class='genre-heading'>${genre_name}</h3><br>`)
		$('#main').append(genre_container)
		$('.movie').on('click', function() {
			loadOverlay(this)
			openOverlay()
		})
		$('.movie').on('mouseover', function() {
			loadOverlay(this)
		})
	})
}

var genre_ids = [
	{'name': 'Action', 'id': 28},
	{'name': 'Science Fiction', 'id': 878},
	{'name': 'Animation', 'id': 16},
	{'name': 'Comedy', 'id': 35},
	// {'name': 'Adventure', 'id': 12},
	{'name': 'Horror', 'id': 27},
	{'name': 'Mystery', 'id': 9648},
	{'name': 'Fantasy', 'id': 14},
	{'name': 'Romance', 'id': 10749},
	{'name': 'Drama', 'id': 18},
	{'name': 'Documentary', 'id': 99},
]
for (var i in genre_ids) {
	var genre = genre_ids[i]
	showMovies(genre['id'], genre['name'])
}

// automatic slideshow
$('#slideshow > div:gt(0)').hide();
setInterval(function() {
$('#slideshow > div:first')
	.fadeOut(1000)
	.next()
	.fadeIn(1000)
	.end()
	.appendTo('#slideshow')
}, 4000)
// resize slideshow images accordingly
function resizeSlideshow() {
	$('#slideshow img').css('width', '100%')
	$('#slideshow').css('min-height', parseFloat($('#slideshow img').css('width')) * 0.5625)
	$('#slideshow').css('max-height', parseFloat($('#slideshow img').css('width')) * 0.5625)
}
window.onresize = function() {
	resizeSlideshow()
}
resizeSlideshow()


