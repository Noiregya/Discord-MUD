//Includes
const Discord = require('discord.js')
const yaml = require('js-yaml')
const fs = require('fs');
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

//Client initialisation
client.on('ready', function(){
  console.log('Welcome to MUDBot.'+'\n')
  console.log('Logged in as '+client.user.tag+'!')
  client.user.setActivity(prefix+" HELP",{ type: 'LISTENING' }).then(function(presence){
  },function(err){
    console.log(err)
  })
})

client.login(token)
