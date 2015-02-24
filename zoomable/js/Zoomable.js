(function() {
	'use strict';

	var ESC = 27;
	var $popup, $image, imgAspectRatio, imgWidth,
		$window = $(window);

	function makeZoomable(root) {
		init(); 

		$(root).on('click', 'img', function() {
			if ($popup.is(':visible')) return;

			var src = this.src.replace('/small/', '/large/');
			if (src === $image.attr('src')) {
				show();
			} else {
				$image.attr('src', src).off('load').on('load', show);
			}

			$window.on('resize.zoomable', fixPosition);
		});
	}

	function init() {
		if ($popup) return;

		var $close = initClose();
		$image = initImage();
		$popup = initPopup();
		var $bg = initBg();

		$popup.append($bg).append($image).append($close);
		$(document).ready(function() {
			$('body').append($popup);
		});

		$close.on('click', hide);
	}

	function initBg() {
		var bg = $('<div class="popup__bg">')
			.css({
				position: 'fixed',
				top: '0',
				left: '0',
				bottom: '0',
				right: '0',
				background: 'rgba(0, 0, 0, .7)',
				zIndex: '-1'
			});
		return bg;
	}


	function initClose() {
		var close = $('<span class="popup__close">')
			.text('×')
			.css({
				position: 'absolute',
				top: '0',
				left: '100%',
				marginLeft: '-45px',
				background: '#000',
				color: '#fff',
				fontSize: '40px',
				width: '45px',
				textAlign: 'center',
				cursor: 'pointer',
				zIndex: '2'
			});
		return close;
	}

	function initImage() {
		var image = $('<img class="popup__image" alt="big image">')
			.css({
				display: 'block',
				width: '100%',
				height: '100%',
				zIndex: '1'
			});
		return image;
	}

	function initPopup() {
		var popup = $('<div class="popup">')
			.css({
				display: 'none',
				position: 'fixed',
				top: '50%',
				left: '50%',
				zIndex: '1'
			});
		return popup;
	}

	function keydownEvent(event) {
		if (event.keyCode === ESC) {
			hide();
		}
	}

	function hide() {
		$popup.hide();
		$window.off('resize.zoomable', fixPosition).off('keydown.zoomable', keydownEvent);
	}

	function show() {
		imgWidth = $image.prop('naturalWidth');
		var imgHeight = $image.prop('naturalHeight');
		imgAspectRatio = imgWidth / imgHeight;

		fixPosition();
		$popup.show('slow');

		$window.on('keydown.zoomable', keydownEvent);
	}

	function fixPosition() {
		var windowWidth = $window.width();
		var windowHeight = $window.height();

		var ratedPopupWidth;

		if ((windowWidth / windowHeight) < imgAspectRatio) {
			ratedPopupWidth = windowWidth * 0.8;
		} else {
			ratedPopupWidth = windowHeight * imgAspectRatio * 0.8;
		}

		if (ratedPopupWidth > imgWidth) {
			ratedPopupWidth = imgWidth;
		}

		$popup.css({
			marginTop: -ratedPopupWidth / imgAspectRatio / 2,
			marginLeft: -ratedPopupWidth / 2,
			width: ratedPopupWidth
		});
	}

	window.makeZoomable = makeZoomable;
})();