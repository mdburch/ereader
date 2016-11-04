var highlightMode = false; //boolean value, true if highligher mode is on
var noteMode = false; //boolean value, true if note/question mode is on
var showMy = true; //boolean value, true if showing my markup
var showGroup = true; //boolean value, true if showing group markup

var showUserMarkup = true; // boolean value, true if the user's icon is pressed on the all markup page
var showGroupsMarkup = true;  // boolean value, true if the groups's icon is pressed on the all markup page
var showQuestionsMarkup = true;  // boolean value, true if the question icon is pressed on the all markup page


function loadLeftNotesPage() {
	$("#leftPageHeader").html("<h4> Notes for page " +  $(".left").attr("id") + "</h4><hr/>");

	$("#leftPageText").empty();

	//Update the text body with the notes
	var temp = getPageNotes($(".left").attr("id"));
	//if we have notes to add, lets put a title in
	if (temp.length != 0) {
	var title = document.createElement("h5");
	title.innerHTML = "notes:"
	$("#leftPageText").append(title);
	}
	//now iterate over our notes
	for(var i = 0; i < temp.length; i++) {
	//make a note
	var note = document.createElement("p");
	note.className = "notesNote";
	note.innerHTML =  temp[i].note;
	//add it to our note page text
	$("#leftPageText").append(note);
	}

	//Update the text body with questions
	temp = getPageQuestions($(".left").attr("id"));
	//if we have questions to add, lets put a title in
	if (temp.length != 0) {
	$("#leftPageText").append(document.createElement("hr"));
	var title = document.createElement("h5");
	title.innerHTML = "questions:"
	$("#leftPageText").append(title);
	}
	//now iterate over our questions
	for(var i = 0; i < temp.length; i++) {
	//make a question
	var question = document.createElement("p");
	question.className = "notesQuestion";
	question.innerHTML =  temp[i].question;
	//add it to our note page text
	$("#leftPageText").append(question);
	}

	//Update the text body with highlights
	temp = getPageHighlights($(".left").attr("id"));
	//if we have highlights to add, lets put a title in
	if (temp.length != 0) {
	$("#leftPageText").append(document.createElement("hr"));
	var title = document.createElement("h5");
	title.innerHTML = "highlights:"
	$("#leftPageText").append(title);
	}
	//now iterate over our highlights
	for(var i = 0; i < temp.length; i++) {
	//make a highlight
	var highlight = document.createElement("p");
	highlight.className = "notesHighlight";
	highlight.innerHTML =  "\"" + temp[i] + "\"";
	//add it to our note page text
	$("#leftPageText").append(highlight);
	}

	//Update page note
	$("#leftPageNoteText").val(getPageNote($(".left").attr("id")));
}

function loadRightNotesPage() {
	$("#rightPageHeader").html("<h4> Notes for page " +  $(".right").attr("id") + "</h4><hr/>");

	$("#rightPageText").empty();
	
	//Update the text body with the notes
	var temp = getPageNotes($(".right").attr("id"));
	//if we have notes to add, lets put a title in
	if (temp.length != 0) {
		var title = document.createElement("h5");
		title.innerHTML = "notes:"
		$("#rightPageText").append(title);
	}
	//now itterate over our notes
	for(var i = 0; i < temp.length; i++) {
		//make a note
		var note = document.createElement("p");
		note.className = "notesNote";
		note.innerHTML =  temp[i].note;
		//add it to our note page text
		$("#rightPageText").append(note);
	}

	//Update the text body with questions
	temp = getPageQuestions($(".right").attr("id"));
	//if we have questions to add, lets put a title in
	if (temp.length != 0) {
		$("#rightPageText").append(document.createElement("hr"));
		var title = document.createElement("h5");
		title.innerHTML = "questions:"
		$("#rightPageText").append(title);
	}
	//now itterate over our questions
	for(var i = 0; i < temp.length; i++) {
		//make a question
		var question = document.createElement("p");
		question.className = "notesQuestion";
		question.innerHTML =  temp[i].question;
		//add it to our note page text
		$("#rightPageText").append(question);
	}

	//Update the text body with highlights
	temp = getPageHighlights($(".right").attr("id"));
	//if we have highlights to add, lets put a title in
	if (temp.length != 0) {
		$("#rightPageText").append(document.createElement("hr"));
		var title = document.createElement("h5");
		title.innerHTML = "highlights:"
		$("#rightPageText").append(title);
	}
	//now itterate over our highlights
	for(var i = 0; i < temp.length; i++) {
		//make a highlight
		var highlight = document.createElement("p");
		highlight.className = "notesHighlight";
		highlight.innerHTML =  "\"" + temp[i] + "\"";
		//add it to our note page text
		$("#rightPageText").append(highlight);
	}
	
	//Update page note
	$("#rightPageNoteText").val(getPageNote($(".right").attr("id")));
}


// on load we set up a number of listeners and
// load content of certain page related elements
$(document).ready(function() {

    //depress my/group markup buttons
    $("#my_markup").button('toggle'); 
    $("#group_markup").button('toggle')

	//listener for highlight mode button
    $("#highlight").click(function() {
        $(this).toggleClass("down");        
        highlightMode = !(highlightMode);
        
        if(noteMode) {
            $("#addnote").removeClass('down');
            noteMode = false;
        }
    });

    //listener for note/question mode button
	    $('#addnote').click(function(){
        $(this).toggleClass("down");
		 noteMode = !(noteMode);
		 
		if(highlightMode) {
            $("#highlight").removeClass('down');
            highlightMode = false;
        }
    });
	//Old addnote click function
    /*$("#addnote").click(function() {
        $(this).button('toggle');
        noteMode = !(noteMode);
        
        if(highlightMode) {
            $("#highlight").button('toggle');
            highlightMode = false;
        }
    });*/

	//listener for all markup pages buttons
	$('#userIcon').click(function(){
        $(this).toggleClass("down");
		 showUserMarkup = !(showUserMarkup);
		 populateAllMarkup();
	});	 
	
	$('#groupIcon').click(function(){
        $(this).toggleClass("down");
		 showGroupsMarkup = !(showGroupsMarkup);
		 populateAllMarkup();
	});	 

	$('#allQuestionsIcon').click(function(){
        $(this).toggleClass("down");
		 showQuestionsMarkup = !(showQuestionsMarkup);
		 populateAllMarkup();
	});
	
    //listener for my markup button
    $("#my_markup").click(function() {
        if(showMy) {
            for(var i = 0; i < highlights.length; i++) {
                highlights[i].hide();
            }
			$(this).removeClass('down');
            showMy = false;
        }
        else {
            for(var i = 0; i < highlights.length; i++) {
                highlights[i].show();
            }
			$(this).toggleClass("down");
            showMy = true;
        }
    });

    //listener for group markup button
    $("#group_markup").click(function() {
        $(this).removeClass('down');
        if(showGroup) {
            $(".page").children(".groupHighlight").css("background-color", "white");
            $(".page").children(".groupQuestion").css("background-color", "white");
			$(this).removeClass('down');
             showGroup = false;
        }
        else {
            $(".page").children(".groupHighlight").css("background-color", "#FFFFCC");
            $(".page").children(".groupQuestion").css("background-color", "#C7C7FF");
			$(this).toggleClass("down");
             showGroup = true;
        }
    });

    //listener for table of content button
    $("#table").click(function() {
        $("#tableModal").modal('show');
    });

    //listener for all markup button
    $("#all_markup").click(function() {
		populateAllMarkup();
	});
	
	
	function populateAllMarkup()
	{
        $("#markupModal").modal('show');
        
        $("#chapter-1").empty();
        $("#chapter-2").empty();
        $("#chapter-3").empty();
        $("#chapter-4").empty();
        $("#chapter-5").empty();
        $("#chapter-6").empty();
        $("#chapter-7").empty();
        $("#chapter-8").empty();
        $("#chapter-9").empty();
        $("#chapter-10").empty();
        $("#chapter-11").empty();
        $("#chapter-12").empty();
        
		if(showUserMarkup)
		{		
			//Update the text body with the notes
			var temp = getAllNotes();
			
			//Getting all of the page notes
			for(var i = 1; i <= 74; i++) {
				var n = getPageNote(i);
				if(n != undefined)
				{
					temp.push({ text: "", note: n, pageNum: i });
				}
			}
			//sorting notes by page
			temp.sort(function(a, b){
				return a.pageNum-b.pageNum;
			});
			//now iterate over our notes
			for(var i = 0; i < temp.length; i++) {
				//make a note
				var note = document.createElement("p");
				note.className = "notesNote";
				note.innerHTML =  "<b>Page " + temp[i].pageNum + ":</b> " + temp[i].note;
				note.setAttribute("onClick","loadPage(" + temp[i].pageNum + ")");
				//ch1
				if (temp[i].pageNum < 6) {
					$("#chapter-1").append(note);
				//ch2
				} else if (temp[i].pageNum < 10) {
					$("#chapter-2").append(note);
				//ch3
				} else if (temp[i].pageNum < 15) {
					$("#chapter-3").append(note);
				//ch4
				} else if (temp[i].pageNum < 21) {
					$("#chapter-4").append(note);
				//ch5
				} else if (temp[i].pageNum < 27) {
					$("#chapter-5").append(note);
				//ch6
				} else if (temp[i].pageNum < 34) {
					$("#chapter-6").append(note);
				//ch7
				} else if (temp[i].pageNum < 41) {
					$("#chapter-7").append(note);
				//ch8
				} else if (temp[i].pageNum < 49) {
					$("#chapter-8").append(note);
				//ch9
				} else if (temp[i].pageNum < 56) {
					$("#chapter-9").append(note);
				//ch10
				} else if (temp[i].pageNum < 63) {
					$("#chapter-10").append(note);
				//ch11
				} else if (temp[i].pageNum < 68) {
					$("#chapter-11").append(note);
				//ch12
				} else {
					$("#chapter-12").append(note);
				}
			}
			
			//Update the text body with highlights
			temp = getAllHighlights();
			
			//sorting highlights by page
		    temp.sort(function(a, b){
				return a.pageNum-b.pageNum;
			});
			//now iterate over our highlights
			for(var i = 0; i < temp.length; i++) {
				//make a highlight
				var highlight = document.createElement("p");
				highlight.className = "notesHighlight";
				highlight.innerHTML =  "<b>Page " + temp[i].pageNum + ":</b> \"" + temp[i].text + "\"";
				highlight.setAttribute("onClick","loadPage(" + temp[i].pageNum + ")");
				//add it to our note page text
				//ch1
				if (temp[i].pageNum < 6) {
					$("#chapter-1").append(highlight);
				//ch2
				} else if (temp[i].pageNum < 10) {
					$("#chapter-2").append(highlight);
				//ch3
				} else if (temp[i].pageNum < 15) {
					$("#chapter-3").append(highlight);
				//ch4
				} else if (temp[i].pageNum < 21) {
					$("#chapter-4").append(highlight);
				//ch5
				} else if (temp[i].pageNum < 27) {
					$("#chapter-5").append(highlight);
				//ch6
				} else if (temp[i].pageNum < 34) {
					$("#chapter-6").append(highlight);
				//ch7
				} else if (temp[i].pageNum < 41) {
					$("#chapter-7").append(highlight);
				//ch8
				} else if (temp[i].pageNum < 49) {
					$("#chapter-8").append(highlight);
				//ch9
				} else if (temp[i].pageNum < 56) {
					$("#chapter-9").append(highlight);
				//ch10
				} else if (temp[i].pageNum < 63) {
					$("#chapter-10").append(highlight);
				//ch11
				} else if (temp[i].pageNum < 68) {
					$("#chapter-11").append(highlight);
				//ch12
				} else {
					$("#chapter-12").append(highlight);
				}
			}
			
			if(showQuestionsMarkup)
			{
				//Update the text body with questions
				temp = getAllQuestions();
				
				//sorting questions by page
				temp.sort(function(a, b){
				return a.pageNum-b.pageNum;
				});
				
				//now iterate over our questions
				for(var i = 0; i < temp.length; i++) {
					//make a question
					var question = document.createElement("p");
					question.className = "notesQuestion";
					question.innerHTML =  "<b>Page " + temp[i].pageNum + ":</b> " + temp[i].question;
					question.setAttribute("onClick","loadPage(" + temp[i].pageNum + ")");
					//add it to our note page text
					//ch1
					if (temp[i].pageNum < 6) {
						$("#chapter-1").append(question);
					//ch2
					} else if (temp[i].pageNum < 10) {
						$("#chapter-2").append(question);
					//ch3
					} else if (temp[i].pageNum < 15) {
						$("#chapter-3").append(question);
					//ch4
					} else if (temp[i].pageNum < 21) {
						$("#chapter-4").append(question);
					//ch5
					} else if (temp[i].pageNum < 27) {
						$("#chapter-5").append(question);
					//ch6
					} else if (temp[i].pageNum < 34) {
						$("#chapter-6").append(question);
					//ch7
					} else if (temp[i].pageNum < 41) {
						$("#chapter-7").append(question);
					//ch8
					} else if (temp[i].pageNum < 49) {
						$("#chapter-8").append(question);
					//ch9
					} else if (temp[i].pageNum < 56) {
						$("#chapter-9").append(question);
					//ch10
					} else if (temp[i].pageNum < 63) {
						$("#chapter-10").append(question);
					//ch11
					} else if (temp[i].pageNum < 68) {
						$("#chapter-11").append(question);
					//ch12
					} else {
						$("#chapter-12").append(question);
					}
				}
				//Add classmate's question
				var title = document.createElement("p");
				title.innerHTML = "<b>Classmate Questions</b>";
				$("#chapter-4").append(title);
				
				var note = document.createElement("p");
				note.className = "notesQuestion";
				note.innerHTML =  "<b>Stan's Question Page 15:</b> " + "Can someone clarify what's going on here? I think I missed something, can anyone help?";
				note.setAttribute("onClick","loadPage(15)");
				$("#chapter-4").append(note);
			}
		}
		//Add groups markup
		if(showGroupsMarkup)
		{
			var title = document.createElement("p");
			title.innerHTML = "<b>Classmate Notes</b>";
			$("#chapter-1").append(title);
			var title = document.createElement("p");
			title.innerHTML = "<b>Classmate Notes</b>";
			$("#chapter-3").append(title);
			var title = document.createElement("p");
			title.innerHTML = "<b>Classmate Notes</b>";
			$("#chapter-4").append(title);
			
			var note = document.createElement("p");
			note.className = "notesNote";
			note.innerHTML =  "<b>Stan's note Page 2:</b> " + "We spend so much time in life worrying about time when sometimes we need to just let unpredictability happen";
			note.setAttribute("onClick","loadPage(2)");
			$("#chapter-1").append(note);

			var note = document.createElement("p");
			note.className = "notesNote";
			note.innerHTML =  "<b>Mark's Note Page 11:</b> " + "We expect certain events in life like races to follow general rules that are completely violated here.";
			note.setAttribute("onClick","loadPage(11)");
			$("#chapter-3").append(note);				

			var note = document.createElement("p");
			note.className = "notesNote";
			note.innerHTML =  "<b>Phil's Note Page 12:</b> " + "This seems to poke fun at the world idea that we should always be getting awards/trophies.";
			note.setAttribute("onClick","loadPage(12)");
			$("#chapter-3").append(note);

			var note = document.createElement("p");
			note.className = "notesNote";
			note.innerHTML =  "<b>Marie's Note Page 14:</b> " + "The world is progressively living in fear even in the safest places.";
			note.setAttribute("onClick","loadPage(14)");
			$("#chapter-3").append(note);				

			var note = document.createElement("p");
			note.className = "notesNote";
			note.innerHTML =  "<b>Sarah's Note Page 14:</b> " + "People are willing to try many things without thinking of the consequences.";
			note.setAttribute("onClick","loadPage(14)");
			$("#chapter-4").append(note);	
			
			var note = document.createElement("p");
			note.className = "notesNote";
			note.innerHTML =  "<b>Phil's Note Page 16:</b> " + "Sometimes in our life we get into sitautions where we fell like a giant trapped in a small room and do not know how to get out.";
			note.setAttribute("onClick","loadPage(16)");
			$("#chapter-4").append(note);	

			//Add the text that corresponds to the notes
			var title = document.createElement("p");
			title.innerHTML = "<b>Classmate Highlights</b>";
			$("#chapter-1").append(title);
			var title = document.createElement("p");
			title.innerHTML = "<b>Classmate Highlights</b>";
			$("#chapter-3").append(title);
			var title = document.createElement("p");
			title.innerHTML = "<b>Classmate Highlights</b>";
			$("#chapter-4").append(title);
			
			var highlight = document.createElement("p");
			highlight.className = "notesHighlight";
			highlight.innerHTML =  "<b>Stan's Highlight Page 2</b> \"but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.\"";
			highlight.setAttribute("onClick","loadPage(2)");
			$("#chapter-1").append(highlight);
			
			var highlight = document.createElement("p");
			highlight.className = "notesHighlight";
			highlight.innerHTML =  "<b>Mark's Highlight Page 11</b> \"First it marked out a race-course, in a sort of circle, ('the exact shape doesn't matter,' it said,) and then all the party were placed along the course, here and there. There was no 'One, two, three, and away,' but they began running when they liked, and left off when they liked, so that it was not easy to know when the race was over. However, when they had been running half an hour or so, and were quite dry again, the Dodo suddenly called out 'The race is over!' and they all crowded round it, panting, and asking, 'But who has won?'\"";
			highlight.setAttribute("onClick","loadPage(11)");
			$("#chapter-3").append(highlight);
			
			var highlight = document.createElement("p");
			highlight.className = "notesHighlight";
			highlight.innerHTML =  "<b>Phil's Highlight Page 12</b> \"Then they all crowded round her once more, while the Dodo solemnly presented the thimble, saying 'We beg your acceptance of this elegant thimble'; and, when it had finished this short speech, they all cheered.\"";
			highlight.setAttribute("onClick","loadPage(12)");
			$("#chapter-3").append(highlight);
			
			var highlight = document.createElement("p");
			highlight.className = "notesHighlight";
			highlight.innerHTML =  "<b>Marie's Highlight Page 14</b> \"This speech caused a remarkable sensation among the party. Some of the birds hurried off at once: one old Magpie began wrapping itself up very carefully, remarking, 'I really must be getting home; the night-air doesn't suit my throat!' and a Canary called out in a trembling voice to its children, 'Come away, my dears! It's high time you were all in bed!' \"";
			highlight.setAttribute("onClick","loadPage(14)");
			$("#chapter-3").append(highlight);

			var highlight = document.createElement("p");
			highlight.className = "notesHighlight";
			highlight.innerHTML =  "<b>Phil's Highlight Page 15</b> \"Very soon the Rabbit noticed Alice, as she went hunting about, and called out to her in an angry tone, 'Why, Mary Ann, what ARE you doing out here? Run home this moment, and fetch me a pair of gloves and a fan! Quick, now!' And Alice was so much frightened that she ran off at once in the direction it pointed to, without trying to explain the mistake it had made.\"";
			highlight.setAttribute("onClick","loadPage(15)");
			$("#chapter-4").append(highlight);
			
			var highlight = document.createElement("p");
			highlight.className = "notesHighlight";
			highlight.innerHTML =  "<b>Sarah's Highlight Page 16</b> \"It did so indeed, and much sooner than she had expected: before she had drunk half the bottle, she found her head pressing against the ceiling, and had to stoop to save her neck from being broken. She hastily put down the bottle, saying to herself 'That's quite enough--I hope I shan't grow any more--As it is, I can't get out at the door--I do wish I hadn't drunk quite so much!' \"";
			highlight.setAttribute("onClick","loadPage(16)");
			$("#chapter-4").append(highlight);

			var highlight = document.createElement("p");
			highlight.className = "notesHighlight";
			highlight.innerHTML =  "<b>Phil's Highlight Page 16</b> \"Luckily for Alice, the little magic bottle had now had its full effect, and she grew no larger: still it was very uncomfortable, and, as there seemed to be no sort of chance of her ever getting out of the room again, no wonder she felt unhappy.\"";
			highlight.setAttribute("onClick","loadPage(16)");
			$("#chapter-4").append(highlight);
			
		}
	
		//Check if the chapters are empty
		if(!$('#chapter-1:empty').length <=0){
			$("#chapter-1").append("No one has added anything yet!");
		}	
		if(!$('#chapter-2:empty').length <=0){
			$("#chapter-2").append("No one has added anything yet!");
		}
		if(!$('#chapter-3:empty').length <=0){
			$("#chapter-3").append("No one has added anything yet!");
		}
		if(!$('#chapter-4:empty').length <=0){
			$("#chapter-4").append("No one has added anything yet!");
		}
		if(!$('#chapter-5:empty').length <=0){
			$("#chapter-5").append("No one has added anything yet!");
		}
		if(!$('#chapter-6:empty').length <=0){
			$("#chapter-6").append("No one has added anything yet!");
		}
		if(!$('#chapter-7:empty').length <=0){
			$("#chapter-7").append("No one has added anything yet!");
		}
		if(!$('#chapter-8:empty').length <=0){
			$("#chapter-8").append("No one has added anything yet!");
		}
		if(!$('#chapter-9:empty').length <=0){
			$("#chapter-9").append("No one has added anything yet!");
		}
		if(!$('#chapter-10:empty').length <=0){
			$("#chapter-10").append("No one has added anything yet!");
		}
		if(!$('#chapter-11:empty').length <=0){
			$("#chapter-11").append("No one has added anything yet!");
		}
		if(!$('#chapter-12:empty').length <=0){
			$("#chapter-12").append("No one has added anything yet!");
		}
	}
	
	//listener for search button
    $("#searchButton").click(function() {
			populateSearchResults();
	});
	
	//listener for the show notes of the left page
	 $("#show_page1").click(function() {
			//Populate the left page notes
			$("#leftPagePopUp").toggle("fast");
			
			loadLeftNotesPage();

			//Change the label values
			if($("#show_page1").val() == "SHOW")
			{
				$("#show_page1").html("Hide page " + $(".left").attr("id") + " notes");
				$("#show_page1").val("HIDE"); //specifies that the hide message is showing
				
				// Make the page 2 modal hidden if need to be 
				//need to add code for the page2 modal to be toggled off.
				$("#show_page2").html("Show page " + $(".right").attr("id") + " notes");
				$("#show_page2").val("SHOW"); //specifies that the show message is showing
				$("#rightPagePopUp").hide(); //hide the right page popup
			}
			else if ($("#show_page1").val() == "HIDE")
			{
				$("#show_page1").html("Show page " + $(".left").attr("id") + " notes");
				$("#show_page1").val("SHOW"); //specifies that the show message is showing
			}
	 });
	 
	 //listener for the show notes of the right page
	 $("#show_page2").click(function() {		
			// Populate the right page notes
			$("#rightPagePopUp").toggle("fast");

			loadRightNotesPage();
			
			//Change the label values 
			if($("#show_page2").val() == "SHOW")
			{
				$("#show_page2").html("Hide page " + $(".right").attr("id") + " notes");
				$("#show_page2").val("HIDE"); //specifies that the hide message is showing
				
				// Make the page 1 modal hidden if need to be 
				//need to add code for the page1 modal to be toggled off.
				$("#show_page1").html("Show page " + $(".left").attr("id") + " notes");
				$("#show_page1").val("SHOW"); //specifies that the show message is showing
				$("#leftPagePopUp").hide(); //hide the left page popup
			}
			else if ($("#show_page2").val() == "HIDE")
			{
				$("#show_page2").html("Show page " + $(".right").attr("id") + " notes");
				$("#show_page2").val("SHOW"); //specifies that the show message is showing
			}
	 });
	 
	 //listener for the left notes page cancel button
	$("#leftNotesPageCancel").click(function() {
		$("#show_page1").html("Show page " + $(".left").attr("id") + " notes");
		$("#show_page1").val("SHOW"); //specifies that the show message is showing
		$("#leftPagePopUp").hide();
	 });
	 
	//listener for the right notes page cancel button
	$("#rightNotesPageCancel").click(function() {
		$("#show_page2").html("Show page " + $(".right").attr("id") + " notes");
		$("#show_page2").val("SHOW"); //specifies that the show message is showing
		$("#rightPagePopUp").hide();
	 });
	
	//listener for the left notes page submit button
	$("#leftNotesPageSubmit").click(function() {
		//save page note
		setPageNote($(".left").attr("id"), $("#leftPageNoteText").val());
		$("#show_page1").html("Show page " + $(".left").attr("id") + " notes");
		$("#show_page1").val("SHOW"); //specifies that the show message is showing
		$("#leftPagePopUp").hide();
	 });
	 	
	//listener for the right notes page submit button
	$("#rightNotesPageSubmit").click(function() {
		//save page note
		setPageNote($(".right").attr("id"), $("#rightPageNoteText").val());
		$("#show_page2").html("Show page " + $(".right").attr("id") + " notes");
		$("#show_page2").val("SHOW"); //specifies that the show message is showing
		$("#rightPagePopUp").hide();
	 });	

});

function populateSearchResults()
{
		document.getElementById("searchResultsBody").innerHTML = "";
		var result	= $('#search').val()
		$("#searchResultsLabel").html("Search results for: " + result);
        
		xmlhttp = new XMLHttpRequest();

		xmlhttp.open("GET", "Alice.xml", false);
		xmlhttp.send();
		xmlDoc = xmlhttp.responseXML;   
		
		var resultSet;
		if(result == "croquet")
		{
			resultSet = "croquetResult";
		}
		else if (result == "caucus")
		{
			resultSet = "caucusResult";
		}
		else if (result == "tarts")
		{
			resultSet = "tartResult";
		}
		else
		{
			resultSet = "none";
		}

		for(var i = 0; i < xmlDoc.getElementsByTagName(resultSet).length; i++) {
			document.getElementById("searchResultsBody").innerHTML += xmlDoc.getElementsByTagName(resultSet)[i].childNodes[1].nodeValue;
			document.getElementById("searchResultsBody").innerHTML += "<hr><br>"; 
		} 
		//Print a message if no results
		if(resultSet == "none")
		{
			document.getElementById("searchResultsBody").innerHTML = "No results. Please try again!";
		}
			
		$("#searchModal").modal('show');	
}