const Discord = require('discord.js')
const token = ''
const prefix = '.M'

//Client initialisation
client.on('ready', function(){
  console.log('Welcome to pin_archiver.'+'\n')
  console.log('Logged in as '+client.user.tag+'!')
  client.user.setActivity(prefix+" HELP",{ type: 'LISTENING' }).then(function(presence){
  },function(err){
    console.log(err)
  })
}

client.login(token)
