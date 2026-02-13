import express, { json } from "express";
import { hash, compare, genSalt } from "bcrypt";
import { Pool } from "pg";
import "dotenv/config";
import cors from "cors";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const app = express();
app.use(cors());
app.use(json());

const pools = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});

app.post("/signup", async (req, res) => {
  const salt = await genSalt(10);
  const hashedPassword = await hash(req.body.password, salt);

  const client = await pools.connect();
  try {
    const result = await client.query(
      `INSERT INTO users (username, email, password) VALUES ('${req.body.username}', '${req.body.email}', '$${hashedPassword}');`,
    );
    console.log(hashedPassword);
    res.send({ msg: "request done" });
  } catch (err) {
    res.send({ error: `encountered error: ${err}` });
  } finally {
    client.release();
  }
});

app.post("/login", async (req, res) => {
  const client = await pools.connect();
  try {
    const result = await client.query(
      `SELECT * FROM users WHERE username = '${req.body.username}' OR email = '${req.body.email}';`,
    );

    if (result.rows.length > 0) {
      const check = compare(req.body.password, result.rows[0].password);
      if (check) {
        res.json({ msg: "login complete" });
      } else {
        res.json({ msg: "wrong password" });
      }
    } else {
      res.json({ msg: "wrong information please try again" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
});

app.listen(3000, () => {
  console.log(`app listening on http://localhost:3000`);
});
