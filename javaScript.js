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
// LOAD WEBSITE
//=============================

window.onload = function () {

    loadProfile();

    loadChats();

    updateVisitor();

    initTheme();

    showPage("home");

    welcomeMessage();

};

//=============================
// CHUYỂN TRANG
//=============================

function showPage(id) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function (page) {
        page.classList.remove("active");
    });

    const current = document.getElementById(id);

    if (current) {
        current.classList.add("active");
        currentPage = id;
    }

}

//=============================
// DARK MODE
//=============================

function toggleTheme() {

    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("theme", theme);

}

function initTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

    }

}

//=============================
// THÔNG BÁO
//=============================

function toast(text) {

    const toastBox = document.getElementById("toast");

    if (!toastBox) return;

    toastBox.innerHTML = text;

    toastBox.classList.add("show");

    setTimeout(function () {

        toastBox.classList.remove("show");

    }, 2500);

}

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

    // Hiển thị tin nhắn người dùng
    chatBox.innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    // Hiển thị AI đang trả lời
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

        document.getElementById("typing").remove();

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

// Enter để gửi
document.addEventListener("keydown", function (e) {

    const input = document.getElementById("userInput");

    if (!input) return;

    if (e.key === "Enter" && document.activeElement === input) {

        e.preventDefault();

        sendMessage();

    }

});

//=============================
// CHAT
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

    profile.name = document.getElementById("profileName").value;
    profile.email = document.getElementById("profileEmail").value;
    profile.bio = document.getElementById("profileBio").value;

    localStorage.setItem("pht_profile", JSON.stringify(profile));

    toast("Đã lưu hồ sơ.");

}

function loadProfile() {

    const data = localStorage.getItem("pht_profile");

    if (!data) return;

    profile = JSON.parse(data);

    document.getElementById("profileName").value = profile.name || "";
    document.getElementById("profileEmail").value = profile.email || "";
    document.getElementById("profileBio").value = profile.bio || "";

    if (profile.avatar) {
        document.getElementById("avatarPreview").src = profile.avatar;
    }

}

const avatarInput = document.getElementById("avatarInput");

if (avatarInput) {

    avatarInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            document.getElementById("avatarPreview").src = e.target.result;

            profile.avatar = e.target.result;

            localStorage.setItem(
                "pht_profile",
                JSON.stringify(profile)
            );

        };

        reader.readAsDataURL(file);

    });

}

//=============================
// BACK TO TOP
//=============================

window.onscroll = function () {

    const btn = document.getElementById("backTop");

    if (!btn) return;

    if (document.documentElement.scrollTop > 300) {

        btn.style.display = "flex";

    } else {

        btn.style.display = "none";

    }

};

function scrollTopPage() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

//=============================
// VISITOR
//=============================

function updateVisitor() {

    let count = Number(localStorage.getItem("visitor")) || 0;

    count++;

    localStorage.setItem("visitor", count);

    const el = document.getElementById("visitorCount");

    if (el) {

        el.innerHTML = count;

    }

}
//=============================
// PROFILE
//=============================

function saveProfile() {

    profile.name = document.getElementById("profileName").value;
    profile.email = document.getElementById("profileEmail").value;
    profile.bio = document.getElementById("profileBio").value;

    localStorage.setItem("pht_profile", JSON.stringify(profile));

    toast("Đã lưu hồ sơ.");

}

function loadProfile() {

    const data = localStorage.getItem("pht_profile");

    if (!data) return;

    profile = JSON.parse(data);

    document.getElementById("profileName").value = profile.name || "";
    document.getElementById("profileEmail").value = profile.email || "";
    document.getElementById("profileBio").value = profile.bio || "";

    if (profile.avatar) {
        document.getElementById("avatarPreview").src = profile.avatar;
    }

}

const avatarInput = document.getElementById("avatarInput");

if (avatarInput) {

    avatarInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            document.getElementById("avatarPreview").src = e.target.result;

            profile.avatar = e.target.result;

            localStorage.setItem(
                "pht_profile",
                JSON.stringify(profile)
            );

        };

        reader.readAsDataURL(file);

    });

}

//=============================
// BACK TO TOP
//=============================

window.onscroll = function () {

    const btn = document.getElementById("backTop");

    if (!btn) return;

    if (document.documentElement.scrollTop > 300) {

        btn.style.display = "flex";

    } else {

        btn.style.display = "none";

    }

};

function scrollTopPage() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

//=============================
// VISITOR
//=============================

function updateVisitor() {

    let count = Number(localStorage.getItem("visitor")) || 0;

    count++;

    localStorage.setItem("visitor", count);

    const el = document.getElementById("visitorCount");

    if (el) {

        el.innerHTML = count;

    }

}
