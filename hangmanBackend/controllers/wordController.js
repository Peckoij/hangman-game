/* eslint-disable indent */
var jwt = require('jsonwebtoken');
var config = require('../config');
const mongoose = require('mongoose');
require('../models/User');

const Word = mongoose.model('Word');
