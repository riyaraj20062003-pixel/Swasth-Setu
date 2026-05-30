let selectedSpeciality = "";

document
.querySelectorAll(
    ".speciality-card"
)
.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            document
            .querySelectorAll(
                ".speciality-card"
            )
            .forEach(c =>
                c.classList.remove(
                    "active"
                )
            );

            card.classList.add(
                "active"
            );

            selectedSpeciality =
            card.dataset.speciality;

        }
    );

});

// =========================
// DARK MODE
// =========================

const darkBtn =
document.getElementById("darkModeBtn");

if (darkBtn) {

    darkBtn.addEventListener("click", () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        const icon =
        darkBtn.querySelector("i");

        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");

        } else {

            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");

        }

    });

}

// =========================
// MOBILE MENU
// =========================

const menuBtn =
document.querySelector(".menu-toggle");

const navLinks =
document.querySelector(".nav-links");

if (menuBtn && navLinks) {

    menuBtn.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "active"
            );

        }
    );

}

// =========================
// AROGYA AI CHATBOT
// =========================

const sendBtn =
document.getElementById("sendBtn");

const userInput =
document.getElementById("userInput");

const chatMessages =
document.getElementById("chatMessages");

const languageSelect =
document.getElementById(
    "languageSelect"
);
// PASTE YOUR GEMINI API KEY

const API_KEY =
"";

if (sendBtn && userInput && chatMessages) {

    // =========================
    // ADD MESSAGE
    // =========================

    function addMessage(text, type) {

        const div =
        document.createElement("div");

        div.className =
        type === "user"
        ? "user-message"
        : "ai-message";

        div.innerText = text;

        chatMessages.appendChild(div);

        chatMessages.scrollTop =
        chatMessages.scrollHeight;
    }

    // =========================
    // AI SPEAKING
    // =========================

    function speakText(text){

        speechSynthesis.cancel();

        const voices =
        speechSynthesis.getVoices();

        const speech =
        new SpeechSynthesisUtterance(text);

        speech.voice =
        voices.find(v =>
            v.name.includes("Microsoft")
        ) || voices[0];

        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;

        speechSynthesis.speak(speech);
    }

    // =========================
    // SEND MESSAGE
    // =========================

    async function sendMessage() {

        const message =
        userInput.value.trim();

        if (!message) return;

        // =========================
        // EMERGENCY DETECTION
        // =========================

        const emergencyWords = [

            "heart attack",
            "chest pain",
            "stroke",
            "can't breathe",
            "breathing problem",
            "severe bleeding",
            "unconscious",
            "blood vomiting",
            "suicide",
            "overdose"

        ];

        const isEmergency =
        emergencyWords.some(word =>
        message.toLowerCase().includes(word));

        if(isEmergency){

            const emergencyMsg =
            "🚨 EMERGENCY DETECTED!\n\nCall 108 immediately.\nSeek emergency medical attention.";

            addMessage(
                emergencyMsg,
                "ai"
            );

            speakText(
                "Emergency detected. Call one zero eight immediately."
            );

            return;
        }

        addMessage(
            message,
            "user"
        );

        userInput.value = "";

        const typing =
        document.createElement("div");

        typing.className =
        "ai-message";

        typing.id =
        "typing";

        typing.innerText =
        "Arogya AI is typing...";

        chatMessages.appendChild(
            typing
        );

        try {

            const response =
            await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    contents:[
                        {
                            parts:[
                                {
                                    text:`
You are Arogya AI.

You are the healthcare assistant of Swasth Setu.

Rules:
- Support English and Hindi.
- Give health guidance.
- Never replace doctors.
- Be friendly.
- Be concise.

Respond only in:
${languageSelect?.value || "English"}

User Question:
${message}
`
                                }
                            ]
                        }
                    ]

                })
            });

            const data =
            await response.json();

            document
            .getElementById("typing")
            ?.remove();

            let aiReply;

            if(data.candidates){

                aiReply =
                data.candidates[0]
                .content.parts[0]
                .text;

            }
            else{

                aiReply =
                "Arogya AI is currently busy. Please try again later.";

            }

            addMessage(
                aiReply,
                "ai"
            );

            const shortReply =
            aiReply.substring(
                0,
                300
            );

            speakText(
                shortReply
            );

        }

        catch(error){

            document
            .getElementById("typing")
            ?.remove();

            addMessage(
                "Sorry, I am unavailable right now.",
                "ai"
            );

            console.error(
                error
            );
        }
    }

    sendBtn.addEventListener(
        "click",
        sendMessage
    );

    userInput.addEventListener(
        "keypress",
        function(e){

            if(
                e.key === "Enter"
            ){

                sendMessage();

            }

        }
    );

}
// =========================
// CHAT HISTORY
// =========================

if(chatMessages){

    const savedChat =
    localStorage.getItem(
        "arogyaChat"
    );

    if(savedChat){

        chatMessages.innerHTML =
        savedChat;

        chatMessages.scrollTop =
        chatMessages.scrollHeight;
    }

}

// Save every 2 seconds

setInterval(() => {

    if(chatMessages){

        localStorage.setItem(
            "arogyaChat",
            chatMessages.innerHTML
        );

    }

}, 2000);

// =========================
// CLEAR CHAT FUNCTION
// =========================

function clearChat(){

    localStorage.removeItem(
        "arogyaChat"
    );

    if(chatMessages){

        chatMessages.innerHTML =
        "";

    }

}

// =========================
// VOICE INPUT
// =========================

const voiceBtn =
document.getElementById(
    "voiceBtn"
);

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(
    SpeechRecognition &&
    voiceBtn
){

    const recognition =
    new SpeechRecognition();

    recognition.lang =
    "en-IN";

    recognition.continuous =
    false;

    recognition.interimResults =
    false;

    voiceBtn.addEventListener(
        "click",
        () => {

            recognition.start();

            voiceBtn.classList.add(
                "listening"
            );

        }
    );

    recognition.onstart =
    () => {

        console.log(
            "Listening..."
        );

    };

    recognition.onresult =
    (event) => {

        const transcript =
        event.results[0][0]
        .transcript;

        userInput.value =
        transcript;

    };

    recognition.onend =
    () => {

        voiceBtn.classList.remove(
            "listening"
        );

    };

    recognition.onerror =
    (event) => {

        console.log(
            "Voice Error:",
            event.error
        );

        voiceBtn.classList.remove(
            "listening"
        );

    };

}
// =========================
// HOSPITAL FINDER
// =========================

const findHospitalBtn =
document.getElementById(
    "findHospitalBtn"
);

const hospitalResult =
document.getElementById(
    "hospitalResult"
);

if(findHospitalBtn){

    findHospitalBtn.addEventListener(
    "click",
    () => {

        if(!selectedSpeciality){

            alert(
                "Please select a speciality first."
            );

            return;
        }

        hospitalResult.innerHTML = `
            <div class="loader"></div>
            <p>Finding nearby hospitals...</p>
        `;

        navigator.geolocation
        .getCurrentPosition(

            async(position)=>{

                const lat =
                position.coords.latitude;

                const lng =
                position.coords.longitude;

                try{

    const specialist =
    selectedSpeciality;
     const specialityNames = {
    eye: "Eye Care",
    heart: "Cardiology",
    skin: "Dermatology",
    bone: "Orthopedic",
    child: "Pediatrics",
    general: "General Care",
    gynecology: "Gynecology",
    dental: "Dental Care"
};

const specialistName =
specialityNames[specialist];
    const response =
    await fetch(
    `http://localhost:5000/api/hospitals?lat=${lat}&lng=${lng}&speciality=${specialist}`
    );

    const hospitals =
    await response.json();

    hospitalResult.innerHTML = "";

    const hospitalImages = [

    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",

    "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800",

    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",

    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800"

    ];

    hospitals
    .slice(0,6)
    .forEach((hospital,index) => {

        const hospitalName =
        hospital.tags?.name;

        if(!hospitalName){
            return;
        }

        const hospitalLat =
        Number(
            hospital.lat ||
            hospital.center?.lat
        );

        const hospitalLng =
        Number(
            hospital.lon ||
            hospital.center?.lon
        );

        const distance =
        Math.sqrt(
            Math.pow(
                hospitalLat - lat,
                2
            ) +
            Math.pow(
                hospitalLng - lng,
                2
            )
        ) * 111;

        const distanceText =
        distance.toFixed(1);

        hospitalResult.innerHTML += `

        <div class="hospital-card">

            <img
            src="${hospitalImages[index % hospitalImages.length]}"
            class="hospital-image"
            alt="Hospital">

            <div class="hospital-content">

                <h3>${hospitalName}</h3>

                <div class="specialist-badge">
                    ${specialistName}
                </div>

                <div class="distance-badge">
                    ${distanceText} km away
                </div>

                <p>
                    Trusted Healthcare Facility
                </p>

                <a
                href="https://www.google.com/maps?q=${hospitalLat},${hospitalLng}"
                target="_blank"
                class="map-btn">

                    View on Map

                </a>

            </div>

        </div>

        `;

    });

    if(hospitalResult.innerHTML === ""){

        hospitalResult.innerHTML = `
        <h3>No hospitals found nearby.</h3>
        `;
    }

}
                catch(error){

                    console.error(error);

                    hospitalResult.innerHTML = `
                    <h3>
                    Failed to load hospitals
                    </h3>
                    `;

                }

            },

            ()=>{

                hospitalResult.innerHTML = `
                <h3>
                Location permission denied
                </h3>
                `;

            }

        );

    });

}