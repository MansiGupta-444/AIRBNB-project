const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require ("./data.js");


const MONGO_URL ='mongodb://127.0.0.1:27017/wanderlust' ;
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err) =>{
        console.log(err)
 });

async function main() {
  await mongoose.connect(MONGO_URL);
}
 
const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj , owner:"688fbbd0fdb81426a8c12abc"}))// defining owner ,map will make new array that is why we again store it in initdata
    await Listing.insertMany(initData.data);
    console.log("data initialized") ;

}

initDB();