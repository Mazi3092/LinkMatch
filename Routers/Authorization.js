import express from 'express'
import Auth from '../Controllers/Auth.js';

const Authorization = express.Router();

    Authorization.get("/",Auth.find)
export default Authorization