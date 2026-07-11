/* =========================================
   PHT AI V100.0
   JavaScript - Part 1
========================================= */

// ==============================
// CHUYỂN TAB
// ==============================

function showTab(tabId){

    document.querySelectorAll(".tab").forEach(tab=>{

        tab.classList.remove("active");

    });

    const target=document.getElementById(tabId);

    if(target){

        target.classList.add("active");

    }

}

// ==============================
// HỒ SƠ NGƯỜI DÙNG
// ==============================

let profile=JSON.parse(
localStorage.getItem("profile")
)||{

    name:"Người dùng",

    email:"",

    bio:"",

    avatar:"https://cdn-icons-png.flaticon.com/512/149/149071.png"

};

// ==============================
// HIỂN THỊ HỒ SƠ
// ==============================

function loadProfile(){

    const nameInput=document.getElementById("profileNameInput");
    const emailInput=document.getElementById("profileEmail");
    const bioInput=document.getElementById("profileBio");

    if(nameInput) nameInput.value=profile.name;
    if(emailInput) emailInput.value=profile.email;
    if(bioInput) bioInput.value=profile.bio;

    const avatar=document.getElementById("avatarPreview");

    if(avatar){

        avatar.src=profile.avatar;

    }

    const sideAvatar=document.getElementById("profileAvatar");

    if(sideAvatar){

        sideAvatar.src=profile.avatar;

    }

    const sideName=document.getElementById("profileName");

    if(sideName){

        sideName.textContent=profile.name;

    }

    const showName=document.getElementById("showName");

    if(showName){

        showName.textContent=profile.name;

    }

    const showEmail=document.getElementById("showEmail");

    if(showEmail){

        showEmail.textContent=profile.email;

    }

}

// ==============================
// LƯU HỒ SƠ
// ==============================

function saveProfile(){

    profile.name=document.getElementById("profileNameInput").value;

    profile.email=document.getElementById("profileEmail").value;

    profile.bio=document.getElementById("profileBio").value;

    localStorage.setItem(

        "profile",

        JSON.stringify(profile)

    );

    loadProfile();

    alert("Đã lưu hồ sơ thành công ✅");

}
// =========================================
// ĐỔI ẢNH ĐẠI DIỆN
// =========================================

function changeAvatar(event){

    const file=event.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(e){

        profile.avatar=e.target.result;

        localStorage.setItem(

            "profile",

            JSON.stringify(profile)

        );

        loadProfile();

    };

    reader.readAsDataURL(file);

}

// =========================================
// DARK / LIGHT MODE
// =========================================

let theme=localStorage.getItem("theme") || "dark";

if(theme==="light"){

    document.body.classList.add("light-mode");

}

function toggleTheme(){

    document.body.classList.toggle("light-mode");

    if(document.body.classList.contains("light-mode")){

        localStorage.setItem("theme","light");

    }else{

        localStorage.setItem("theme","dark");

    }

}

// =========================================
// BACK TO TOP
// =========================================

const backButton=document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

    if(window.scrollY>300){

        if(backButton){

            backButton.style.display="block";

        }

    }else{

        if(backButton){

            backButton.style.display="none";

        }

    }

});

function scrollToTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// =========================================
// LOADING SCREEN
// =========================================

window.addEventListener("load",()=>{

    const loading=document.getElementById("loadingScreen");

    if(loading){

        setTimeout(()=>{

            loading.style.display="none";

        },800);

    }

    loadProfile();

});
// =========================================
// CHATBOT
// PHẦN 3
// =========================================

// Danh sách cuộc trò chuyện

let chats = JSON.parse(
localStorage.getItem("chats")
) || [];

// Chat hiện tại

let currentChat = -1;

// =========================================
// TẠO CHAT MỚI
// =========================================

function newChat(){

    const welcome =
    "👋 Xin chào " +
    profile.name +
    "! Mình là PHT AI. Hôm nay mình có thể giúp gì cho bạn?";

    const chat = {

        id:Date.now(),

        name:"Chat " + (chats.length+1),

        messages:[

            {
                role:"assistant",
                content:welcome
            }

        ]

    };

    chats.push(chat);

    currentChat = chats.length-1;

    saveChats();

    updateChatList();

    renderMessages();

}

// =========================================
// LƯU CHAT
// =========================================

function saveChats(){

    localStorage.setItem(

        "chats",

        JSON.stringify(chats)

    );

}

// =========================================
// DANH SÁCH CHAT
// =========================================

function updateChatList(){

    const list =
    document.getElementById("chatList");

    if(!list) return;

    list.innerHTML="";

    chats.forEach((chat,index)=>{

        const option =
        document.createElement("option");

        option.value=index;

        option.textContent=chat.name;

        list.appendChild(option);

    });

    if(currentChat>=0){

        list.value=currentChat;

    }

}

// =========================================
// CHỌN CHAT
// =========================================

function loadChat(){

    const list =
    document.getElementById("chatList");

    currentChat =
    Number(list.value);

    renderMessages();

}

// =========================================
// HIỂN THỊ CHAT
// =========================================

function renderMessages(){

    const box =
    document.getElementById("chatBox");

    if(!box) return;

    box.innerHTML="";

    if(currentChat<0) return;

    chats[currentChat].messages.forEach(msg=>{

        const div =
        document.createElement("div");

        div.className =
        msg.role==="user"
        ? "user-message"
        : "bot-message";

        div.innerHTML =
        msg.content;

        box.appendChild(div);

    });

    box.scrollTop =
    box.scrollHeight;

}
// =========================================
// GỬI TIN NHẮN
// PHẦN 4
// =========================================

async function sendMessage(){

    const input=document.getElementById("userInput");

    if(!input) return;

    const text=input.value.trim();

    if(text==="") return;

    // Nếu chưa có chat thì tạo mới
    if(currentChat===-1){

        newChat();

    }

    // Thêm tin nhắn người dùng
    chats[currentChat].messages.push({

        role:"user",

        content:text

    });

    renderMessages();

    input.value="";

    saveChats();

    try{

        const response=await fetch("/api/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                message:text,

                profile:profile,

                history:chats[currentChat].messages

            })

        });

        if(!response.ok){

            throw new Error("Không kết nối được AI");

        }

        const data=await response.json();

        chats[currentChat].messages.push({

            role:"assistant",

            content:data.reply

        });

    }catch(error){

        chats[currentChat].messages.push({

            role:"assistant",

            content:"❌ Không thể kết nối AI. Vui lòng thử lại sau."

        });

    }

    saveChats();

    renderMessages();

}

// =========================================
// ENTER ĐỂ GỬI
// =========================================

document.addEventListener("keydown",function(e){

    const input=document.getElementById("userInput");

    if(!input) return;

    if(document.activeElement===input && e.key==="Enter"){

        e.preventDefault();

        sendMessage();

    }

});

// =========================================
// KHỞI TẠO
// =========================================

document.addEventListener("DOMContentLoaded",()=>{

    loadProfile();

    if(chats.length===0){

        newChat();

    }else{

        currentChat=0;

        updateChatList();

        renderMessages();

    }

});
// =========================================
// JAVASCRIPT PART 5
// TÌM KIẾM - TYPING - COPY - VISITOR
// =========================================

// ==========================
// TÌM KIẾM TRÊN WEBSITE
// ==========================

const searchInput=document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener("input",function(){

        const keyword=this.value.toLowerCase();

        document.querySelectorAll("section").forEach(section=>{

            const text=section.innerText.toLowerCase();

            if(
                text.includes(keyword) ||
                keyword===""
            ){

                section.style.display="block";

            }else{

                section.style.display="none";

            }

        });

    });

}

// ==========================
// AI ĐANG NHẬP...
// ==========================

function showTyping(){

    const box=document.getElementById("chatBox");

    const typing=document.createElement("div");

    typing.className="bot-message";

    typing.id="typing";

    typing.innerHTML="🤖 Đang suy nghĩ...";

    box.appendChild(typing);

    box.scrollTop=box.scrollHeight;

}

function hideTyping(){

    const typing=document.getElementById("typing");

    if(typing){

        typing.remove();

    }

}

// ==========================
// COPY TIN NHẮN AI
// ==========================

function copyText(text){

    navigator.clipboard.writeText(text);

    alert("📋 Đã sao chép.");

}

// ==========================
// ĐẾM LƯỢT TRUY CẬP
// (Local Demo)
// ==========================

let visitor=

Number(
localStorage.getItem("visitor")
)||0;

visitor++;

localStorage.setItem(
"visitor",
visitor
);

const visitorText=
document.getElementById("visitorCount");

if(visitorText){

    visitorText.innerText=visitor;

}

// ==========================
// AI CHÀO NGƯỜI DÙNG
// ==========================

function getGreeting(){

    const hour=new Date().getHours();

    if(hour<12){

        return "☀️ Chào buổi sáng";

    }

    if(hour<18){

        return "🌤️ Chào buổi chiều";

    }

    return "🌙 Chào buổi tối";

}

console.log(

getGreeting()+
" "+
profile.name

);
// =========================================
// JAVASCRIPT PART 6
// AI CHAT - STREAM - MARKDOWN
// =========================================

// ==========================
// THÊM TIN NHẮN
// ==========================

function addMessage(role,text){

    if(currentChat<0) return;

    chats[currentChat].messages.push({

        role:role,

        content:text

    });

    saveChats();

    renderMessages();

}

// ==========================
// GỌI AI
// ==========================

async function askAI(message){

    showTyping();

    try{

        const response=await fetch("/api/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                message:message,

                profile:profile,

                history:chats[currentChat].messages

            })

        });

        hideTyping();

        if(!response.ok){

            throw new Error();

        }

        const data=await response.json();

        addMessage(

            "assistant",

            data.reply

        );

    }

    catch(e){

        hideTyping();

        addMessage(

            "assistant",

            "❌ Không thể kết nối AI."

        );

    }

}

// ==========================
// GỬI TIN NHẮN
// ==========================

async function sendMessage(){

    const input=document.getElementById("userInput");

    if(!input) return;

    const text=input.value.trim();

    if(text==="") return;

    input.value="";

    addMessage(

        "user",

        text

    );

    await askAI(text);

}

// ==========================
// ENTER
// ==========================

const input=document.getElementById("userInput");

if(input){

    input.addEventListener(

        "keydown",

        function(e){

            if(e.key==="Enter"){

                sendMessage();

            }

        }

    );

}

// ==========================
// MARKDOWN ĐƠN GIẢN
// ==========================

function markdown(text){

    text=text.replace(

        /\*\*(.*?)\*\*/g,

        "<b>$1</b>"

    );

    text=text.replace(

        /\n/g,

        "<br>"

    );

    return text;

}
// =========================================
// JAVASCRIPT PART 6
// AI CHAT - STREAM - MARKDOWN
// =========================================

// ==========================
// THÊM TIN NHẮN
// ==========================

function addMessage(role,text){

    if(currentChat<0) return;

    chats[currentChat].messages.push({

        role:role,

        content:text

    });

    saveChats();

    renderMessages();

}

// ==========================
// GỌI AI
// ==========================

async function askAI(message){

    showTyping();

    try{

        const response=await fetch("/api/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                message:message,

                profile:profile,

                history:chats[currentChat].messages

            })

        });

        hideTyping();

        if(!response.ok){

            throw new Error();

        }

        const data=await response.json();

        addMessage(

            "assistant",

            data.reply

        );

    }

    catch(e){

        hideTyping();

        addMessage(

            "assistant",

            "❌ Không thể kết nối AI."

        );

    }

}

// ==========================
// GỬI TIN NHẮN
// ==========================

async function sendMessage(){

    const input=document.getElementById("userInput");

    if(!input) return;

    const text=input.value.trim();

    if(text==="") return;

    input.value="";

    addMessage(

        "user",

        text

    );

    await askAI(text);

}

// ==========================
// ENTER
// ==========================

const input=document.getElementById("userInput");

if(input){

    input.addEventListener(

        "keydown",

        function(e){

            if(e.key==="Enter"){

                sendMessage();

            }

        }

    );

}

// ==========================
// MARKDOWN ĐƠN GIẢN
// ==========================

function markdown(text){

    text=text.replace(

        /\*\*(.*?)\*\*/g,

        "<b>$1</b>"

    );

    text=text.replace(

        /\n/g,

        "<br>"

    );

    return text;

}
// =========================================
// JAVASCRIPT PART 7
// KHỞI TẠO WEBSITE
// =========================================

// ==========================
// CHÀO NGƯỜI DÙNG
// ==========================

function welcomeUser(){

    if(currentChat===-1) return;

    if(chats[currentChat].messages.length>1){

        return;

    }

    const hour=new Date().getHours();

    let hello="Xin chào";

    if(hour<12){

        hello="☀️ Chào buổi sáng";

    }else if(hour<18){

        hello="🌤️ Chào buổi chiều";

    }else{

        hello="🌙 Chào buổi tối";

    }

    chats[currentChat].messages[0].content=

    hello+

    " "+profile.name+

    "! 👋\n\nMình là PHT AI V100.0.\nMình có thể giúp gì cho bạn hôm nay?";

}

// ==========================
// KHỞI ĐỘNG
// ==========================

function startWebsite(){

    loadProfile();

    if(chats.length===0){

        newChat();

    }

    welcomeUser();

    updateChatList();

    renderMessages();

}

// ==========================
// TỰ ĐỘNG LƯU
// ==========================

setInterval(()=>{

    localStorage.setItem(

        "profile",

        JSON.stringify(profile)

    );

    localStorage.setItem(

        "chats",

        JSON.stringify(chats)

    );

},5000);

// ==========================
// DOM READY
// ==========================

document.addEventListener(

    "DOMContentLoaded",

    function(){

        startWebsite();

    }

);

// =========================================
// PHT AI V100.0
// Frontend Finished
// =========================================

console.log(

"%cPHT AI V100.0 Loaded",

"color:#00ff88;font-size:20px;font-weight:bold;"

);
