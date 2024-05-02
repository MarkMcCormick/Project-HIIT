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

app.use(express.json()); // Use this line instead of app.unsubscribe(bodyParser.json());

// Create the 'Activities' table

app.get('/get-all-activities', (req, res) => {
  let sql = `SELECT * FROM Activities`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);  // Send data as JSON
  });
});

app.get('/getActivityType', (req, res) => {
  let activity_id = req.query.id;  // Get the activity id from the request
  console.log(`Activity ID: ${activity_id}`);

  let sql = `SELECT activity_type FROM Activities WHERE activity_ID = ?`;  // Change the SQL query to use activity_id

  db.get(sql, [activity_id], (err, row) =>  {
    if (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    } else if (row) {
      res.send(row.activity_type.toString());
    } else {
      // If no matching activity is found, return a default response
      res.send('No matching activity found');
    }
  }); 
});


app.post('/addActivity', (req, res) => {
  const { activityId, workoutData } = req.body;

  // Now insert workout data into user_progress table with the provided activity ID
  const sqlInsertWorkoutData = `INSERT INTO user_progress(activity_id, Reps, Sets, Weight) VALUES (?, ?, ?, ?)`;

  // Insert workout data into the database
  workoutData.forEach(setData => {
    const { set, rep, weight } = setData;
    db.run(sqlInsertWorkoutData, [activityId, rep, set, weight], function(err) {
      if (err) {
        console.error(err.message);
        res.status(500).send(err);
      } else {
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    });
  });

  // After inserting, fetch all rows from the user_progress table
  const sqlSelectAll = `SELECT * FROM user_progress`;
  db.all(sqlSelectAll, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      // Send the fetched rows in the response
      console.log("error fetching rows")
      res.status(200).json(rows);
    }
  });
});



app.use(express.static(__dirname));

// Start the server
app.listen(8080, function () {
  console.log("Server is running on localhost:8080");
})