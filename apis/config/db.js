const mongoose = require("mongoose");


const connectToDB = async () => {
    await mongoose.connect(process.env.db_uri).then((res)=>{
        console.log("MONGODB CONNECTED SUCCESSFULLY");
        
    })
}

module.exports = connectToDB;