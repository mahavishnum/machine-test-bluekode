function getUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  return res.json({ id, name: 'John Doe' });
}

module.exports = { getUserById };