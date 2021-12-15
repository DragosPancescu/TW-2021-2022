const { json } = require("express");
const express = require("express");
const app = express();
const fs = require('fs');
const sharp = require('sharp');
const port = process.env.Port || 8080;
const host = '0.0.0.0';

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

function createImages(){
    // Handle gallery
    var buf = fs.readFileSync(`${__dirname}/Resources/Json/galerie.json`).toString("utf-8");
    obImagini = JSON.parse(buf);

    // Resize images
    obImagini.imagini.forEach(imag => {
        var nume_imag;
        [nume_imag, ]= imag.cale_imagine.split('.');
        
        let dim_mic = 150;
        let dim_mediu = 250;

        imag.mic = `/${obImagini.cale_galerie}/Small/${nume_imag}-mic.webp`;
        imag.mediu = `/${obImagini.cale_galerie}/Medium/${nume_imag}-mediu.webp`;
        imag.mare = `/${obImagini.cale_galerie}/${imag.cale_imagine}`;

        console.log(imag.mic)
        
        // If file exists dont create it
        if (!fs.existsSync(`${__dirname}${imag.mic}`)) {
            sharp(`${__dirname}${imag.mare}`).resize(dim_mic).toFile(`${__dirname}${imag.mic}`);
        }

        // If file exists dont create it
        if (!fs.existsSync(`${__dirname}${imag.mediu}`)) {
            sharp(`${__dirname}${imag.mare}`).resize(dim_mediu).toFile(`${__dirname}${imag.mediu}`);
        }

    });
    console.log("Done with processing gallery images");
}

createImages();

// Route Handling
app.get(["/", "/index"], (req, res) => {
    res.render("pagini/index", {ip: req.ip, images:obImagini.imagini, cale_galerie:obImagini.cale_galerie});
});

app.get(["/galerii"], (req, res) => {

    // Generate odd number between 5 and 11
    var max = 12;
    var min = 5;
    var numar_imagini = Math.floor(Math.random() * (max - min + 1)) + min;
    if (numar_imagini % 2 == 0) {
        if (numar_imagini == 12){
            numar_imagini -= 1;
        } else {
            numar_imagini += 1;
        }
    }

    console.log(`animated gallery number of images: ${numar_imagini}`)

    // Select last numar_imagini from the images list
    var imagesAnimate = [];
    for (i=obImagini.imagini.length - 1; i >= 0; i--){
        imagesAnimate.push(obImagini.imagini[i]);

        if (i == obImagini.imagini.length - 1 - numar_imagini){
            break;
        }
    }

    // Compile sass


    res.render("pagini/galerii", {animated_images:imagesAnimate, images:obImagini.imagini, cale_galerie:obImagini.cale_galerie});
});

// Route forbidden
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
app.listen(port, host, () => {
    console.log("Server started on port: ", port);
});