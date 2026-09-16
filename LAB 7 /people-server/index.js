const express = require("express");
const bodyParser = require("body-parser");

const app = express();



app.use((req, res, next) => {
    console.log("Request received:", req.url);
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

const people = [
    {
        name: "Swaroop",
        description: "BCA Student",
        image: "/profile.jpg"
    },
    {
        name: "Aryan",
        description: "Computer Science Student",
        image: "/profile.jpg"
    },
    {
        name: "Girish",
        description: "Software Developer",
        image: "/profile.jpg"
    }
];

app.get("/", (req, res) => {
    res.send("Hello from my Express server!");
});

app.get("/form", (req, res) => {
    res.render("form");
});

app.post("/submit", (req, res) => {

    console.log(req.body);

    res.send("Data received!");

});

app.post("/submit", (req, res) => {

    const name = req.body.name;
    const description = req.body.description;

    res.render("person", {
        title: name + "'s Profile",
        name: name,
        description: description,
        image: "/profile.jpg"
    });

});

app.get("/person", (req, res) => {
    res.sendFile(__dirname + "/person.html");
});

app.get("/person2", (req, res) => {
    res.sendFile(__dirname + "/person2.html");
});

app.get("/profile", (req, res) => {
    res.render("person", {
        title: "Swaroop's Profile",
        name: "Swaroop",
        description: "BCA Student"
    });
});

app.get("/profile/:id", (req, res) => {

    const id = req.params.id;

    const person = people[id];

    if (!person) {
        return res.status(404).send("Person not found");
    }

    res.render("person", {
        title: person.name + "'s Profile",
        name: person.name,
        description: person.description,
        image: person.image
    });

});

app.get("/people", (req, res) => {
    res.render("home", {
        people: people
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});