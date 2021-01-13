$(document).ready(function() {

	var video = document.querySelector('.video')

	// toggle play/pause video
	function togglePlayPause() {
		if (video.paused) video.play()
		else video.pause()
		$('.play').toggleClass('pause')
	}
	$('.play').on('click', togglePlayPause)
	$('.video').on('click', togglePlayPause)

	// skip forwards 15 seconds
	function skipForwards() {
		video.currentTime = video.currentTime + 15
		// videojs($('.video')).currentTime(video.currentTime + 15)
	}
	$('.skip-forwards').on('click', skipForwards)

	// skip backwards 15 seconds
	function skipBackwards() {
		video.currentTime = video.currentTime - 15
		// videojs($('.video')).currentTime(video.currentTime - 15)
	}
	$('.skip-backwards').on('click', skipBackwards)

	// VOLUME CONTROLS

	// volume slider
	$('.volume-slider').slider({
		min: 0,
		max: 100,
		value: 100,
		range: 'min',
		slide: function(event, ui) {
			updateVolume(ui.value / 100)
		}
	})

	// adjust volume according to volume slider
	function updateVolume(volume_val) {
		if (video.muted) {
			video.muted = false
		}
		video.volume = volume_val
	}
	var volume_slider = $('.volume-slider')
	volume_slider.on('input', updateVolume)

	// show/hide volume slider on hover
	$('.volume-slider-container, .volume-button').on('mouseover', () => {
		volume_slider.css('visibility', 'visible')
		volume_slider.css('opacity', 1)
	})
	$('.volume-slider-container, .volume-button').on('mouseout', () => {
		volume_slider.css('visibility', 'hidden')
		volume_slider.css('opacity', 0)
	})

	// mute/unmute volume on click
	function toggleMute() {
		if (video.muted) { // unmute video
			video.muted = false
			$('.volume-slider').slider('value', 100)
			$('.volume-button').removeClass('mute')
		} else { // mute video
			video.muted = true
			$('.volume-slider').slider('value', 0)
			$('.volume-button').addClass('mute')
		}
	}
	$('.volume-button').on('click', toggleMute)

	// enter fullscreen mode
	function toggleFullscreen() {
		if(video.requestFullScreen){
			video.requestFullScreen()
		} else if(video.webkitRequestFullScreen){
			video.webkitRequestFullScreen()
		} else if(video.mozRequestFullScreen){
			video.mozRequestFullScreen()
		}
	}
	$('.fullscreen').on('click', toggleFullscreen)

	var which_time = 'remaining'

	// get time remaining in video
	function getTimeRemaining() {
		if (which_time === 'remaining') {
			var time = video.duration - video.currentTime
		} else if (which_time === 'current') {
			var time = video.currentTime
		}
		var min = Math.floor(time / 60)
		var sec = Math.floor(time - min * 60)
		if (min < 10) min = '0' + min
		if (sec < 10) sec = '0' + sec
		var display_time = min + ':' + sec
		if (which_time === 'remaining') {
			display_time = '- ' + display_time
		}
		$('.time-remaining').html(display_time)
	}
	video.addEventListener('timeupdate', getTimeRemaining)
	video.onloadedmetadata = getTimeRemaining
	$('.time-remaining').on('click', () => {
		if (which_time === 'remaining') which_time = 'current'
		else which_time = 'remaining'
	})

	// video scrubbing
	function scrub(e) {
		const scrubTime = (e.offsetX / progress_bar.offsetWidth) * video.duration
		video.currentTime = scrubTime
	}

	// track scrubbing
	let mousedown = false
	var progress_bar = document.querySelector('.bar')
	$('.bar').on('click', scrub)
	$('.bar').on('mousemove', (e) => mousedown && scrub(e))

	// track mouse up/down
	$('.bar').on('mousedown', () => mousedown = true)
	$('.bar').on('mouseup', () => mousedown = false)

	// progress bar juice
	video.addEventListener('timeupdate', () => {
		var pos = video.currentTime / video.duration
		$('.juice').css('width', pos * 100 + '%')
		if (video.ended) {
			$('.play').removeClass('pause')
		}
	})

	// KEYBOARD SHORTCUTS
	$(document).on('keyup', function(e) {
		// don't fire keyboard shortcuts if typing in an input
		if (e.target.tagName.toLowerCase() === 'input') return
		// prevent default keyup behavior
		e.preventDefault()
		// pause video if spacebar is pressed
		if (e.which == 32) {
			e.preventDefault()
			togglePlayPause()
		}
		// skip backwards on left arrow key is pressed
		else if (e.which == 37) skipBackwards()
		// skip forwards on right arrow key is pressed
		else if (e.which == 39) skipForwards()
		// mute/unmute if 'm' key is pressed
		else if (e.which == 77) toggleMute()
		// enter fullscreen if 'f' key is pressed
		else if (e.which == 70) toggleFullscreen()
		e.preventDefault()
	})


})

