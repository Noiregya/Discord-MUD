const WorldAction = require('./WorldAction.js')
/**
 * @class
 * A Death.
 */
class Death extends WorldAction {
  /**
   * @constructor
   * Creates a Death
   * @param {!string} player - player to kill
   */
  constructor (description, player) {
    super(description, 'death')
    this.player = player
  }
}
module.exports = {
  Death: Death
}
