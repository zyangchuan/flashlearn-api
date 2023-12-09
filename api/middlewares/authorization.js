const { Deck } = require('../models');
const { NotFoundError, UnauthorizedError } = require('../errors');

const authorizeUser = async (req, res, next) => {
  const data = await Deck.findOne({ where: { id: req.params.id }});
  if (!data) throw new NotFoundError(`Deck with id ${req.params.id} is not found.`);
  const { author_user_id } = data;
  if (req.user.id !== author_user_id) throw new UnauthorizedError('Unauthorized');

  return next();
}

module.exports = authorizeUser;