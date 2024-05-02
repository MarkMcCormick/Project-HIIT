var repsWeightDisplay = document.getElementById("reps_weight_display");
var TimerDisplay = document.getElementById("workoutTimer");
var RepsDisplay = document.getElementById("reps");
var activityType = "";
//var setCount = 5;
var setCounts = {
  'activity1': 1,
  'activity2': 1,
  // Add more activities as needed...
};
document.addEventListener("DOMContentLoaded", function() {
  
    const addActivityButton = document.getElementById("addActivity");
    addActivityButton.addEventListener('click', addNewActivity);

    const startWorkoutButton = document.getElementById("startWorkout");
    const pauseButton = document.getElementById("pause");
    const stopButton = document.getElementById("stop");
  
    const activitiesContainer = document.getElementById("activities");
    const workoutTimer = document.getElementById("workoutTimer");
    const currentActivity = document.getElementById("currentActivity");
    const timer = document.getElementById("timer");


    let activities = [];
  





    // Below is the countdown function that will be called when the workout starts
    function countdown(duration) {
      let seconds = duration;
      timer.textContent = formatTime(seconds);
  
      timerInterval = setInterval(function() {
        seconds--;
        timer.textContent = formatTime(seconds);
        if (seconds <= 0) {
          clearInterval(timerInterval);
          displayNextActivity();
        }
      }, 1000);
    }
  
    // Below is the function that will format the time to be displayed in the timer
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
  
    pauseButton.addEventListener("click", function() {
      clearInterval(timerInterval);
    });
  
    stopButton.addEventListener("click", function() {
      clearInterval(timerInterval);
      workoutTimer.style.display = "none";
    });
  });




// Below will hide the creating work out prompt and show the form for adding reps and sets

function hideWorkoutBuilder() {
  // Hide the existing workout builder
  document.getElementById('workoutBuilder').classList.add('hidden');
  workoutBuilder.style.display = 'none';
  
  // Show the form for adding reps and sets
  document.getElementById('repsSetsForm').classList.remove('hidden');
  repsSetsForm.style.display = 'block';

  // Changes placeholder text
  var workoutName = document.getElementById('workoutName').value;
  var displayArea = document.getElementById("WorkoutName_placeholder");
  displayArea.textContent = workoutName;
}


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var workoutSets = {};

// Function to hide all sets for a specific workout
function hideAllSets(workout) {
  var sets = workoutSets[workout];
  if (sets) {
    for (var i = 0; i < sets.length; i++) {
      sets[i].style.display = 'none';
    }
  }
}

// Function to show all sets for a specific workout
function showAllSets(workout) {
  var sets = workoutSets[workout];
  if (sets) {
    for (var i = 0; i < sets.length; i++) {
      sets[i].style.display = 'block';
    }
  }
}


var addedWorkouts = [];

// Function to add a new activity
function addNewActivity() {
  // Get the selected workout from the dropdown menu
  var workoutDropdown = document.getElementById("activityName");
  var selectedWorkout = workoutDropdown.options[workoutDropdown.selectedIndex].text;

  if (addedWorkouts.includes(selectedWorkout)) {
    alert('This workout has already been added. Please select a different workout.');
    return;
  }

  // Add this workout to the list of added workouts
  addedWorkouts.push(selectedWorkout);

  const workoutName = document.createElement("div");
  const newContent = document.createTextNode("Workout: " + selectedWorkout);
  workoutName.appendChild(newContent);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.workout = selectedWorkout; // Store the workout name in the button
  editButton.disabled = selectedWorkout === workoutDropdown.options[workoutDropdown.selectedIndex].text; // Disable the button if the workout is currently selected
  editButton.addEventListener("click", function() {

    showAllSets(selectedWorkout); // Show all sets for this workout when the button is clicked
    this.style.display = 'none'; // Hide the "Edit" button
    doneButton.style.display = 'block'; // Show the "Done" button
  });

  var workoutDropdown = document.getElementById("activityName");


  workoutDropdown.addEventListener('change', function() {
    // Get all "Edit" buttons
    var editButtons = document.querySelectorAll('button');
    for (var i = 0; i < editButtons.length; i++) {
      if (editButtons[i].workout === workoutDropdown.options[workoutDropdown.selectedIndex].text) {
        // Disable the "Edit" button for the newly selected workout
        editButtons[i].disabled = true;
      } else {
        // Enable the "Edit" button for all other workouts
        editButtons[i].disabled = false;
      }
    }
  });

  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  doneButton.style.display = 'none'; // Initially hide the "Done" button
  doneButton.addEventListener("click", function() {
    hideAllSets(selectedWorkout); // Hide all sets for this workout when the button is clicked
    this.style.display = 'none'; // Hide the "Done" button
    editButton.style.display = 'block'; // Show the "Edit" button
  });

  const activitiesContainer = document.getElementById("activitiesContainer");
  activitiesContainer.prepend(workoutName, editButton, doneButton);

  console.log("Selected Workout:", selectedWorkout); // Log the selected workout to console

  // Get the sets for this workout
  var sets = document.getElementsByClassName(selectedWorkout);
  workoutSets[selectedWorkout] = sets; // Store the sets for this workout

}



// Function to display a completed activity
function displayCompletedActivity(activity) {
    var activitiesContainer = document.getElementById("activities");
    var activityElement = document.createElement('div');
    activityElement.textContent = activity;

    // Create an "Edit" button
    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        // When "Edit" button is clicked, show all sets again
        showAllSets();
    });
    activityElement.appendChild(editButton);

    activitiesContainer.appendChild(activityElement);
}




// Below will decide if the activity needs just to keep track of reps, sets, weight or if it needs a timer
function checkActivityType() {
  var workoutDropdown = document.getElementById("activityName");
  var selectedWorkout = workoutDropdown.value;

  // Below allows me just to select the number so I can use it to determine the activity type
  var selectedWorkout = workoutDropdown.value.split("|");
  activityType = selectedWorkout[0];
  var workoutName = selectedWorkout[1];

  // Clone the elements
var clonedRepsWeightDisplay = repsWeightDisplay.cloneNode(true);
clonedRepsWeightDisplay.id = 'cloned_reps_weight_display';
var clonedWorkoutTimer = workoutTimer.cloneNode(true);
clonedWorkoutTimer.id = 'cloned_workoutTimer';
var clonedSetsContainer = setsContainer.cloneNode(true);
clonedSetsContainer.id = 'cloned_setsContainer';

  // Determine the activity type based on the selected workout
  switch(activityType) {
    case "1": // reps
      document.getElementById('cloned_RepsDisplay').style.display = "block";
      document.getElementById('cloned_reps_weight_display').style.display = "none";
      document.getElementById('cloned_TimerDisplay').style.display = "none";
      break;
    case "2": // timer display
      document.getElementById('cloned_TimerDisplay').style.display = "block";
      document.getElementById('cloned_RepsDisplay').style.display = "none"
      document.getElementById('cloned_reps_weight_display').style.display = "none";
      break;
    case "3": // reps and weight
      document.getElementById('cloned_reps_weight_display').style.display = "block";
      document.getElementById('cloned_TimerDisplay').style.display = "none";
      document.getElementById('cloned_RepsDisplay').style.display = "none";
      break;
    default:
      activityType = "Unknown"; // Handle unknown workouts
  }
}

// Get the workout dropdown
var workoutDropdown = document.getElementById("activityName");

var dropdown = document.getElementById('activityName');

var repsInput = document.getElementById('reps_input');
var repsAndWeight = document.getElementById('reps_weight_display');
var timerDiv = document.getElementById('workoutTimer');

// Add an event listener for the change event
workoutDropdown.addEventListener('change', function() {
  // Get all the sets
  var sets = document.getElementsByClassName('set');

  // Loop through all the sets and hide them
  for (var i = 0; i < sets.length; i++) {
    sets[i].style.display = 'none';
  }

  // Show the sets for the selected workout
  var selectedWorkoutSets = document.getElementsByClassName('set ' + workoutDropdown.value.split('|')[1]);
  for (var i = 0; i < selectedWorkoutSets.length; i++) {
    selectedWorkoutSets[i].style.display = 'block';
  }

  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -----
  


  var trackingOption;
  if (weightsAndReps[workoutDropdown.value]) {
    trackingOption = 'weightsAndReps';
  } else if (justReps[workoutDropdown.value]) {
    trackingOption = 'justReps';
  } else if (timer[workoutDropdown.value]) {
    trackingOption = 'timer';
  }
  

  // Show the appropriate input fields based on the tracking option
  if (trackingOption === 'weightsAndReps') {

  } else if (trackingOption === 'justReps') {
    repsInput.style.display = 'block';
    timerDiv.style.display = 'none';
    repsAndWeight.style.display = 'none';
  } else if (trackingOption === 'timer') {
    timerDiv.style.display = 'block';
    repsInput.style.display = 'none';
    repsAndWeight.style.display = 'none';
  }


  // Call checkActivityType to update the activity type
  checkActivityType();
});

var setCounts = {};

// Get the workout dropdown
var workoutDropdown = document.getElementById("activityName");

// Add an event listener for the change event

var setCountDisplay = document.getElementById('setCountDisplay');
var clonedSetCountDisplay = setCountDisplay.cloneNode(true);
clonedSetCountDisplay.id = 'cloned_setCountDisplay';

// Append the cloned set count to the parent of the original set count
setCountDisplay.parentNode.appendChild(clonedSetCountDisplay);

// Hide the original set count
setCountDisplay.style.display = 'none';


workoutDropdown.addEventListener('change', function() {

  // Get the selected activity
  var selectedActivity = workoutDropdown.value.split('|')[1];

  // If the set count for the selected activity is not defined, initialize it to 0
  if (!setCounts[selectedActivity]) {
    setCounts[selectedActivity] = 0;
  }

  // Update the set count display
  document.getElementById('setCountDisplay').textContent = 'Set: ' + setCounts[selectedActivity];
});

function newSet(){

  document.getElementById('setsContainer').style.display = 'block'; 
   // Get the selected activity
  var selectedActivity = workoutDropdown.value.split('|')[1];

  // Increment the set count for the selected activity
  setCounts[selectedActivity]++;

  // Update the set count display
  var currentSetCount = setCounts[selectedActivity];

  // Update the set count display
  document.getElementById('setCountDisplay').textContent = 'Set: ' + currentSetCount;

  const newSetContainer = document.createElement('div');

  // Depending on the selected radio button, clone and display the corresponding input field
  if (weightsAndReps) {
    var clonedInput = document.getElementById('weightsAndRepsInput').cloneNode(true);
    clonedInput.style.display = 'block';
    newSetContainer.appendChild(clonedInput);
  } else if (justReps) {
    var clonedInput = document.getElementById('justRepsInput').cloneNode(true);
    clonedInput.style.display = 'block';
    newSetContainer.appendChild(clonedInput);
  } else if (timer) {
    var clonedInput = document.getElementById('timerInput').cloneNode(true);
    clonedInput.style.display = 'block';
    newSetContainer.appendChild(clonedInput);
  }

  // Append the new set container to the sets container
  document.getElementById('setsContainer').appendChild(newSetContainer);


  newSetContainer.className = 'set ' + workoutDropdown.value.split('|')[1]; // Add the 'set' class and a class for the selected workout


  const newTextElement = document.createElement('h3');
  newTextElement.textContent = `Set: ${setCounts[selectedActivity]}`; // Use setCounts[selectedActivity] instead of setCount

  newSetContainer.appendChild(newTextElement);  // Append the new text element to the new set container

  var clonedElement;

  var workoutTimer = document.getElementById('workoutTimer');

  // Clone the timer element and give it a unique ID
  var clonedWorkoutTimer = workoutTimer.cloneNode(true);
  clonedWorkoutTimer.id = 'cloned_workoutTimer';
  
  // Append the cloned timer to the parent of the original timer
  workoutTimer.parentNode.appendChild(clonedWorkoutTimer);
  
  // Hide the original timer
  workoutTimer.style.display = 'none';

  switch(activityType) {
    case "1": // reps and set
      clonedElement = RepsDisplay.cloneNode(true);
      clonedElement.style.display = 'block'; // Make the cloned element visibleS
      newSetContainer.appendChild(clonedElement); // Append the cloned element to the new set container
      break;
    case "2":
      clonedElement = clonedWorkoutTimer; // Use the cloned timer
      clonedElement.style.display = 'block'; // Make the cloned timer visible
      newSetContainer.appendChild(clonedElement); // Append the cloned element to the new set container
      break;
      case "3":
        clonedElement = repsAndWeight.cloneNode(true); // Use the cloned timer
        clonedElement.style.display = 'block'; // Make the cloned timer visible
        newSetContainer.appendChild(clonedElement); // Append the cloned element to the new set container
        break;
    default:
      activityType = "Unknown"; // Handle unknown workouts
  }

  const removeButton = document.createElement('button');

  // Set the text content of the button
  removeButton.textContent = 'Remove';

  newSetContainer.dataset.activity = selectedActivity;

  if (setCounts[selectedActivity] < currentSetCount) {
    setCounts[selectedActivity]++;
  }




// Add an event listener to the button
removeButton.addEventListener('click', function() {
  // Remove the parent set container when the button is clicked
  newSetContainer.remove();

  // Decrement the set count for the activity of the removed set
  var activityOfRemovedSet = newSetContainer.dataset.activity;
  setCounts[activityOfRemovedSet]--;

  renumberSets();

  });

  newSetContainer.appendChild(removeButton);



  const setsContainer = document.getElementById('setsContainer');
  const addSetButton = document.getElementById('addSetButton');

  // Insert the new set before the "Add New Set" button
  setsContainer.insertBefore(newSetContainer, addSetButton);



  var weightsAndReps = document.getElementById('weightsAndReps').checked;
  var justReps = document.getElementById('justReps').checked;
  var timer = document.getElementById('timer').checked;

  
};



function renumberSets() {
  // Get all the activities
  var activities = Object.keys(setCounts);

  // Iterate over the activities
  for (var i = 0; i < activities.length; i++) {
    // Get the sets for the current activity
    var sets = document.querySelectorAll('.set[data-activity="' + activities[i] + '"]');

    // Iterate over the sets
    for (var j = 0; j < sets.length; j++) {
      // Update the set number
      sets[j].querySelector('h3').textContent = 'Set: ' + (j + 1);
    }

    // Update the set count for the activity
    setCounts[activities[i]] = sets.length;
  }
}



function createRepsWeightDisplay() {
  // Deep clone the reps_weight_display element
  const clonedElement = repsWeightDisplay.cloneNode(true);

  // Ensure that the cloned element is visible
  clonedElement.style.display = "block";

  return clonedElement; // Return the cloned element instead of appending it to the body

  
}
//                                                                                                                                     CUSTOM ACTIVITY 


var customWorkoutMenu = document.getElementById('customWorkoutMenu');

var customActivityButton = document.getElementById('CustomWorkoutButton');


var doneButton = document.getElementById('doneCustomButton');

customWorkoutMenu.style.display = 'none';

doneButton.style.display = 'none'; // Initially hide the "Done" button


customActivityButton.parentNode.appendChild(doneButton);


customWorkoutMenu.style.display = 'none';


function CreateCustomWorkout(){
  customWorkoutMenu.style.display = 'block';
  customActivityButton.style.display = 'none';
  doneButton.style.display = 'block';
  customWorkoutMenu.style.display = 'block';

};

function exitCustomWorkout(){ 
  customActivityButton.style.display = 'block';
  customWorkoutMenu.style.display = 'none';

};
//                                                                            Add button
function addButton(){  // Get the text from the "customWorkout" input field
  var customWorkout = document.getElementById('customWorkout').value;

  // Get the "activityName" dropdown
  var dropdown = document.getElementById('activityName');

    // Check if a workout with the same name already exists
    for (var i = 0; i < dropdown.options.length; i++) {
      if (dropdown.options[i].value === customWorkout) {
        alert('A workout with this name already exists.');
        return;
      }
    }

    var weightsAndReps = document.getElementById('weightsAndReps').checked;
    var justReps = document.getElementById('justReps').checked;
    var timer = document.getElementById('timer').checked;
  
    // Check if at least one tracking option is selected
    if (!weightsAndReps && !justReps && !timer) {
      alert('Please select a tracking option.');
      return;
    }
  
  // Create a new option element
  var option = document.createElement('option');
  option.text = customWorkout;
  option.value = customWorkout;

  // Append the new option to the dropdown
  dropdown.add(option);

  // Call the exitCustomWorkout function to hide the custom workout menu
  exitCustomWorkout();
};



// Clone the elements
var clonedRepsWeightDisplay = repsWeightDisplay.cloneNode(true);
var clonedWorkoutTimer = workoutTimer.cloneNode(true);
var clonedSetsContainer = setsContainer.cloneNode(true);

// Append the cloned elements to the parent of the original elements
repsWeightDisplay.parentNode.appendChild(clonedRepsWeightDisplay);
workoutTimer.parentNode.appendChild(clonedWorkoutTimer);
setsContainer.parentNode.appendChild(clonedSetsContainer);

// Get the dropdown element
var dropdown = document.getElementById('activityName');




