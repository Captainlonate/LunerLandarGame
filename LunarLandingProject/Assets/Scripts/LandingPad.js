#pragma strict

var stationLight : Light;
var onMaterial : Material;
var onColor : Color;
var GUI : InGameGUI;
var isActivated : boolean;

function Start () {
	// This is going to get a handle on the InGameGUI script so we can access it via "GUI."
	GUI  = GameObject.FindWithTag("GUI").GetComponent(InGameGUI);
	isActivated = false;
}

/**
*	This function is called every frame
*/
function Update () {

}

/**
*	This function is called by PlayerController.OnCollisionEnter()
*/
function Activate() {
	
	if ( !isActivated ) {
		isActivated = true;
		// Play whatever audio is attached
		audio.Play();
		// Update the appearance of the landing pad to resemble an activated state
		renderer.material = onMaterial;
		stationLight.color = onColor;
		// Then make sure the number of activated landing pads is incremented, 
		//	and check if the game has been won
		GUI.LZActivated();	
	}
}