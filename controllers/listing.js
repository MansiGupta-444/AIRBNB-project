const Listing =require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs" , {allListings})};

 module.exports.renderNewForm =(req,res)=>{
    // if(!req.isAuthenticated())
    // {
    //     req.flash("error","you must be logged in to create listing");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
};  

module.exports.showListing= async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{
        path:"author",
    },})
    .populate("owner");
    // if(!listing){
    //     req.flash("error","listing does not exist");
    //     res.redirect("/listings");
    // }
    res.render("listings/show.ejs",{listing});
    console.log(listing)
}
module.exports.createListing=async(req,res,next)=>{
     let response=await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
     limit: 1,
})
  .send();

    let url = req.file.path;
    let filename = req.file.filename;
const newListing = new Listing(req.body.listing);
newListing.owner = req.user._id;
newListing.geometry=response.body.features[0].geometry
newListing.image={url,filename};
let save =await newListing.save();
console.log(save);
req.flash("success"," new listing is added");
 res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing} );
};
module.exports.updateListing=async(req,res)=>{
    let {id} = req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
   }
    req.flash("success","Listing updated ");
    res.redirect("/listings");
}
module.exports.destroyListing=async(req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    console.log(deletedListing);
    res.redirect("/listings");
}