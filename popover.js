/*********************************************************
 InnerHTML for Pop Menu
 add variables here to add type
**********************************************************/

var MODE_NONE = "<li><a href=\"javascript:void(0)\" id=\"po0\">highlight selection</a></li>\
				<li><a href=\"javascript:void(0)\" id=\"po1\">add note/question</a></li>"

var SEL_HIGH = "<li><a href=\"javascript:void(0)\" id=\"po0\">remove highlight</a></li>\
				<li><a href=\"javascript:void(0)\" id=\"po1\">add note/question</a></li>"

var SEL_NOTE = "<li><a href=\"javascript:void(0)\" id=\"po0\">remove note</a></li>\
				<li><a href=\"javascript:void(0)\" id=\"po1\">edit note</a></li>"

var SEL_QUES = "<li><a href=\"javascript:void(0)\" id=\"po0\">remove question</a></li>\
				<li><a href=\"javascript:void(0)\" id=\"po1\">edit question</a></li>"

//true if popMenu is visible
var popped = false;
var tempHigh = null;

//JavaScript object used to store event mouse position
function mousePosition()  {
	this.X;
	this.Y;
};

//Global variable holding event mouse position
var clickPosition = new mousePosition();


/*
 * On load, we set up our pop menu
 */
$(document).ready(function() {
	var pop = document.createElement("div");
	pop.innerHTML = "<ul class=\"dropdown-menu pop-menu\"></ul>";
	pop.id = "pop_menu";
	$(pop).hide();
	$("body").append(pop);
});

/*
 * Function to open pop menu and set location
 */
function pop(value, width, height) {
	if(!value) {
		$("#pop_menu").children(".pop-menu").removeClass("note_pop");
		$("#pop_menu").hide();
		if(tempHigh!==null) {
			tempHigh.remove();
			tempHigh = null;
		}
		popped = false;
	} else {
		if(clickPosition.X + width > window.innerWidth) $("#pop_menu").css("padding-left", clickPosition.X - width);
		else $("#pop_menu").css("padding-left", clickPosition.X);
		
		if(clickPosition.Y + height > window.innerHeight) $("#pop_menu").css("padding-top", clickPosition.Y - height);
		else $("#pop_menu").css("padding-top", clickPosition.Y);
		
		$("#pop_menu").show();
		popped = true;
	}

}

/*
 * Function that sets innerHTML of pop menu.
 * Also opens menu and sets menu selection listeners.
 */
function openPop(type, highlight) {
	hideHighlightPops();
	$("#po0").unbind("click");
	$("#po1").unbind("click");
	$("#pop_menu").children(".pop-menu").html(type);
	pop(true, 162, 64);

	
	//for each type, we set up different listeners
	//most remain unimplemented
	if(type==MODE_NONE) {
		//highlight selection
		$("#po0").click(function() {
			highlights.push(new Highlight(document.getSelection().getRangeAt(0)));
			setHighlightPops();
			pop(false, 162, 64);
		});
		//add note
		$("#po1").click(function() {
			var index = highlights.push(new Highlight(document.getSelection().getRangeAt(0)));
			loadAddNote("addNote", highlights[index-1]);
		});
	}

	if(type==SEL_HIGH) {
		//remove highlight
		$("#po0").click(function() {
			highlight.remove();
			setHighlightPops();
			pop(false, 162, 64);
		});
		//add note to highlight
		$("#po1").click(function() {
			loadAddNote("addNote", highlight);
		});
	}

	if(type==SEL_NOTE) {
		//remove note
		$("#po0").click(function() {
			highlight.clearType();
			setHighlightPops();
		});
		//edit note
		$("#po1").click(function() {
			loadAddNote("editNote", highlight);
		});
	}

	if(type==SEL_QUES) {
		//remove question
		$("#po0").click(function() {
			highlight.clearType();
			setHighlightPops();
		});
		//edit question
		$("#po1").click(function() {
			loadAddNote("editQuestion", highlight);
		});
	}
}

function loadAddNote(type, highlight) {
	if(noteMode) $("#pop_menu").children(".pop-menu").html("");
	if(type=="addNote") tempHigh = highlight;

	if(type=="editNote" && !popped) pop(true, 336, 203); 
	if(type=="editQuestion" && !popped) pop(true, 336, 203); 

	$("#pop_menu").load("addNote.html", function() {
		if(noteMode) pop(true, 336, 203);
		else {
			if(clickPosition.X + 336 > window.innerWidth) $("#pop_menu").css("padding-left", clickPosition.X - 336);
			if(clickPosition.Y + 203 > window.innerHeight) $("#pop_menu").css("padding-top", clickPosition.Y - 203);
		}

		highlight.private ? $('#private').attr("checked", true) : $('#private').attr("checked", false);

		//set up popMenu according to whether this is a note, or a question
		if(type=="addNote" || type=="editNote")
			$("#addNote").button('toggle');
		else {
			$("#private").attr("checked", false);
			$("#private").attr("disabled", true);
			$("#askQues").button('toggle');
			$("#add_help_text").html("QUESTION:");
			$("#submit_note").html("ask");
		}

		//set up popMenu for editing
		if(type=="editNote" || type=="editQuestion") {

			if(highlight.type=="note") $("#note_textarea").val(highlight.note);
			else if(highlight.type=="question") $("#note_textarea").val(highlight.question);
			
			$("#cancel_note").html("delete");
			$("#cancel_note").click(function() {
				highlight.clearType();
				setHighlightPops();
				pop(false);
			});
		} 
		//if not, set up for adding
		else {
			$("#cancel_note").click(function() {
				highlight.remove();
				tempHigh = null;
				pop(false);
			});
		}

		$("#submit_note").click(function() {
			if($("#note_textarea").val()!="") {

				if($("#add_help_text").html()=="NOTE:") highlight.addNote( $("#note_textarea").val() );

				else if($("#add_help_text").html()=="QUESTION:") highlight.addQuestion( $("#note_textarea").val() );
				
				$("#private").is(":checked") ? highlight.private = true : highlight.private = false;
				if(noteMode) highlights.push(highlight);
				setHighlightPops();
				tempHigh = null;
				pop(false);
			}
		});

		$("#addNote").click(function() {
			$("#add_help_text").html("NOTE:");
			$("#submit_note").html("save");
			$("#private").attr("disabled", false);
		});

		$("#askQues").click(function() {
			$("#add_help_text").html("QUESTION:");
			$("#submit_note").html("ask");
			$("#private").attr("checked", false);
			$("#private").attr("disabled", true);
		});

	});
}