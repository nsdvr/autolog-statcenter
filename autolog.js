/*
autolog-statcenter
a lush discord bot built on discord.js for chatmm
by andihow roasty and the best of the chatmm massive
*/

//general bot stuff
var token = require('./token.js').token;
var phrase = require('./phrase.js').phrase
const Discord = require("discord.js");
const client = new Discord.Client();
var newUsers = new Discord.Collection();
var delay=500; //.5 second
var currentYear = new Date().getFullYear();
var currentdate = new Date();
var datetime = currentdate.getDate() + "/" + (parseInt(currentdate.getMonth()) + 1) + "/" + currentdate.getFullYear();
var getYT = require('get-youtube-title');
var getYTID = require('get-youtube-id');
var http = require('http');
var PythonShell = require('python-shell')

//plug command stuff
const PlugAPI = require('plugapi');
var plugusername = require('./token.js').plugusername;
var plugpw = require('./token.js').plugpw;
var plugBot = new PlugAPI ({
  email: plugusername,
  password: plugpw,
});

//log plugbot in
plugBot.connect('exp-noise-weirdshit-novelty')
plugBot.on('roomJoin', function(room) {
    console.log("autolog has entered " + room);
});


//### !commands ###

//defines ! as prefix for command
client.on("message", msg => {
  let prefix = "!";
  if(!msg.content.startsWith(prefix)) return;

//!bitcoin
 if (msg.content.startsWith(prefix + "bitcoin")) {
  http.get({
    host: 'api.coindesk.com',
    path: '/v1/bpi/currentprice.json'
  },
  function(response) {
    var body = '';
    response.on('data', function(d) {body += d;});
    response.on('end', function(){
      var parsed = JSON.parse(body);
      msg.channel.send(`:flag_us: 1 Bitcoin = ` + parsed.bpi.USD.rate + ` USD.`);
      msg.channel.send(`:flag_gb: 1 Bitcoin = ` + parsed.bpi.GBP.rate + ` GBP.`);
      msg.channel.send(`:flag_eu: 1 Bitcoin = ` + parsed.bpi.EUR.rate + ` EUR.`);
    })
  })
}

//backdoor
 if (msg.content.startsWith(prefix + phrase)) {
   const bdmessage = msg.content.substring(8,99);
   const channel = client.channels.find('id', '271974636210749441')
  msg.channel.send(bdmessage);
  console.log(msg.author + "sent " + bdmessage);
 }

//!help
 if (msg.content.startsWith(prefix + "help")) {
   msg.channel.send(`I can !johnsim [insert-opinion-here], !hug, !grouphug !currentyear, !cointoss, !doggo, !hype, !gender or !opinion [@-user-here].`);
   console.log(currentdate + " - Someone got help.");
  }

//!plug
if (msg.content.startsWith(prefix + "plug")) {
console.log(currentdate + " - Someone asked about plug");
try {
    var plugtrack = plugBot.getMedia().title;
    var plugartist = plugBot.getMedia().author;
    var plugremain = plugBot.getTimeRemaining();
    try {
        msg.channel.send(`:point_right:<https://plug.dj/exp-noise-weirdshit-novelty>`);
        msg.channel.send(`:musical_note:np: ` + plugartist + ` - ` + plugtrack);
        function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
        var timeleft = fmtMSS(plugremain);
        msg.channel.send(`:alarm_clock:Track Time Remaining: ` + timeleft);
    } catch (e) {
        // Else-handler-block - really only has to exist
    }
} catch(e) {
    msg.channel.send(`:point_right:<https://plug.dj/exp-noise-weirdshit-novelty>`);
    msg.channel.send(`:skull_crossbones:Selektah Not Found`);
}
}

//!johnsim
  if (msg.content.startsWith(prefix + "johnsim")) {
    let userinput = msg.content;
    jonpinion = userinput.substring(8, 1800);
    let adjective1s = [`shocked`, `disturbed`, `weirded out`, `at a loss for words`];
    let johnner = msg.author;
    let adjective2s = [`moronic`, `disturbing`, `hilarious`, `retarded`, `fucked up`, `crazy`, `surreal`, `creepy`];
      let i1 = Math.floor(Math.random() * 4);
      let adjective1 = adjective1s[i1];
      let i2 = Math.floor(Math.random() * 8);
      let adjective2 = adjective2s[i2];
  msg.channel.send(`:robot: Robbie The Robot: Wow, I'm ${adjective1} by you thinking ${jonpinion}. It's absolutely ${adjective2} that ${johnner} really thinks${jonpinion}.`);
  console.log(currentdate + msg.author +  " John Spoke")
  }

//!currentyear
  if (msg.content.startsWith(prefix + "currentyear")) {
    msg.channel.send(`The current year is ${currentYear}`);
    console.log(currentdate + msg.author +  " - Displayed the Current Year");
  }

//!hug
  if (msg.content.startsWith(prefix + "hug")) {
    let userToHug = msg.author;
    msg.channel.send(`*gives ${userToHug} a warm hug.*`)
    console.log(currentdate + msg.author + " Gave a hug.");
  }

//!grouphug
  if (msg.content.startsWith(prefix + "grouphug")) {
    msg.channel.send(`:heart: :heart: :heart: @everyone partakes in a compulsory group hug. :heart: :heart: :heart: `);
    console.log(currentdate + " was fascist about hugs.");
  }

//!opinion
    let userToOpinion = msg.mentions.users.first();
  if ( msg.content.startsWith(prefix + "opinion") && (typeof userToOpinion !== 'undefined') ){
    msg.channel.send(`Computing Objectively Correct Opinion...`);
    let opinions = [
      userToOpinion + " is probably wrong.",
      userToOpinion + " probably just needs a kiss.",
      userToOpinion + " is just being edgy tbh.",
      "I'm shocked that you think that,  " + userToOpinion + ".",
      userToOpinion + " speaks total truth.",
      userToOpinion + " is correct, despite popular belief.",
      "Thats right, " + userToOpinion +". Absolutely right."];
    let i = Math.floor(Math.random() * 7);
    let selectedopinion = opinions[i];
    setTimeout(function() {
    msg.channel.send(`${selectedopinion}`);
  }, delay);
    console.log(currentdate +msg.author+ " - Corrected an opinion");
  }

//!gender
      let userToGender = msg.mentions.users.first();
  if ( msg.content.startsWith(prefix + "gender") && (typeof userToOpinion !== 'undefined') ){
      let genders = require('./genders.js').genders;
      let i = Math.floor(Math.random() * genders.length);
      let selectedgender = "Did you just assume "+msg.mentions.users.first()+"'s gender? For your information, it's *"+genders[i][0]+"*";
      let genderdescription = '"'+genders[i][1]+'"';
    msg.channel.send(`${selectedgender}`);
    msg.channel.send(`${genderdescription}`);
    console.log(currentdate + msg.author + " - Assumed a gender." )
  }

//!hype
  if (msg.content.startsWith(prefix + "hype")){
      let hypephrases = require('./hypephrases.js').hypephrases;
      let i = Math.floor(Math.random() * 77);
      let selectedhype = hypephrases[i];
      msg.channel.send(`${selectedhype}`);
    console.log(currentdate + msg.author +" - Generated Hype");
  }

//!doggo
  if (msg.content.startsWith(prefix + "doggo")) {
      let barks = require('./barks.js').barks;
      // Select a random woof from Barks array
      let pickBark = barks[Math.floor(Math.random() * barks.length)];
      msg.channel.send(":dog: Richard Divine The Pup: " + pickBark + " :dog:");
    console.log(currentdate + msg.author + " - WOOF WOOF");
    }

//!cointoss
  if (msg.content.startsWith(prefix + "cointoss")) {
      let userWhoTossed = msg.mentions.users.first();
    msg.channel.send(`Rotating Airborn Coin... (i miss val :cry:  )`);
      let outcomes = [
      "Heads.", "Tails."];
      let i = Math.floor(Math.random() * 2);
      let selectedoutcomes = outcomes[i];
      setTimeout(function() {
    msg.channel.send(`${selectedoutcomes}`);
  }, delay);
    console.log(currentdate + " " + userWhoTossed + " Tossed a coin.");
    }

//ceelo
if (msg.content.startsWith(prefix + "ceelo")) {
    let userWhoRolled = msg.author;
    msg.channel.send(`:fingers_crossed::fingers_crossed: ${userWhoRolled}'s roll: `)
    var dice = [`[ 1 ]`,`[ 2 ]`,`[ 3 ]`,`[ 4 ]`,`[ 5 ]`,`[ 6 ]`]
    for (i = 0; i < 3; i++) {
      let r = Math.floor(Math.random() * 6);
      msg.channel.send(`${dice[r]}`);
    console.log(currentdate + " " + msg.author + "rolled tha dice")
    }
  }
 if (msg.content.startsWith(prefix + "rules of ceelo")) {
        msg.channel.send(`Aite playa its like this: You roll 3 dice. Best roll is 4-5-6, second best is trips. Rolling a 1-2-3 is an automatic loss. Otherwise you have to roll a pair and the orphan is your number. If you roll 3 random numbers that aren't 1-2-3 or 4-5-6, you must re-roll.`);
      }
//random yt
if (msg.content.startsWith(prefix + "randomyoutube")) {
  var pyoptions = {pythonPath:'python3'};
  PythonShell.run(`random-youtube-video.py`, pyoptions, function(err, results) {
    msg.channel.send(`https://youtube.com/watch?v=`+results);
  })
}
//

});

//### End of !commands ###

//### Easter Eggs ###

// EdgeMeter variables
var edge_counter = 0;
var edge_timeout;
var edge_delay = 1000*60*5; // 5 minute timeout

// Edge Meter TM
client.on("message", msg => {
    let edge_triggers = require('./edge_triggers.js').edge_triggers;
    let edge_found = false;

    for (i=0 ; i<edge_triggers.length; i++) {
      messagecontent = msg.content.toLowerCase();
      if (messagecontent.includes(edge_triggers[i])) { edge_found = true }
    }
    if (edge_found){
      clearTimeout(edge_timeout);
      edge_timeout = setTimeout(function() { edge_counter = 0; }, edge_delay);
      edge_counter = edge_counter + 10;
      if(edge_counter < 100) {
        msg.channel.send("Edge Level: " + edge_counter.toString() + "% - you are rather edgy.");
      }
      if(edge_counter >= 100 && edge_counter < 200) {
        msg.channel.send(":warning: :warning: **EDGE LEVEL: " + edge_counter.toString() + "% - EDGE OVERDRIVE - COULD YOU NOT?!** :warning: :warning:");
        msg.channel.send("http://i.imgur.com/wnIaRyJ.gif");
      }
      if (edge_counter >= 200) {
        msg.channel.send(":warning: :warning: **EDGE LEVEL: " + edge_counter.toString() + "% = EDGE CORE MELTDOWN IMMINENT! LITERALLY NOT COOL AT ALL!** :warning: :warning:");
        msg.channel.send("http://i.imgur.com/avHnbUZ.gif");
      }
      console.log(currentdate + " - EdgeMeter Increased");
    }
});
//Alex Detector
//client.on("message", msg => {
//    if (msg.content.includes("youtube.com/watch?v=" || "youtu.be/")) {
//      const ytid = getYTID(msg.content)
//      getYT(ytid, function (err, title) {
//        if (title.includes("Alex" || "Jones" || "Infowars" || "alex" || "jones" || "infowars")) {
//          msg.channel.send(":warning: B E W A R E : Potential Alex Jones Video")
//        }
//        console.log(title)
//})
//    }
//})
//Secret phrase triggers bot racism.
client.on("message", msg => {
    if (msg.content.includes("14 words")) {
        msg.channel.send(`https://i.imgur.com/6UrhSq4.png`);
        console.log(currentdate + " - Smashed Racism");
    }
});

client.on("message", msg => {
    if (msg.content.includes("Zoe Quinn") || (msg.content.includes("zoe quinn")) ) {
        msg.channel.send(`https://www.patreon.com/zoe`);
        console.log(currentdate + " - Helped out Zoe");
    }
});

client.on("message", msg => {
    if (msg.content.includes("burger king")) {
        msg.channel.send(`:hamburger: :crown: :mans_shoe: :salad:`);
        console.log(currentdate + " - but thats even worse");
    }
});


//announce user who's entered
client.on("guildMemberAdd", (member) => {
    console.log(currentdate + ` New User "${member.user.username}" has entered the room.` );
    member.guild.defaultChannel.send(`${member.user.username} has entered the room.`);
});

//announce user who's become active
client.on("guildMemberAvailable", (member) => {
    console.log(currentdate + ` New User "${member.user.username}" has entered the room.` );
    member.guild.defaultChannel.send(`${member.user.username} has entered the room.`);
});

//announce user who's left
client.on("guildMemberRemove", (member) => {
  console.log(currentdate + ` New User "${member.user.username}" has left the room. `);
  member.guild.defaultChannel.send(`${member.user.username} has left the room.`)
})

//"I am alive" message for cli console
client.on('ready', () => {
  console.log('It is ' + currentdate + ' and I have awoken!');
});

client.login(token);
