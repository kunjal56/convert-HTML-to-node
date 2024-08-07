const express = require("express");

const path = require("path");
const app = express();

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({extended: true}));

var studentData = [
    {
        id: 1,
        name: "Kunji"
    },
    {
        id: 2,
        name: "Rakhi"
    }
]

app.set("view engine", "ejs");

const middleware = ((req,res,next) => {
    if(req.query.age >= 18) {
        next();
    } else {
        res.redirect("/")
    }
})

app.get("/", (req, res) => {
 res.render("index1", {
    student: studentData
 })
});

app.post("/insertData", (req,res) => {
    const { id, name } = req.body;

    const i= parseInt(id) ? parseInt(id) : id ;

    let obj = {
        id: id,
        name: name
    }

    studentData.push(obj);
    res.redirect("/");
});

app.get("/deleteData", (req, res) => {
    const id = parseInt(req.query.userid , 10);

    const data = studentData.filter((el) => el.id != id);

    studentData = data;

    res.redirect("back");
});

app.get("/edit", (req, res) => {
    const id = parseInt(req.query.userid, 10); // Correctly parse the ID

    const data = studentData.find(el => el.id === id);

    if (data) {
        res.render("edit", {
            data: data
        });
    } else {
        res.redirect("/");
        console.log("Internal server error");
    }
});

app.post("/update", (req, res) => {
    const id = parseInt(req.body.id, 10); // Parse the ID from the request body
    const { name } = req.body;

    studentData = studentData.map((el) => {
        if (el.id === id) {
            return { id, name };
        }
        return el;
    });

    res.redirect("/");
});

app.get("/admin", (req,res) => {
    res.render("index");
})

app.get("/home", middleware, (req , res) => {
    res.render("home");
})

app.use(middleware);

app.listen(3000, ()=> {
    console.log("server start")
});

