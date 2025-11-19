const express = require('express');
const { z } = require('zod');
const validate = require('../../presentation/validate');
const auth = require('../../presentation/authMiddleware');
const { usecases } = require('../../shared/container');

const router = express.Router();

const requestSchema = z.object({
  toUserId: z.string().uuid()
});

router.use(auth);

router.get('/', (req, res) => {
  const friends = usecases.friend.getFriends(req.user.id);
  res.json(friends);
});
