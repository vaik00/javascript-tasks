'use strict';

var NUM = 2;
var DURATION = 500;
var EASING = 'easeInOutQuad'

function Explosm(root) {
	this.lastComic = root;
	this.lastNumber = this.getCurrentNumber();
	this.requests = [];

	this.init();
}

Explosm.prototype.init = function() {
	this.attachEasings();
	this.fixLayout();
	this.bindAllEvents();
}


Explosm.prototype.attachEasings = function() {
	var easingsURL = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js';
	$.ajax({
		url: easingsURL,
		dataType: 'script',
		success: function() {
			console.log('success');
		},
		error: function() {
			console.log('error loading');
		}
	});
}
Explosm.prototype.fixLayout = function() {
	this.lastComic.css({
		margin: '0 auto',
		display: 'block'
	});
}

Explosm.prototype.bindAllEvents = function() {
	$(window).scroll(this.eventHandler.bind(this));
}

Explosm.prototype.eventHandler = function() {
	var notWaitingRequests = (this.requests.length === 0);
	if (notWaitingRequests && event.type === 'scroll' && this.lastComicsReached()) {
		this.loadAllComics();
	}
}

Explosm.prototype.lastComicsReached = function() {
	var windowBottom = $(window).scrollTop() + $(window).height();
	var lastComicBottom = this.lastComic.height() + this.lastComic.offset().top;
	return windowBottom > lastComicBottom;
}

Explosm.prototype.loadAllComics = function() {
	for (var i = 0; i < NUM; i += 1) {
		this.loadComics(this.lastNumber -= 1);
	}
}

Explosm.prototype.loadComics = function(number) {
	var uri = '/comics/' + number + '/'
	$.ajax({
		url: uri,
		type: 'GET',
		error: function() {
			console.log('error ajax loadComics request');
			this.loadComics();
		}.bind(this),
		success: function(result) {
			var img = $(result).find('#main-comic');
				this.addComic(img)
		}.bind(this),
		beforeSend: function() {
			this.requests.push(+new Date());
		}.bind(this),
		complete: function() {
			this.requests.pop()
		}.bind(this)
	});
}

Explosm.prototype.addComic = function(img) {
	this.lastComic.removeAttr('id');
	img.one('load', function() {
		var imgHeight = img.height();
		var imgWidth = img.width();
		img.css({
			margin: '0 auto',
			display: 'block',
			height: '0',
			width: imgWidth
		}).stop().animate({
			height: imgHeight
		}, DURATION, EASING);
	});
	this.lastComic.parent().append(img);
	this.lastComic = img;
}

Explosm.prototype.getCurrentNumber = function() {
	var href = $('.previous-comic').attr('href')
	var prevNumber = /[0-9]{1,4}/.exec(href)[0];
	return +prevNumber + 1;
}

window.Explosm = Explosm;
new Explosm($('#main-comic, #featured-comic'));