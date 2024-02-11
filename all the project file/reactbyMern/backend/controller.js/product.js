const express =require("express")
const productrouter = express.Router()
const {productmodel} =require("../model/product.model")

productrouter.post("/addproduct",async(req,res)=>{
    const { title, gender, category, brand, rating, review, price, image, available, itemleft}=req.body
try {

    const product =productmodel(req.body)
    await product.save()
    res.status(200).send({"msg":"one product is added in the cart"})
    
} catch (error) {
    console.log(error.message)
        res.status(404).send({ "message": error.message })
}
})


productrouter.get("/retrive",async(req,res)=>{
    try {
        
        const products = await productmodel.find();
       
        res.send(products);
    

    } catch (error) {
        console.log(error.message)
        res.status(404).send({ "message": error.message })
    }
})


productrouter.get('/retrive/:id', async (req, res) => {
    try {
        const product = await productmodel.findById(req.params.id)
        
        res.send(product)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})
module.exports={productrouter}