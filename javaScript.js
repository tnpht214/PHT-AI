/* =========================================
   PHT AI V100.0
   JavaScript - Part 1
========================================= */

//=============================
// BIẾN TOÀN CỤC
//=============================

let currentPage = "home";

let chatHistory = [];

let chatSessions = [];

let currentChatIndex = 0;

let profile = {

    name: "",

    email: "",

    bio: "",

    avatar: ""

};

//=============================
// LOAD WEBSITE
//=============================

window.onload = () => {

    loadProfile();

    loadChats();

    updateVisitor();

    initTheme();

    showPage("home");

};

//=============================
// CHUYỂN TRANG
//=============================

function showPage(id){

    document.querySelectorAll(".page").forEach(page=>{

        page.classList.remove("active");

    });

    const page=document.getElementById(id);

    if(page){

        page.classList.add("active");

        currentPage=id;

    }

}

//=============================
// DARK MODE
//=============================

function toggleTheme(){

    document.body.classList.toggle("dark");

    localStorage.setItem(

        "theme",

        document.body.classList.contains("dark")

        ?"dark"

        :"light"

    );

}

function initTheme(){

    const theme=

    localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add("dark");

    }

}

//=============================
// THÔNG BÁO
//=============================

function toast(text){

    const t=document.getElementById("toast");

    t.innerText=text;

    t.classList.add("show");

    setTimeout(()=>{

        t.classList.remove("show");

    },2500);

}

//=============================
// POPUP
//=============================

function showPopup(text){

    document.getElementById(

        "popupText"

    ).innerHTML=text;

    document.getElementById(

        "popup"

    ).style.display="flex";

}

function closePopup(){

    document.getElementById(

        "popup"

    ).style.display="none";

}
/* =========================================
   PHT AI V100.0
   JavaScript - Part 2
========================================= */

//=============================
// HỒ SƠ NGƯỜI DÙNG
//=============================

function saveProfile() {

    profile.name = document.getElementById("profileName").value.trim();

    profile.email = document.getElementById("profileEmail").value.trim();

    profile.bio = document.getElementById("profileBio").value.trim();

    localStorage.setItem(
        "pht_profile",
        JSON.stringify(profile)
    );

    toast("✅ Đã lưu hồ sơ.");

}

function loadProfile() {

    const data = localStorage.getItem("pht_profile");

    if (!data) return;

    profile = JSON.parse(data);

    document.getElementById("profileName").value =
        profile.name || "";

    document.getElementById("profileEmail").value =
        profile.email || "";

    document.getElementById("profileBio").value =
        profile.bio || "";

    if (profile.avatar) {

        document.getElementById(
            "avatarPreview"
        ).src = profile.avatar;

    }

}

//=============================
// ĐỔI AVATAR
//=============================

const avatarInput = document.getElementById("avatarInput");

if (avatarInput) {

    avatarInput.addEventListener(

        "change",

        function (event) {

            const file = event.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (e) {

                profile.avatar = e.target.result;

                document.getElementById(
                    "avatarPreview"
                ).src = profile.avatar;

                localStorage.setItem(
                    "pht_profile",
                    JSON.stringify(profile)
                );

                toast("🖼 Avatar đã được cập nhật.");

            };

            reader.readAsDataURL(file);

        }

    );

}

//=============================
// AI CHÀO THEO TÊN
//=============================

function getUserName() {

    if (

        profile.name &&
        profile.name.trim() !== ""

    ) {

        return profile.name;

    }

    return "bạn";

}

function welcomeMessage() {

    const box = document.getElementById("chatBox");

    if (!box) return;

    box.innerHTML = "";

    addBotMessage(

        "👋 Xin chào <b>" +

        getUserName() +

        "</b>!<br><br>" +

        "Mình là <b>PHT AI V100.0</b>.<br>" +

        "Hôm nay mình có thể giúp gì cho bạn?"

    );

}
/* =========================================
   PHT AI V100.0
   JavaScript - Part 3
========================================= */

//=============================
// THÊM TIN NHẮN
//=============================

function addUserMessage(text){

    const chatBox=document.getElementById("chatBox");

    const div=document.createElement("div");

    div.className="user-message";

    div.innerHTML=text;

    chatBox.appendChild(div);

    chatBox.scrollTop=chatBox.scrollHeight;

}

function addBotMessage(text){

    const chatBox=document.getElementById("chatBox");

    const div=document.createElement("div");

    div.className="bot-message";

    div.innerHTML=text;

    chatBox.appendChild(div);

    chatBox.scrollTop=chatBox.scrollHeight;

}

//=============================
// GỬI TIN NHẮN
//=============================

async function sendMessage(){

    const input=document.getElementById("userInput");

    const message=input.value.trim();

    if(message==="") return;

    addUserMessage(message);

    input.value="";

    addBotMessage("⏳ AI đang suy nghĩ...");

    const loading=document.querySelectorAll(".bot-message");

    const last=loading[loading.length-1];

    try{

        const response=await fetch("/api/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                message:message,

                username:getUserName()

            })

        });

        const data=await response.json();

        last.innerHTML=data.reply;

        saveChat(message,data.reply);

    }

    catch(error){

        last.innerHTML="❌ Không thể kết nối tới AI.";

        console.error(error);

    }

}

//=============================
// ENTER ĐỂ GỬI
//=============================

document.addEventListener("DOMContentLoaded",()=>{

    const input=document.getElementById("userInput");

    if(input){

        input.addEventListener("keydown",(e)=>{

            if(e.key==="Enter"){

                sendMessage();

            }

        });

    }

});

//=============================
// NEW CHAT
//=============================

function newChat(){

    chatHistory=[];

    document.getElementById("chatBox").innerHTML="";

    welcomeMessage();

    toast("🆕 Đã tạo cuộc trò chuyện mới.");

}

//=============================
// LƯU CHAT
//=============================

function saveChat(user,ai){

    chatHistory.push({

        user:user,

        ai:ai,

        time:new Date().toLocaleString()

    });

    localStorage.setItem(

        "pht_chat",

        JSON.stringify(chatHistory)

    );

}

//=============================
// LOAD CHAT
//=============================

function loadChats(){

    const data=localStorage.getItem("pht_chat");

    if(!data) return;

    chatHistory=JSON.parse(data);

}
/* =========================================
   PHT AI V100.0
   JavaScript - Part 4
========================================= */

//=============================
// TÌM KIẾM WEBSITE
//=============================

function searchWebsite() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    document.querySelectorAll(".page").forEach(page => {

        const text = page.innerText.toLowerCase();

        if (keyword === "") {

            page.style.display = "";

        } else {

            page.style.display =
                text.includes(keyword)
                    ? ""
                    : "none";

        }

    });

}

//=============================
// LƯỢT TRUY CẬP (LOCAL)
//=============================

function updateVisitor() {

    let count = Number(
        localStorage.getItem("visitorCount") || 0
    );

    count++;

    localStorage.setItem(
        "visitorCount",
        count
    );

    const visitor = document.getElementById("visitorCount");

    if (visitor) {

        visitor.innerHTML = count;

    }

}

//=============================
// XUẤT CHAT
//=============================

function exportChat() {

    if (chatHistory.length === 0) {

        toast("📭 Chưa có dữ liệu chat.");

        return;

    }

    let text = "";

    chatHistory.forEach(chat => {

        text +=
            "Bạn: " + chat.user + "\n";

        text +=
            "AI: " + chat.ai + "\n";

        text +=
            "-----------------------------\n";

    });

    const blob = new Blob(

        [text],

        {

            type: "text/plain"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "PHT_AI_Chat.txt";

    a.click();

    URL.revokeObjectURL(url);

}

//=============================
// XÓA CHAT
//=============================

function clearCurrentChat() {

    if (!confirm("Bạn có chắc muốn xóa cuộc trò chuyện?")) {

        return;

    }

    chatHistory = [];

    localStorage.removeItem("pht_chat");

    document.getElementById("chatBox").innerHTML = "";

    welcomeMessage();

    toast("🗑 Đã xóa cuộc trò chuyện.");

}

//=============================
// BACK TO TOP
//=============================

window.addEventListener("scroll", () => {

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
// ẨN LOADING
//=============================

window.addEventListener("load", () => {

    const loading = document.getElementById("loadingScreen");

    if (!loading) return;

    setTimeout(() => {

        loading.style.display = "none";

    }, 1000);

});

//=============================
// KHỞI TẠO
//=============================

document.addEventListener("DOMContentLoaded", () => {

    welcomeMessage();

    loadProfile();

    loadChats();

    initTheme();

    updateVisitor();

    console.log("🚀 PHT AI V100.0 Ready!");

});
