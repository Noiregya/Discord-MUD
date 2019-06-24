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
  constructor (name, inventory) {
    this.name = name
    this.inventory = new Inventory()
    this.activeQuests = new Array()
  }
}
module.exports = Player
