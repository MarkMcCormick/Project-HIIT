const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./newDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const express = require('express');
const app = express();

// Create the 'Activities' table
db.run(`CREATE TABLE IF NOT EXISTS Activities (
  activity_ID INTEGER PRIMARY KEY NOT NULL,
  activity_name VARCHAR(100) NOT NULL,
  activity_type INTEGER NOT NULL,
  description TEXT
)`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Activities table created.');
  }
});

// Create the 'user_progress' table
db.run(`CREATE TABLE IF NOT EXISTS user_progress (
  progress_id INTEGER PRIMARY KEY NOT NULL,
  activity_id INTEGER NOT NULL,
  Reps INTEGER,
  Sets INTEGER,
  Weight INTEGER,
  FOREIGN KEY(activity_id) REFERENCES Activities(activity_ID)
)`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('user_progress table created.');
  }
});

// Create the 'Workout' table
db.run(`CREATE TABLE IF NOT EXISTS Workout (
  workout_ID INTEGER PRIMARY KEY NOT NULL,
  Workout_name TEXT NOT NULL,
  workout_description TEXT
)`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Workout table created.');
  }
});

// Create the 'Workout_Junc_Activity' table
db.run(`CREATE TABLE IF NOT EXISTS Workout_Junc_Activity (
    Workout_Junc_ActivityID INTEGER PRIMARY KEY NOT NULL,
    WorkoutID INTEGER,
    ActivityID INTEGER,
    FOREIGN KEY(WorkoutID) REFERENCES Workout(workout_ID),
    FOREIGN KEY(ActivityID) REFERENCES Activities(activity_ID)
  )`, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Workout_Junc_Activity table created.');
    }
  });




let activities = [
    ['Push-ups', 1, 'Push-ups activity'],
    ['Sit-ups', 1, 'Sit-ups activity'],
    ['Planks', 2, 'Planks activity'],
    ['Flat-bench dumbbell press', 3, 'Flat-bench dumbbell press activity'],
    ['Pull-ups', 1, 'Pull-ups activity']
  ];
  
  // Insert data into the 'Activities' table
  let sql = `INSERT INTO Activities(activity_name, activity_type, description) VALUES(?, ?, ?)`;
  
  activities.forEach((activity) => {
    db.run(sql, activity, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  });
  
