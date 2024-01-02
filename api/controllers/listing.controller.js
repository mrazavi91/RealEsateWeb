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


