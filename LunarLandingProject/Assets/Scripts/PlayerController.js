#pragma strict

var bottomThruster:ParticleEmitter;
var topThruster:ParticleEmitter;
var leftThruster:ParticleEmitter;
var rightThruster:ParticleEmitter;
// An array that will hold 3 GameObjects ( they will be Explosion prefabs ssshhh )
var shipExplosions:GameObject[];
// A variable that WILL hold an "InGameGUI"
var GUI : InGameGUI;
//
var fuelBurnSpeed : float;
//
var haveFuel : boolean;
// A variable that holds the current amount of remaining fuel
var fuelAmount : float;


function Start () {
	// Retrieve the InGameGUI component of the GameObject that has been given the tag "GUI"
	GUI  = GameObject.FindWithTag("GUI").GetComponent(InGameGUI);
	fuelAmount = 100;
	fuelBurnSpeed = 2;
	haveFuel = true;
}


/**
*	This function is called every frame
*/
function Update () {
	// Obviously don't move if they don't have fuel
	if ( haveFuel ) {
		// 		CHECK FOR USER INPUT
		if(Input.GetAxis("Horizontal") > 0) {// Checking for right arrow key
			rightThruster.emit = false;
			leftThruster.emit = true;
			rigidbody.AddForce(10,0,0);
		}	
		if(Input.GetAxis("Horizontal") < 0) {// Checking for left arrow key
			leftThruster.emit = false;
			rightThruster.emit = true;
			rigidbody.AddForce(-10,0,0);	
		}	
		if(Input.GetAxis("Horizontal") == 0) {// Checking if no horizontal keys down
			leftThruster.emit = false;
			rightThruster.emit = false;
		}
		
		
		
		if(Input.GetAxis("Vertical") > 0) {// Checking for up arrow key
			bottomThruster.emit = true;
			topThruster.emit = false;
			rigidbody.AddForce(0,10,0);
		}	
		if(Input.GetAxis("Vertical") < 0) {// Checking for down arrow key
			topThruster.emit = true;	
			bottomThruster.emit = false;
			rigidbody.AddForce(0,-10,0);
		}	
		if(Input.GetAxis("Vertical") == 0) {// Checking if no vertical keys down
			bottomThruster.emit = false;
			topThruster.emit = false;	
		}	
		
		
		if(Input.GetAxis("Vertical") != 0 ||  Input.GetAxis("Horizontal") != 0 ) {
			if( !audio.isPlaying ) { // If the default audio clip is not playing
				audio.Play();
			}
			// Remove fuel per second
			fuelAmount -= (fuelBurnSpeed * Time.deltaTime);
			if (fuelAmount <= 0) { // if we ran out of fuel
				fuelAmount = 0;
				haveFuel = false;
				audio.Stop();
				topThruster.emit = false; // disable all thruster particle effects
				bottomThruster.emit = false;
				leftThruster.emit = false;
				rightThruster.emit = false;
			}
			GUI.updateFuelMeter(fuelAmount);
		}
		else if( audio.isPlaying ) { // else if no buttons are down
			audio.Stop();
		}
	}// end if(haveFuel)
}


/**
*	This function is called by the game when there is a collision involving this GameObject
*/
function OnCollisionEnter(hitInfo : Collision) {	
	// If there was a collision, and the speed ( magnitude ) of the ship was greater than 2
	if(hitInfo.relativeVelocity.magnitude > 2) {
		// Then call the function responsible for initiating the exploding animation and lose state
		Explode();
	}
	else if(hitInfo.gameObject.tag == "LandingPad") {
		// If there was a collision, and the user delicately landed on a landing pad...
		var landingPadScript : LandingPad;
		landingPadScript = hitInfo.gameObject.GetComponent("LandingPad");
		// Then notify the Landing Pad that it should activate.
		landingPadScript.Activate();
	}
	
}


/**
*	This function is called by OnCollisionEnter()
*/
function Explode () {
	// We need a random number to determine which explosion we will use
	var randomNumber : int = Random.Range(0,shipExplosions.length);	
	// It seems like this function just "creates" an instance of some object
	Instantiate(shipExplosions[0], transform.position, transform.rotation);	
	// This will freeze the game animation and set the gui's state to "Lose"    
	GUI.LoseCaller();
	// Remove a reference to this particular gameObject
	Destroy(gameObject);
}