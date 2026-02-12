import express, { json } from "express";
import { hash as _hash } from "bcrypt";
import { Pool } from "pg";
import "dotenv/config";
import cors from "cors";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

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
  _hash(req.body.password, 10, async (err, hash) => {
    const client = await pools.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (username, email, password) VALUES ('${req.body.username}', '${req.body.email}', '${hash}');`,
      );
      res.send({ msg: "request done" });
    } catch (err) {
      res.send({ error: `encountered error: ${err}` });
    } finally {
      client.release();
    }
  });
});

app.post("/login", async (req, res) => {
  const client = await pools.connect();
  try {
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
});

app.listen(3000, () => {
  console.log(`app listening on http://localhost:3000`);
});
