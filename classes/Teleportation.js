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
   * @param {!int} map - place to send the player
   * @param {!Player} player - Player to teleport
   */
  constructor (description, map, player) {
    super(description, 'teleportation')
    this.player = player
    this.map = map
  }
}
module.exports = Teleportation
