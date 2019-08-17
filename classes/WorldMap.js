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
   * @param {?Item[]} userItems - the items users can drop
   */
  constructor (name, description, directions, interactions, userItems) {
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
    if(userItems==undefined){
      this.userItems = new Array()
    }else{
      this.userItems = userItems;
    }
  }
}
module.exports = WorldMap
