import {Request,Response} from 'express';
import { logger } from "../utils/log";
import { deleteUserById, getUsers, getUserById } from '../db/testing';

export const getAllUsers = async (req:Request, res:Response) => {
  logger.info("Inside get all users");
  try {
    //const {limit} = req.query
    const users = await getUsers().limit(2);
    return res.status(200).json({users});
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req:Request, res: Response) => {
  logger.info("Inside delete user");
  try {
    const {id} = req.params;
    await deleteUserById(id);
    return res.status(200).json({success:false,message:'User is deleted'});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:'Server error'});
  }
}

export const updateUser = async (req:Request, res:Response) => {
  logger.info("Inside update user");
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);
    
    user.username = username;
    await user.save();

    return res.status(200).json({success:true,message:'user has been updated'}).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}