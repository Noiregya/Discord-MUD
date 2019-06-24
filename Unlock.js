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
module.exports = {
  Unlock: Unlock
}
