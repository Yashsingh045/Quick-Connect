import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController";




app.post('/register',createUser)
app.post('./login',loginUser)