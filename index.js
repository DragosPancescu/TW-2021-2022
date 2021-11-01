const express = require("express");
const app = express();
const port = 8080;

// Settings
app.set("view engine", "ejs");
app.use("/Resources", express.static(`${__dirname}/Resources`));


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


// Starting the server
app.listen(port, () => {
    console.log("Server started on port: ", port);
});