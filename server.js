import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Do not change code above this line
// Route for empty date parameter: /api or /api/
app.get("/api", (req, res) => {
  const now = new Date();
  res.json({
    unix: now.getTime(),
    utc: now.toUTCString()
  });
});

// Route with date parameter: /api/:date
app.get("/api/:date", (req, res) => {
  const dateParam = req.params.date;
  let date;

  // Check if the parameter consists only of digits (Unix timestamp)
  if (/^\d+$/.test(dateParam)) {
    date = new Date(parseInt(dateParam, 10));
  } else {
    date = new Date(dateParam);
  }

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  // Handle valid dates
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});
// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
