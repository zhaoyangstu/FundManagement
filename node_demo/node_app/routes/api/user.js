//login register
const express = require('express')

const router = express.Router()

const User = require("../../models/User")

const bcrypt = require("bcrypt")

const gravatar = require("gravatar")

const jwt = require('jsonwebtoken');

const passport = require("passport")


// router.get("/test",(req,res)=>{
//   res.json({msg:"login works"})
// })

//register
router.post('/register',(req,res)=>{
  // console.log(req.body);
  // 查询数据库是否有邮箱
  User.findOne({email:req.body.email}).
  then((user)=>{
    // 用户名存在
    if(user){
      return res.status(400).json({email:"邮箱已被注册"})
    }else{
      //获取头像
      const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});

      const newUser = new User({
        name:req.body.name,
        email:req.body.email,
        avatar,
        password:req.body.password,
        identity:req.body.identity
      })
      //密码加密
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err) throw err;
            newUser.password = hash;

            newUser.save().then(user=>res.json(user))
            .catch(err=>console.log(err))
        });
    });
    }
  })
})
//login
router.post('/login',(req,res)=>{
  const email = req.body.email
  const password = req.body.password
  //查询数据库
  User.findOne({email}).
  then(user=>{
    if(!user){
      return res.status(404).json("用户不存在")
    }
    //密码匹配
    bcrypt.compare(password, user.password).
    then(isMatch=>{
      if(isMatch){
        const rule = {id:user.id,name:user.name,avatar:user.avatar,identity:user.identity}
        jwt.sign(rule,"secret",{expiresIn:3600},(err,token)=>{
          if(err){throw err}
          res.json({
            success:true,
            token:"Bearer " + token
          })
        })
        // return res.json({msg:"登录成功"})
      }else{
        return res.status(400).json("密码错误!")
      }
    })
  })
})
//当前用户请求
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
  res.json({
    id:req.user.id,
    email:req.user.email,
    name:req.user.name,
    identity:req.user.identity
  })
})

module.exports = router