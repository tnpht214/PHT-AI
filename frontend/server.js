import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("frontend"));

const client = new OpenAI({

    apiKey: process.env.OPENAI_API_KEY

});

const PORT = process.env.PORT || 3000;
app.post("/api/chat", async (req, res) => {

    try {

        const { message, history, profile } = req.body;

        const messages = [

            {

                role: "system",

                content:
                `Bạn là PHT AI V100.0.
Tên người dùng là ${profile.name}.
Luôn trả lời bằng tiếng Việt nếu người dùng dùng tiếng Việt.
Thân thiện, thông minh và hỗ trợ học tập.`

            }

        ];

        if (Array.isArray(history)) {

            history.forEach(msg => {

                messages.push({

                    role: msg.role,

                    content: msg.content

                });

            });

        }

        messages.push({

            role: "user",

            content: message

        });

        const response = await client.responses.create({

            model: "gpt-5.5",

            input: messages

        });

        res.json({

            reply: response.output_text

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            reply: "Xin lỗi, AI đang bận."

        });

    }

});
app.listen(PORT, () => {

    console.log(

        "🚀 PHT AI chạy tại http://localhost:" + PORT

    );

});
