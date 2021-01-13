const URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1'
const IMGPATH = 'https://image.tmdb.org/t/p/w1280'

function getMovieInfo(id) {
	var url = `https://api.themoviedb.org/3/movie/${id}?api_key=04c35731a5ee918f014970082a0088b1`
	fetch(url).then(res => res.json())
	.then(function(data) {
		return data
	})
}

function showMovies() {
	fetch(URL).then(res => res.json())
	.then(function(data) {
		// for each movie
		data.results.forEach(item => {
			// show movie poster
			var image = document.createElement('img')
			$(image).addClass('movie')
				.attr('src', IMGPATH + item.poster_path)
				.attr('data-id', item.id)
			$('#main').append(image)
		})

		$('.movie').on('click', function() {
			// show overlay
			$('#overlay').css('visibility', 'visible')
				.css('opacity', 1)
			$('#infobox').toggleClass('visible')

			// get movie details // 464052
			var id = $(this).attr('data-id')
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
					$('#infobox .genres').append(`<span class="genre">${genres[i]}</span>`)
				}
				$('#infobox .description').html(movie_data.overview)
				$('#infobox .languages').html(languages)
				$('#infobox .companies').html(companies)
				console.log(movie_data, genres, languages, companies)
			})
		})
	})
}
showMovies()

// close overlay button
$('.close-button, #overlay').on('click', () => {
	if ($('#overlay').css('visibility') == 'hidden') {
		$('#overlay').css('visibility', 'visible')
				.css('opacity', 1)
	} else {
		$('#overlay').css('visibility', 'hidden')
				.css('opacity', 0)
	}
	$('#infobox').toggleClass('visible')
})
$('#infobox').on('click', (e) => {
	e.stopPropagation() // don't trigger #overlay click event
})

