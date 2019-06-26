/**
 * @class
 * A quest.
 */
class Quest {
  /**
   * @constructor
   * Creates a Quest
   * @param {!Name} name - name of the Quest
   * @param {!string} description - description of the Quest
   * @param {?Item[]} items - the bounty we gain
   */
  constructor (name, description, items) {
    this.description = description
    this.name = name
    this.items = items
  }
}
module.exports = Quest
