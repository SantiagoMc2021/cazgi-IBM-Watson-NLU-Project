const express = require('express');
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
    NLU.analyze(req);
    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    let NLU = getNLUInstance();
    NLU.analyze(req);
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    let NLU = getNLUInstance();
    const analyzeParams = {
    'text': req.text,
    'features': {
        'entities': {
        'emotion': true
        },
        'keywords': {
        'emotion': true,
        'sentiment': true,
        'limit': 2,
        },
    },
};

    NLU.analyze(analyzeParams)
    .then(analysisResults => 
    {
        console.log(JSON.stringify(analysisResults, null, 2));
    })
    .catch(err => {
        console.log('Error:',err);
    });
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => 
{
    let NLU = getNLUInstance();

    const analyzeParams = 
    {
    'text': req.text,
    'features': 
        {
            'entities': 
            {
            'emotion': false,
            'sentiment': true,
            'limit': 2,
            },
            'keywords': 
            {
            'emotion': false,
            'sentiment': true,
            'limit': 2,
            },
        },
    }
    
    NLU.analyze(analyzeParams).then(analysisResults => 
    {
        console.log(JSON.stringify(analysisResults, null, 2));
    })
    .catch(err => {
        console.log('Error:',err);
    });
    return res.send("text sentiment for "+req.query.text);
});

//---------------------------------

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

