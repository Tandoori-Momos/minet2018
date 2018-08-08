var nlp = require('natural');
var tokenizer = new nlp.WordTokenizer();
//var w2v = require('word2vec');
var postagger=require('pos');

function Wordobj()
{
	this.text="";
	this.tag="";
}
var i, j;
var inptargettext = ["hello and welcome to delhi", "it is the capital of india", "akbar killed birbal"]; //INPUT from OCR/Text/Handwriting afte grammarcheck. Each array element is a line.
var inprecogtext = ["greetings welcome to delhi", "it is capital of india the", "birbal was killed by akbar"]; //INPUT when user speaking out during learning after grammarcheck. Each array element is a line.
var matchtype = 0; //INPUT 0 = word to word, 1 = order matters, paraphrasing works, 2 = order also doesnt matter
var numlinestarget=inptargettext.length;
var numlinesrecog=inprecogtext.length;
var targettext = [];
var recogtext = [];
const INF = 1e5;
var dp0 = []; //for word to word, cost = number of targettext dropped
var prev0 = []; //for word to word
for(i = 0; i < numlinestarget; i++)
{
	targettext[i]=[];
	targettext[i]=tokenizer.tokenize(inptargettext[i]);
}
for(i = 0; i < numlinesrecog; i++)
{
	recogtext[i]=[];
	recogtext[i]=tokenizer.tokenize(inprecogtext[i]);
}
if(matchtype==0)
{
	var lineartarget = [];
	lineartarget.push("null");
	var linearrecog = [];
	linearrecog.push("null");
	for(i = 0; i < numlinestarget; i++)
	{
		for(j = 0; j < targettext[i].length; j++)
		{
			lineartarget.push(targettext[i][j]);
		}
	}
	for(i = 0; i < numlinesrecog; i++)
	{
		for(j = 0; j < recogtext[i].length; j++)
		{
			linearrecog.push(recogtext[i][j]);
		}
	}
	var numwordstarget=lineartarget.length;
	var numwordsrecog=linearrecog.length;
	for(i = 0; i <= numwordstarget; i++)
	{
		dp0[i]=[];
		prev0[i]=[];
		for(j = 0; j <= numwordsrecog; j++)
		{
			dp0[i].push(INF);
			prev0[i][j]=[];
		}
	}
	//console.log(lineartarget + "\n" + linearrecog);
	//***set base states***
	dp0[0][0]=dp0[0][1]=0;
	prev0[0][0]=prev0[0][1]= [0, 0];
	dp0[1][0]=1;
	prev0[1][0]=[0, 0];
	//***end base states***
	for(i = 1; i <= numwordstarget; i++)
	{
		for(j = 1; j <= numwordsrecog; j++)
		{
			var trans1=dp0[i-1][j-1];
			if(lineartarget[i]!=linearrecog[j]) trans1=INF;
			var trans2=dp0[i-1][j]+1;
			var trans3=dp0[i][j-1];
			if(trans1<=trans2 && trans1<=trans3)
			{
				dp0[i][j]=trans1;
				prev0[i][j]=[i-1, j-1];
			}
			else if(trans3<=trans1 && trans3<=trans2)
			{
				dp0[i][j]=trans3;
				prev0[i][j]=[i, j-1];
			}
			else
			{
				dp0[i][j]=trans2;
				prev0[i][j]=[i-1, j];
			}
		//	console.log(i + " " + j + " = " + prev0[i][j]);
		}
	}
	var currstate = [];
	currstate = [numwordstarget, numwordsrecog];
	//console.log(prev0[numwordstarget][numwordsrecog]);
	var prevcand = [];
	var missedlist = [] //FINAL OUTPUT WITH LIST OF MISSED WORDS
	while(true)
	{
	//	console.log(currstate + "\n");
		prevcand = prev0[currstate[0]][currstate[1]];
		if(prevcand==currstate) break;
		if(prevcand[0]==currstate[0]-1 && prevcand[1]==currstate[1])
		{
			missedlist.push(lineartarget[prevcand[0]]);
		}
		currstate=prevcand;
	}
	missedlist.reverse();
	console.log(missedlist); //OUTPUT MISSED LIST AS YOU WANT
	console.log("Number of Skipped words from target content=" + dp0[numwordstarget][numwordsrecog]-1 + "\n");
}
