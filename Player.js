/**
 * @class
 * A humain player.
 */
class Player {
  /**
   * @constructor
   * Creates a Player
   * @param {!Name} name - Name of the Player
   * @param {!Inventory} inventory - An existing bag to give the player
   */
  constructor (name, inventory) {
    this.name = name
    this.inventory = inventory
  }
}
module.exports = {
  Player: Player
}
