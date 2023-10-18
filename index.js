const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('my brands server ongoing')
})

app.listen(port, ()=>{
    console.log(`my server port in ongoing at ${port}`);
})