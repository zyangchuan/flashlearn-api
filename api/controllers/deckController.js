const getAllDecks = async (req, res) => {
  res.send('getAllDecks');
}

const getSingleDeck = async (req, res) => {
  res.send('getSingleDeck');
}

const createDeck = async (req, res) => {
  res.send('createDeck');
}

const updateDeck = async (req, res) => {
  res.send('updateDeck');
}

const deleteDeck = async (req, res) => {
  res.send('deleteDeck');
}

module.exports = {
  getAllDecks,
  getSingleDeck,
  createDeck,
  updateDeck,
  deleteDeck
}