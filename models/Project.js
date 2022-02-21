const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        required : true,
    },
    title:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    html : {
      type : String
    },
    css : {
      type : String
    },
    js : {
      type : String
    },
    contributers : []
},{timestamps:true});

module.exports = mongoose.model("Project",ProjectSchema);