#pragma strict
@script ExecuteInEditMode()

var myGUI: GUISkin;
var btnWidth : int = 225;

/**
*	This function is called at least once per frame
*/
function OnGUI() {

	GUI.skin = myGUI;

	// Register a button that if pressed, will load the first level of the game
	if( GUI.Button(Rect(Screen.width/2-(btnWidth/2), Screen.height/2-20, btnWidth, 30), "Start New Game!")) {
		
		PlayerPrefs.DeleteAll();		
		// Theses "Levels" are the scenes that you add in your build settings - arranged by index
		Application.LoadLevel(1);
	}
	
	// Make sure that there is actually a value stored for playerLevel before we show the button
	if(PlayerPrefs.HasKey("playerLevel")) {
		// If there is a value stored, then display a button that (when clicked) will load the
		// 	player's most accomplished level
		if( GUI.Button(Rect(Screen.width/2-(btnWidth/2), Screen.height/2+20, btnWidth, 30), "Continue Game")) {
			// Get the player level, and load into that
			// Mobile = right on the device, web = stored in registry?
			// Anytime they finish the level we want to save it and load back into it
			Application.LoadLevel(PlayerPrefs.GetInt("playerLevel"));
		}
	}
}