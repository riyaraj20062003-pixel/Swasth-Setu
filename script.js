
// PERMANENT DARK MODE


document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("dark-mode");
});
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
// MOBILE MENU
// =========================

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

if (hamburger && mobileMenu) {

    hamburger.addEventListener("click", () => {

        hamburger.classList.toggle("active");
        mobileMenu.classList.toggle("active");

    });

  document
.querySelectorAll(".mobile-menu a")
.forEach(link => {

    link.addEventListener("click", function(e){

        const target =
        document.querySelector(
            this.getAttribute("href")
        );

        if(target){

            e.preventDefault();

            hamburger.classList.remove("active");
            mobileMenu.classList.remove("active");

            target.scrollIntoView({
                behavior:"smooth"
            });

        }

    });

});

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
            "http://localhost:5000/api/chat",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    message: `
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
                })

            });

            const data =
            await response.json();

            document
            .getElementById("typing")
            ?.remove();

            const aiReply =
            data.reply;

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
`https://swasth-setu-backend.onrender.com/api/hospitals?lat=${lat}&lng=${lng}&speciality=${specialist}`
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

const analyzeBtn =
document.getElementById(
"analyzePrescription"
);

if(analyzeBtn){

analyzeBtn.addEventListener(
"click",
()=>{

const result =
document.getElementById(
"prescriptionResult"
);

result.innerHTML = `

<b>Medicine:</b>
Paracetamol 650mg

<br><br>

<b>Dosage:</b>
1 Tablet Twice Daily

<br><br>

<b>Duration:</b>
5 Days

<br><br>

<b>Advice:</b>
Take After Food

`;

});
}


/* ===================================
   HEALTH PROFILE BUILDER
=================================== */

const generateBtn =
document.getElementById("generateCard");

if(generateBtn){

generateBtn.addEventListener(
"click",
()=>{

const name =
document.getElementById("name").value;

const age =
parseInt(
document.getElementById("age").value
) || 0;

const gender =
document.getElementById("gender").value;

const blood =
document.getElementById("blood").value;

const height =
parseFloat(
document.getElementById("height").value
) || 0;

const weight =
parseFloat(
document.getElementById("weight").value
) || 0;

const disease =
document.getElementById("disease").value;

const allergy =
document.getElementById("allergy").value;

const emergency =
document.getElementById("emergency").value;

/* =====================
   BMI CALCULATION
===================== */

let bmi = 0;

if(height > 0 && weight > 0){

bmi =
weight /
Math.pow(height / 100, 2);

}

bmi = bmi.toFixed(1);

/* =====================
   HEALTH SCORE
===================== */

let score = 100;

if(bmi < 18.5 || bmi > 25){
score -= 15;
}

if(disease.trim() !== ""){
score -= 20;
}

if(allergy.trim() !== ""){
score -= 10;
}

if(age > 50){
score -= 10;
}

if(score < 0){
score = 0;
}

/* =====================
   STATUS
===================== */

let risk = "Low";
let status = "Healthy";
let color = "#22c55e";

if(score < 90){

risk = "Moderate";
status = "Need Attention";
color = "#f97316";

}

if(score < 60){

risk = "High";
status = "Consult Doctor";
color = "#ef4444";

}

/* =====================
   HEALTH CARD
===================== */

const output =
document.getElementById(
"healthCardOutput"
);

output.innerHTML = `

<div class="health-id">

<h2>

<i class="fa-solid fa-heart-pulse"></i>

Health ID Card

</h2>

<hr>

<div class="health-row">

<span class="health-label">

<i class="fa-solid fa-user"></i>

Name

</span>

<span class="health-value">

${name || "-"}

</span>

</div>

<div class="health-row">

<span class="health-label">

<i class="fa-solid fa-cake-candles"></i>

Age

</span>

<span class="health-value">

${age || "-"}

</span>

</div>

<div class="health-row">

<span class="health-label">

<i class="fa-solid fa-venus-mars"></i>

Gender

</span>

<span class="health-value">

${gender || "-"}

</span>

</div>

<div class="health-row">

<span class="health-label">

<i class="fa-solid fa-droplet"></i>

Blood Group

</span>

<span class="health-value">

${blood || "-"}

</span>

</div>

<div class="health-row">

<span class="health-label">

<i class="fa-solid fa-ruler-vertical"></i>

Height

</span>

<span class="health-value">

${height || "-"}

cm

</span>

</div>

<div class="health-row">

<span class="health-label">

<i class="fa-solid fa-weight-scale"></i>

Weight

</span>

<span class="health-value">

${weight || "-"}

kg

</span>

</div>

<div class="health-row">

<span class="health-label">

<i class="fa-solid fa-notes-medical"></i>

Diseases

</span>

<span class="health-value">

${disease || "None"}

</span>

</div>

<div class="health-row">

<span class="health-label">

<i class="fa-solid fa-triangle-exclamation"></i>

Allergies

</span>

<span class="health-value">

${allergy || "None"}

</span>

</div>

<div class="health-row">

<span class="health-label">

<i class="fa-solid fa-phone-volume"></i>

Emergency

</span>

<span class="health-value">

${emergency || "-"}

</span>

</div>

</div>

`;

/* =====================
   HEALTH SCORE
===================== */

document.getElementById(
"healthScore"
).textContent = score;

document.getElementById(
"bmiValue"
).textContent = bmi;

document.getElementById(
"riskLevel"
).textContent = risk;

document.getElementById(
"healthStatus"
).textContent = status;

/* =====================
   COLORS
===================== */

document.getElementById(
"riskLevel"
).style.color = color;

document.getElementById(
"healthStatus"
).style.color = color;

/* =====================
   CIRCLE UPDATE
===================== */
const circle =
document.querySelector(".score-circle");

if(circle){

let circleColor = "#22c55e";

if(score < 75){
circleColor = "#f59e0b";
}

if(score < 60){
circleColor = "#ef4444";
}

const degree =
(score / 100) * 360;

circle.style.background =
`conic-gradient(
${circleColor} ${degree}deg,
rgba(255,255,255,.08) ${degree}deg
)`;

document.getElementById(
"healthScore"
).textContent = score;

}

document.getElementById("healthScore").textContent = score;

});
}

/* ===================================
   REAL OCR PRESCRIPTION READER
=================================== */

const analyzePrescriptionBtn =
document.getElementById(
"analyzePrescription"
);

if(analyzePrescriptionBtn){

analyzePrescriptionBtn.addEventListener(
"click",
async ()=>{

const fileInput =
document.getElementById(
"prescriptionFile"
);

const result =
document.getElementById(
"prescriptionResult"
);

const file =
fileInput.files[0];

if(!file){

result.innerHTML = `

<div class="result-item">

<strong>
Please upload a prescription.
</strong>

</div>

`;

return;
}

result.innerHTML = `

<div class="result-item">

<strong>
Reading Prescription...
</strong>

</div>

`;

try{
console.log("START OCR");
const {
data:{ text }
}
=
await Tesseract.recognize(
file,
"eng"
);

console.log("OCR TEXT:");
console.log(text);
result.innerHTML = `

<div class="result-item">

<strong>
Extracted Text
</strong>

<br><br>

${text.replace(/\n/g,"<br>")}

</div>

`;

}
catch(error){

result.innerHTML = `

<div class="result-item">

<strong>
Unable to read prescription.
</strong>

</div>

`;

console.log(error);

}

});
}



/* ===================================
   CBC REPORT ANALYZER - PART 1
=================================== */

const analyzeCBCBtn =
document.getElementById("analyzeCBC");

if(analyzeCBCBtn){

analyzeCBCBtn.addEventListener(
"click",
async ()=>{

const file =
document.getElementById("cbcFile").files[0];

const result =
document.getElementById("cbcResult");

const preview =
document.getElementById("cbcPreview");

const placeholder =
document.getElementById("previewPlaceholder");

/* FILE CHECK */

if(!file){

result.innerHTML = `
<div class="cbc-item">
<h4>Upload Required</h4>
<p>Please upload a CBC report.</p>
</div>
`;

return;
}

/* PREVIEW */

const reader = new FileReader();

reader.onload = function(e){

if(preview){
preview.src = e.target.result;
preview.style.display = "block";
}

if(placeholder){
placeholder.style.display = "none";
}

};

reader.readAsDataURL(file);

result.innerHTML = `
<div class="cbc-item">
<h4>Analyzing Report...</h4>
<p>Reading CBC values using OCR...</p>
</div>
`;

try{

const {
data:{ text }
}
=
await Tesseract.recognize(
file,
"eng"
);

console.log("OCR TEXT:");
console.log(text);

/* =====================
   VALUE EXTRACTION
===================== */

const hemoglobin =
text.match(/HEMOGLOBIN\s+([\d.]+)/i)?.[1]
|| "Not Found";

const wbc =
text.match(/TOTAL LEUKOCYTE COUNT\s+([\d,]+)/i)?.[1]
|| "Not Found";

const rbc =
text.match(/TOTAL RBC COUNT\s+([\d.]+)/i)?.[1]
|| "Not Found";

const platelets =
text.match(
/(PLATELET COUNT|PLATELETS|PLT)[^0-9]*([\d.]+)/i
)?.[2]
|| "Not Found";

const neutrophils =
text.match(/NEUTROPHILS\s+([\d.]+)/i)?.[1]
|| "Not Found";

const lymphocyte =
text.match(/LYMPHOCYTE.*?([\d.]+)/i)?.[1]
|| "Not Found";

const eosinophils =
text.match(/EOSINOPHILS\s+([\d.]+)/i)?.[1]
|| "Not Found";

const monocytes =
text.match(/MONOCYTES.*?([\d.]+)/i)?.[1]
|| "Not Found";

const basophils =
text.match(/BASOPHILS\s+([\d.]+)/i)?.[1]
|| "Not Found";

const hct =
text.match(/HCT\s+([\d.]+)/i)?.[1]
|| "Not Found";

const mcv =
text.match(/MCV\s+([\d.]+)/i)?.[1]
|| "Not Found";

const mch =
text.match(/MCH\s+([\d.]+)/i)?.[1]
|| "Not Found";

const mchc =
text.match(/MCHC.*?([\d.]+)/i)?.[1]
|| "Not Found";
/* =====================
   PATIENT DETAILS
===================== */

const patientName =
text.match(/Mr\.\s+[A-Za-z\s]+/i)?.[0]
|| "Not Found";

const age =
text.match(/(\d+)\s*YRS/i)?.[1]
|| "--";

const genderCode =
text.match(/\/([MF])/i)?.[1];

const gender =
genderCode === "M"
? "Male"
: genderCode === "F"
? "Female"
: "--";

const reportDate =
text.match(
/Reported on:\s*([0-9\/]+)/i
)?.[1]
|| "Not Found";

/* =====================
   HEALTH ANALYSIS
===================== */

let risk = "Low";

if(
hemoglobin !== "Not Found" &&
Number(hemoglobin) < 12
){
risk = "Moderate";
}

if(
wbc !== "Not Found" &&
Number(
wbc.replace(",","")
) > 11000
){
risk = "High";
}

/* =====================
   HEALTH SCORE
===================== */

let healthScore = 100;

if(
lymphocyte !== "Not Found" &&
Number(lymphocyte) < 20
){
healthScore -= 10;
}

if(
mchc !== "Not Found" &&
Number(mchc) > 34.5
){
healthScore -= 5;
}

if(
hemoglobin !== "Not Found" &&
Number(hemoglobin) < 12
){
healthScore -= 20;
}

if(
wbc !== "Not Found" &&
Number(
wbc.replace(",","")
) > 11000
){
healthScore -= 20;
}

if(
platelets !== "Not Found" &&
Number(platelets) < 15
){
healthScore -= 15;
}

if(
rbc !== "Not Found" &&
Number(rbc) < 4.5
){
healthScore -= 10;
}

if(healthScore < 0){

healthScore = 0;

}

/* =====================
   HEALTH STATUS
===================== */

let healthStatus = "";

if(
healthScore >= 90
){

healthStatus = "Excellent";

}
else if(
healthScore >= 75
){

healthStatus = "Good";

}
else if(
healthScore >= 60
){

healthStatus = "Moderate";

}
else{

healthStatus =
"Needs Attention";

}

/* =====================
   STATUS BADGES
===================== */

function getStatus(
value,
min,
max
){

if(
value === "Not Found"
){

return `
<span class="cbc-badge warning">
Not Found
</span>
`;

}

if(
Number(value) < min
){

return `
<span class="cbc-badge danger">
Low
</span>
`;

}

if(
Number(value) > max
){

return `
<span class="cbc-badge warning">
High
</span>
`;

}

return `
<span class="cbc-badge success">
Normal
</span>
`;

}
/* =====================
   AI SUMMARY
===================== */

let summary = [];

if(
hemoglobin !== "Not Found" &&
Number(hemoglobin) >= 13
){

summary.push(
"✓ Hemoglobin Level Normal"
);

}

if(
wbc !== "Not Found" &&
Number(
wbc.replace(",","")
) >= 4800 &&
Number(
wbc.replace(",","")
) <= 10800
){

summary.push(
"✓ WBC Count Within Range"
);

}

if(
platelets !== "Not Found" &&
Number(platelets) >= 15
){

summary.push(
"✓ Platelet Count Stable"
);

}

if(
lymphocyte !== "Not Found" &&
Number(lymphocyte) < 20
){

summary.push(
"⚠ Lymphocyte Slightly Low"
);

}

if(
mchc !== "Not Found" &&
Number(mchc) > 34.5
){

summary.push(
"⚠ MCHC Slightly High"
);

}

if(
hemoglobin !== "Not Found" &&
Number(hemoglobin) < 12
){

summary.push(
"⚠ Possible Mild Anemia"
);

}

if(
wbc !== "Not Found" &&
Number(
wbc.replace(",","")
) > 11000
){

summary.push(
"⚠ Possible Infection Detected"
);

}

if(
summary.length === 0
){

summary.push(
"✓ CBC Report Successfully Analyzed"
);

}

/* =====================
   RECOMMENDATIONS
===================== */
let recommendations = [];

if(Number(hemoglobin) < 12){

recommendations.push(
"🥗 Increase iron-rich foods such as spinach, beetroot and dates."
);

}

if(Number(lymphocyte) < 20){

recommendations.push(
"🍊 Eat Vitamin C rich foods to support immunity."
);

recommendations.push(
"😴 Ensure 7-8 hours of quality sleep daily."
);

}

if(Number(wbc.replace(",","")) > 11000){

recommendations.push(
"👨‍⚕️ Consult a physician if infection symptoms are present."
);

}

if(Number(platelets) < 15){

recommendations.push(
"💧 Stay hydrated and monitor platelet levels regularly."
);

}

recommendations.push(
"🏃 Perform at least 30 minutes of physical activity daily."
);

if(recommendations.length === 1){

recommendations.push(
"✅ Maintain your current healthy lifestyle."
);

}
/* =====================
   DISEASE PREDICTION
===================== */

let possibleConditions = [];

if(
Number(lymphocyte) < 20
){

possibleConditions.push(
"Possible Mild Viral Infection"
);

}

if(
Number(mchc) > 34.5
){

possibleConditions.push(
"Possible Dehydration or RBC Concentration Issue"
);

}

if(
Number(hemoglobin) < 12
){

possibleConditions.push(
"Possible Iron Deficiency Anemia"
);

}

if(
Number(wbc.replace(",","")) > 11000
){

possibleConditions.push(
"Possible Infection or Inflammation"
);

}

if(
possibleConditions.length === 0
){

possibleConditions.push(
"No Major Health Risk Detected"
);

}
/* =====================
   AI DIET PLAN
===================== */

let dietPlan = [];

if(Number(hemoglobin) < 12){

dietPlan.push(
"🥬 Spinach and Beetroot Juice"
);

dietPlan.push(
"🥚 Eggs and Dates"
);

}

if(Number(lymphocyte) < 20){

dietPlan.push(
"🍊 Orange and Lemon"
);

dietPlan.push(
"🥛 Milk and Dry Fruits"
);

}

if(Number(mchc) > 34.5){

dietPlan.push(
"💧 Drink More Water"
);

}

dietPlan.push(
"🍎 Fresh Fruits Daily"
);

dietPlan.push(
"🥗 Green Vegetables"
);

dietPlan.push(
"🍚 Balanced Home-Cooked Meals"
);
/* =====================
   HEALTH ALERT
===================== */

let alertMessage =
"Normal";

if(
risk === "High"
){

alertMessage =
"Medical Consultation Recommended";

}
else if(
risk === "Moderate"
){

alertMessage =
"Monitor Health Parameters";

}

/* =====================
   SCORE COLOR
===================== */

let scoreColor =
"#22c55e";

if(
healthScore < 75
){

scoreColor =
"#f59e0b";

}

if(
healthScore < 60
){

scoreColor =
"#ef4444";

}
/* =====================
   OUTPUT
===================== */

result.innerHTML = `

<div class="cbc-item ai-summary-card">

<h4>
<i class="fa-solid fa-user"></i>
Patient Details
</h4>

<p>

<b>Name:</b> ${patientName}

<br><br>

<b>Age:</b> ${age} Years

<br><br>

<b>Gender:</b> ${gender}

<br><br>

<b>Report Date:</b> ${reportDate}

<br><br>

<b>Status:</b> Successfully Analyzed

</p>

</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-droplet"></i> Hemoglobin</h4>
<p>${hemoglobin} ${getStatus(hemoglobin,13,17)}</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-shield-virus"></i> WBC Count</h4>
<p>${wbc} ${getStatus(wbc.replace(",",""),4800,10800)}</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-heart-circle-check"></i> RBC Count</h4>
<p>${rbc} ${getStatus(rbc,4.5,5.5)}</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-bandage"></i> Platelets</h4>
<p>${platelets} ${getStatus(platelets,15,41)}</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-dna"></i> Neutrophils</h4>
<p>${neutrophils}%</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-dna"></i> Lymphocyte</h4>
<p>${lymphocyte}%</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-dna"></i> Eosinophils</h4>
<p>${eosinophils}%</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-dna"></i> Monocytes</h4>
<p>${monocytes}%</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-dna"></i> Basophils</h4>
<p>${basophils}%</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-chart-column"></i> HCT</h4>
<p>${hct}%</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-chart-line"></i> MCV</h4>
<p>${mcv} fL</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-chart-line"></i> MCH</h4>
<p>${mch} pg</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-chart-line"></i> MCHC</h4>
<p>${mchc}%</p>
</div>

<div class="cbc-item">
<h4><i class="fa-solid fa-triangle-exclamation"></i> Health Risk</h4>
<p>${risk}</p>
</div>

<div class="cbc-item health-score-card">

<h4>
<i class="fa-solid fa-heart-circle-check"></i>
Health Score
</h4>

<div class="score-circle">
<span>${healthScore}</span>
</div>

<p class="score-status">
${healthStatus}
</p>

</div>

<div class="cbc-item ai-summary-card">

<h4>
<i class="fa-solid fa-brain"></i>
AI Health Summary
</h4>

<p>
${summary.join("<br>")}
</p>

</div>

<div class="cbc-item ai-summary-card">

<h4>
<i class="fa-solid fa-lightbulb"></i>
Recommendations
</h4>

<p>
${recommendations.join("<br><br>")}
</p>

</div>
<div class="cbc-item ai-summary-card">

<h4>
<i class="fa-solid fa-stethoscope"></i>
Possible Conditions
</h4>

<p>

${possibleConditions.join("<br><br>")}

</p>

</div>
<div class="cbc-item ai-summary-card">

<h4>
<i class="fa-solid fa-utensils"></i>
AI Diet Plan
</h4>

<p>

${dietPlan.join("<br><br>")}

</p>

</div>
<div class="cbc-item ai-summary-card">

<h4>
<i class="fa-solid fa-user-doctor"></i>
Recommended Specialist
</h4>

<p>

🩺 ${doctorSuggestion}

</p>

</div>
<div class="cbc-item ai-summary-card">

<h4>
<i class="fa-solid fa-bell"></i>
Health Alert
</h4>

<p>
${alertMessage}
</p>

</div>

`;

/* =====================
   SCORE CIRCLE
===================== */

const scoreCircle =
document.querySelector(
".health-score-card .score-circle"
);

if(scoreCircle){

scoreCircle.style.background =
`conic-gradient(
${scoreColor}
${(healthScore / 100) * 360}deg,
rgba(255,255,255,.08) 0deg
)`;

}
}
catch(error){

console.error(error);

result.innerHTML = `

<div class="cbc-item">

<h4>Error</h4>

<p>
Unable to analyze report.
</p>

</div>

`;

}
});
}
/* ===================================
   CBC PDF DOWNLOAD
=================================== */

const pdfBtn =
document.getElementById(
"downloadCBCPdf"
);

if(pdfBtn){

pdfBtn.addEventListener(
"click",
()=>{

const reportText =
document.getElementById(
"cbcResult"
).innerText;

if(!reportText){

alert(
"No CBC Report Found"
);

return;

}

const win =
window.open(
"",
"_blank"
);

win.document.write(`

<html>

<head>

<title>
CBC Health Report
</title>

<style>

body{

font-family:Arial;
padding:40px;

}

h1{

color:#ff7a00;

}

pre{

white-space:pre-wrap;

font-size:14px;

line-height:1.8;

}

</style>

</head>

<body>

<h1>
Swasth Setu CBC Report
</h1>

<hr>

<pre>

${reportText}

</pre>

</body>

</html>

`);

win.document.close();

win.print();

});

}
/* ===================================
   CBC VOICE SUMMARY (DYNAMIC)
=================================== */

const cbcVoiceBtn =
document.getElementById(
"voiceSummaryBtn"
);

if(cbcVoiceBtn){

cbcVoiceBtn.onclick = function(){

const reportText =
document.getElementById(
"cbcResult"
).innerText;

speechSynthesis.cancel();

const msg =
new SpeechSynthesisUtterance(
reportText
);

msg.lang = "en-US";

msg.rate = 0.9;

msg.pitch = 1;

speechSynthesis.speak(msg);

};

}
/* =====================
   DOCTOR RECOMMENDATION
===================== */

let doctorSuggestion =
"General Physician";

if(Number(hemoglobin) < 12){

doctorSuggestion =
"Hematologist";

}

if(Number(lymphocyte) < 20){

doctorSuggestion =
"Immunologist";

}

if(Number(wbc.replace(",","")) > 11000){

doctorSuggestion =
"Infectious Disease Specialist";

}