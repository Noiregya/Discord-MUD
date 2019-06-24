/**
 * @class
 * A Inventory for something.
 */
class Inventory {
  /**
   * @constructor
   * Creates a Inventory
   * @param {!Item[]} items - Real Inventory
   */
  constructor (items) {
    if(items == undefined){
      this.items = new Array()
    } else {
      this.items = items
    }
  }
}
module.exports = {
  Inventory: Inventory
}
