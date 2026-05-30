console.log("SERVER FILE:", __filename);
const express = require("express");
const cors = require("cors");
const hospitalRoutes =
require("./routes/hospitals");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.send(
        "Swasth Setu Backend Running 🚀"
    );

});
app.use(
    "/api/hospitals",
    hospitalRoutes
);
const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});