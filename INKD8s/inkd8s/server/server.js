const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/inkd8s');

const userSchema = new mongoose.Schema({
  username: String,
  elo: { type: Number, default: 1000 }
});
const User = mongoose.model('User', userSchema);

const matchSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  winner: String // e.g., team or player ID
});
const Match = mongoose.model('Match', matchSchema);

// Register user
app.post('/users', async (req, res) => {
  const user = new User({ username: req.body.username });
  await user.save();
  res.json(user);
});

// Get rankings
app.get('/rankings', async (req, res) => {
  const users = await User.find().sort({ elo: -1 });
  res.json(users);
});

// Report match (simplified: assume 1v1, update ELO)
app.post('/matches', async (req, res) => {
  const { playerAId, playerBId, winnerId } = req.body;
  const [a, b] = await User.find({ _id: { $in: [playerAId, playerBId] } });
  const ra = a.elo, rb = b.elo;
  const ea = 1 / (1 + Math.pow(10, (rb - ra) / 400));
  const k = 32;
  const scoreA = winnerId === playerAId ? 1 : 0;
  a.elo = ra + k * (scoreA - ea);
  b.elo = rb + k * ((1 - scoreA) - (1 - ea));
  await Promise.all([a.save(), b.save()]);
  const match = new Match({ players: [playerAId, playerBId], winner: winnerId });
  await match.save();
  res.json({ a, b });
});

app.listen(3000, () => console.log('Server on 3000'));