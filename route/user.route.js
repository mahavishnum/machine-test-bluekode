const express = require('express');
const { getUserById } = require('../service/user.service');

const route = express.Router();

route.get('/:id', getUserById);

module.exports = route;