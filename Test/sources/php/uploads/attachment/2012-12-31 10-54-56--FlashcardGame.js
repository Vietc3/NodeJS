


function FlashcardGame() {
	// set defaults
	this.timed = false;	
	this.questionUI = null; // function to create the UI for the question interface, given a "card"
	this.answerUI = null; // function to create the UI for the answer interface, given a "card"

	this.currentCard = null; // the currentc ard being displayed
	this.nextCardFunction = null; // get the next "card" to test
	

	// save DOM nodes	
	this.node = null;
	this.questionNode = null;
	this.answerNode = null;
	this.footerNode = null;
	this.answerNodeContents = null;
	this.id = "flashcardsgame";
	return this;
}

FlashcardGame.prototype.validSetup = function() {
	if (this.questionUI == null) { error("FlashcardGame.validSetup()", "questionUI invalid."); return false; }
	if (this.answerUI == null) { error("FlashcardGame.validSetup()", "answerUI invalid."); return false; }
	return true;
}

FlashcardGame.prototype.play = function() {
	if (!this.validSetup()) return;
	this.draw(); // make sure components are on the screen
	
	this.displayQuestion();
	return this;
}

FlashcardGame.prototype.draw = function() {
	if (this.node == null) {
		var game = this; // save "this" for use in event callbacks
		this.node = Document.createElement("div");
		// ....

	}
	$("document).html(this.node);
	return this;
}

FlashcardGame.prototype.displayQuestion = function() {
	// Get the next question
	this.currentCard = this.nextCardFunction();
	if (this.currentCard == null) this.drawGameFunction("<div>"+ui("nothingtolearn")+"</div>");
	
	// Add the contents
	this.questionNode.html(this.questionUI(this.currentCard));
	// show the question, hide the answer
	this.questionNode.css("display","block");
	this.answerNode.css("display","none");
	
	this.startTime = nowmilliseconds();
	return this;
}

FlashcardGame.prototype.displayAnswer = function() {
	// Add the contents
	this.answerNodeContents.html(this.answerUI(this.currentCard));
	// show the question, hide the answer
	this.answerNode.css("display","block");
	this.questionNode.css("display","none");

	return this;	
}

/** This gets called if we change the difficulty level, or if we change the interface language, or any other settings. 
	We should stay on the same question / answer.
*/
FlashcardGame.prototype.refreshUI = function() {
	// quick hack
	this.questionNode.html(this.questionUI(this.currentCard));
	this.answerNodeContents.html(this.answerUI(this.currentCard));	
}

FlashcardGame.prototype.end = function() {
	$("#games_flashcards").css("display","none");
	$("#games_flashcards").css("visibility","hidden");
	return this;
}


FlashcardGame.prototype.correct = function() {
	this.answerFunction(0);
	this.displayQuestion(); // get next card
}

FlashcardGame.prototype.incorrect = function() {
	this.answerFunction(1);
	this.displayQuestion(); // get next card
}

