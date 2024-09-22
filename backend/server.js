const express = require("express");
const dotenv=require('dotenv');
dotenv.config({path:'.env'})
const app = express();
const cors = require("cors");
app.use(cors());

const data=require('./data/data')
app.get('/api/chats',(req,res)=>{
    res.send(data)
})



const port=process.env.PORT
app.listen(port, () => console.log(`server running on port ${port}`));
