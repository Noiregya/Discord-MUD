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
  constructor (id, name) {
    this.id = id
    this.name = name
    this.inventory = new Inventory()
    this.activeQuests = new Array()
    this.passes = new Array()
  }
}
module.exports = Player
