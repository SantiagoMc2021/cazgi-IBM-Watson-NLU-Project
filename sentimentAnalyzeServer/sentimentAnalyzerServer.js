const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = new express();


function getNLUInstance()
{
  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;

  const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
  const { IamAuthenticator } = require('ibm-watson/auth');

  const NLU = new NaturalLanguageUnderstandingV1({
    version: '2021-03-25',
    authenticator: new IamAuthenticator({
      apikey: api_key,
    }),
    serviceUrl: api_url,
  });
  return NLU;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

//----------------------------------

app.get("/",(req,res)=>{
    
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let NLU = getNLUInstance();
     console.log("Input (URL): " + req.query.url);
    let analyzeParams = 
    {
    'url': req.query.url,
    'features': 
        {
            'emotion': {}
        }
    };


    NLU.analyze(analyzeParams)
    .then(analysisResults => 
    {
        //console.log(req.query.url);
        //console.log(JSON.stringify(analysisResults.result.emotion.document.emotion, null, 2));
              //  return res.send(req.query.text + JSON.stringify(analysisResults.result.emotion));
            console.log("DONE");
            return res.send(analysisResults.result.emotion.document.emotion)
    })
    .catch(err => {
        console.log('Error:',err);
    });
});

app.get("/url/sentiment", (req,res) => {
    let NLU = getNLUInstance();
    console.log("Input (URL): " + req.query.url);
    let analyzeParams = 
    {
    'url': req.query.url,
    'features': 
        {
            'sentiment': {}
        }
    };
    
    NLU.analyze(analyzeParams).then(analysisResults => 
    {

        let respond = "Positive";
        //console.log(JSON.stringify(analysisResults.result, null, 2));
        if (JSON.stringify(analysisResults.result.sentiment.document.label) == '"negative"')
            respond = "Negative";    
        
        //console.log(JSON.stringify(analysisResults.result, null, 2))
        console.log("DONE")
        return res.send(respond);
    })
    .catch(err => {
        console.log('Error:',err);
    });
});

app.get("/text/emotion", (req,res) => 
{
    let NLU = getNLUInstance();
    console.log("Input: " + req.query.text);
    let analyzeParams = 
    {
    'text': req.query.text,
    'features': 
        {
            'emotion': {}
        }
    };


    NLU.analyze(analyzeParams)
    .then(analysisResults => 
    {
        //console.log("ENTRO");
       // console.log(JSON.stringify(analysisResults.result.emotion, null, 2));
              //  return res.send(req.query.text + JSON.stringify(analysisResults.result.emotion));
              console.log("DONE");
              return res.send(analysisResults.result.emotion.document.emotion)
    })
    .catch(err => {
        console.log('Error:',err);
    });
    //return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => 
{
    let NLU = getNLUInstance();
    console.log("Input: " + req.query.text);
    let analyzeParams = 
    {
    'text': req.query.text,
    'features': 
        {
            'sentiment': {}
        }
    };
    
    NLU.analyze(analyzeParams).then(analysisResults => 
    {
        let respond = "NAN";
      //  console.log(JSON.stringify(analysisResults.result, null, 2));
        let ans = JSON.stringify(analysisResults.result.sentiment.document.label);
        if (ans == '"negative"')
            respond = "Negative";
        else if(ans == '"positive"')
            respond = "Positive";
            else respond = "Neutral";
        //return res.send("Text sentiment for " + '"' + req.query.text + '"' + "\n is: " + respond);
        console.log("DONE");
        return res.send(respond);
    })
    .catch(err => {
        console.log('Error:',err);
    });
    
});

//---------------------------------

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

