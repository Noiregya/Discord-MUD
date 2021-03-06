/**
 * @class
 * A WorldAction for something.
 */
class WorldAction {
  /**
   * @constructor
   * Creates a WorldAction, type is optionnal, but it won't do anything if it's invalid.
   * @param {!string} description - WorldAction description
   * @param {?string} type - WorldAction type, death teleportation lock or unlock
   */
  constructor (description, type) {
    this.description = description
    this.type = type
  }
}
module.exports = WorldAction
