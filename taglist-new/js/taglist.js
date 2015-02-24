//1.Creating dom for taglist
//2.Adding tag on button click or enter on keyboard 
//3.Check to no-repeat if (true - add tag) (false - dont do anything)
//4.Delete tag on cross button; (if mouse on cross button - delete tag, else - dont do anything)
//5. Creating Tag widget


'use strict';
(function(){
	function TagList (node) {
		this.node = node;      
		this.createTagListStructure();                                               // initializing widget structure
		this.arrayOfTags = [];                                                       // array for variables
		this.node.find('.states').on('click', this.changeState.bind(this));          // changing mods
		this.node.find('#addTagButton').on('click', this.checkTag.bind(this));       // adding tags
		this.node.find('#textInput').on('keyup', this.addTagByEnter.bind(this));     // add tag on pressed Enter
		this.node.find('.saved-tags').on('click', this.removeTag.bind(this));        // delete tag
	    
	};

	//changing state
	TagList.prototype.changeState = function () {
		this.node.find('.edit-state, \
		.view-state, \
		.form-inline, \
		.delete-container').toggle();                                                // changing visible of states
	};
	//check added or not our text
	TagList.prototype.checkTag = function (tag) {
		tag = tag || window.event;
		tag.preventDefault() ? tag.preventDefault() : tag.returnValue = false;       // cancel default browser events
		this.inputedText = this.node.find('#textInput').val();
		  if (!this.inputedText) {                                                   // if no text, do anything
			  return
		     };
		  if (this.arrayOfTags.indexOf(this.inputedText) === -1) {                   // if we dont have this element, add to the array
			  this.addTag(tag);
		     };
	};
    //widget dom structure
	TagList.prototype.createTagListStructure = function () {
		this.tagListContainer = $('<div/>', {class: 'tag-list-container'});
		this.tagListContainer.html('<div class="states"> \
		                            <div class="edit-state">Finish edit</div> \
		                            <div class="view-state">Edit Tags</div> \
		                            </div> \
		                            <div class="saved-tags"></div> \
	                             	<form class="form-inline"> \
  		                            <div class="form-group"> \
    	                            <input type="text" class="form-control" id="textInput"> \
  		                            </div> \
  		                            <button type="submit" id="addTagButton" class="btn btn-primary">Add Tag</button> \
		                            </form>');
		this.node.append(this.tagListContainer);
	};
	// adding tags function
	TagList.prototype.addTag = function (tag) {
		tag = tag || window.event;
		tag.preventDefault() ? tag.preventDefault() : tag.returnValue = false;       // cancel default browser events
		this.tagTextCrossContainer = $('<div />', {class: 'text-delete-container'});
		this.tagTextCrossContainer.html('<div class="text-container"></div> \
										 <div class="delete-container">X</div>');
		this.node.find('.saved-tags').append(this.tagTextCrossContainer); 
		this.arrayOfTags.push(this.inputedText);                                     // add text to the array
		this.tagTextCrossContainer.find('.text-container').text(this.inputedText);   // add text to the block
		this.node.find('#textInput').val('');                                        // erase text field
	};
	// delete tags
	TagList.prototype.removeTag = function (tag) {
		tag = tag || window.event;
		if (tag.target.className !== 'delete-container') {                           //if click not in delete-container dont do anything
			return
		};
		$(tag.target).parent().remove();                                             // delete element
		this.textToRemove = $(tag.target).prev().text();                             // text for erasing
		this.textIndex = this.arrayOfTags.indexOf(this.textToRemove);                // index of text to remove from array
		this.arrayOfTags.splice(this.textIndex, 1);                                  // delete text from array
	};

	//adding tag on Enter
	TagList.prototype.addTagByEnter = function (tag) {
		tag = tag || window.event;
		tag.preventDefault() ? tag.preventDefault() : tag.returnValue = false;       // cancel default browser events
		if (tag.keyCode === 13) {                                                //if enter pressed add tag
			this.checkTag(tag);
		}
	};
    //initialization of our TagList    
	window.TagList = TagList;
}());

(function() {
 window.tl_1 = new TagList($('.first'));
 window.tl_2 = new TagList($('.second'));
 window.tl_3 = new TagList($('.third'));}());