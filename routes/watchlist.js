import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import { readWatchlists, writeWatchlists } from "../utils/db.js";

const router = express.Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
  const watchlists = readWatchlists();
  const watchlist = watchlists[req.params.userId] || [];
  res.status(200).json(watchlist);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const watchlists = readWatchlists();
  const userId = req.params.userId;

  if (!watchlists[userId]) {
    watchlists[userId] = [];
  }

  const newMovie = { id: String(Date.now()), ...req.body };
  watchlists[userId].push(newMovie);
  writeWatchlists(watchlists);

  res.status(201).json(newMovie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const watchlists = readWatchlists();
  const { userId, movieId } = req.params;
  const watchlist = watchlists[userId] || [];

  const movieIndex = watchlist.findIndex(
    (m) => String(m.id || m.movieId) === String(movieId)
  );

  if (movieIndex === -1) {
    return res.status(404).json({ error: "Movie not found" });
  }

  watchlists[userId][movieIndex] = {
    ...watchlist[userId][movieIndex],
    ...req.body,
  };
  writeWatchlists(watchlists);

  res.status(200).json(watchlists[userId][movieIndex]);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const watchlists = readWatchlists();
  const { userId, movieId } = req.params;

  if (watchlists[userId]) {
    watchlists[userId] = watchlists[userId].filter(
      (m) => String(m.id || m.movieId) !== String(movieId)
    );
    writeWatchlists(watchlists);
  }

  res.status(200).json({ message: "Movie removed" });
});

export default router;