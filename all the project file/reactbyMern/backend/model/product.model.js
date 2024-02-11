const mongoose=require("mongoose")

const productschema = mongoose.Schema({
    title:{type:String,require:true},
    gender:{type:String,require:true},
    category:{type:String,require:true},
    brand:{type:String,require:true},
    material:{type:String,require:true},
    rating:{type:String,require:true},
    review:{type:String,require:true},
    price:{type:String,require:true},
    image:{type:String,require:true},

    available:{type:Boolean,default:true},
    itemleft:{type:Number},

    des:{type:String},
    arrival:{type:Date},
},{
    versionkey:false
})
const productmodel =mongoose.model("product",productschema)
module.exports={productmodel}