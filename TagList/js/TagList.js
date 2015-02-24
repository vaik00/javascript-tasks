(function () {
	'use strict';

	var extend = function (target, source) {
		if (source) {
			for (var key in source) {
				var val = source[key];
				if (typeof val !== 'undefined') {
					target[key] = val;
				}
			}
		}
		return target;
	};

	var create = function (opts) {
		opts = extend({
			tag: 'p'
		}, opts);
		var el = $('<' + opts.tag + '>');
		for (var key in opts) {
			switch (key) {
				case 'type':
				case 'href':
					el.attr(key, opts[key]);
					break;
				case 'css':
					el.addClass(opts[key]);
					break;
				case 'style':
					el.css(opts[key]);
					break;
				case 'text':
					el.html(opts[key]);
					break;
				case 'tag':
					break;
				case 'data':
					el.data(opts[key]);
					break;
				default:
					console.log('switch default exeption');
			}
		}
		return el;
	};

	var wrap = function (opts) {
		var wrapper = create(opts);
		var args = Array.prototype.slice.call(arguments, 1);
		args.forEach(function (elem) {
			wrapper.append(elem);
		});
		return wrapper;
	};

	var escape = function (str) {
		str = $.trim(str);
		return str.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	};

	var TagListModel = (function () {
		function TagListModel() {
			this._tags = [];
		}

		TagListModel.prototype.add = function (tag) {
			tag = tag.toLowerCase();
			var i = this._tags.indexOf(tag);
			if (i >= 0) {
				return false;
			} else {
				this._tags.push(tag);
				return true;
			}
		};

		TagListModel.prototype.remove = function (tag) {
			tag = tag.toLowerCase();
			var i = this._tags.indexOf(tag);
			this._tags.splice(i, 1);
		};

		return TagListModel;
	})();

	var TagList = (function () {

		function TagList(root, initTags, colorize) {
			TagListModel.call(this);
			this.$form = undefined;
			this.$input = undefined;
			this.$tags = undefined;
			this.$link = undefined;
			this._editingTags = false;

			if (colorize === undefined) {
				this._colorize = (Math.random() > 0.5) ? true : false;
			} else {
				this._colorize = colorize;
			}

			if (!(root instanceof jQuery)) root = $(root);
			root.append(this.createStruct());
			root.on('click', this.eventHandler.bind(this));

			if (initTags !== undefined && Array.isArray(initTags)) {
				initTags.forEach(function (val) {
					this.addTag(val);
				}, this);
			}
		}

		TagList.prototype = Object.create(TagListModel.prototype);
		TagList.prototype.constructor = TagListModel;

		TagList.prototype.eventHandler = function (event) {
			event.preventDefault();
			var target = $(event.target);

			if (target.hasClass('tagList--click')) {
				switch (true) {
					case target.hasClass('tagList__showhide'):
						this.showhide();
						break;
					case target.hasClass('tagList__removeTag'):
						this.removeTag(target);
						break;
					case target.hasClass('tagList__addTag'):
						var tag = escape(this.$input.val());
						this.addTag(tag);
						break;
				}
			}
		};

		TagList.prototype.createStruct = function () {
			var link = create({
				tag: 'a',
				href: '#',
				css: 'tagList--click tagList__showhide',
				text: 'Редактировать теги'
			});
			var linkWrap = wrap({
				css: 'text-center'
			}, link);
			var tags = create({
				style: {
					'line-height': '25px'
				}
			});
			var form = this.createForm()
				.hide();

			this.$tags = tags;
			this.$form = form;
			this.$link = link;
			return [linkWrap, tags, form];
		};

		TagList.prototype.createForm = function () {
			var button = create({
				tag: 'button',
				type: 'submit',
				css: 'btn btn-primary tagList--click tagList__addTag',
				text: 'Добавить тег'
			});
			button = wrap({
				tag: 'span',
				css: 'input-group-btn'
			}, button);
			var input = create({
				tag: 'input',
				type: 'text',
				css: 'form-control'
			});
			var group = wrap({
				tag: 'div',
				css: 'input-group'
			}, input, button);
			var label = create({
				tag: 'label',
				css: 'sr-only',
				text: 'Тег'
			});
			var formGroup = wrap({
				tag: 'div',
				css: 'form-group'
			}, label, group);
			var form = wrap({
				tag: 'form'
			}, formGroup);

			this.$input = input;
			return form;
		};

		TagList.prototype.createTag = function (text) {
			var color = (this._colorize) ? this.color() : 'default';
			var tagText = create({
				tag: 'div',
				css: 'btn btn-' + color + ' tagList__tag',
				text: text,
				style: {
					'pointer-events': 'none',
					'cursor': 'default'
				}
			});
			var tagClose;
			if (this._editingTags) {
				tagClose = this.createClose(color);
			}
			var tagGroup = wrap({
				tag: 'div',
				data: {
					'color': color
				},
				css: 'btn-group btn-group-xs'
			}, tagText, tagClose, '&nbsp;');
			return tagGroup;
		};

		TagList.prototype.createClose = function (color) {
			var tagClose = create({
				tag: 'i',
				css: 'fa fa-times tagList--click tagList__removeTag'
			});
			return wrap({
				tag: 'a',
				href: '#',
				css: 'btn btn-' + color + ' tagList--click tagList__removeTag'
			}, tagClose);
		};

		TagList.prototype.addTag = function (tag) {
			if (tag === '') return;
			if (this.add(tag)) {
				this.$tags.append(this.createTag(tag));
				this.clearInput();
			}
		};

		TagList.prototype.removeTag = function (target) {
			var parent = this.tagParent(target).remove();
			var tag = parent.find('.tagList__tag').text();

			this.remove(tag);
		};

		TagList.prototype.tagParent = function (node) {
			while (!node.hasClass('btn-group')) {
				node = node.parent();
			}
			return node;
		};

		TagList.prototype.showhide = function () {
			this._editingTags = !this._editingTags;
			if (this._editingTags) {
				this.$link.text('Применить изменения');
				this.$tags.find('.btn-group').each(function (i, el) {
					el = $(el);
					var color = el.data('color');
					el.append(this.createClose(color));
				}.bind(this));
			} else {
				this.$link.text('Редактировать теги');
				this.$tags.find('.btn-group').children('a').remove();
			}
			this.$form.stop().toggle();
		};

		TagList.prototype.clearInput = function () {
			this.$input.val('');
		};

		TagListModel.prototype.color = function () {
			var rnd = Math.floor(Math.random() * 5);
			var color;
			switch (rnd) {
				case 0:
					color = 'info';
					break;
				case 1:
					color = 'danger';
					break;
				case 2:
					color = 'warning';
					break;
				case 3:
					color = 'primary';
					break;
				case 4:
					color = 'success';
					break;
				default:
					break;
			}
			return color;
		};

		return TagList;
	})();

	window.TagList = TagList;
})();