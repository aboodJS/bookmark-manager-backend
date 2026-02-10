import express, { json } from "express";
import { hash as _hash } from "bcrypt";
import "dotenv/config";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
const port = process.env.PORT;
const sql = neon(process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  _hash(req.body.password, 10, function (err, hash) {
    try {
      res.send({ username: req.body.username, "hashed password": hash });
    } catch (err) {
      res.send({ error: `encountered error: ${err}` });
    }
  });
});

app.get("/users", async (req, res) => {
  const users = await sql`SELECT * FROM users`;
  res.send(users);
});

app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});
