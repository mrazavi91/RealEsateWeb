import Listing from "../models/listing.model.js"



export const createListing = async (req, res, next) => {


    try {
        // i may need to add return 
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        
        next(error)
        
    }
    
}