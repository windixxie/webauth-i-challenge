const express = require('express');
const server = express();
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);
const cors = require('cors');

const port = process.env.PORT || 5000;
const bcrypt = require('bcryptjs');
const session = require('express-session');

server.use(
  session({
    name: 'testSession',
    secret: "Tell me what thy lordly name is on the Night's Plutonian shore",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // Would be true to restrict to https, but cannot test with Postman while set to true.
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
  })
);
const corsOptions = {
  credentials: true,
  origin: 'http://localhost:3000', // Obviously changed for prod
};
server.use(cors(corsOptions));
server.use(express.json());
server.use('/api/restricted', restrictAccess);

function restrictAccess(req, res, next) {
  if (req.session && req.session.username) next();
  else res.status(401).json({ message: 'You shall not pass!' });
}

server.post('/api/register', (req, res) => {
  // Promise syntax
  const { username, password, email, firstName, lastName } = req.body;
  if (!username || !password || !email || !firstName || !lastName)
    return res.status(400).json({
      error:
        'Please provide values for username, password, email, firstName, and lastName keys.',
    });
  const credentials = { username, password, email, firstName, lastName };
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  db('users')
    .insert(credentials)
    .then(id => {
      req.session.username = username;
      res.status(201).json({ id: id[0] });
    })
    .catch(error => {
      const column = (error.message.match(/users\..+/) || [])[0];
      const reason = (error.message.match(/\w+(?=\sconstraint\sfailed)/) ||
        [])[0];
      switch (reason) {
        case 'UNIQUE':
          return res
            .status(400)
            .json({ error: `Value provided for ${column} already exists.` });
        default:
          return res.status(500).json({ error });
      }
    });
});

server.post('/api/login', async (req, res) => {
  // Async/await
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ error: 'Please provide username and password.' });
    const credentials = { username, password };
    const user = await db('users')
      .where({ username })
      .first();
    if (!user || !bcrypt.compareSync(credentials.password, user.password))
      return res.status(401).json({ error: 'You shall not pass!' });
    req.session.username = user.username;
    res.json({ success: `Welcome, ${user.firstName}.` });
  } catch (error) {
    res.status(500).json({ error });
  }
});

server.get('/api/users', async (req, res) => {
  try {
    if (req.session.username) {
      const result = await db('users');
      const users = result.map(x => {
        const { password, ...noPassword } = x;
        return noPassword;
      });
      res.json({ users });
    } else {
      res.status(401).json({ error: 'You shall not pass!' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

server.get('/api/logout', (req, res) => {
  if (req.session)
    req.session.destroy(err =>
      err ? res.send('error logging out.') : res.send('good bye.')
    );
});

server.listen(port, () => console.log(`Server listening on port ${port}.`));
