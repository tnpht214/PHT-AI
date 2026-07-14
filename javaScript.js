/* =========================================
   PHT AI V100.0
   JavaScript - Part 1
========================================= */

//=============================
// BIẾN TOÀN CỤC
//=============================

let currentPage = "home";

let chatHistory = [];

let profile = {
    name: "",
    email: "",
    bio: "",
    avatar: ""
};

//=============================
// KHI WEBSITE TẢI
//=============================

window.onload = function () {

    loadProfile();

    loadChats();

    updateVisitor();

    initTheme();

    showPage("home");

    welcomeMessage();

    // Tắt màn hình loading
    setTimeout(function () {

        const loading = document.getElementById("loadingScreen");

        if (loading) {

            loading.style.display = "none";

        }

    }, 800);

};

//=============================
// CHUYỂN TRANG
//=============================

function showPage(id) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page){

        page.classList.remove("active");

    });

    const page = document.getElementById(id);

    if(page){

        page.classList.add("active");

        currentPage = id;

    }

}

//=============================
// GIAO DIỆN
//=============================

function toggleTheme(){

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );

}

function initTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark");

    }

}

//=============================
// THÔNG BÁO
//=============================

function toast(text){

    const toastBox = document.getElementById("toast");

    if(!toastBox) return;

    toastBox.innerHTML = text;

    toastBox.classList.add("show");

    setTimeout(function(){

        toastBox.classList.remove("show");

    },2500);

}
//=============================
// CHAT AI
//=============================

function welcomeMessage() {

    const chatBox = document.getElementById("chatBox");

    if (!chatBox) return;

    if (chatBox.innerHTML.trim() !== "") return;

    chatBox.innerHTML = `
        <div class="bot-message">
            👋 Xin chào!<br><br>
            Mình là <b>PHT AI V100.0</b>.<br><br>
            Hãy nhập câu hỏi để bắt đầu.
        </div>
    `;

}

async function sendMessage() {

    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    if (!input || !chatBox) return;

    const message = input.value.trim();

    if (message === "") return;

    chatBox.innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    chatBox.innerHTML += `
        <div class="bot-message" id="typing">
            🤖 Đang trả lời...
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message,
                username: profile.name || "Bạn"
            })

        });

        const data = await response.json();

        const typing = document.getElementById("typing");

        if (typing) typing.remove();

        chatBox.innerHTML += `
            <div class="bot-message">
                ${data.reply}
            </div>
        `;

        chatHistory.push({
            user: message,
            ai: data.reply
        });

        saveChats();

    } catch (error) {

        const typing = document.getElementById("typing");

        if (typing) typing.remove();

        chatBox.innerHTML += `
            <div class="bot-message">
                ❌ Không thể kết nối tới AI.
            </div>
        `;

        console.error(error);

    }

    chatBox.scrollTop = chatBox.scrollHeight;

}

document.addEventListener("keydown", function (e) {

    const input = document.getElementById("userInput");

    if (!input) return;

    if (e.key === "Enter" && document.activeElement === input) {

        e.preventDefault();

        sendMessage();

    }

});

//=============================
// CHAT HISTORY
//=============================

function newChat() {

    chatHistory = [];

    const chatBox = document.getElementById("chatBox");

    if (chatBox) {

        chatBox.innerHTML = "";

        welcomeMessage();

    }

    toast("Đã tạo cuộc trò chuyện mới.");

}

function clearCurrentChat() {

    if (!confirm("Bạn có chắc muốn xóa cuộc trò chuyện?")) return;

    chatHistory = [];

    const chatBox = document.getElementById("chatBox");

    if (chatBox) {

        chatBox.innerHTML = "";

        welcomeMessage();

    }

    saveChats();

    toast("Đã xóa cuộc trò chuyện.");

}

function saveChats() {

    localStorage.setItem(
        "pht_chat_history",
        JSON.stringify(chatHistory)
    );

}

function loadChats() {

    const data = localStorage.getItem("pht_chat_history");

    if (data) {

        chatHistory = JSON.parse(data);

    }

}

function exportChat() {

    if (chatHistory.length === 0) {

        toast("Không có dữ liệu để xuất.");

        return;

    }

    let text = "";

    chatHistory.forEach(function (item) {

        text += "Bạn: " + item.user + "\n";
        text += "AI: " + item.ai + "\n\n";

    });

    const blob = new Blob([text], {
        type: "text/plain"
    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "PHT_AI_Chat.txt";

    a.click();

    URL.revokeObjectURL(a.href);

}
//=============================
// PROFILE
//=============================

function saveProfile() {

    const name = document.getElementById("profileName");
    const email = document.getElementById("profileEmail");
    const bio = document.getElementById("profileBio");

    profile.name = name ? name.value : "";
    profile.email = email ? email.value : "";
    profile.bio = bio ? bio.value : "";

    localStorage.setItem(
        "pht_profile",
        JSON.stringify(profile)
    );

    toast("💾 Đã lưu hồ sơ.");

}

function loadProfile() {

    const data = localStorage.getItem("pht_profile");

    if (!data) return;

    profile = JSON.parse(data);

    const name = document.getElementById("profileName");
    const email = document.getElementById("profileEmail");
    const bio = document.getElementById("profileBio");
    const avatar = document.getElementById("avatarPreview");

    if (name) name.value = profile.name || "";
    if (email) email.value = profile.email || "";
    if (bio) bio.value = profile.bio || "";

    if (avatar && profile.avatar) {

        avatar.src = profile.avatar;

    }

}

//=============================
// AVATAR
//=============================

function initAvatar() {

    const avatarInput = document.getElementById("avatarInput");

    if (!avatarInput) return;

    avatarInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            const avatar = document.getElementById("avatarPreview");

            if (avatar) {

                avatar.src = e.target.result;

            }

            profile.avatar = e.target.result;

            localStorage.setItem(
                "pht_profile",
                JSON.stringify(profile)
            );

            toast("✅ Đã cập nhật avatar.");

        };

        reader.readAsDataURL(file);

    });

}

document.addEventListener("DOMContentLoaded", initAvatar);

//=============================
// BACK TO TOP
//=============================

window.addEventListener("scroll", function () {

    const btn = document.getElementById("backTop");

    if (!btn) return;

    if (window.scrollY > 300) {

        btn.style.display = "flex";

    } else {

        btn.style.display = "none";

    }

});

function scrollTopPage() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

//=============================
// LƯỢT TRUY CẬP
//=============================

function updateVisitor() {

    let visitor = Number(localStorage.getItem("visitor")) || 0;

    visitor++;

    localStorage.setItem("visitor", visitor);

    const count = document.getElementById("visitorCount");

    if (count) {

        count.innerHTML = visitor;

    }

}
//=============================
// LOADING SCREEN
//=============================

window.addEventListener("load", function () {

    const loading = document.getElementById("loadingScreen");

    if (!loading) return;

    setTimeout(function () {

        loading.style.opacity = "0";

        setTimeout(function () {

            loading.style.display = "none";

        }, 500);

    }, 800);

});

//=============================
// POPUP
//=============================

function showPopup(text) {

    const popup = document.getElementById("popup");
    const popupText = document.getElementById("popupText");

    if (!popup || !popupText) return;

    popupText.innerHTML = text;

    popup.style.display = "flex";

}

function closePopup() {

    const popup = document.getElementById("popup");

    if (!popup) return;

    popup.style.display = "none";

}

//=============================
// TÌM KIẾM
//=============================

function searchCards(keyword) {

    keyword = keyword.toLowerCase();

    const cards = document.querySelectorAll(
        ".card,.tool-card,.casio-card"
    );

    cards.forEach(function (card) {

        const text = card.innerText.toLowerCase();

        if (text.includes(keyword)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}

//=============================
// KIỂM TRA SERVER
//=============================

async function checkServer() {

    try {

        const response = await fetch("/");

        if (response.ok) {

            console.log("✅ Server Online");

        } else {

            console.log("⚠ Server phản hồi lỗi");

        }

    } catch (error) {

        console.log("❌ Không kết nối được Server");

    }

}

checkServer();

//=============================
// PHÍM ESC ĐÓNG POPUP
//=============================

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        closePopup();

    }

});

//=============================
// THÔNG TIN
//=============================

console.log("==================================");
console.log("🤖 PHT AI V100.0");
console.log("Developed by Hoàng Tấn Phát");
console.log("Website Loaded Successfully");
console.log("==================================");
