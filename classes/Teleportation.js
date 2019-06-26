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
   * @param {!Player} player - Player to teleport
   * @param {!Map} map - place to send the player
   */
  constructor (description, player, map) {
    super(description, 'teleportation')
    this.player = player
    this.map = map
  }
}
module.exports = Teleportation
