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
  client.user.setActivity(prefix+" HELP",{ type: 'LISTENING' }).then(function(presence){
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
    if (message.channel.type === 'text') {

    } else if (message.channel.type === 'dm') {

    }
  }
})


client.login(token)
