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
