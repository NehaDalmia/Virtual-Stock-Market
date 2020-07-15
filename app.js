
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://NehaDalmia:Neha101926%2A@cluster0.cz4io.mongodb.net/Stocks?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
     .then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  username:String,
  password:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var stocks = [];
stocks.push(post={name:"Reliance",price:Number(5),quantity:Number(10), vol_fac: 1} );
stocks.push(post={name:"Apple",price:Number(100),quantity:Number(10), vol_fac:1});
stocks.push(post={name:"Mango",price:Number(50),quantity:Number(10),vol_fac:1});
var usernames=[];
usernames.push("Khushi@gmail");
usernames.push("Neha@gmail");
usernames.push("XYZ@gmail")
var passwords=[];
passwords.push("Khushi123");
passwords.push("Neha123");
passwords.push("XYZ");
var user_index=0;
var my_stocks = [
  [0,0,0],
  [0,0,0],
  [0,0,0]
]
var money=[1000,1000,1000];

app.get("/",function(req,res){
  //res.sendFile(__dirname+"/signup.html");
  res.render("home");
});


app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/list");
      });
    }
  });

});

app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        usernames.push(req.body.username);
        passwords.push(req.body.password);
        money.push(1000);
        my_stocks.push([0,0,0]);
        console.log(usernames);
        res.redirect("/list");
      });
    }
  });

});


/*app.post("/", function(req,res){



  var name=req.body.inputEmail;
  var pass=req.body.inputPassword;
  var index1=100;
  var index2=200;
  for(var i=0;i<usernames.length;i++)
  {
    if(usernames[i]==name)
    {index1=i; break;}
  }
  for(var i=0;i<passwords.length;i++)
  {
    if(passwords[i]==pass)
    {index2=i; break;}
  }
  //if(index1!=index2)
  //res.send("Invalid User Id or Password"+index1+" "+index2);
  //else
 {

        User.register({username:req.body.inputEmail},req.body.inputPassword,function(err,user){
        if(err)
        {
          res.redirect("list");
        }
        else
        {
          passport.authenticate('local', { failureRedirect: '/' }),
          res.send("Registered!!");
        }
      })
      user_index=index1;
      const user = new User({
      username:req.body.inputEmail,
      password:req.body.inputPassword
    });
    //console.log(user);
    req.login(user,function(err){
      if(err)
      {
        console.log(err);
      }
      else
      {
        passport.authenticate('local', { failureRedirect: '/' }),
        res.redirect('list');
        //  res.render("list",{usernames:usernames,passwords:passwords,stocks:stocks,user_index:user_index,money:money,my_stocks:my_stocks});
    }
  });

}
});
*/
app.get("/list",function(req,res){
   for(var i=0;i<usernames.length;i++)
  {
     if(usernames[i]==req.user.username)
     {user_index=i; break;}
   }
  console.log(req.user.username);
  res.render("list",{usernames:usernames,passwords:passwords,stocks:stocks,user_index:user_index,money:money,my_stocks:my_stocks});
  //res.sendFile("Hello!");
});
app.get("/Buy", function(req, res){
  for(var i=0;i<usernames.length;i++)
 {
    if(usernames[i]==req.user.username)
    {user_index=i; break;}
  }
  res.render("Buy",{usernames:usernames,passwords:passwords,stocks:stocks,user_index:user_index});
});
app.post("/Buy",function(req,res){
  for(var i=0;i<usernames.length;i++)
 {
    if(usernames[i]==req.user.username)
    {user_index=i; break;}
  }
  if(isNaN(Number(req.body.no_of_stocks)))
  {res.send("Invalid!");  res.redirect("/list");}
  else
  {
  if(Number(req.body.no_of_stocks)>Number(stocks[Number(req.body.stocks)].quantity))
  {res.send("Invalid!");}
  else if(money[user_index]<Number(req.body.no_of_stocks*stocks[Number(req.body.stocks)].price))
  {res.send("Invalid!");}
  else
  {
  money[user_index]-=Number(req.body.no_of_stocks*stocks[Number(req.body.stocks)].price);
  //console.log(user_details);
  (stocks[Number(req.body.stocks)].quantity)-=Number(req.body.no_of_stocks);
  (stocks[Number(req.body.stocks)].price)+=Number(req.body.no_of_stocks*5);
  my_stocks[user_index][Number(req.body.stocks)]+=Number(req.body.no_of_stocks);
  res.redirect("/list");
  }
}


});
app.get("/Sell", function(req, res){

  for(var i=0;i<usernames.length;i++)
 {
    if(usernames[i]==req.user.username)
    {user_index=i; break;}
  }
  res.render("Sell",{usernames:usernames,passwords:passwords,stocks:stocks,user_index:user_index});
});
app.post("/Sell",function(req,res)
{
//  console.log(Number(req.body.stocks));
for(var i=0;i<usernames.length;i++)
{
  if(usernames[i]==req.user.username)
  {user_index=i; break;}
}
  if(req.body.no_of_stocks>my_stocks[user_index][Number(req.body.stocks)])
  res.send("Invalid!");
 else
if(isNaN(Number(req.body.no_of_stocks)))
{res.send("Invalid!");  res.redirect("/list");}
else
  {
    money[user_index]+=Number(req.body.no_of_stocks*stocks[Number(req.body.stocks)].price);
    (stocks[Number(req.body.stocks)].quantity)+=Number(req.body.no_of_stocks);
  (stocks[Number(req.body.stocks)].price)-=Number(req.body.no_of_stocks*5);
  my_stocks[user_index][Number(req.body.stocks)]-=req.body.no_of_stocks;

  res.redirect("/list");
}


});
//app.listen(3000,function(){
  //console.log("Running");
//});

app.listen(process.env.PORT||3000,function(){
  console.log("Running");
});
