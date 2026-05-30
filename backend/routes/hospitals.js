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
if(speciality){

hospitals = hospitals.filter(hospital => {

    const name =
    (
        hospital.tags?.name || ""
    ).toLowerCase();

    switch(speciality){

        case "eye":
            return name.includes("eye") ||
                   name.includes("vision") ||
                   name.includes("ophthalm");

        case "heart":
            return name.includes("heart") ||
                   name.includes("cardio");

        case "skin":
            return name.includes("skin") ||
                   name.includes("derma");

        case "bone":
            return name.includes("ortho") ||
                   name.includes("bone");

        case "child":
            return name.includes("child") ||
                   name.includes("pediatric");

        case "dental":
            return name.includes("dental") ||
                   name.includes("tooth");

        case "gynecology":
            return name.includes("women") ||
                   name.includes("gyne");

        default:
            return true;
    }

});


}


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