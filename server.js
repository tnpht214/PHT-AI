import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("./"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Kiểm tra server
app.get("/", (req, res) => {
  res.json({
    status: "online",
    name: "PHT AI V100.0",
    message: "Server is running!"
  });
});

// API Chat
app.post("/api/chat", async (req, res) => {
  try {

    const { message, username } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Bạn chưa nhập tin nhắn."
      });
    }

    const completion = await client.responses.create({
      model: "gpt-5.5",
      input: [
        {
          role: "system",
          content: `
Bạn là AI của website PHT AI V100.0.

Luôn trả lời bằng tiếng Việt.

Nếu biết tên người dùng thì hãy chào:
Xin chào ${username || "bạn"} 👋

Bạn hỗ trợ:
- AI Chat
- Học Tool
- Casio
- Hồ sơ
- Website PHT AI

Trả lời ngắn gọn, thân thiện và chính xác.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      success: true,
      reply: completion.output_text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      reply: "Đã xảy ra lỗi khi kết nối AI."
    });

  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("================================");
  console.log("🚀 PHT AI V100.0");
  console.log("Server running...");
  console.log("Port:", PORT);
  console.log("================================");
});
