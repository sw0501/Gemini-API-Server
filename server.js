const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// ...

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static(__dirname + "/Front"));

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
  });
});

app.body("/search", async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  const promptData = req.body.prompt;

  // ...

  async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // const prompt =
    //   "부산 1박2일 여행지 추천해줘, JSON 형식으로 해주고 위도 경도에다가 여행지 간략한 설명과 이용 시간 정보를 포함해줘 여행지 이름은 name, 위도는 latitude, 경도는 logitude, 설명은 description, 시간은 time으로 표시해줘 1일차 2일차 구분해줘";

    // const prompt =
    //   "Please recommend a travel destination for 2 days and 1 night in Busan. Please write in JSON format and include a brief explanation of the travel destination and information on the latitude and longitude. The name of the travel destination is name, latitude is latitude, longitude is logitude, description is time. Please indicate the time. Please distinguish between day 1 and day 2. And give me all data in Korean, as json list";
    const prompt = promptData;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.split("```")[1].split("json")[1];
  }

  const jsonData = await run();

  console.log(jsonData);

  return res.status(200).json({
    message: JSON.parse(jsonData),
  });
});

app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});
