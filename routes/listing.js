const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

//Index & Create route using router.route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing,
     wrapAsync(listingController.createListing)
);

//New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show,Update & delete route using router.route
router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner,
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.rederEditForm)
);

module.exports = router;