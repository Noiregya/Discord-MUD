'use strict'

//Includes
const Discord = require('discord.js')
const yaml = require('js-yaml')
const fs = require('fs');
const Classes = require('./Classes.js')

//Objects
const client = new Discord.Client()
try {
  var config = yaml.safeLoad(fs.readFileSync(__dirname+'/secret.yaml', 'utf8'));
} catch (e) {
  console.log(e);
}

//Consts
const prefix = '.M'
const token = config['token']
const commands = {
  regHelp: /^HELP$|^H$|^MANUAL$|^MAN$/,
  regBuy: /^PURCHASE$|^BUY$/,
  regSell: /^SELL$/,
  regGo: /^GO$|^ENTER$|LEAVE TO$/,
  regFlee: /^FLEE$|^RUN$/,
  regLook: /^LOOK$|^WHERE$/,
  regTake: /^FETCH$|^TAKE$|^GET$/,
  regGive: /^LEND$|^GIVE$/,
  regDrop: /^THROW*$|^DROP$|^LEAVE$/,
  regKill: /^ATTACK$|^KILL$/,
  regSleep: /^REST$|^SLEEP$/,
  regKeep: /^KEEP$|^SAVE$/,
  regBag: /^INVENTORY$|^BAG$/,
  regLaugh: /^LAUGH$|^GIGGLE$/,
  regTickle: /^TICKLE$/,
  regHug: /^HUG$|^CUDDLE$/,
  regTell: /^SPEAK$|^SAY$|^TELL$/,
  regKiss: /^KISS$/,
  regYell: /^SHOUT$|^YELL$|^SCREAM$/,
  regAct: /^IMITATE|^ACT LIKE$|^ACT/
}
const helpMessage = 'You can look around by typing look, open your bag with bag and ask for help. Maybe you can also do other things, who knows?'

//Global vars
var Players = new Array()

function parseMessage (string) {
  var spaces = string.trim().split('"')
  var peer = true
  var parsedCommand = []
  spaces.forEach(function (space) {
    if (peer) {
      parsedCommand = parsedCommand.concat(space.trim().split(' '))
    } else {
      parsedCommand.push(space)
    }
    peer = !peer
  })
  return parsedCommand.filter(value => Object.keys(value).length !== 0)
}

function sendHelp(author){
  author.createDM().then(
    DMChannel =>{
      DMChannel.send(helpMessage).catch(
        err => console.log('Could not send DM\n'+err))
      }, err => console.log('Could not send DM\n'+err))
}

/* EVENTS */

//on warnings
client.on('warn', function (warning) {
  //console.log(warning)
  log.warn('Client.on', 'uncaught warning')
})
//on errors
client.on('error', function (error) {
  //console.log(error)
  log.error('Client.on', 'uncaught error', error)
})

//Client initialisation
client.on('ready', function(){
  console.log('Welcome to MUDBot.'+'\n')
  console.log('Logged in as '+client.user.tag+'!')
  client.user.setActivity("Ask for help!",{ type: 'LISTENING' }).then(function(presence){
  },function(err){
    console.log(err)
  })
})
client.on('message', function (message) {
  // parse the message
  let parsedMessage = parseMessage(message.content)
  //is the message from the bot itself?
  if (message.author.id === client.user.id) { return }
  else{
    if (parsedMessage[0].toUpperCase().match(commands.regHelp)) {
      sendHelp(message.author)
    }
    /*
    DM/Text channel check, might have to be used in command specific conditions
    instead of outside like here.
    if (message.channel.type === 'text') {

    } else if (message.channel.type === 'dm') {

    }*/
  }
})


client.login(token)
