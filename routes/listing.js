const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema,reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController =require("../controllers/listing.js");
const multer  = require('multer')
const {storage} =require("../cloudconfig.js")
const upload = multer({ storage})


router.route("/")
.get( wrapAsync(listingController.index))//Index route
.post(isLoggedIn,
    upload.single("listing[image]"),
      validateListing,
    wrapAsync(listingController.createListing))//  create route



    //New route 
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm
 );


router.route("/:id")
.get(wrapAsync(listingController.showListing))//Show route
.put(isLoggedIn,
       isOwner,
       upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))//Update route
.delete(isLoggedIn,
       isOwner, wrapAsync(listingController.destroyListing));//Delete route

// Edit route
router.get("/:id/edit", isLoggedIn,
       isOwner,wrapAsync(listingController.renderEditForm));



module.exports = router ;