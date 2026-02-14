import express, { json } from "express";
import { hash, compare, genSalt } from "bcrypt";
import { Pool } from "pg";
import "dotenv/config";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
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
    res.json({ error: `encountered error: ${err}` });
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

    if (result.rows[0] !== undefined) {
      const check = compare(req.body.password, result.rows[0].password);
      if (check) {
        const token = jsonwebtoken.sign(
          { userName: result.rows[0].username },
          process.env.JWT_SECRET,
          { expiresIn: "15m" },
        );
        console.log(token);
        res.status(200).json({ msg: "login complete", jwt_token: token });
      } else {
        res.status(403).json({ error: "wrong password" });
      }
    } else {
      res.status(403).json({ error: "wrong information please try again" });
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
