$(document).ready(function() {

	var video = document.querySelector('.video')

	var mouseDown = 0
	document.body.onmousedown = function() { 
		++mouseDown
	}
	document.body.onmouseup = function() {
		--mouseDown
	}

	// show/hide video controls on hover
	$('.video-container').on('mouseover', () => {
		$('.controls').addClass('show')
	})
	$('.video-container').on('mouseout', () => {
		// don't hide controls if video paused or if mousedown
		// and controls currently showing (volume slider)
		if (video.paused) return
		if ($('.controls').hasClass('show') && mouseDown) return
		$('.controls').removeClass('show')
	})

	// show video action overlay indicator
	function showIndicator() {
		$('#indicator-parent').css('opacity', 1)
				.css('visibility', 'visible')
				.delay(300)
				.queue(function (next) { 
					$('#indicator-parent').css('opacity', 0)
					$('#indicator-parent').css('visibility', 'hidden')
					$('#indicator').css('opacity', 1)
					next()
				})
			$('#indicator').css('opacity', 0)
	}

	// toggle play/pause video
	function togglePlayPause() {
		if (video.paused) {
			video.play()
			// show overlay play icon
			$('#indicator').attr('class', 'play')
			showIndicator()
		}
		else {
			video.pause()
			// show overlay pause icon
			$('#indicator').attr('class', 'pause')
			showIndicator()
		}
		$('.buttons .play').toggleClass('pause')
	}
	$('.buttons .play, .video, #indicator-parent').on('click', togglePlayPause)

	// skip forwards 15 seconds
	function skipForwards() {
		video.currentTime = video.currentTime + 15
		// show overlay pause icon
		$('#indicator').attr('class', 'skip-forwards')
		showIndicator()
	}
	$('.skip-forwards').on('click', skipForwards)

	// skip backwards 15 seconds
	function skipBackwards() {
		video.currentTime = video.currentTime - 15
		// show overlay pause icon
		$('#indicator').attr('class', 'skip-backwards')
		showIndicator()
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
		volume_slider.css('visibility', 'visible')
		volume_slider.css('opacity', 1)
		$('.controls').addClass('show')
		if (video.muted) {
			video.muted = false
		}
		video.volume = volume_val
	}
	var volume_slider = $('.volume-slider')
	volume_slider.on('input', updateVolume)

	// show/hide volume slider on hover
	$('.volume-button').on('mouseover', () => {
		volume_slider.css('visibility', 'visible')
		volume_slider.css('opacity', 1)
	})
	$('.volume-controls').on('mouseover', () => {
		if (volume_slider.css('visibility') === 'hidden') return
		volume_slider.css('visibility', 'visible')
		volume_slider.css('opacity', 1)
	})
	$('.volume-controls, .volume-button').on('mouseout', () => {
		// if mousedown and controls currently showing
		if ($('.controls').hasClass('show') && mouseDown) return
		volume_slider.css('visibility', 'hidden')
		volume_slider.css('opacity', 0)
	})

	// mute/unmute volume on click
	function toggleMute() {
		if (video.muted) { // unmute video
			video.muted = false
			$('.volume-slider').slider('value', 100)
			$('.volume-button').removeClass('mute')
			// show overlay pause icon
			$('#indicator').attr('class', 'volume')
			showIndicator()
		} else { // mute video
			video.muted = true
			$('.volume-slider').slider('value', 0)
			$('.volume-button').addClass('mute')
			// show overlay pause icon
			$('#indicator').attr('class', 'mute')
			showIndicator()
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
		getTimeRemaining()
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
			$('.buttons .play').removeClass('pause')
		}
	})

	// KEYBOARD SHORTCUTS
	$(document).on('keypress', function(e) {
		// prevent default keypress behavior
		e.preventDefault()
	})
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

