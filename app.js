const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _ = require('lodash')

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


// Custom list schema
const listSchema = {
  name:String,
  items : [itemSchema]
};

// collection
const List = mongoose.model("List", listSchema);



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
 
// Custom param
app.get("/:customListName", function(req,res){
  // console.log(req.params.customListName)
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name:customListName,
          items:defaultItem
        })
      
        list.save()
        res.redirect("/"+customListName)
      }
      else{
        res.render('list',{listTitle:foundList.name, newListItems:foundList.items})
      }
    }
  })

 



})



// CREATE
app.post('/', (req, res) => {
  // console.log(req.body)
  var itemName = req.body.newItem;

  // button name value
  var listName = req.body.list;

  const newItem = new Item({ 
    name: itemName,
  });

  if(listName === "Today"){
  // Save : insert one
  newItem.save().then(() => console.log('One document inserted!'));
  res.redirect("/")
  }
  else{
    List.findOne({name:listName}, function(err, foundList){
      foundList.items.push(newItem)
      foundList.save()
      res.redirect("/"+listName)
    })
  }

})


// DELETE
app.post('/delete', function(req, res) {
  
  // console.log(req.body.ck)
  const checkedItemId = req.body.ck;
  const listName = req.body.listName;


if(listName === "Today"){
  Item.findByIdAndDelete(checkedItemId,function(err){
    if(!err){
      console.log("Successfully deleted checked item!")
      res.redirect("/")
    }
  })
  
}

else{

  console.log("l;;")
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}}, function(err, foundList){
  if(!err){
    res.redirect("/"+listName)
  }
})
}
 
})



app.get("/about", (req,res)=>{
  res.render("about")
})



app.listen(port, function(){
    console.log("Server started on port 3000")
})


// nodemon server.js