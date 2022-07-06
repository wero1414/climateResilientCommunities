const functions = require("firebase-functions");

const TelegramBot = require('node-telegram-bot-api');
const Promise = require('bluebird');
  Promise.config({
    cancellation: true
  });

// replace the value below with the Telegram token you receive from @BotFather
const token = '5495529357:AAG-ZlxjGe1stKF4_TvnMgkd9i5WNbGxxa4';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
var chatIDG;

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  chatIDG = chatId;
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("JSON for Debbug", {structuredData: request.body});
  //functions.logger.info("Data",  request.body.event.body.decoded.payload.data);
  //response.send("Hello from Firebase!");
  //let variables = "Temperatura = ";
  //variables += request.body.decoded.payload.data.temperature_7;

  var idName = request.body.name;
  var devaddress = request.body.devaddr;
  var temperature = (request.body.decoded.payload.data.temperature_7+request.body.decoded.payload.data.temperature_7)/2;
  var humidity = request.body.decoded.payload.data.humidity_6;
  
  var RSR0 = request.body.decoded.payload.data.analog_in_40/10;
  var ppm = Math.pow(10, 0.9682 * (Math.log(RSR0) / Math.LN10) - 0.8108);
  
  functions.logger.info("Data PPM", {structuredData: ppm});
  if(ppm>0.4){
    functions.logger.info("Data High 1 PPM", {structuredData: ppm});
  }
  else if(ppm>1){
    functions.logger.info("Data High 2 PPM", {structuredData: ppm});
  }
  var msg = "Dato del dispositivo: "
  msg += idName;
  msg += " \nTemperatura =  "
  msg += temperature;
  msg += " \nHumedad = "
  msg += humidity;
  msg += " \nPPM = "
  msg += ppm;
  chatIDG = 229458447;
  bot.sendMessage(chatIDG, msg);
  response.sendStatus(200);

});
