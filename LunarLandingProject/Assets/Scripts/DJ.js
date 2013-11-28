#pragma strict

// Makes sure that any time we load a new level, this object does not get destroyed
// even though normally it would.
DontDestroyOnLoad(gameObject);

//
var myLifeTime : int = 0;
//
var musicTracks : AudioClip[];
//
var currentTrack : int;


/**
*	A function that always happens right before Start()
*/
function Awake() {
	// Check for all other GameInfo objects
	var allDJs = GameObject.FindGameObjectsWithTag("DJ");
	if(allDJs.Length > 1 ) { // If there is more than one game object
		// Keep the oldest one, destroy the rest
		for (theDJ in allDJs) {
			// Compare the lifetime variables
			if(theDJ.GetComponent(GameInfo).myLifeTime > myLifeTime) {
				Destroy(gameObject);
			}
		}
	}
}


function Start () {
	// if we are still alive
	myLifeTime++;
	
	// Set the very first song to play
	audio.clip = musicTracks[2];
	
	// Start playing our audio
	audio.Play();
	
	
}

function Update () {
	// if we're not playing anything, we've finished the track and need to move to the next one
	if ( !audio.isPlaying ) {
		if (currentTrack == musicTracks.Length-1) {
			// Go back to the start
			currentTrack = 0;
			audio.clip = musicTracks[0];
			audio.Play();
		}
		else {
			// Move on to the next one
			currentTrack++;
			audio.clip = musicTracks[currentTrack];
			audio.Play();
		}
	}
}