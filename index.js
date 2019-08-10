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
  console.error(e);
}

//Consts
const prefix = '.M'
const token = config['token']
const commands = {
  regHelp: /^HELP$|^H$|^MANUAL$|^MAN$/,
  regBuy: /^PURCHASE$|^BUY$/,
  regSell: /^SELL$/,
  regGo: /^GO$|^ENTER$|^CROSS$|^TRAVEL$|^WALK$/,
  regUse: /^USE$|^ACTIVATE$|^OPEN$|^PULL$|^DRINK$|^PRESS$/,
  regLook: /^LOOK$|^WHERE$/,
  regTake: /^FETCH$|^TAKE$|^GET$|^GRAB$|^PICK$/,
  regGive: /^LEND$|^GIVE$/,
  regDrop: /^THROW$|^DROP$|^LEAVE$/,
  regKill: /^ATTACK$|^KILL$/,
  regSleep: /^REST$|^SLEEP$/,
  regInteract: /^ACTIVATE$|^INTERACT$/,
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
const serversFilePAth = './servers.json'
const playersFilePath = './players.json'
const mapsFilePath = './maps.json'
const universesFilePath = './universes'
const utils = new Classes.Utils()

//Global
var universes = new Array();
var isWritingPlayer = false //Flag true while writing the players file, to limit amount of writes.
var isWaiting = false

fs.mkdir(universesFilePath, { recursive: true }, err =>{
  //console.error(err);
})

/**
 * Parse a message sent by anyone.
 * @param string - The content of the message
 */
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

/**
 * Send the help message in the player's DMs
 * @param author - discord.js author of the message
 */
function sendHelp(author){

  /*var player = checkPlayerExist(author, a guild)
  if(player && player.guild.name){ //TODO: replace guild.name because guild is now an ID
    var string = 'You have been active in '+player.guild.name+' for the last time.'
  }else{
    var string = 'It says on the register that you have never played.'
  }*/
  //TODO: Fix
  var string = 'The command is still under construction.'
  author.createDM().then(
    DMChannel =>{
      DMChannel.send(helpMessage+'\n'+string).catch(
        err => console.error('Could not send DM\n'+err))
      }, err => console.error('Could not send DM\n'+err))
}

/**
 * Save all players into a file

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
      //console.error('Abort');
      return
    }
    //Starts waiting 5 seconds
    isWaiting = true;
    //console.error('Timeout set');
    setTimeout(savePlayers, 5000)
  }
}*/

/**
 * Load player data from a file.

function loadPlayers(){
  try{
    players = JSON.parse(fs.readFileSync(playersFilePath))
  }catch(error){
    console.error(`No ${playersFilePath} file loaded.`);
  }
}*/

/**
 * Load player data from a file.

function loadServers(){
  try{
    servers = JSON.parse(fs.readFileSync(playersFilePath))
  }catch(error){
    console.error(`No ${playersFilePath} file loaded.`);
  }
  client.guilds.array().forEach(guild => {
    if(!utils.getById(guilds, guild.id)){
      var currentGuild = new Object()
      currentGuild.id = guild.id
      currentGuild.channel = null
    }
  })
}*/

/* EVENTS */

function loadUniverses(path){
  let folders = fs.readdirSync(path)
  folders.forEach(folder => {
    //let files = let fs.readdirSync(folder)
    try{
      let guild = client.guilds.get(folder)
      if(guild){
        let players = JSON.parse(fs.readFileSync(path+"/"+folder+"/players.json"))
        let maps = JSON.parse(fs.readFileSync(path+"/"+folder+"/maps.json"))
        let id = folder
        let name = guild.name
        universes.push(new Classes.Universe(name, id, mapsFilePath, universesFilePath, players, maps))
        console.log(`File ${id} read`);
      }
    }catch(error){
      console.error(error);
    }
  })
  return universes
}

//on warnings
client.on('warn', function (warning) {
  console.log(warning)
})
//on errors
client.on('error', function (error) {
  console.error(error)
})

//Client initialisation
client.on('ready', function(){
  console.log('Welcome to HDN MUDBot.'+'\n')
//Loading data
  loadUniverses(universesFilePath)
  var guilds = client.guilds.array()
  guilds.forEach(guild => {
    //console.log(universes[]);
    if(!utils.getById(universes, guild.id)){
      console.log("Adding universe "+guild.name);
      universes.push(new Classes.Universe(guild.name, guild.id, mapsFilePath, universesFilePath))
    }
  })
  //If there's too many universes
  if(guilds.length < universes.length){
    universes.forEach(universe =>{
      //Search for the guilds that were left
      if(!utils.getById(guilds, universe.id)){
        //And remove data associated with them
        console.log("Removing universe "+universe.id);
        universes = universes.filter(item => !universe)
      }
    })
  }
//Ready
  console.log('Logged in as '+client.user.tag+'!')
  client.user.setActivity("Ask for help!",{ type: 'LISTENING' }).then(function(presence){
  },function(err){
    console.log(err)
  })
})

client.on('guildCreate', function (guild){if(!utils.getById(universes, guild.id)){
  console.log("Adding universe "+guild.name);
  universes.push(new Classes.Universe(guild.name, guild.id, mapsFilePath, universesFilePath))
} }
)

// On message
client.on('message', function (message) {
  var universe = undefined
  if(message.content){
    let currentPlayer
    // parse the message
    let parsedMessage = parseMessage(message.content)
    //is the message from the bot itself?
    if (message.author.id === client.user.id) { return }
    else{
      if(message.channel.type === 'text'){
        universe = utils.getById(universes, message.guild.id);
        currentPlayer = universe.checkPlayerExist(message.author, message.guild)
          //Create contextual function checkplayer (needed for use with search)
          if(currentPlayer === undefined){
            console.log('creating player');
            //Player was never seen before
            currentPlayer = new Classes.Player(message.member.displayName, message.author.id, message.guild.id)
            universe.players.push(currentPlayer)
          } else {
            //Player is already known.
            //Update last guild and username
            //('Player already known');
            if(currentPlayer.name !== message.member.displayName){
              currentPlayer.name = message.member.displayName
            }
          }
      } else if(message.channel.type === 'dm'){
        console.log('No action defined for DMs yet');
      }
      //DM/Text channel check, might have to be used in command specific conditions too
      if(universe){
        if (parsedMessage[0].toUpperCase().match(commands.regHelp)) {
          sendHelp(message.author)
        }
        if(currentPlayer){//The player needs to exist for any other command.
          //('Activity detected from '+currentPlayer.name)
          if (parsedMessage[0].toUpperCase().match(commands.regLook)){
            let i = 1;
            if(parsedMessage.length > 1){
              if(parsedMessage.length > 2 && parsedMessage[1].toUpperCase() === 'AT'){
                i++
              }
            }
            universe.lookAround(currentPlayer, parsedMessage[i], message.channel)
          }else if (parsedMessage[0].toUpperCase().match(commands.regGo)){
            let i = 1
            if(parsedMessage.length > 1){
              if(parsedMessage.length > 2 && parsedMessage[i].toUpperCase() === 'TO'){
                i++
              }
              universe.travel(currentPlayer, parsedMessage[i], message.channel)
            }
          }else if (parsedMessage[0].toUpperCase().match(commands.regBuy)){
          }
          else if (parsedMessage[0].toUpperCase().match(commands.regSell)){
          }
          else if (parsedMessage[0].toUpperCase().match(commands.regUse)){
            let i = 1
            if(parsedMessage.length > 1){
              if(parsedMessage.length > 2 && parsedMessage[i].toUpperCase() === 'THE'){
                i++
              }
              universe.use(currentPlayer, parsedMessage[i], message.channel)
            }
          }
          else if (parsedMessage[0].toUpperCase().match(commands.regTake)){
            let i = 1
            if(parsedMessage.length > 1){
              if(parsedMessage.length > 2 && parsedMessage[i].toUpperCase() === 'UP'){
                i++
              }
              universe.pickUp(currentPlayer, parsedMessage[i], message.channel)
            }
          }
          else if (parsedMessage[0].toUpperCase().match(commands.regGive)){
          }
          else if (parsedMessage[0].toUpperCase().match(commands.regDrop)){
            if(parsedMessage.length > 1){
                universe.drop(currentPlayer, parsedMessage[1], message.channel)
            }
          }
          else if (parsedMessage[0].toUpperCase().match(commands.regKill)){
          }
          else if (parsedMessage[0].toUpperCase().match(commands.regSleep)){
          }
          else if (parsedMessage[0].toUpperCase().match(commands.regInteract)){
            let i = 1
            if(parsedMessage.length > 1){
              if(parsedMessage.length > 2 && parsedMessage[i].toUpperCase() === 'WITH'){
                i++
              }
              //universe.interact(currentPlayer, parsedMessage[i]) function doesn't exist yet
            }
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
      }
    }
  }

})

client.login(token)
