import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {

    try{
      const token = req.cookies.jwt

      if(!token){
        return res.status(401).json({message: "Unauthorized- No token provided"})
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if(!decoded){
        return res.status(401).json({ message: "Unauthorized- Invlid token"})
      }

      const user = await User.findById(decoded.userId).select("-password")

      req.user = user;

      next()
      
    }catch(error){
     console.log("Error in protect Route middileware", error);
     res.status(500).json({message: "Internal Server Error"})
    }
}