const Interaction = require('./Interaction.js')
/**
 * @class
 * A activable interaction in a map.
 */
class Activable extends Interaction{
  /**
   * @constructor
   * Creates a Activable
   * @param {!Name} name - name of the Activable
   * @param {!string} description - description of the Activable
   * @param {!WorldAction[]} consequences - What to do
   */
  constructor (name, description, consequences) {
    super(name, description, 'activable')
    this.consequences = consequences
  }
}
module.exports = Activable
