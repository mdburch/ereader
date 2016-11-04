var visited_pages = new Array(); 
var groupHighlighters = new Array("Stan's note: We spend so much time in life worrying about time when sometimes we need to just let unpredictability happen", "Mark's note: We expect certain events in life like races to follow general rules that are completely violated here.", "Phil's note: This seems to poke fun at the world idea that we should always be getting awards/trophies.", "Marie's note: The world is progressively living in fear even in the safest places.", "Sarah's note: People are willing to try many things without thinking of the consequences.","Phil's note: Sometimes in our life we get into sitautions where we fell like a giant trapped in a small room and do not know how to get out. ");
var qCount = 0;
var qResponse = "";
//keeps track of already visited pages, 
//stores a JavaScript Object with params: num (the page number)
//                                        page (page innerHTML)

var lastPage; //int representing the final page of the book

function incrementQCount() {
    qCount++;
    qResponse = $("#resp_textarea").val();
    setGroupPops();
    pop(false);
}

/* AJAX function to retrieve a page from the ALICE.XML file.
 * params: int value representing the page to be retrieved 
 * returns: innerHTML for page (value of XML page node)
*/
 function getPage(pageNum) { 

     for(var i = 0; i < visited_pages.length; i++) { 
        if(visited_pages[i].num == pageNum)
            return visited_pages[i].page;
    }
    pageNum--; 
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", "Alice.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;	
    pageData = xmlDoc.getElementsByTagName("page")[pageNum].childNodes[1].nodeValue;
    
    if(lastPage == undefined)
        lastPage = xmlDoc.getElementsByTagName("page").length; 
    
    return pageData; 
}

//will call the populate search results function found in buttons.js when the enter key is pressed on search bar
function getSearchResults(e)
{
	if(e.keyCode == 13)// 13 is the enter key
	{
		populateSearchResults();
	}
}
//will be called when the user enters in their own page number to navigate to.
function changePage(e)
{
	if(e.keyCode == 13)// 13 is the enter key
	{
        page = $("#pagenum").val(); //get page value
        if (page < lastPage && page > 0) //check if a valid value
		{
			if(page%2==1) page++; //page must be even to work (strange)
		
			loadPage(page);//will load the page the user enters
		}
		else 
		{
			$("#pagenum").val(pageNum);
		}
	}
}


/* AJAX function used to load table of contents from ALICE XML file
 * sets innerHTML of tableBody div according to chapter tag content 
 * retrieved from XML file.
 * takes no params, returns void.
*/
function loadTable() {
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", "Alice.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;   

    for(var i = 0; i < xmlDoc.getElementsByTagName("chapter").length; i++) {
        document.getElementById("tableBody").innerHTML += xmlDoc.getElementsByTagName("chapter")[i].childNodes[1].nodeValue;
        document.getElementById("tableBody").innerHTML += "<br>";
    } 
}

function setGroupPops() {
    $(".groupQuestion").unbind("click");
    $(".groupHighlight").unbind("click");

    $(".groupHighlight").click(function(event) {
        if(!popped && document.getSelection() == "") {

            clickPosition.X = event.clientX;
            clickPosition.Y = event.clientY;

            if($(this).children().length==0) {
                popUp = document.createElement("div");
                
                $(popUp).addClass("popUp");
                $(this).append(popUp);
                $(popUp).css({ "top" : this.offsetTop, "left" : event.pageX });

				//Assign note index.  Each note is assigned to a specific section in the book.  Please be aware of this if making any changes.
				var index = 0;
				if($(".left").attr("id") == 1)
					index = 0;
				else if ($(".left").attr("id") == 11 && clickPosition.X < 800)
					index = 1;
				else if ($(".right").attr("id") == 12 && clickPosition.X >= 800)
					index = 2;
				else if ($(".right").attr("id") == 14)
					index = 3;
				else if ($(".right").attr("id") == 16 && clickPosition.Y < 300)
					index = 4;
				else if ($(".right").attr("id") == 16 && clickPosition.Y >= 300)
					index = 5;
				
                $(popUp).html(groupHighlighters[index]);
                $(popUp).show("fast");
            }
            else {
                $($(this).children()[0]).hide("fast", function() {
                    $(this).remove();
                });
            }
        }
    });

    $(".groupQuestion").click(function(event) {
        if(!popped && document.getSelection() == "") {

            clickPosition.X = event.clientX;
            clickPosition.Y = event.clientY;

            if($(this).children().length==0) {
                
                popUp = document.createElement("div");
                $(popUp).addClass("popUp");
                $(popUp).html("<b class=\"popText\">Phill's question:</b><br><span class=\"popText\">Can someone clarify what's going on here? I think I missed something, can anyone help?</span><br>");            
                
                var responses = document.createElement('a');
                responses.innerHTML = qCount + " responses";
                responses.className = "popText pull-left";
                $(responses).click(function() { 
                     $("#pop_menu").load("exampleQuestion.html", function() {
                        $("#resp_textarea").val(qResponse);
                        pop(true, 336, 203);
                    });
                });

                $(popUp).append(responses);
                $(this).append(popUp);

                $(popUp).css({ "top" : this.offsetTop, "left" : event.pageX });
                $(popUp).show("fast");
            }
            else {
                $($(this).children()[0]).hide("fast", function() {
                    $(this).remove();
                });
            }
        }
    });
}
/* Function used to load a specific PAIR of pages. 
 * Uses getPage() helper method to retrieve innerHTML for two facing pages.
 * params: int pageNum value
*/
function loadPage(pageNum) {
    //before we load the page, we must save the current page to the visited_pages array
    //if the page is already in the array, we simply update the visited
    for(var i = 0; i < visited_pages.length; i++) { 
        if(visited_pages[i].num == $(".left").attr("id"))
            visited_pages[i].page = $(".left").html();
        if(visited_pages[i].num == $(".right").attr("id"))
            visited_pages[i].page = $(".right").html();
    } 
    visited_pages.push({num:$(".left").attr("id"), page:$(".left").html()});
    visited_pages.push({num:$(".right").attr("id"), page:$(".right").html()});

    //now we can retrieve the page content, specific operation based on 
    //whether the page is odd, even, or a the final odd-numbered page of the book.

    if(pageNum ==lastPage && pageNum%2 == 1) { 
        $(".left").attr("id", pageNum);
        $(".left").html(getPage(pageNum));
        $(".right").attr("id", -1);
        $(".right").html("");
		$("#pagenum").val(pageNum);
		$("#leftPage").html(pageNum-1);
		$("#rightPage").html(pageNum);
        $("#totalPages").html("/" + lastPage); 
    }
    if(pageNum%2 == 1) {
        $(".left").attr("id", pageNum);
        $(".left").html(getPage(pageNum));
        $(".right").attr("id", pageNum + 1);
        $(".right").html(getPage(pageNum + 1));
		$("#pagenum").val(pageNum+1);
		$("#leftPage").html(pageNum);
		$("#rightPage").html(pageNum+1);
        $("#totalPages").html("/" + lastPage); 
    } else {
        $(".left").attr("id", pageNum - 1);
        $(".left").html(getPage(pageNum - 1)); 
        $(".right").attr("id", pageNum); 
        $(".right").html(getPage(pageNum)); 
		$("#pagenum").val(pageNum);
		$("#leftPage").html(pageNum-1);
		$("#rightPage").html(pageNum);
        $("#totalPages").html("/" + lastPage);
    }

    $("#show_page1").html("Show pg " + $(".left").attr("id") + " notes");
    $("#show_page2").html("Show pg " + $(".right").attr("id") + " notes");
	//reset values of the notes page menus 
	$("#show_page1").val("SHOW");
	$("#show_page2").val("SHOW");
	
    $( "#slider" ).slider( "option", "value", pageNum )

    findHighlightSpan();
    setHighlightPops();
    setGroupPops();
    
    for(var i = 0; i < highlights.length; i++) {
        if(!showMy) highlights[i].hide();
        else highlights[i].show();
    }
    if(!showGroup) $(".page").children(".groupHighlight").css("background-color", "white");
    else $(".page").children(".groupHighlight").css("background-color", "#FFFFCC");
	
	//Hides the table of contents modal when a chapter is selected.
	$("#tableModal").modal('hide');
	
	//Hides the search results modal when a link is selected.
	$("#searchModal").modal('hide');
	
	//Hides the note pages when the page changes
	$("#leftPagePopUp").hide();
	$("#rightPagePopUp").hide();
	
}

// on load we set up a number of listeners and
// load content of certain page related elements
$(document).ready(function() {
	
    //load the table of contents
    loadTable();

    //load the first two pages 
    //(the pages to be loaded can be changed based on the ID of the two page DIVs)
    $(".page").html(function() {
      pageNum = $(this).attr("id");
      $(this).html(getPage(pageNum));
    });

    setGroupPops();

    $("#left_add").click(function() {
        $("#show_page1").click();
        $("#leftPageNoteText").focus();
    });

    $("#right_add").click(function() {
        $("#show_page2").click();
        $("#rightPageNoteText").focus();
    });

    //set up current page text below slider
	$("#pagenum").val(2);
	$("#leftPage").html(1);
	$("#rightPage").html(2);
    $("#totalPages").html("/" + lastPage);
	
	//set values of the notes page menus 
	$("#show_page1").val("SHOW");
	$("#show_page2").val("SHOW");
	
	//Populate the search bar with popular words from the text... Might be able to leave this that rough.
	var popularWords = ['alice', 'little', 'down', 'queen', 'king', 'turtle','mock', 'hatter', 'gryphon', 'thing', 'head', 'voice', 'never', 'rabbit', 'mouse', 'round', 'two', 'tone', 'great', 'dormouse', 'duchess', 'cat', 'march', 'nothing', 'large', 'found', 'looking', 'hare', 'white', 'door','moment', 'dear', 'eyes', 'replied', 'day', 'three', 'poor', 'good', 'caterpillar', 'won', 'half', 'jury', 'minute', 'cried', 'old', 'feet', 'tea', 'curious','table', 'soup', 'house', 'question', 'eat', 'sat', 'talking', 'garden', 'ran', 'air', 'arm', 'speak', 'mad', 'silence', 'anxiously', 'sea', 'baby', 'room', 'beautiful', 'footman', 'dance', 'cook', 'cats', 'dodo', 'grow', 'pigeon', 'majesty', 'life', 'bill', 'game', 'afraid', 'hands', 'queer', 'growing', 'thinking', 'gloves', 'pig', 'book', 'minutes', 'pool', 'dinah', 'tears', 'mouth', 'lessons', 'glass', 'soldiers', 'conversation', 'fan', 'rest', 'creatures', 'bottle', 'birds', 'tail', 'shook', 'angrily', 'key','croquet', 'caucus', 'party', 'hearts', 'gardeners', 'mushroom','hedgehog', 'lobster', 'world', 'school', 'father','guinea', 'school', 'english', 'adventures', 'pigs', 'trouble', 'tarts']; 
	$('#search').typeahead({source: popularWords})  
	
    //initialize slider, max value based on last page
    //step set to 2
    $("#slider").slider({
        max: lastPage,
        min: 1,
        step: 2,
        change: function(event, ui) {
            if (event.originalEvent) {
                loadPage($("#slider").slider("value"));
            }
        } 
    });

    //initialize next and prev buttons
    $("#nav_left").mouseover(function() {
        $(this).css( 'cursor', 'pointer' );
    });
    
    $("#nav_right").mouseover(function() {
        $(this).css( 'cursor', 'pointer' );
    });

    $("#nav_left").click(function() {
        var pageNum = $(".left").attr("id");
        if(pageNum > 2) loadPage(pageNum - 1);
    });
    
    $("#nav_right").click(function() {
        var pageNum = $(".right").attr("id"); 
        pageNum = parseInt(pageNum);  
        if(pageNum < lastPage -1) loadPage(pageNum + 1);
    });

    $(".page").mouseup(function(event) {
        setTimeout(function() {
            var dblclick = parseInt($(this).data('double'), 10);
            if (dblclick > 0) {
                $(this).data('double', dblclick-1);
            } else {
                if($(event.target).attr("class")!=("popText pull-right") && $(event.target).attr("class")!=("popText pull-left"))
                    mouseUp.call(this, event);
            }
        }, 300);
    }).dblclick(function(event) {
        doubleClick.call(this, event);
        $(this).data('double', 2);
    });


    // listener to stop selection on double click
    function doubleClick(event) {
        event.preventDefault();
        document.getSelection().removeAllRanges();
        document.getSelection().empty();
        return false;
    }

    /* Main .page listener, when mouseup is
     * detected we check selection and mode
     * and perform the appropriate action
     */
    function mouseUp(event) {
        //if nothing is selected, hide popUps and popMenu.
    	if(document.getSelection() == "") {
            pop(false); 
            if( $(event.target).attr("class")==("page left") || 
                $(event.target).attr("class")==("page right")) 
                hideHighlightPops(); 
            return false;
        };

        clickPosition.X = event.clientX;
        clickPosition.Y = event.clientY;

        //if highlight mode is selected, we highlight
        if(highlightMode) {
            var range = document.getSelection().getRangeAt(0);
            var index = -1;
            for(var i = 0; i < highlights.length; i++ ) {
                if (range.toString() == highlights[i].text) {
                    highlights[i].remove();
                    index = i;
                }
            }
            if(index!=-1) {highlights.splice(index, 1); return;}

            highlights.push(new Highlight(range));
            setHighlightPops();
        }
        
        //otherwise, we check our selection and open the appropriate pop menu
        else {
            var range = document.getSelection().getRangeAt(0);
            
            //check selection
            for(var i = 0; i < highlights.length; i++ ) {
                //selected is a note
                if (range.toString() == highlights[i].text && highlights[i].type == "note") {
                    openPop(SEL_NOTE, highlights[i]);
                    return;
                } 
                //selection is a question
                else if (range.toString() == highlights[i].text && highlights[i].type == "question") {
                    openPop(SEL_QUES, highlights[i]);
                    return;
                } 
                //selection is a highlight
                else if (range.toString() == highlights[i].text) {
                    openPop(SEL_HIGH, highlights[i]);
                    return;
                }
            }

            //selection not a highlight/note/question
            noteMode? loadAddNote("addNote", new Highlight(range)) : openPop(MODE_NONE);
        }

    }
});
