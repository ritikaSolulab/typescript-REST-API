import {Request,Response,NextFunction} from 'express';
import { merge, get } from 'lodash';
import { logger } from "../utils/log";
import { getUserBySessionToken } from '../db/testing'; 

export const isAuthenticated = async (req:Request, res:Response, next:NextFunction) => {
  logger.info("Inside auth");
  try {
    const sessionToken = req.cookies['SECRET-AUTH'];

    if (!sessionToken) {
      return res.sendStatus(403).json({message:'You are not authorized'});
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const isOwner = async (req:Request, res:Response, next:NextFunction) => {
  logger.info("Inside is owner");
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string;

    if (!currentUserId) {
      return res.sendStatus(400).json({message:'This is not your current user id'});
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}