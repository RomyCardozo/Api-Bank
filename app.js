require("dotenv").config();
const express = require("express");
const routes = require("./src/routes/v1")
    

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1", routes);

app.get("/api/v1/health-check", (req, res) => {
    res.json({
        status: "Online",
        health: "ok"
})
})

app.get("/api/v1/mensaje", (req, res) => {
    res.json({
        name: "Romy",
        lastName: "Cardozo"
    })
})

app.get("/api/v1/saludar", (req, res) => {
    res.send("Holi");
})

app.listen(PORT, () => {
    console.log("Bank Api corriendo en el puerto:", PORT)
})