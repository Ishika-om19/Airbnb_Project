const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


const validateListing =(req,res , next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError (400,error);
    }else{
        next();
    }
};


//Index route
router.get("/", wrapAsync (async(req,res)=>{
const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})
);

//New route
router.get("/new",(req, res)=>{
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id).populate("reviews");
if(!listing){
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
}
    res.render("listings/show.ejs", {listing});
})
);


// Create Route
router.post("/",validateListing,
     wrapAsync(async(req, res, next)=>{
     const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
})
);

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error", "Listing is requested for not found!");
    return res.redirect("/listings");
}
    res.render("listings/edit.ejs",{listing});
})
);

//Update route
router.put("/:id",
    validateListing,
    wrapAsync(async(req, res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated Successfully!");
    res.redirect("/listings");
})
);


//Delete Route
router.delete("/:id", wrapAsync(async(req, res)=>{
    let{id}=req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
})
);

module.exports = router;