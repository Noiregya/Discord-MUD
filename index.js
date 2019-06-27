'use strict'

//Includes
const Discord = require('discord.js')
const yaml = require('js-yaml')
const fs = require('fs');
const Classes = require('./classes/Classes.js')

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
  regGo: /^GO$|^ENTER$|LEAVE$|^CROSS$|^TRAVEL$/,
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
const playersFilePath = './players.json'
const mapsFilePath = './maps.json'

//Global vars (To save)
var players = new Array()
var maps = new Array()
var isWritingPlayer = false
var isWaiting = false

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
  var player = checkPlayerExist(author)
  if(player){
    var string = 'You have been active in '+player.guild.name+' for the last time.'
  }else{
    var string = 'It says on the register that you have never played.'
  }
  author.createDM().then(
    DMChannel =>{
      DMChannel.send(helpMessage+'\n'+string).catch(
        err => console.log('Could not send DM\n'+err))
      }, err => console.log('Could not send DM\n'+err))
}

//Save all players into a file
async function savePlayers(){
  //Is someone else writing
  if(!isWritingPlayer){
    //No one is, write file
    isWaiting = false
    isWritingPlayer = true
    fs.writeFile(playersFilePath,JSON.stringify(players),function(){
      isWritingPlayer = false
    })
  } else {
    if(isWaiting){
      //Already waiting, abort
      console.log('Abort');
      return
    }
    //Starts waiting 5 seconds
    isWaiting = true;
    console.log('Timeout set');
    setTimeout(savePlayers, 5000)
  }
}

function loadPlayers(){
  try{
    players = JSON.parse(fs.readFileSync(playersFilePath))
  }catch(error){
    console.log('No '+playersFilePath+' file loaded.');
  }
}

function loadMaps(){
  try{
    maps = JSON.parse(fs.readFileSync(mapsFilePath))
  }catch(error){
    console.log('No '+mapsFilePath+' file loaded.');
  }
}

/**
 * Check if a user already has a player in the playerlist.
 * @param user - The user
 * @return - undefined if it's a new player, the player object otherwise
 * TODO: Support for multiple guilds, unique player for (user_id,guid_id) pairs
 */
function checkPlayerExist(user){
  let testPlayer = function(player){
    if(user.id === player.id){
      return true
    }
  return false
  }
  return players.find(testPlayer)
}

function evaluateName(name, string){
  string = string.toUpperCase()
  if(name.name.toUpperCase() === string){
    return true
  }
  let testName = function(evaluatedName){
    if(evaluateName.toUpperCase() === string){
      return true
    }
  }
  return name.aliases.find(testName)
}

function travel(currentPlayer, parsedMessage, channel){
  //TODO: Replace placeholder.
  let i = 1
  if(parsedMessage[i].toUpperCase() === 'TO'){
    i++
  }
  var parsed = parseInt(parsedMessage[i])
  if(!isNaN(parsed) && parsed >= 0 && parsed < maps.length){
    currentPlayer.position = parsed
    channel.send(currentPlayer.name + ' moves to ' + maps[parsed].name.name) //Debug message
  }
}


/* EVENTS */

//on warnings
client.on('warn', function (warning) {
  //console.log(warning)
  log.warn('Client.on', 'uncaught warning', warning)
})
//on errors
client.on('error', function (error) {
  //console.log(error)
  log.error('Client.on', 'uncaught error', error)
})

//Client initialisation
client.on('ready', function(){
  console.log('Welcome to MUDBot.'+'\n')
//Loading data
  loadPlayers()
  loadMaps()
  console.log(players.length);
  console.log(maps.length);
  console.log(maps[2].description);
//Ready
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
    //DM/Text channel check, might have to be used in command specific conditions too
    let currentPlayer = checkPlayerExist (message.author)
    if (message.channel.type === 'text') {//In a public channel
      //Create contextual function checkplayer (needed for use with search)
      if(currentPlayer === undefined){
        //Player was never seen before
        currentPlayer = new Classes.Player(message.member.displayName, message.author.id, message.guild)
        players.push(currentPlayer)
      } else {
        //Player is already known.
        //Update last guild and username
        //console.log('Player already known');
        currentPlayer.guild = message.guild
        currentPlayer.name = message.member.displayName
      }
      savePlayers()
      console.log('Activity detected from '+currentPlayer.name)

    } else if (message.channel.type === 'dm') { //in a DM

    }

    if (parsedMessage[0].toUpperCase().match(commands.regHelp)) {
      sendHelp(message.author)
    }else if (parsedMessage[0].toUpperCase().match(commands.regGo)){
      if(currentPlayer !== undefined){
        travel(currentPlayer, parsedMessage, message.channel)
      }
    }else if (parsedMessage[0].toUpperCase().match(commands.regBuy)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regSell)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regFlee)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regTake)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regGive)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regDrop)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regKill)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regSleep)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regKeep)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regBag)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regLaugh)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regTickle)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regHug)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regTell)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regYell)){
    }
    else if (parsedMessage[0].toUpperCase().match(commands.regAct)){
    }
  }
})

client.login(token)
