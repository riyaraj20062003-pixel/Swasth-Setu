
const axios = require("axios");

async function getNearbyHospitals(lat, lng) {

    const query = `
[out:json];
(
  node["amenity"="hospital"](around:2000,${lat},${lng});
);
out;
`;

    const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        {
            headers: {
                "Content-Type": "text/plain",
                "User-Agent": "SwasthSetu/1.0"
            },
            timeout: 15000
        }
    );

    return response.data.elements;
}

module.exports = {
    getNearbyHospitals
};

