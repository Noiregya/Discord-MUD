(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.logic = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
const Interaction = require('./Interaction.js')
/**
 * @class
 * A activable interaction in a map.
 */
class Activable extends Interaction{
  /**
   * @constructor
   * Creates a Activable
   * @param {!Name} name - name of the Activable
   * @param {!string} description - description of the Activable
   * @param {!WorldAction[]} consequences - What to do
   */
  constructor (name, description, consequences) {
    super(name, description, 'activable')
    this.consequences = consequences
  }
}
module.exports = Activable

},{"./Interaction.js":7}],3:[function(require,module,exports){
const Player = require('./Player.js')
const Name = require('./Name.js')
const Inventory = require('./Inventory.js')
const Item = require('./Item.js')
const WorldAction = require('./WorldAction.js')
const Teleportation = require('./Teleportation.js')
const Death = require('./Death.js')
const Unlock = require('./Unlock.js')
const Lock = require('./Lock.js')
const Interaction = require('./Interaction.js')
const Activable = require('./Activable.js')
const Grabbable = require('./Grabbable.js')
const WorldMap = require('./WorldMap.js')
const Direction = require('./Direction.js')
const Quest = require('./Quest.js')
const User = require('./User.js')
const Universe = require('./Universe.js')
const Utils = require('./Utils.js')


module.exports = {
  Player: Player,
  Inventory: Inventory,
  Name: Name,
  Item: Item,
  WorldAction: WorldAction,
  Teleportation: Teleportation,
  Death: Death,
  Unlock: Unlock,
  Lock: Lock,
  WorldMap: WorldMap,
  Interaction: Interaction,
  Activable: Activable,
  Grabbable: Grabbable,
  Direction: Direction,
  Quest: Quest,
  User: User,
  Universe: Universe,
  Utils: Utils
}

},{"./Activable.js":2,"./Death.js":4,"./Direction.js":5,"./Grabbable.js":6,"./Interaction.js":7,"./Inventory.js":8,"./Item.js":9,"./Lock.js":10,"./Name.js":11,"./Player.js":12,"./Quest.js":13,"./Teleportation.js":14,"./Universe.js":15,"./Unlock.js":16,"./User.js":17,"./Utils.js":18,"./WorldAction.js":19,"./WorldMap.js":20}],4:[function(require,module,exports){
const WorldAction = require('./WorldAction.js')
/**
 * @class
 * A Death.
 */
class Death extends WorldAction {
  /**
   * @constructor
   * Creates a Death
   * @param {!string} descritpion - description of the death
   * @param {!string} player - player to kill, leave blank for self
   */
  constructor (description, player) {
    super(description, 'death')
    this.player = player
  }
}
module.exports = Death

},{"./WorldAction.js":19}],5:[function(require,module,exports){
/**
 * @class
 * A direction to a map.
 */
class Direction {
  /**
   * @constructor
   * Creates a Direction
   * @param {!Name} name - name of the Direction
   * @param {!string} description - description of the Direction
   * @param {!Integer} mapIndex - the place index it leads to
   */
  constructor (name, description, mapIndex) {
    this.description = description
    this.name = name
    this.mapIndex = mapIndex
  }
}
module.exports = Direction

},{}],6:[function(require,module,exports){
const Interaction = require('./Interaction.js') 
/**
 * @class
 * A grabbable interaction in a map.
 */
class Grabbable extends Interaction{
  /**
   * @constructor
   * Creates a Grabbable
   * @param {!Name} name - name of the Grabbable
   * @param {!string} description - description of the Grabbable
   * @param {!Item[]} items - Items to grab
   */
  constructor (name, description, items) {
    super(name, description, 'grabbable')
    this.items = items
  }
}
module.exports = Grabbable

},{"./Interaction.js":7}],7:[function(require,module,exports){
/**
 * @class
 * An interaction in a map.
 */
class Interaction {
  /**
   * @constructor
   * Creates a Interaction
   * @param {!Name} name - name of the Interaction
   * @param {!string} description - description of the Interaction
   * @param {!string} type - grabbable, activable or nothing
   */
  constructor (name, description, type) {
    this.description = description
    this.name = name
    this.type = type
  }
}
module.exports = Interaction

},{}],8:[function(require,module,exports){
/**
 * @class
 * A Inventory for something.
 */
class Inventory {
  /**
   * @constructor
   * Creates a Inventory
   * @param {?Item[]} items - Real Inventory
   * @param {?var} gold - amount of gold
   */
  constructor (items, gold) {
    if(items == undefined){
      this.items = new Array()
    } else {
      this.items = items
    }
    if(gold == undefined){
      this.gold = 0
    } else {
      this.gold = gold
    }
  }
}
module.exports = Inventory

},{}],9:[function(require,module,exports){
/**
 * @class
 * A Item for something.
 */
class Item {
  /**
   * @constructor
   * Creates a Item
   * @param {!Name} name - name
   * @param {!string} description - Item description
   * @param {!WorldAction[]} consequences - consequences of using the item
   */
  constructor (name, description, consequences) {
    this.name = name
    this.description = description
    if(consequences == undefined){
      this.consequences = new Array()
    } else {
      this.consequences = consequences
    }
  }
}
module.exports = Item

},{}],10:[function(require,module,exports){
const WorldAction = require('./WorldAction.js')
/**
 * @class
 * A n action you can do only with a specific pass.
 */
class Lock extends WorldAction {
  /**
   * @constructor
   * An action you can do only if you have a specific pass
   * @param {!string} successDescription - Success description
   * @param {!string} failureDescription - Failure description, accessed with this.description
   * @param {!string} pass - Pass needed for the player do the action
   * @param {!WorldAction[]} consequences - What happens after success
   */
  constructor (successDescription, failureDescription, pass, consequences) {
    super(failureDescription, 'lock')
    this.successDescription = successDescription
    this.pass = pass
    this.consequences = consequences
  }
}
module.exports = Lock

},{"./WorldAction.js":19}],11:[function(require,module,exports){
/**
 * @class
 * A name for something.
 */
class Name {
  /**
   * @constructor
   * Creates a Name
   * @param {!string} name - Real name
   * @param {?string[]} aliases - Aliases for the name
   */
  constructor (name, aliases) {
    this.name = name
    if(aliases == undefined){
      this.aliases = new Array()
    } else {
      this.aliases = aliases
    }
  }
}
module.exports = Name

},{}],12:[function(require,module,exports){
const Inventory = require('./Inventory.js')

/**
 * @class
 * A humain player.
 */
class Player {
  /**
   * @constructor
   * Creates a Player
   * @param {!Name} name - Name of the Player
   */
  constructor (name, id, guild) {
    this.id = id
    this.name = name
    this.position = 0
    this.inventory = new Inventory()
    this.activeQuests = new Array()
    this.interactionsDone = new Array()
    this.passes = new Array()
    this.guild = guild
  }

}
module.exports = Player

},{"./Inventory.js":8}],13:[function(require,module,exports){
/**
 * @class
 * A quest.
 */
class Quest {
  /**
   * @constructor
   * Creates a Quest
   * @param {!Name} name - name of the Quest
   * @param {!string} description - description of the Quest
   * @param {?Item[]} items - the bounty we gain
   */
  constructor (name, description, items) {
    this.description = description
    this.name = name
    this.items = items
  }
}
module.exports = Quest

},{}],14:[function(require,module,exports){
const WorldAction = require('./WorldAction.js')

/**
 * @class
 * A teleportation to somewhere.
 */
class Teleportation extends WorldAction {
  /**
   * @constructor
   * Creates a Teleportation
   * @param {!string} description - Teleportation description
   * @param {!int} mapIndex - place to send the player
   * @param {!Player} player - Player to teleport
   */
  constructor (description, mapIndex, player) {
    super(description, 'teleportation')
    this.player = player
    this.mapIndex = mapIndex
  }
}
module.exports = Teleportation

},{"./WorldAction.js":19}],15:[function(require,module,exports){
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

},{"./Utils.js":18,"fs":1}],16:[function(require,module,exports){
const WorldAction = require('./WorldAction.js')
/**
 * @class
 * A teleportation to somewhere.
 */
class Unlock extends WorldAction {
  /**
   * @constructor
   * Creates a Unlock
   * @param {!string} description - Unlock description
   * @param {!string} pass - Pass needed for the player to go somewhere
   */
  constructor (description, pass) {
    super(description, 'unlock')
    this.pass = pass
  }
}
module.exports = Unlock

},{"./WorldAction.js":19}],17:[function(require,module,exports){
/**
 * @class
 * A humain user.
 */
class User {
  /**
   * @constructor
   * Creates a User
   * @param {!id} id - ID of the User
   * @param {!lastGuild} lastGuild - Last guild the user was seen in
   */
  constructor (id, lastGuild) {
    this.id = id
    this.lastGuild = lastGuild
  }

}
module.exports = User

},{}],18:[function(require,module,exports){
const fs = require('fs');

/**
 * @class
 * Technical tools.
 */

 /**
  * The reason it's here is because it's called in a temporary function
  * @returns A name object where the name or the aliases matches string
  **/
 function evaluateName (name, string){
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

class Utils {

  /**
   * @constructor
   * Creates an instance of utils
   */
  constructor () {
    //Empty constructor
  }

  /**
   * Check for each element in an array if their property id equals a given id
   * @param array - Object array that has an id property
   * @param id - A snowflake
   * @returns the element if found, else false
   */
  getById(array, id){
    let result = false
    array.forEach(object => {
      if(id === object.id){
        result = object
      }
    })
    return result
  }

  /**
   * Saves one universe into files
   */
  saveUniverse(universe){
    if(universe){
      try{
        fs.mkdirSync(universe.universesFilePath+"/"+universe.id, { recursive: true })
      }catch(e){
        //console.error(e);
      }
      fs.writeFile(universe.universesFilePath+"/"+universe.id+"/players.json", JSON.stringify(universe.players), err =>{
        if(err){
          console.error("Couldn't wite file "+universe.universesFilePath+"/"+universe.id+"/players.json\n"+err);
        }
      })
      fs.writeFile(universe.universesFilePath+"/"+universe.id+"/maps.json", JSON.stringify(universe.maps), err =>{
        if(err){
          console.error("Couldn't wite file "+universe.universesFilePath+"/"+universe.id+"/maps.json\n"+err);
        }
      })
    }else{
      console.error("This universe doesn't exist.");
    }
  }

  /**
   * @param interactions - List of all the interactions to display
   * @returns a human friendly text that lists the interactions to the player
   */
  generateInteractionsListString(interactions){
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
  resolveNamable(itemName, itemList){
    let findItem = function(evaluatedItem){
      if(evaluatedItem && evaluatedItem.name){
        var name = evaluateName(evaluatedItem.name, itemName)
        if(evaluatedItem.name === name){
          return evaluatedItem
        }
      } else {
        console.error(`You\'re trying to evaluate a non-namable object, check that the property name on all your objects is a Name class in `)
        console.error(evaluatedItem)
      }
      return false
    }
    let item = itemList.find(findItem)
    return item
  }

  /**
   * Make a human friendly string describing who's around.
   * @param nearbyPlayers - List of all the players you want to list
   * @returns a string with a desciption of nearby players.
   */
  generateWhoString(nearbyPlayers){
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
}

module.exports = Utils

},{"fs":1}],19:[function(require,module,exports){
/**
 * @class
 * A WorldAction for something.
 */
class WorldAction {
  /**
   * @constructor
   * Creates a WorldAction, type is optionnal, but it won't do anything if it's invalid.
   * @param {!string} description - WorldAction description
   * @param {?string} type - WorldAction type, death teleportation lock or unlock
   */
  constructor (description, type) {
    this.description = description
    this.type = type
  }
}
module.exports = WorldAction

},{}],20:[function(require,module,exports){
/**
 * @class
 * A place.
 */
class WorldMap {
  /**
   * @constructor
   * Creates a WorldMap
   * @param {!Name} name - name of the map
   * @param {!string} description - description of the map
   * @param {?Direction[]} directions - the directions you can take
   * @param {?Interaction[]} interactions - the interactions you can do
   * @param {?Item[]} userItems - the items users can drop
   */
  constructor (name, description, directions, interactions, userItems) {
    this.description = description
    this.name = name
    if(directions==undefined){
        this.directions = new Array()
    } else {
      this.directions = directions
    }
    if(interactions==undefined){
        this.interactions = new Array()
    } else {
      this.interactions = interactions
    }
    if(userItems==undefined){
      this.userItems = new Array()
    }else{
      this.userItems = userItems;
    }
  }
}
module.exports = WorldMap

},{}],21:[function(require,module,exports){
const Classes = require('../../classes/Classes.js')
var document;
function generateItem(htmlItem){
  //TODO
}
function generateInteraction(htmlInteraction){
  //TODO
}
function generateDirection(htmlDirection){
  return new Classes.Direction(
    generateName(htmlDirection.getElementsByName('name')),
    htmlDirection.getElementsByName('description')[0].getTextContent(),
    htmlDirection.getElementsByName('targetMap')[0].value()
  );
}
function generateItems(htmlItems){
  let items = new Array();
  htmlItems.forEach(htmlItem =>{
    items.push(generateItem(htmlItem));
  })
  return items;
}
function generateInteractions(htmlInteractions){
  let interactions = new Array();
  htmlInteractions.forEach(htmlInteraction => {
    interactions.push(generateInteraction(htmlInteraction));
  })
  return interactions;
}
function generateDirections(htmlDirections){
  let directions = new Array();
  htmlDirections.forEach(htmlDirection => {
    directions.push(generateDirection(htmlDirection));
  })
  return directions;
}

function generateAliases(htmlAliases){
  let aliases = new Array();
  htmlAliases.getElementsByName('alias').forEach(alias => {
    aliases.push(alias.getTextContent());
  })
  return aliases;
}

function generateName(htmlName){
  //TODO generate Aliases and load the text value for name
  return new Classes.Name(
    htmlName.getElementByName('name')[0].getTextContent(),
    generateAliases(htmlName.getElementsByName('aliases')[0])
  );
}

function generateMap(htmlMap){
  return new Classes.WorldMap(
    generateName(htmlMap.elements[0]),
    htmlMap.getElementsByName('description')[0].getTextContent(),
    generateDirections(htmlMap.getElementsByName('direction')),
    generateInteractions(htmlMap.getElementsByName('interaction')),
    generateItems(htmlMap.getElementsByName('item'))
  );
}
function generateMaps(){
  let htmlMaps = document.getElementsByName('map'); //get all elements of the map name
  let maps = new Array();
  htmlMaps.forEach(htmlMap=>{ //For each HTML Element
    if(htmlMap.elements.length < 1){
      alert('Fieldset map not correctly initialized.');
    }else{
      maps.push(generateMap(htmlMap)); //Add the JS element to the list
    }
  })
  return maps;
}
function generateWorld(myDocument){
  document = myDocument;
  document.getElementById('result').innerHTML = JSON.stringify(generateMaps()); //put result in field
}
module.exports = {generateWorld: generateWorld};

},{"../../classes/Classes.js":3}]},{},[21])(21)
});
