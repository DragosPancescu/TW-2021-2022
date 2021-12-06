const express = require("express");
const app = express();
const port = process.env.Port || 8080;

// Settings
app.set("view engine", "ejs");
app.use("/Resources", express.static(`${__dirname}/Resources`));
app.use(express.json());
app.use(express.urlencoded());

const {Client} = require("pg");

const client = new Client({    
    user: 'uhebvejjawfhtj',    
    password: '6d82ec355b0c9130d07913dd3e6b33ac0f0058edbc3e021d9e92142e63fffb5d',    
    database: 'd30g89385ru53p',    
    host: 'ec2-3-230-219-251.compute-1.amazonaws.com',    
    port: 5432
});



// Route Handling
app.get(["/", "/index"], (req, res) => {
    res.render("pagini/index", {ip: req.ip});
});

// Rute forbidden
app.get("/*.ejs", (req, res) => {
    res.status(403).render("pagini/error_page", {error_type: 403});
});

app.get("/*", (req, res) => {

    res.render("pagini" + req.url, (err, rezRandare) => {
        
        if (err != null)
            // If error is 404
            if (err.message.includes("Failed to lookup")){
                console.log(err.message);
                res.status(404).render("pagini/error_page", {error_type: 404});
                return;
            // General error
            }else {
                console.log(err.message);
                res.render("pagini/error_page", {error_type: "unknown, server stopped working."});
            }
        res.send(rezRandare);
    });
});

app.post("/contact", (req, res) => {
    if (req.body != null){
        var res_text = "first_name: " + req.body.firstname +
                        "\nlast_name: " + req.body.lastname +
                        "\nemail: " + req.body.email +
                        "\nsubject: " + req.body.subject;
        console.log(res_text)
    }
    res.render("pagini/contact")
});


// Starting the server
app.listen(port, () => {
    console.log("Server started on port: ", port);
});