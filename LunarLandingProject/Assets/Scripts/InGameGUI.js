#pragma strict

// A variable initialized with a default value for the guiMode representing an "In Game" state
var guiMode : String = "InGame";
// A variable to keep track of how many landing pads are currently activated
var numActivated : int;
// The total number of landing pads in this level
var totalLZ : int;
//
var winClip : AudioClip;
//
var loseClip : AudioClip;
//
var scoreText : GUIText;
//
var totalScoreText : GUIText;
//
var levelScore : int;
//
var winTexture : GUITexture;
//
var loseTexture : GUITexture;
//
var fuelMeter : GUITexture;
//
var fuelMeterStartingWidth : float;


function Start() {
	totalLZ = 3;
	levelScore = 0;
	// Get the starting width of the fuel meter
	fuelMeterStartingWidth = fuelMeter.pixelInset.width;
}


/**
*	This function is called every frame
*/
function Update () {
	// If the user presses the "esc" key on their keyboard, set the gui mode to paused and freeze animations
	if(Input.GetKeyDown("escape")) {
		Time.timeScale = 0;
		guiMode = "Paused";	
	}
}



/**
*	I believe this function is called at least once per frame
*	It checks to see what state the gui is in, and displays the appropriate buttons
*/
function OnGUI() {
	if(guiMode == "Paused") { // IF THE GUI IS IN THE PAUSED STATE
		if( GUI.Button(Rect(Screen.width/2-75, Screen.height/2-20, 150, 30), "Resume Game")) {
			Time.timeScale = 1;
			guiMode = "InGame";
		}
		
		if( GUI.Button(Rect(Screen.width/2-75, Screen.height/2+20, 150, 30), "Quit To Main Menu")) {
			Time.timeScale = 1;
			Application.LoadLevel(0);
		}
	
	}
	else if(guiMode == "Win") { // IF THE GUI IS IN THE WIN STATE
		if( GUI.Button(Rect(Screen.width/2-75, Screen.height/2-20, 150, 30), "Next Level")) {
			Time.timeScale = 1;
			Application.LoadLevel(Application.loadedLevel+1);
			guiMode = "InGame";
		}
		
		if( GUI.Button(Rect(Screen.width/2-75, Screen.height/2+20, 150, 30), "Quit To Main Menu")) {
			Time.timeScale = 1;
			Application.LoadLevel(0);
		}
	
	}
	else if(guiMode == "Lose") { // IF THE GUI IS IN THE LOSE STATE
		if( GUI.Button(Rect(Screen.width/2-75, Screen.height/2-20, 150, 30), "Retry Level")) {
			Time.timeScale = 1;
			Application.LoadLevel(Application.loadedLevel);
			guiMode = "InGame";
		}
		
		if( GUI.Button(Rect(Screen.width/2-75, Screen.height/2+20, 150, 30), "Quit To Main Menu")) {
			Time.timeScale = 1;
			Application.LoadLevel(0);
		}
	
	}
	
}




/**
* 	Called from LandingPad.Activate()
*	Called anytime a player lands on a landing pad ( without blowing up of course lol )
*/
function LZActivated() { 
	levelScore += 500;
	scoreText.text = "Score - " + levelScore;
	// Increment the number of activated landing zones since the player just landed on one
	numActivated++;
	// Check to see if the player has activated all landing pads and has thus, won the game
	if(numActivated == totalLZ) {
		Win();
	}
}



/**
*	This function is called by LZActivated()
*/
function Win() {
	// Play the audio clip for when the player wins
	audio.clip = winClip;
	audio.Play();
	if(PlayerPrefs.HasKey("playerTotalScore")) {
		PlayerPrefs.SetInt("playerTotalScore", PlayerPrefs.GetInt("playerTotalScore")+levelScore);
	}
	else {
		// Else if there isn't already a player score in the "database", then create it
		PlayerPrefs.SetInt("playerTotalScore", levelScore);
	}
	// Save the level win, only can save ints and strings
	// Theses "Levels" are the scenes that you add in your build settings - arranged by index
	PlayerPrefs.SetInt("playerLevel", Application.loadedLevel+1);
	PlayerPrefs.Save();
	// Update the "Total Score" GUIText displayed at the top of the screen
	totalScoreText.text = "Total Score - " + PlayerPrefs.GetInt("playerTotalScore");
	totalScoreText.enabled = true;
	winTexture.enabled = true;
	// Freeze all animations and set the gui's state to "win"
	Time.timeScale = 0;
	guiMode = "Win";
	

}



/**
*	This function is called by PlayerController.Explode()
*/
function LoseCaller() {	
	Lose();
}



/**
*	This function is called by LoseCaller()
*/
function Lose() {
	loseTexture.enabled = true;
	// Allow the exploding animation to continue for 3 seconds
	yield(WaitForSeconds(3));
	audio.clip = loseClip;
	audio.Play();
	// Then freeze all animations
	Time.timeScale = 0;
	// And finally, change the gui's state to Lose
	guiMode = "Lose";
}


/**
*	Called from PlayerController.Update()
*/
function updateFuelMeter(newFuelAmount : float) {
	// Scale down the fuel meter
	fuelMeter.pixelInset.width = fuelMeterStartingWidth * (newFuelAmount * .01);
	// Change the color from green to red as the fuel reduces - between 0 and 1
	fuelMeter.color = Color.Lerp(Color.red, Color.green, (newFuelAmount * .01));
}