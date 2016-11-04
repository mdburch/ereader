var pageNotes = new Array();
var highlights = new Array();
var HIGHLIGHT_NUM = -1;

// variable and function used to get   
// and set the current highlight color 
var HIGHLIGHT_COLOR = "yellow";
function setHighlightColor(color) {
    HIGHLIGHT_COLOR = color;
}

//sets click event for all highlights on the page
function setHighlightPops() {
	for(var i = 0; i < highlights.length; i++) {
		$(highlights[i].node).unbind("click");

		if(highlights[i].pageNum == $(".right").attr("id") || highlights[i].pageNum == $(".left").attr("id")) {
			$(highlights[i].icon).on("click", function(event) {
				event.stopPropagation();
			});

			$(highlights[i].node).on("click", {value: i}, function(event) {
				if(!popped && document.getSelection() == "") {
					$(highlights[event.data.value].popUp).css({ "top" : this.offsetTop, "left" : event.pageX });

					clickPosition.X = event.clientX;
					clickPosition.Y = event.clientY;

					if($(highlights[event.data.value].popUp).is(":hidden")) {
						highlights[event.data.value].setPopVal();
						$(highlights[event.data.value].popUp).show("fast");
					}
					else {
						$(highlights[event.data.value].popUp).hide("fast");
						highlights[event.data.value].clearPop();
					}
				}
			});
		}
	}
	loadLeftNotesPage();
	loadRightNotesPage();
}

// after a page change, we must re-associate each highlight with
// its span elements on the page
function findHighlightSpan() {
	for(var i = 0; i < highlights.length; i++) {
		if(highlights[i].pageNum == $(".right").attr("id") || highlights[i].pageNum == $(".left").attr("id")) {
			highlights[i].node = $("#" + highlights[i].id).get(0);
			highlights[i].popUp = $("#" + highlights[i].id).children().get(0);
			if(highlights[i].type!="none") highlights[i].icon = $("#" + highlights[i].id).children().get(1);
		}
	}
}


// used to hide all highlight pops on a page
function hideHighlightPops() {
	for(var i = 0; i < highlights.length; i++) {
		$(highlights[i].popUp).hide("fast");
		highlights[i].clearPop();
	}
}

// get all highlights for a specific page
// RETURNS: an Array of strings (highlight text)
function getPageHighlights(pageNum) {
	temp = new Array();
	for(var i = 0; i < highlights.length; i++) {
		if(highlights[i].pageNum == pageNum && highlights[i].type == "none")
			temp.push(highlights[i].text)
	}
	return temp;
}

// get all notes for a specific page
// RETURNS: An Array holding JavaScript objects with attributes: text, note
function getPageNotes(pageNum) {
	temp = new Array();
	for(var i = 0; i < highlights.length; i++) {
		if(highlights[i].pageNum == pageNum && highlights[i].type == "note")
			temp.push({ text: highlights[i].text, note: highlights[i].note });
	}
	return temp;
}

// get all questions for a specific page
// RETURNS: An Array holding JavaScript objects with attributes: text, question
function getPageQuestions(pageNum) {
	temp = new Array();
	for(var i = 0; i < highlights.length; i++) {
		if(highlights[i].pageNum == pageNum && highlights[i].type == "question")
			temp.push({ text: highlights[i].text, question: highlights[i].question });
	}
	return temp;
}

// get all user highlights
// RETURNS: an Array of strings (highlight text)
function getAllHighlights() {
	temp = new Array();
	for(var i = 0; i < highlights.length; i++) {
		temp.push({ text: highlights[i].text, pageNum: highlights[i].pageNum });
	}
	return temp;
}

// get all user notes
// RETURNS: An Array holding JavaScript objects with attributes: text, note
function getAllNotes() {
	temp = new Array();
	for(var i = 0; i < highlights.length; i++) {
		if(highlights[i].type == "note")
			temp.push({ text: highlights[i].text, note: highlights[i].note, pageNum: highlights[i].pageNum });
	}
	return temp;
}

// get all user questions
// RETURNS: An Array holding JavaScript objects with attributes: text, question
function getAllQuestions() {
	temp = new Array();
	for(var i = 0; i < highlights.length; i++) {
		if(highlights[i].type == "question")
			temp.push({ text: highlights[i].text, question: highlights[i].question, pageNum: highlights[i].pageNum });
	}
	return temp;
}

// RETURNS: The page note for the current page
function getPageNote(pageNum)
{
	return pageNotes[pageNum];
}

// sets the page note based on the pageNum passed in
function setPageNote(pageNum, note)
{
	pageNotes[pageNum] = note;
}

////////////////////////////////////////////////
// JavaScript Object for a page highlight.    //
// Has a number of associated methods and     //
// values, all pertaining to user interaction //
// with highlights on a page.                 //
////////////////////////////////////////////////

function Highlight(range) {
	//type options
	var NOTE = "note";
	var QUESTION = "question";
	var NONE = "none";

	//get page number from range.parent.id
	this.pageNum = $(range.startContainer).parent(".page").attr("id");
	
	// create node for Highlight that will contain our
	// highlight text.  We then set the background color
	// for our node to the current highlight color
	// and surround our range with the node.
	this.node = document.createElement("span");
	
	$(this.node).css("background-color", HIGHLIGHT_COLOR);
	range.surroundContents(this.node);

	// create icon element, but do not do anything with it
	this.icon = document.createElement("div");
	$(this.node).append(this.icon);
	$(this.icon).hide();

	// create popUp element and add it to our node
	this.popUp = document.createElement("div");
	
	$(this.popUp).addClass("popUp");
	$(this.node).append(this.popUp);

	//set other object variables
	this.text     = range.toString();        // highlighted text
	this.note     = false;                   // optional note text
	this.question = false;               // optional question text
	this.color    = HIGHLIGHT_COLOR;        // color of the highlight
	this.type     = NONE;                    // highlight type: NONE, NOTE, or QUESTION
	this.id       = "HL" + (HIGHLIGHT_NUM++);  // highlight id, used for finding span on page change
	this.private  = false;	// boolean value, true if highlight is private

	
	// set node.id (element on page) to highlight.id
	$(this.node).attr("id", this.id);

	// function used to add a note to our highlight.
	// PARAMS: A string containing the note text
	Highlight.prototype.addNote = function(note) {
		this.note = note;
		this.question = false;
		this.type = NOTE;
		this.color = HIGHLIGHT_COLOR;

		$(this.node).css("background-color", HIGHLIGHT_COLOR);

		$(this.icon).removeClass("question");
		$(this.icon).addClass("note");
		$(this.icon).css("top", this.node.offsetTop + (0.5 * this.node.offsetHeight) - 11);
	
		if (this.pageNum % 2 === 0) $(this.icon).css("right", "2px");
		else $(this.icon).css("left", "2px");

		$(this.icon).show();
	};

	// function used to add a question to our highlight.
	// PARAMS: A string containing the question text
	Highlight.prototype.addQuestion = function(question) {
		this.question = question;
		this.note = false;
		this.type = QUESTION;
		this.color = "#9999FF";
		
		$(this.node).css("background-color", "#9999FF");

		$(this.icon).removeClass("note");
		$(this.icon).addClass("question");
		$(this.icon).css("top", this.node.offsetTop + (0.5 * this.node.offsetHeight) - 9);
	
		if (this.pageNum % 2 === 0) $(this.icon).css("right", "2px");
		else $(this.icon).css("left", "2px");

		$(this.icon).show();
	};

	// function used to clear question/note type and
	// revert highlight type back to NONE.
	Highlight.prototype.clearType = function() {
		this.question = false;
		this.note = false;
		this.type = NONE;
		this.color = HIGHLIGHT_COLOR;

		$(this.node).css("background-color", this.color);
		$(this.icon).hide();
	};

	// function called to set the popUp value for
	// the highlight.  Value differs based on highlight TYPE.
	Highlight.prototype.setPopVal = function() {
		// if highlight is of type NONE
		if(this.type==NONE) {
			$(this.popUp).html(" my highlight");
			var del = document.createElement('a');
			del.innerHTML = "delete";
			del.className = "popText";

			var theObj = this;
			$(del).click(function(e) {
				theObj.remove();
			});
			$(this.popUp).prepend(del);

		}
		
		// if highlight is of type NOTE
		else if(this.type==NOTE) {
			$(this.popUp).html("<b class=\"popText\">my note:</b><br><span class=\"popText\">" + this.note + "</span><br>");
			var edit = document.createElement('a');
			edit.innerHTML = "edit";
			edit.className = "popText pull-left";
			var theObj = this;
			$(edit).click(function() { hideHighlightPops(); loadAddNote("editNote", theObj); });
			$(this.popUp).append(edit);
		}
		
		// if highlight is of type QUESTION
		else if(this.type==QUESTION) {
			$(this.popUp).html("<b class=\"popText\">my question:</b><br><span class=\"popText\">" + this.question + "</span><br>");
			var edit = document.createElement('a');
			edit.innerHTML = "edit";
			edit.className = "popText pull-right";
			var theObj = this;
			$(edit).click(function() { hideHighlightPops(); loadAddNote("editQuestion", theObj); });
			
			var responses = document.createElement('a');
			responses.innerHTML = "0 responses";
			responses.className = "popText pull-left";
			$(this.popUp).append(edit);
			$(this.popUp).append(responses);
		}
	};

	// function used to clear popUp value.
	// needed when changing popValue and to prevent
	// range selection of popUp innerHTML.
	Highlight.prototype.clearPop = function() {
		$(this.popUp).html("");
	};

	// function used to hide highlight on the page.
	Highlight.prototype.hide = function() {
		$(this.node).css("background-color", "white");
		$(this.icon).hide();
	};

	// function used to show highlight on the page.
	Highlight.prototype.show = function() {
		$(this.node).css("background-color", this.color);
		$(this.icon).show();
	};

	// function used to remove the entire highlight from DOM.
	Highlight.prototype.remove = function() {
		this.remove();
	};

	this.remove = function() {
		if(this.type!=NONE) this.node.removeChild(this.icon);
		this.node.removeChild(this.popUp);

		$(this.node.firstChild).unwrap();
		highlights.splice(highlights.indexOf(this), 1);

		loadLeftNotesPage();
		loadRightNotesPage();
	};
}