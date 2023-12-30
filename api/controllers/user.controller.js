import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"



export const test = (req, res) => {
    res.json({
        "message": "elloo"
    })
}




export const updateUser = async (req, res, next) => {

    console.log(req.params.id)
    
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