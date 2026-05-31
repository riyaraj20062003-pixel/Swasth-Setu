require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { GoogleGenerativeAI } =
require("@google/generative-ai");

const hospitalRoutes =
require("./routes/hospitals");

const app = express();

const PORT = 5000;

/* =========================
   GEMINI SETUP
========================= */

const genAI =
new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

console.log(
    "SERVER FILE:",
    __filename
);

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

/* =========================
   ROOT ROUTE
========================= */

app.get("/", (req, res) => {

    res.send(
        "Swasth Setu Backend Running 🚀"
    );

});

/* =========================
   TEST ROUTE
========================= */

app.get("/test", (req, res) => {

    res.send(
        "TEST ROUTE WORKING ✅"
    );

});

/* =========================
   CHAT TEST ROUTE
========================= */

app.get("/api/chat", (req, res) => {

    res.send(
        "Arogya AI API Working ✅"
    );

});

/* =========================
   HOSPITAL ROUTES
========================= */

app.use(
    "/api/hospitals",
    hospitalRoutes
);

/* =========================
   GEMINI CHAT API
========================= */

app.post(
"/api/chat",
async (req, res) => {

    try {

        const { message } =
        req.body;

        if(!message){

            return res
            .status(400)
            .json({

                reply:
                "Message is required."

            });

        }

        console.log(
            "USER:",
            message
        );

        const model =
        genAI.getGenerativeModel({

            model:
            "gemini-2.5-flash"

        });

        const result =
        await model.generateContent(
            message
        );

        const reply =
        result.response.text();

        console.log(
            "AI:",
            reply.substring(
                0,
                100
            )
        );

        res.json({

            reply

        });

    }

    catch(error){

        console.error(
            "🔥 GEMINI ERROR 🔥"
        );

        console.error(error);

        res.status(500).json({

            reply:
            "Sorry, Arogya AI is unavailable right now."

        });

    }

});

/* =========================
   START SERVER
========================= */

app.listen(
PORT,
() => {

    console.log(
        `Server running on port ${PORT}`
    );

});