/**
 * @class
 * A direction to a map.
 */
class Direction {
  /**
   * @constructor
   * Creates a Direction
   * @param {!Name} name - name of the Direction
   * @param {!string} description - description of the Direction
   * @param {!Integer} mapIndex - the place index it leads to
   */
  constructor (name, description, mapIndex) {
    this.description = description
    this.name = name
    this.mapIndex = mapIndex
  }
}
module.exports = Direction
