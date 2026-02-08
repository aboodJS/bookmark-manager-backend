import express, { json } from "express";
import { hash as _hash } from "bcrypt";
import cors from "cors";
const port = 3000;
const saltRounds = 10;

// TODO: fix the issue of the server reciving undefined from the client-side

// Source - https://stackoverflow.com/a/54165206
// Posted by Foobar, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-07, License - CC BY-SA 4.0

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  _hash(req.body.password, saltRounds, function (err, hash) {
    try {
      res.send({ username: req.body.username, "hashed password": hash });
    } catch (err) {
      res.send({ error: `encountered error: ${err}` });
    }
  });
});

// app.post("/signup", async (req, res) => {
//   console.log(req.body);
//   res.send(req.body);
// });

app.post("/login", async (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});
