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
