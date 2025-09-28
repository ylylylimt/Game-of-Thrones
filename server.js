// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas.
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.
//
// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/
//
// Once you are familiar with Node.js and the assignment, start implementing
// an API according to your design by adding routes.

// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'media.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require("sqlite3").verbose();
const cors = require("cors");
let db = my_database("./media.db");

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();

// We need some middleware to parse JSON data in the body of our HTTP requests:
app.use(express.json());
app.use(cors());

// ###############################################################################
// Routes
//
// TODO: Add your routes here and remove the example routes once you know how
//       everything works.

// Route to retrieve all data
app.get("/items", getAllItems);

// Route to retrieve data of a specific item by id
app.get("/items/:id", getItemById);

// Route to update data of a specific item by id
app.put("/items/:id", updateItem);

// Route to add a new item
app.post("/items", createItem);

// Route to delete data of a specific item by id
app.delete("/items/:id", deleteItem);

// Route to reset all data
app.get("/reset", reset);

// ###############################################################################

// This example route responds to http://localhost:3000/hello with an example JSON object.
// Please test if this works on your own device before you make any changes.
// Do not remove this endpoint as it is used for codegrade evaluation.
app.get("/hello", function (req, res) {
  response_body = { Hello: "World" };

  // This example returns valid JSON in the response, but does not yet set the
  // associated HTTP response header.  This you should do yourself in your
  // own routes!
  res.json(response_body);
});

// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

const server = app.listen(3000, () => {
  console.log("Your Web server should be up and running...");
});

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
  // Conncect to db by opening filename, create filename if it does not exist:
  var db = new sqlite.Database(filename, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the media database.");
  });
  // Create our media table if it does not exist already:
  db.serialize(() => {
    db.run(`
        	CREATE TABLE IF NOT EXISTS media
        	 (
                    id INTEGER PRIMARY KEY,
                    name CHAR(100) NOT NULL,
                    year CHAR(100) NOT NULL,
                    genre CHAR(256) NOT NULL,
                    poster char(2048) NOT NULL,
                    description CHAR(1024) NOT NULL
		 )
		`);
    db.all(`select count(*) as count from media`, function (err, result) {
      if (result[0].count == 0) {
        db.run(
          `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)`,
          [
            "Arcane",
            "2021",
            "animation, action, adventure, tv-show",
            "https://www.nerdpool.it/wp-content/uploads/2021/11/poster-arcane.jpg",
            "Set in Utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League Of Legends champions and the power that will tear them apart.",
            ]
        );
        db.run(
          `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)`,
          [
            "Celeste",
            "2018",
            "platformer, video-game",
            "https://upload.wikimedia.org/wikipedia/commons/0/0f/Celeste_box_art_full.png",
            "Celeste is a critically acclaimed two-dimensional platform game developed by Maddy Makes Games. The player controls Madeline, a young woman who sets out to climb Celeste Mountain. The game features tight controls, challenging levels, and a touching story about overcoming personal demons.",
          ]
        );
        console.log("Inserted 2 example items into empty database");
      } else {
        console.log(
          "Database already contains",
          result[0].count,
          " item(s) at startup."
        );
      }
    });
  });
  return db;
}

function setHeaders(res) {
  res.setHeader("Content-Type", "application/json");
}

// RETRIEVE ALL 
function getAllItems(req, res) {
  setHeaders(res);
  db.all("SELECT id, name, year, genre, poster, description FROM media", function (err, rows) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(rows); 
  });
}

// RETRIEVE 
function getItemById(req, res) {
  setHeaders(res);
  const id = req.params.id;
  db.get("SELECT id, name, year, genre, poster, description FROM media WHERE id=?", [id], function (err, row) {
    if (err) {
      console.error(`Error retrieving item with id ${id}:`, err.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.status(200).json(row);
  });
}

// UPDATE 
function updateItem(req, res) {
  setHeaders(res);
  const id = req.params.id;
  const item = req.body;
  db.run(
    `UPDATE media
    SET name=?, year=?, genre=?, poster=?, description=?
    WHERE id=?`,
    [item.name, item.year, item.genre, item.poster, item.description, id],
    function (err) {
      if (err) {
        console.error(`Error updating item with id ${id}:`, err.message);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.status(204).end();
    }
  );
}

// CREATE 
function createItem(req, res) {
  setHeaders(res);
  const item = req.body;
  db.run(
    `INSERT INTO media (name, year, genre, poster, description)
    VALUES (?, ?, ?, ?, ?)`,
    [item.name, item.year, item.genre, item.poster, item.description],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(201).json({ message: "Created", id: this.lastID });
    }
  );
}

// DELETE 
function deleteItem(req, res) {
  setHeaders(res);
  const id = req.params.id;
  db.run(`DELETE FROM media WHERE id=?`, [id], function (err) {
    if (err) {
      console.error(`Error deleting item with id ${id}:`, err.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.status(204).end();
  });
}

// RESET
function reset(req, res) {
  setHeaders(res);
  db.run(`DROP TABLE IF EXISTS media`, function (err) {
    if (err) {
      console.error("Error dropping the media table:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    db = my_database("./media.db");
    res.status(201).json({ message: "Database reset to default state with 2 default items."});
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); 
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Cleaning up...');
  server.close(() => {
    console.log('Server closed. Exiting...');
    process.exit(0);
  });
});

