import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"



export const test = (req, res) => {
    res.json({
        "message": "elloo"
    })
}




export const updateUser = async (req, res, next) => {
    
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account"))

    try {
        // change password then we hash it and update 
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password , 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true }) //new will store the new data 
        
        const { password, ...rest } = updatedUser._doc
        
        res.status(200).json(rest)

    } catch (error) {
        console.log(error)
        next(error)
    }
}



export const deleteUser = async (req, res, next) => {

    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account"))
    

    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie("access_token")
        res.status(200).json("User has been deleted")
        
    } catch (error) {
        next(error)
    }
}

export const getUserListings = async (req, res, next) => {
    
    try {

        if (req.user.id === req.params.id) {
            const listings = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listings)
            
        } else {
            return next(errorHandler(401, "You can only view your own account"))
        }


        
    } catch (error) {
        next(error)
    }
    
}