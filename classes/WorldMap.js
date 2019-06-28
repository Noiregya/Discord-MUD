/**
 * @class
 * A place.
 */
class WorldMap {
  /**
   * @constructor
   * Creates a WorldMap
   * @param {!Name} name - name of the map
   * @param {!string} description - description of the map
   * @param {?Direction[]} directions - the directions you can take
   * @param {?Interaction[]} interactions - the interactions you can do
   */
  constructor (name, description, directions, interactions) {
    this.description = description
    this.name = name
    if(directions==undefined){
        this.directions = new Array()
    } else {
      this.directions = directions
    }
    if(interactions==undefined){
        this.interactions = new Array()
    } else {
      this.interactions = interactions
    }
    this.userItems = new Array() //List of items users can drop, dissapear when the bot is rebooted.
  }
}
module.exports = WorldMap
