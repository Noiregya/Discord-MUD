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
const playersFilePath = './players.json'
const mapsFilePath = './maps.json'

//Global vars (To save)
var players = new Array()
var maps = new Array()
var isWritingPlayer = false
var isWaiting = false

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
  var player = checkPlayerExist(author)
  if(player && player.guild.name){
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

/**
 * Save all players into a file
 */
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
      //console.log('Abort');
      return
    }
    //Starts waiting 5 seconds
    isWaiting = true;
    //console.log('Timeout set');
    setTimeout(savePlayers, 5000)
  }
}

/**
 * Load player data from a file.
 */
function loadPlayers(){
  try{
    players = JSON.parse(fs.readFileSync(playersFilePath))
  }catch(error){
    console.log(`No ${playersFilePath} file loaded.`);
  }
}

/**
 * Load map data from a file.
 */
function loadMaps(){
  try{
    maps = JSON.parse(fs.readFileSync(mapsFilePath))
    maps.forEach(map => map.userItems = new Array())
  }catch(error){
    console.log(`No ${mapsFilePath} file loaded.`);
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

/**
 * @returns A name object where the name or the aliases matches string
 **/
function evaluateName(name, string){
  if(name && string){
    string = string.toUpperCase()
    if(name.name.toUpperCase() === string){
      return name
    }
    //Function to test an alias
    let testName = function(evaluatedName){
      if(evaluatedName.toUpperCase() === string){
        return true //The current name corresponds to the string
      }
    }
    if (name.aliases.find(testName)){
      return name
    }
  }
}

/**
 * @param interactions - List of all the interactions to display
 * @returns a human friendly text that lists the interactions to the player
 */
function generateInteractionsListString(interactions){
  var string
  let i = 0
  if(interactions.length > 0){
    interactions.forEach(interaction => {
      if(i === 0) {
        string = 'You can see '
      }else if(i >= interactions.length - 1) {
        string += ' and '
      }else {
        string += ', '
      }
      string += interaction.name.name.toLowerCase()
      i++
    })
    return string+'.'
  }
  return 'There seems to be nothing to interact with.'
}

/**
 * Get a game object from its name or alias.
 * @param itemName string that should be used to try to match with names
 * @param itemList list of anything that has a property name containing a name object
 * @returns Namable object that the name corresponds to
 */
function resolveNamable(itemName, itemList){
  let findItem = function(evaluatedItem){
    if(evaluatedItem && evaluatedItem.name){
      var name = evaluateName(evaluatedItem.name, itemName)
      if(evaluatedItem.name === name){
        return evaluatedItem
      }
    } else {
      console.log(`You\'re trying to evaluate a non-namable object, check that the property name on all your objects is a Name class in `)
      console.log(evaluatedItem)
    }
    return false
  }
  let item = itemList.find(findItem)
  return item
}

/**
 * Make a list of all the other players around the player.
 * @param currentPlayer - The player looking around
 * @returns list of nearby players
 */
function who(currentPlayer, channel){
  let map = maps[currentPlayer.position]
  let nearbyPlayers = new Array()
  players.forEach(player => {
    if(player !== currentPlayer && player.position === currentPlayer.position){
      nearbyPlayers.push(player)
    }
  })
  return nearbyPlayers
}

/**
 * Make a human friendly string describing who's around.
 * @param nearbyPlayers - List of all the players you want to list
 * @returns a string with a desciption of nearby players.
 */
function generateWhoString(nearbyPlayers){
  let string = ''
  switch(nearbyPlayers.length){
    case 0:
      break;
    case 1:
      string += `There\'s someone around, look it\'s ${nearbyPlayers[0].name}`
      break;
    default:
      let i
      for(i = 0; i < nearbyPlayers.length; i++){
        switch (i) {
          case 0:
              string += nearbyPlayers[i].name
            break;
          case nearbyPlayers.length - 1:
            string += ` and ${nearbyPlayers[i].name} are here too`
            break;
          default:
            string += ` ,${nearbyPlayers[i].name}`
        }
      }
  }
  if(string){
    string+='.'
  }
  return string
}

/**
 * Gives the player a description of what's happening in the map they're in.
 * @param currentPlayer - The player looking around
 * @param request - Name of what the player want to look at if applicable
 * @param channel - Channel to send the human friendly description in
 */
function lookAround(currentPlayer, request, channel){
  let item = resolveNamable(request, currentPlayer.inventory.items)
  //If there's an item
  if(item){
      channel.send(item.description).catch(err => {console.log(err);})
  }else{
    let position = maps[currentPlayer.position]
    if(position){
      let availableInteractions =''
      if(position.interactions){
        availableInteractions = generateInteractionsListString(position.interactions.filter(interaction => {
          console.log(interaction);
          return !currentPlayer.interactionsDone.includes(interaction.name.name)
        }))
      }
      let itemList =''
      if(maps[currentPlayer.position].userItems.length > 0){
        itemList = 'Other items on the ground:\n'
          maps[currentPlayer.position].userItems.forEach(currentItem => {
            itemList+=`${currentItem.name.name}\n`
          })
      }
      let nearbyPlayers = generateWhoString(who(currentPlayer, channel))
      channel.send(position.description+'\n'+availableInteractions+'\n'+nearbyPlayers+'\n'+itemList).catch(err => {console.log(err);})
    }else{
      console.log('Current position '+currentPlayer.position);
        console.log(maps);
    }

  }
  //TODO: Add descriptions for the things that need a pass and the pass is owned by the player
}

/**
 * Tries to move a player from a map to another one.
 * @param currentPlayer - Player traveling
 * @param directionName - Where the player told the game they want to go
 * @param channel - Channel to send the human friendly description in
 */
function travel(currentPlayer, directionName, channel){
  //console.log(maps[currentPlayer.position].directions);
  let direction = resolveNamable(directionName,maps[currentPlayer.position].directions)
  if(direction){
    currentPlayer.position = direction.map
    channel.send(direction.description).catch(err => {console.log(err);})
    savePlayers()
    lookAround(currentPlayer, undefined, channel)
  }
}

/**
 * Tries to pick up an item on the ground/map.
 * @param currentPlayer - The player trying to pick up something
 * @param grabbableName - The name the player gave for what they try to pick up
 * @param channel - Channel to send the human friendly description in
 */
function pickUp(currentPlayer, grabbableName, channel){
  let item = resolveNamable(grabbableName, maps[currentPlayer.position].userItems)
  let grabbable = resolveNamable(grabbableName,maps[currentPlayer.position].interactions
    .filter(interaction => {
      return interaction.type === 'grabbable' && !currentPlayer.interactionsDone.includes(interaction.name.name)
    }))
    if(grabbable && !currentPlayer.interactionsDone.includes(grabbable.name.name)){
    currentPlayer.interactionsDone.push(grabbable.name.name)
    grabbable.items.forEach(item => currentPlayer.inventory.items.push(item))
    channel.send(grabbable.description).catch(err => {console.log(err);})
    savePlayers()
  } else if (item){
      currentPlayer.inventory.items.push(item)
      maps[currentPlayer.position].userItems = maps[currentPlayer.position].userItems.filter(
        currentItem => currentItem !== item)
      channel.send(`Added ${item.name.name} to your inventory.`).catch(err => {console.log(err);})
      savePlayers()
  }
}
/**
 * Tries to drop an item from the player's inventory on the ground.
 * @param currentPlayer - The player trying to drop something
 * @param grabbableName - The name the player gave for what they try to drop
 * @param channel - Channel to send the human friendly description in
 */
function drop(currentPlayer, itemName, channel){
  let item = resolveNamable(itemName, currentPlayer.inventory.items)
  if(item){
    currentPlayer.inventory.items = currentPlayer.inventory.items.filter(
      currentItem => currentItem !== item)
    maps[currentPlayer.position].userItems.push(item)
    channel.send(`Item ${item.name.name} dropped.`).catch(err => {console.log(err);})
    savePlayers()
  }
}
/**
 * Kills the current player and display a message about it.
 * @param currentPlayer - player to kill
 * @param consequence - message to send upon death
 * @param channel - channel to send the message in
 */
function death(currentPlayer, consequence, channel){//Kills the player
  players = players.filter(player => {return player.id !== currentPlayer.id})
  channel.send(consequence.description).catch(err => {console.log(err);})
  savePlayers()
}


/**
 * Teleports the current player and display a message about it.
 * @param currentPlayer - player to teleprt
 * @param consequence - object containing destination and message to send upon teleportation
 * @param channel - channel to send the message in
 */
function teleportation(currentPlayer, consequence, channel){
  currentPlayer.position = consequence.map
  channel.send(consequence.description).catch(err => {console.log(err);})
  savePlayers()
}

/**
 * Check if the user has a pass then do an action.
 * @param currentPlayer - player trying to do the restricted action
 * @param consequence - Action condition, failed message, success message and action to do next
 * @param channel - channel to send the message in
 */
function lock(currentPlayer, consequence, channel){
  if(currentPlayer.passes.includes(consequence.pass)){
    channel.send(consequence.successDescription).catch(err => {console.log(err);})
    if(consequence.consequences){
      consequence.consequences.forEach(aConsequence => {
        makeItHappen(currentPlayer, consequence.consequences, channel)
      })
    }
  }else{
    channel.send(consequence.description).catch(err => {console.log(err);})
  }
}

/**
 * Give the player a pass.
 * @param currentPlayer - player getting a pass
 * @param consequence - Object containing the pass and message to send upon pass being given
 * @param channel - channel to send the message in
 */
function unlock(currentPlayer, consequence, channel){//Gives the player a pass
  currentPlayer.passes.push(consequence.pass)
  channel.send(consequence.description).catch(err => {console.log(err);})
  savePlayers()
}

/**
 * Do any WorldAction, redirects each kind to the appropriate function.
 * @param currentPlayer - player the action is performed on
 * @param consequences - consequences to that action
 * @param channel - channel to send the message in
 */
function makeItHappen(currentPlayer, consequences, channel){
  console.log(consequences);
  consequences.forEach(consequence => {
    switch (consequence.type) {
      case 'death':
        death(currentPlayer, consequence, channel)
        break;
      case 'teleportation':
        teleportation(currentPlayer, consequence, channel)
        break;
      case 'lock':
        lock(currentPlayer, consequence, channel)
        break;
      case 'unlock':
        unlock(currentPlayer, consequence, channel)
        break;
      default:

    }
  })
}

/**
 * Tries to use an item.
 * @param currentPlayer - player trying to use the item
 * @param itemName - name the player gave for that item
 * @param channel - channel to send the message in
 */
function use(currentPlayer, itemName, channel){
  let message
  let consequences
  let item = resolveNamable(itemName, currentPlayer.inventory.items)
  if(item){
    if(item.consequences.length < 1){
      message = `This ${item.name.name} does nothing at all, you don't even know how to use it.`
    } else {
      consequences = item.consequences
    }
  }else{
    let interaction = resolveNamable(itemName, maps[currentPlayer.position].interactions)
    console.log(maps[currentPlayer.position].interactions);
    if(interaction){
      console.log(interaction);
      if(interaction.consequences.length < 1){
        message = `You tried to use the ${interaction.name.name}, and it did nothing at all.`
      } else {
        consequences = interaction.consequences
      }
    }
  }
  if(consequences){
    makeItHappen(currentPlayer, consequences, channel)
  }
}

/* EVENTS */

//on warnings
client.on('warn', function (warning) {
  console.log(warning)
})
//on errors
client.on('error', function (error) {
  console.log(error)
})

//Client initialisation
client.on('ready', function(){
  console.log('Welcome to MUDBot.'+'\n')
//Loading data
  loadPlayers()
  loadMaps()
//Ready
  console.log('Logged in as '+client.user.tag+'!')
  client.user.setActivity("Ask for help!",{ type: 'LISTENING' }).then(function(presence){
  },function(err){
    console.log(err)
  })
})
// On message
client.on('message', function (message) {
  if(message.content){
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
          savePlayers()
        } else {
          //Player is already known.
          //Update last guild and username
          //console.log('Player already known');
          if(currentPlayer.guild.id !== message.guild.id || currentPlayer.name !== message.member.displayName){
            currentPlayer.guild = message.guild
            currentPlayer.name = message.member.displayName
            savePlayers()
          }
        }
        //console.log('Activity detected from '+currentPlayer.name)

      } else if (message.channel.type === 'dm') { //in a DM
        let currentPlayer = checkPlayerExist (message.author)
        if(!currentPlayer){
          currentPlayer = new Classes.Player(message.author.tag, message.author.id, message.author.id)
          players.push(currentPlayer)
          savePlayers()
        }
      }

      if (parsedMessage[0].toUpperCase().match(commands.regHelp)) {
        sendHelp(message.author)
      }
      if(currentPlayer !== undefined){//The player needs to exist for any other command.
        if (parsedMessage[0].toUpperCase().match(commands.regLook)){
          let i = 1;
          if(parsedMessage.length > 1){
            if(parsedMessage.length > 2 && parsedMessage[1].toUpperCase() === 'AT'){
              i++
            }
          }
          lookAround(currentPlayer, parsedMessage[i], message.channel)
        }else if (parsedMessage[0].toUpperCase().match(commands.regGo)){
          let i = 1
          if(parsedMessage.length > 1){
            if(parsedMessage.length > 2 && parsedMessage[i].toUpperCase() === 'TO'){
              i++
            }
            travel(currentPlayer, parsedMessage[i], message.channel)
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
            use(currentPlayer, parsedMessage[i], message.channel)
          }
        }
        else if (parsedMessage[0].toUpperCase().match(commands.regTake)){
          let i = 1
          if(parsedMessage.length > 1){
            if(parsedMessage.length > 2 && parsedMessage[i].toUpperCase() === 'UP'){
              i++
            }
            pickUp(currentPlayer, parsedMessage[i], message.channel)
          }
        }
        else if (parsedMessage[0].toUpperCase().match(commands.regGive)){
        }
        else if (parsedMessage[0].toUpperCase().match(commands.regDrop)){
          if(parsedMessage.length > 1){
              drop(currentPlayer, parsedMessage[1], message.channel)
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
            interact(currentPlayer, parsedMessage[i])
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

})

client.login(token)
