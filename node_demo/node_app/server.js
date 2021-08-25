// 创建服务器
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require("body-parser")

const users = require("./routes/api/user")
const profiles = require("./routes/api/profile")

const passport = require("passport")

//  app.use(bodyParser.urlencoded({extended:false}))
//  app.use(bodyParser.json)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(passport.initialize())

require("./config/passport")(passport)

//连接数据库
mongoose.connect('mongodb://localhost/restful-api-prod',{ useNewUrlParser: true })
  .then(()=>
    console.log('success'))
  .catch((err)=>console.log(err))

app.get('/',(req,res)=>{
  res.send('Hello World')
})

app.use("/api/users",users)
app.use("/api/profiles",profiles)


const port = process.env.PORT || 80
app.listen(port,()=>{
  console.log('server running at http://127.0.0.1');
})
