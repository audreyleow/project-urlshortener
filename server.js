require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.post("/api/shorturl/new", (req, res) => {
  const url = req.body.url;
  try {
    const hostname = new URL(url).hostname;
    dns.lookup(hostname, (error) => {
      if (error) {
        res.json({ error: "invalid url" });
      } else {
        db.push(req.body.url);
        res.json({ original_url: req.body.url, short_url: db.length - 1 });
      }
    });
  } catch {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:num", (req, res) => {
  res.redirect(db[parseInt(req.params.num)]);
});
