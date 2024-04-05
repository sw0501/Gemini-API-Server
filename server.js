const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();

const port = 80;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// ...

const corsOptions = {
  origin: ["*", 'null', 'localhost']
};

app.use(cors(corsOptions));


app.use(express.static(__dirname + "/Front"));


app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
  });
});

app.post("/search", async (req, res) => {

  // function getRequestBody() {
  //   return new Promise((response, reject) => {

  //     let body = '';
  //     req.on('data', chunk => {
  //         body += chunk.toString(); // 요청 본문을 문자열로 변환하여 body에 추가
  //     });
  //     req.on('end', () => {
  //       body = decodeURIComponent(body);
  //       console.log('Received body:', body);
  //       response(body);
  //         // 여기서 body를 가지고 원하는 처리를 수행
  //         res.end('Received POST request');
  //     });
  //   })
  // }

  // await getRequestBody()
  //   .then((body) => {
  //     const jsonData = JSON.parse(body);

  //     let promptData = "Recommend a travel plan";
  //     promptData += "In " + jsonData.city + "area, ";
  //     promptData += "Among " + jsonData.category + " types of tourist attractions, ";
  //     promptData += "Related to " + jsonData.keyword + ", ";
  //     promptData += "In " + jsonData.day + ", ";
  //     promptData += "Fir"
      
  //     console.log(promptData);
      
  //     const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  //   });
  
  const promptData = req.body;
  console.log(promptData);



  async function run() {
    // For text-only input, use the gemini-pro model
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    let prompt = "여행 계획 추천해주세요";
    prompt += "목적지는 " + promptData.city + "입니다. ";
    prompt += "여행 유형는 " + promptData.category + "입니다. ";
    prompt += "관련 키워드는 " + promptData.keyword +"입니다. ";
    prompt += "여행 날짜는 " + promptData.day + "입니다. ";
    prompt += "여행 인원은 " + promptData.peopleNumber + "입니다. ";
    prompt += "예상 경비는 " + promptData.price + "입니다. ";
    prompt += "여행지 이름은 name, 위도는 latitude 소수점 아래 8자리까지, 경도는 longitude 소수점 아래 8자리까지, 여행지 간단한 설명은 describe, 여행 일자는 timeStamp로 1일차 2일차 .. n일차로 구분하는 JSON Array 형식으로 줘 [ { 앞에 불필요한 문자는 제거해줘";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  }

  const jsonData = await run();

  const planList = JSON.parse(jsonData)
  console.log(planList);

  return res.status(200).json({
    tarvelPointList: planList,
  });
});

app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});
