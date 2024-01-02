import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js";



export const createListing = async (req, res, next) => {

    try {
        // i may need to add return 
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error)   
    }
}

export const deleteListing = async (req, res, next) => {
    console.log(req.params.id)
    
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
        return next(errorHandler(404, "Listing no found"))
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only delete your own listings"))
    }

    try {

        await Listing.findByIdAndDelete(req.params.id)  
        res.status(200).json("listing has been deleted")

    } catch (error) {
        next(error)
    }
}


export const updateListing = async (req, res, next) => {
    

    try {
        // i may need to put the listing in another try and catch 
        const listing = await Listing.findById(req.params.id)

        if (!listing) {
            return next(errorHandler(404, "Listing not found"))
        }

        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, "You can only edit your own listings"))
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.status(200).json(updatedListing)
        
    } catch (error) {
        next(error)
    }
    
}


export const getListing = async (req, res, next) => {

    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing) return next(errorHandler(401, "Listing not found")) // may need to move to catch
        res.status(200).json(listing)
    } catch (error) {
        
        next(error)
    }
    
}

