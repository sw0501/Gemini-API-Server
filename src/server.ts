import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

const port: number = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  origin: ["*", "null", "localhost"],
};

app.use(cors(corsOptions));

import chatbotRouter from "./routes/chatbot";

app.use("/chatbot", chatbotRouter);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
  });
});

app.post("/search", async (req, res) => {
  try {
    const promptData = req.body;
    console.log(promptData);

    async function run() {
      // For text-only input, use the gemini-pro model

      if (process.env.GEMINI_API_KEY === undefined) {
        throw new Error("asdf");
      }
      const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY;

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      let prompt = "여행 계획 추천해주세요";
      prompt += "목적지는 " + promptData.city + "입니다. ";
      prompt += "여행 유형는 " + promptData.category + "입니다. ";
      prompt += "관련 키워드는 " + promptData.keyword + "입니다. ";
      prompt += "여행 날짜는 " + promptData.day + "입니다. ";
      prompt += "여행 인원은 " + promptData.peopleNumber + "입니다. ";
      prompt += "예상 경비는 " + promptData.price + "입니다. ";
      prompt +=
        "여행지 이름은 name, 위도는 latitude 소수점 아래 10자리까지, 경도는 longitude 소수점 아래 10자리까지, 여행지 간단한 설명은 describe, 여행 일자는 timeStamp로 1일차 2일차 .. n일차로 구분하는 JSON Array 형식으로 줘 데이터 앞이랑 뒤에 ```랑 ```json은 절대 주지마";
      //prompt += "Json Array의 형식은 다음과 같아 [ { name: value, latitude: value, longitude: value, describe: value, timeStamp: value}, ]"

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);

      return text;
    }

    const jsonData = await run();

    const planList = JSON.parse(jsonData);
    console.log(planList);

    return res.status(200).json({
      tarvelPointList: planList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});
