const bodyParser = require('body-parser')


var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function(app) {

  app.get("/", function(req,res) {
    res.render('index.ejs');
  });

  app.get("/main", function(req,res) {
    res.render('main.ejs');
  });

  app.get("/revise", function(req,res) {
    res.render('revise.ejs');


  });

  app.get("/speak", function(req,res) {

    res.render('speak.ejs');



  });

  app.post("/summarize", urlencodedParser, function(req,res) {
    var Algorithmia = require("algorithmia");

    var input = req.body.text;

    console.log(input);
    Algorithmia.client("simMQDy9IYWtJUP4quDZXMPx+Ki1")
        .algo("nlp/Summarizer/0.1.8")
        .pipe(input)
        .then(function(response) {
            res.send(response.get());
        });
  });


}
