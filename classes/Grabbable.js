const Interaction = require('./Interaction.js') 
/**
 * @class
 * A grabbable interaction in a map.
 */
class Grabbable extends Interaction{
  /**
   * @constructor
   * Creates a Grabbable
   * @param {!Name} name - name of the Grabbable
   * @param {!string} description - description of the Grabbable
   * @param {!Item[]} items - Items to grab
   */
  constructor (name, description, items) {
    super(name, description, 'grabbable')
    this.items = items
  }
}
module.exports = Grabbable
