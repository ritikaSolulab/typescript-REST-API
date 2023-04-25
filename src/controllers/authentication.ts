import express from 'express';
import lodash from 'lodash';
import validator from "validator";
import {error} from 'winston';
import {logger} from '../utils/log';
import { getUserByEmail, createUser } from '../db/testing';
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
  logger.info("Inside login");
  try {
    const { email, password } = req.body;
    if (lodash.isEmpty(email) || lodash.isEmpty(password)) {
      logger.error(`Provide all the details: ${(error as any).message}`);
      return res.status(400).json({
        success: false,
        message: "Provide all the details",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const user = await getUserByEmail(email).select('+authentication.password');

    if (!user) {
      return res.sendStatus(400).json({message:'User is not valid'});
    }

    const expectedHash = authentication(user.authentication.salt, password);
    
    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403).json({message:'Password is wrong'});
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('SECRET-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).json({message:'Server error'});
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (lodash.isEmpty(email) || lodash.isEmpty(password) || lodash.isEmpty(username)) {
      logger.error(`Provide all the details: ${(error as any).message}`);
      return res.status(400).json({
        success: false,
        message: "Provide all the details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingUser = await getUserByEmail(email);
  
    if (existingUser) {
      logger.error(`User with ${email} already registered`);
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        password: authentication(salt, password),
      },
    });

    return res.status(201).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).json({message:'Server error'});
  }
}