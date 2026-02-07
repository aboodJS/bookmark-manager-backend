const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;
const saltRounds = 10;

app.use(express.json());

app.get("/", async (req, res) => {});

app.post("/signup", async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    try {
      res.send({ username: req.body.username, "hashed password": hash });
    } catch (err) {
      res.send({ error: `encountered error: ${err}` });
    }
  });
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});
