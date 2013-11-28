#pragma strict

// Makes sure that any time we load a new level, this object does not get destroyed
// even though normally it would.
DontDestroyOnLoad(gameObject);

//
var myLifeTime : int = 0;




/**
*	A function that always happens right before Start()
*/
function Awake() {
	// Check for all other GameInfo objects
	var allGI = GameObject.FindGameObjectsWithTag("GameInfo");
	if( allGI.Length > 1 ) { // If there is more than one game object
		// Keep the oldest one, destroy the rest
		for (theGI in allGI) {
			// Compare the lifetime variables
			if(theGI.GetComponent(GameInfo).myLifeTime > myLifeTime) {
				Destroy(gameObject);
			}
		}
	}
}


function Start () {
	// if we are still alive
	myLifeTime++;
}

function Update () {

}