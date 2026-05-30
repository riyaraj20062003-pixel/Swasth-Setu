console.log("🔥 NEW HOSPITAL ROUTE LOADED 🔥");

const express = require("express");
const router = express.Router();

const {
    getNearbyHospitals
} = require("../services/osmService");

router.get("/", async (req, res) => {

    try {
const latitude = req.query.lat;
const longitude = req.query.lng;
const speciality = req.query.speciality;

        if (!latitude || !longitude) {

            return res.status(400).json({
                message: "Latitude and Longitude required"
            });

        }

let hospitals =
await getNearbyHospitals(
    latitude,
    longitude
);
res.json(hospitals);

    } catch (error) {

    console.error("FULL ERROR:");
    console.error(error.response?.data || error.message);

    res.status(500).json({
        message: "Failed to fetch hospitals",
        error: error.message
    });

}

});

module.exports = router;