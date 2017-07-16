const assert = require('assert');
const app = require("../main.js");
const request = require("supertest");
const users = require("../models/users");
const snippets = require("../models/snippets");
const routes = require('../routes/routes');
const crypto = require('crypto');
