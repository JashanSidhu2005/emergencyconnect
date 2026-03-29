/* --------------------------------------
   DATA: COUNTRY WISE EMERGENCY NUMBERS
-------------------------------------- */
const emergencyData = {
    india: [
        { key: "cat_police", number: "100", img: "images/police.jpg" },
        { key: "cat_ambulance", number: "102", img: "images/ambulance.jpg" },
        { key: "cat_fire", number: "101", img: "images/fire.jpg" },
        { key: "cat_women", number: "1091", img: "images/women.jpg" },
        { key: "cat_child", number: "1098", img: "images/child.jpg" },
        { key: "cat_cyber", number: "1930", img: "images/cyber.jpg" },
        { key: "cat_tourist", number: "1363", img: "images/tourist.jpg" },
        { key: "cat_road", number: "1073", img: "images/road.jpg" },
        { key: "cat_disaster", number: "108", img: "images/disaster.jpg" }
    ],
    canada: [
        { key: "cat_pfa", number: "911", img: "images/canadapolice.jpg" },
        { key: "cat_poison", number: "1-844-POISON-X", img: "images/canadahealth.jpg" },
        { key: "cat_mental", number: "988", img: "images/canadamental.jpg" },
        { key: "cat_telehealth", number: "811", img: "images/canadaambulance.jpg" },
        { key: "cat_kidshelp", number: "1-800-668-6868", img: "images/canadachild.jpg" }
    ]
};

// --------------------------------------
// THEME TOGGLE (DARK/LIGHT MODE)
// --------------------------------------
const themeToggleBtn = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", currentTheme);

if (themeToggleBtn) {
    themeToggleBtn.innerHTML = currentTheme === "dark" ? "☀️" : "🌙";
    themeToggleBtn.addEventListener("click", () => {
        let theme = document.documentElement.getAttribute("data-theme");
        let newTheme = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        themeToggleBtn.innerHTML = newTheme === "dark" ? "☀️" : "🌙";
    });
}

// --------------------------------------
// MULTI-LANGUAGE ENGINE
// --------------------------------------
function getLang() {
    return localStorage.getItem("lang") || "en";
}

let currentLang = getLang();

function updateLanguage(lang) {
    if (!translations || !translations[lang]) return;
    
    // Update all static elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            if(el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    // Re-render dynamic cards with translated titles
    const countrySelectLocal = document.getElementById("countrySelect");
    if(countrySelectLocal) {
        renderCards(countrySelectLocal.value);
    }
}

// We attach event listener to document in case nav is not fully parsed
document.addEventListener("DOMContentLoaded", () => {
    const langSelect = document.getElementById("langSelect");
    if(langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener("change", (e) => {
            currentLang = e.target.value;
            localStorage.setItem("lang", currentLang);
            updateLanguage(currentLang);
        });
    }
    updateLanguage(currentLang);
});


// --------------------------------------
// INITIALIZE GRID
// --------------------------------------
const grid = document.getElementById("cardsGrid");
const countrySelect = document.getElementById("countrySelect");
const searchInput = document.getElementById("searchInput");

function renderCards(country) {
    if (!grid) return; 

    grid.innerHTML = "";
    const services = emergencyData[country] || [];
    
    // Get translations for current lang, default to EN
    const currentDict = translations[currentLang] || translations["en"];

    services.forEach((s, index) => {
        const titleTranslated = currentDict[s.key] || "Emergency";
        const callBtnTranslated = currentDict["btn_call"] || "Call Now";

        const card = document.createElement("div");
        card.className = "col-12 col-md-6 col-lg-4";
        card.style.animation = `fadeInUp 0.5s ease forwards ${(index * 0.05)}s`;
        card.style.opacity = "0";

        const imgSrc = s.img ? s.img : 'images/bg.jpg';

        card.innerHTML = `
            <div class="card-box">
                <img src="${imgSrc}" alt="${titleTranslated}" onerror="this.src='https://via.placeholder.com/400x200?text=Emergency'">
                <div class="card-body-custom">
                    <div class="card-title">${titleTranslated}</div>
                    <div class="card-number">${s.number}</div>
                    <a href="tel:${s.number.replace(/\D/g, '')}" class="btn btn-call w-100">${callBtnTranslated}</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);

if (countrySelect) {
    renderCards(countrySelect.value);

    countrySelect.addEventListener("change", (e) => {
        renderCards(e.target.value);
        if (searchInput) searchInput.value = "";
    });
}

// --------------------------------------
// SEARCH BAR
// --------------------------------------
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        const cards = document.querySelectorAll(".card-box");

        cards.forEach(card => {
            const title = card.querySelector(".card-title").textContent.toLowerCase();
            card.parentElement.style.display = title.includes(value) ? "block" : "none";
        });
    });
}

// --------------------------------------
// WHATSAPP SOS & PANIC BUTTON
// --------------------------------------
const panicBtn = document.getElementById("panicBtn");
if (panicBtn) {
    panicBtn.addEventListener("click", function () {
        if ("geolocation" in navigator) {
            panicBtn.innerHTML = "LOCATING...";
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    let lat = position.coords.latitude;
                    let lon = position.coords.longitude;
                    let message = `🚨 EMERGENCY ALERT 🚨\n\nI need immediate assistance. My live location:\nhttps://www.google.com/maps?q=${lat},${lon}`;
                    let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

                    panicBtn.innerHTML = translations[currentLang]?.panic_btn || "🚨 PANIC BUTTON – SHARE LIVE LOCATION";
                    window.location.href = url;
                },
                function (error) {
                    alert("Location access is required to send emergency alert.");
                    panicBtn.innerHTML = translations[currentLang]?.panic_btn || "🚨 PANIC BUTTON – SHARE LIVE LOCATION";
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });
}
