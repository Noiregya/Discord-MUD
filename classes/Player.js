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
