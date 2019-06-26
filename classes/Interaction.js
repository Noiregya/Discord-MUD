/**
 * @class
 * An interaction in a map.
 */
class Interaction {
  /**
   * @constructor
   * Creates a Interaction
   * @param {!Name} name - name of the Interaction
   * @param {!string} description - description of the Interaction
   * @param {!string} type - grabbable, activable or nothing
   */
  constructor (name, description, type) {
    this.description = description
    this.name = name
    this.type = type
  }
}
module.exports = Interaction
