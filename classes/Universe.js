const Utils = require('./Utils.js')
const fs = require('fs');

//Static methods

/**
 * Adds an item to the inventory, add the required pass(es) to the player if any.
 * @param player - Player to give the item to
 * @param item - Item to give to the player
 */
 function addItem(player, item){
   //Add to inventory
   player.inventory.items.push(item)
   //Add passes to player
   getPasses(item).forEach(pass =>{
     if(!player.passes.includes(pass)){
       player.passes.push(pass)
     }
   })
 }

 function getPasses(item){
   let passes = new Array()
   item.consequences.forEach(action => {
     if(action.type === 'unlock'){
       passes.push(action.pass)
     }
   })
   return passes
 }

/**
 * @class
 * A universe.
 */
class Universe {
  /**
   * Load map data from a file.
   * @param {!String} mapsFilePath - path of the map to load
   */
  loadMaps(mapsFilePath){
    try{
      this.maps = JSON.parse(fs.readFileSync(mapsFilePath))
      this.maps.forEach(map => map.userItems = new Array())
    }catch(error){
      console.error(`No ${mapsFilePath} file loaded.`);
      console.error(error)
    }
  }

  /**
   * @constructor
   * Creates a WorldMap
   * @param {!Name} name - name of the guild
   * @param {!Snowflake} id - id of the guild
   * @param {!String} mapsFilePath - file path for this universe's map
   * @param {!String} universesFilePath - file path for this universe
   * OR
   * @param {UniverseJSON} name - An universe converted from json
    */
  constructor (name, id, mapsFilePath, universesFilePath, players, maps) {
      this.name = name
      this.id = id
      this.players = players || new Array()
      this.maps = maps || new Array()
      if(this.maps.length === 0){
        this.loadMaps(mapsFilePath)
      }
      this.utils = new Utils()
      this.universesFilePath = universesFilePath
    }

  /**
   * Check if a user already has a player in the playerlist.
   * @param user - The user
   * @return - undefined if it's a new player, the player object otherwise
   */
  checkPlayerExist(user){
    let testPlayer = function(player){
      if(user.id === player.id){
        return true
      }
    return false
    }
    return this.players.find(testPlayer)
  }

  /**
   * Make a list of all the other players around the player.
   * @param currentPlayer - The player looking around
   * @returns list of nearby players
   */
  who(currentPlayer, channel){
    let map = this.maps[currentPlayer.position]
    let nearbyPlayers = new Array()
    this.players.forEach(player => {
      if(player !== currentPlayer && player.position === currentPlayer.position){
        nearbyPlayers.push(player)
      }
    })
    return nearbyPlayers
  }

  /**
   * Gives the player a description of what's happening in the map they're in.
   * @param currentPlayer - The player looking around
   * @param request - Name of what the player want to look at if applicable
   * @param channel - Channel to send the human friendly description in
   */
  lookAround(currentPlayer, request, channel){
    let item = this.utils.resolveNamable(request, currentPlayer.inventory.items)
    //If there's an item
    if(item){
        channel.send(item.description).catch(err => {console.error(err);})
    }else{
      let position = this.maps[currentPlayer.position]
      if(position){
        let availableInteractions =''
        if(position.interactions){
          availableInteractions = this.utils.generateInteractionsListString(position.interactions.filter(interaction => {
            return !currentPlayer.interactionsDone.includes(interaction.name.name)
          }))
        }
        let itemList =''
        if(this.maps[currentPlayer.position].userItems.length > 0){
          itemList = 'Other items on the ground:\n'
            this.maps[currentPlayer.position].userItems.forEach(currentItem => {
              itemList+=`${currentItem.name.name}\n`
            })
        }
        let nearbyPlayers = this.utils.generateWhoString(this.who(currentPlayer, channel))
        channel.send(position.description+'\n'+availableInteractions+'\n'+nearbyPlayers+'\n'+itemList).catch(err => {console.error(err);})
      }else{
        console.error('Current position '+currentPlayer.position);
          console.error(this.maps);
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
  travel(currentPlayer, directionName, channel){
    let direction = this.utils.resolveNamable(directionName,this.maps[currentPlayer.position].directions)
    if(direction){
      currentPlayer.position = direction.mapIndex
      channel.send(direction.description).catch(err => {console.error(err);})
      this.utils.saveUniverse(this)
      this.lookAround(currentPlayer, undefined, channel)
    }
  }

  /**
   * Tries to pick up an item on the ground/map.
   * @param currentPlayer - The player trying to pick up something
   * @param grabbableName - The name the player gave for what they try to pick up
   * @param channel - Channel to send the human friendly description in
   */
  pickUp(currentPlayer, grabbableName, channel){
    let item = this.utils.resolveNamable(grabbableName, this.maps[currentPlayer.position].userItems)
    let grabbable = this.utils.resolveNamable(grabbableName,this.maps[currentPlayer.position].interactions
      .filter(interaction => {
        return interaction.type === 'grabbable' && !currentPlayer.interactionsDone.includes(interaction.name.name)
      }))
      if(grabbable && !currentPlayer.interactionsDone.includes(grabbable.name.name)){
      currentPlayer.interactionsDone.push(grabbable.name.name)
      grabbable.items.forEach(item => {
          addItem(currentPlayer, item)
        })
      channel.send(grabbable.description).catch(err => {console.error(err);})
      this.utils.saveUniverse(this)
    } else if (item){
        addItem(currentPlayer, item)
        this.maps[currentPlayer.position].userItems = this.maps[currentPlayer.position].userItems.filter(
          currentItem => currentItem !== item)
        channel.send(`Added ${item.name.name} to your inventory.`).catch(err => {console.error(err);})
        this.utils.saveUniverse(this)
    }
  }
  /**
   * Tries to drop an item from the player's inventory on the ground. If the item provided any pass, the passes are lost.
   * @param currentPlayer - The player trying to drop something
   * @param grabbableName - The name the player gave for what they try to drop
   * @param channel - Channel to send the human friendly description in
   */
  drop(currentPlayer, itemName, channel){
    let item = this.utils.resolveNamable(itemName, currentPlayer.inventory.items)
    if(item){
      currentPlayer.inventory.items = currentPlayer.inventory.items.filter(
        currentItem => currentItem !== item)
      this.maps[currentPlayer.position].userItems.push(item)
      let forDeletion = getPasses(item)
      currentPlayer.passes = currentPlayer.passes.filter(instance => {
        return !forDeletion.includes(instance)
      })

      channel.send(`Item ${item.name.name} dropped.`).catch(err => {console.error(err);})
      this.utils.saveUniverse(this)
    }
  }

  /**
   * Shows the content of the user's inventory.
   * @param currentPlayer - The player's whose bag shall be displayed
   * @param channel - The channel in which the message shall be sent
   */
  bag(currentPlayer, channel, itemName){
    if(itemName){
      let item = this.utils.resolveNamable(itemName, currentPlayer.inventory.items)
      if(item){
        channel.send(`**${item.name.name}:**\n`+
          `\`\`\`${item.description}\`\`\``
        ).catch(err =>{
          console.error(err);
        })
        return;
      }
    }
    let answer = `You have **${currentPlayer.inventory.gold}** gold in your inventory, as well as:\n`
    currentPlayer.inventory.items.forEach(item => {
      answer += `*-${item.name.name}*\n`
    })
    channel.send(answer).catch(err =>{
      console.error(err);
    })
  }
  /**
   * Kills the current player and display a message about it.
   * @param currentPlayer - player to kill
   * @param consequence - message to send upon death
   * @param channel - channel to send the message in
   */
  death(currentPlayer, consequence, channel){//Kills the player
    this.players = this.players.filter(player => {return player.id !== currentPlayer.id})
    channel.send(consequence.description).catch(err => {console.error(err);})
    this.utils.saveUniverse(this)
  }


  /**
   * Teleports the current player and display a message about it.
   * @param currentPlayer - player to teleprt
   * @param consequence - object containing destination and message to send upon teleportation
   * @param channel - channel to send the message in
   */
  teleportation(currentPlayer, consequence, channel){
    currentPlayer.position = consequence.mapIndex
    channel.send(consequence.description).catch(err => {console.error(err);})
    this.utils.saveUniverse(this)
  }

  /**
   * Check if the user has a pass then do an action.
   * @param currentPlayer - player trying to do the restricted action
   * @param consequence - Action condition, failed message, success message and action to do next
   * @param channel - channel to send the message in
   */
  lock(currentPlayer, consequence, channel){
    if(currentPlayer.passes.includes(consequence.pass)){
      channel.send(consequence.successDescription).catch(err => {console.error(err);})
      if(consequence.consequences){
        consequence.consequences.forEach(aConsequence => {
          makeItHappen(currentPlayer, consequence.consequences, channel)
        })
      }
    }else{
      channel.send(consequence.description).catch(err => {console.error(err);})
    }
  }

  /**
   * Give the player a pass.
   * @param currentPlayer - player getting a pass
   * @param consequence - Object containing the pass and message to send upon pass being given
   * @param channel - channel to send the message in
   */
  unlock(currentPlayer, consequence, channel){//Gives the player a pass
    if(!currentPlayer.passes.includes(consequence.pass)){
      currentPlayer.passes.push(consequence.pass)
    }
    channel.send(consequence.description).catch(err => {console.error(err);})
    this.utils.saveUniverse(this)
  }

  /**
   * Do any WorldAction, redirects each kind to the appropriate function.
   * @param currentPlayer - player the action is performed on
   * @param consequences - consequences to that action
   * @param channel - channel to send the message in
   */
  makeItHappen(currentPlayer, consequences, channel){
    consequences.forEach(consequence => {
      switch (consequence.type) {
        case 'death':
          this.death(currentPlayer, consequence, channel)
          break;
        case 'teleportation':
          this.teleportation(currentPlayer, consequence, channel)
          break;
        case 'lock':
          this.lock(currentPlayer, consequence, channel)
          break;
        case 'unlock':
          this.unlock(currentPlayer, consequence, channel)
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
  use(currentPlayer, itemName, channel){
    let message
    let consequences
    let item = this.utils.resolveNamable(itemName, currentPlayer.inventory.items)
    if(item){
      if(item.consequences.length < 1){
        message = `This ${item.name.name} does nothing at all, you don't even know how to use it.`
      } else {
        consequences = item.consequences
      }
    }else{
      let interaction = this.utils.resolveNamable(itemName, this.maps[currentPlayer.position].interactions)
      if(interaction && interaction.type === "activable"){
        if(interaction.consequences.length < 1){
          message = `You tried to use the ${interaction.name.name}, and it did nothing at all.`
        } else {
          consequences = interaction.consequences
        }
      }else if(interaction && interaction.type === "grabbable"){
        message = "Shouldn't you try to pick it up instead?"
      }else{
        message = "Doesn't seems to do anything."
      }
    }
    if(consequences){
      this.makeItHappen(currentPlayer, consequences, channel)
    }else {
      channel.send(message).catch(err => {console.error(err)})
    }
  }
}
module.exports = Universe
