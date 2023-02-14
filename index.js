const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const operandClient = require("@operandinc/sdk").operandClient;
const indexIDHeaderKey = require("@operandinc/sdk").indexIDHeaderKey;
const ObjectService = require("@operandinc/sdk").ObjectService;

// Open AI Configuration
const configuration = new Configuration({
  // organization: "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",
  // apiKey: "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",
  apiKey:process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// Express Configuration
const app = express();
const port = 3080;

app.use(bodyParser.json());
app.use(cors());
app.use(require("morgan")("dev"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Routing
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.options('/', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});
// Primary Open AI Route
app.post("/", async (req, res) => {
  const { message } = req.body;

  // const runIndex = async () => {
  //   const operand = operandClient(
  //     ObjectService,
  //     process.env.OPERAND_KEY,
  //     "https://api.operand.ai",
  //     {
  //       [indexIDHeaderKey]:
  //         "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",
  //     }
  //   );

  //   try {
  //     const results = await operand.searchWithin({
  //       query: `${message}`,
  //       limit: 5,
  //     });

  //     if (results) {
  //       return results.matches.map((m) => `- ${m.content}`).join("\n");
  //     } else {
  //       return "";
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // console.log(message);
  // let operandSearch = await runIndex(message);
  // console.log("am here");
  // console.log(operandSearch);

  // if (typeof operandSearch !== 'undefined' && query)
  //  {

  const basePromptPrefix = `This is a conversation between the United Airlines and a Traveller .\nRelevant information that Traveller knows knows:\n`;
try{
 
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    
    prompt: `${basePromptPrefix}\n\nTraveller:${message}\n\Flight Agent:`,
    
    max_tokens: 100,
    temperature: 0.7,
  });
  res.json({
    message: response.data.choices[0].text,
  });
  // }
  // else{
  //   res.json({
  //     message: "i don't know , check with my brother ChatGPT",
  //   });
  // }
}

catch (error) {
  console.error(error);
  // res.json({
  //   message: error.message
  // });
}

})

// Get Models Route

// Start the server
app.listen(port, () => {
  console.log(`server running`);
});

module.exports = app;
