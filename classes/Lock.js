const WorldAction = require('./WorldAction.js')
/**
 * @class
 * A n action you can do only with a specific pass.
 */
class Lock extends WorldAction {
  /**
   * @constructor
   * An action you can do only if you have a specific pass
   * @param {!string} successDescription - Success description
   * @param {!string} failureDescription - Failure description, accessed with this.description
   * @param {!string} pass - Pass needed for the player do the action
   * @param {!WorldAction[]} consequences - What happens after success
   */
  constructor (successDescription, failureDescription, pass, consequences) {
    super(failureDescription, 'lock')
    this.successDescription = successDescription
    this.pass = pass
    this.consequences = consequences
  }
}
module.exports = Lock
