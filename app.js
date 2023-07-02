//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect("mongodb://127.0.0.1:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection successful, proceed with operations");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const itemsSchems = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchems);
const title = "tody";
const item1 = new Item({
  name: "ali",
});
const item2 = new Item({
  name: "saj",
});
const item3 = new Item({
  name: "vareer",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find()
    .then((founItems) => {
      if (founItems.length === 0) {
        Item.insertMany(defaultItems)
          .then((insertItem) => {
            console.log("insert Items: " + insertItem);
          })
          .catch((error) => {
            console.log("error: " + error);
          });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: title, newListItems: founItems });
      }
    })
    .catch((error) => {
      console.error("Error executing query:", error);
      res.status(500).send("Error executing query");
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const itemCheckedId = req.body.itemChecked;

  Item.deleteOne({ _id: itemCheckedId })
    .then(() => {
      console.log("Item deleted successfully");
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error deleting item:", error);
      res.status(500).send("Error deleting item");
    });
});

app.get("/:customListName", function (req, res) {
  const requestTitle = req.params.customListName;
  
  title = _.lowerCase(requestTitle)

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
