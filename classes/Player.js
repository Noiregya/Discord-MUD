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
    this.guild = guild
    this.inventory = new Inventory()
    this.activeQuests = new Array()
    this.passes = new Array()
  }

}
module.exports = Player
