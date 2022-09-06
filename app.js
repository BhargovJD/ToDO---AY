const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))

app.set("view engine","ejs")

const port = 3000




// Connection URL and creating Mongodb database todoList
const url = 'mongodb://localhost:27017/todoList';
mongoose.connect(url)

// For item schema
const itemSchema = new mongoose.Schema({
  name:String,
});

// Collection Item(Items)
const Item = mongoose.model("Item", itemSchema);

// Creating documents to be store in collection
const item1 = new Item({ 
  name: 'Breakfast',
});

const item2 = new Item({ 
  name: 'Lunch',
});

const item3 = new Item({ 
  name: 'Dinner',
});

const defaultItem = [item1, item2, item3]




// READ
// Getting request from browser as "/" and what to do in "/"
app.get('/', (req, res) => {
 // READ from database
Item.find(function(err, foundItems){

  if(foundItems.length == 0){
    // Insert docs to collection(Run for one time)
    Item.insertMany(defaultItem, function(err){
      if(err){
        console.log(err)
      }
      else{
        console.log("Todo inserted successfully!")
      }
    });
    
    res.redirect("/")
  }else{
    res.render('list',{listTitle:"Today", newListItems:foundItems})
  }
})
  
})



// CREATE
app.post('/', (req, res) => {
  // console.log(req.body)
  var itemName = req.body.newItem;

  const newItem = new Item({ 
    name: itemName,
  });


  // Save : insert one
  newItem.save().then(() => console.log('One document inserted!'));
  res.redirect("/")

  // if(req.body.list == 'Work_List'){
  //   workItems.push(item)
  //   res.redirect("/work")
  // }
  // else{
  //   items.push(item)
  //   res.redirect("/")
  // }

})


// DELETE
app.post('/delete', function(req, res) {
  
  // console.log(req.body.ck)
  const checkedItemId = req.body.ck;
  Item.findByIdAndDelete(checkedItemId,function(err){
    if(!err){
      console.log("Successfully deleted checked item!")
      res.redirect("/")
    }
  })
  
})


app.get('/work', (req, res) => {
  
  res.render('list',{listTitle:"Work_List", newListItems:workItems})
  
})


app.get("/about", (req,res)=>{
  res.render("about")
})



app.listen(port, function(){
    console.log("Server started on port 3000")
})


// nodemon server.js