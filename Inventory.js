/**
 * @class
 * A Inventory for something.
 */
class Inventory {
  /**
   * @constructor
   * Creates a Inventory
   * @param {?Item[]} items - Real Inventory
   * @param {?var} gold - amount of gold
   */
  constructor (items, gold) {
    if(items == undefined){
      this.items = new Array()
    } else {
      this.items = items
    }
    if(gold == undefined){
      this.gold = 0
    } else {
      this.gold = gold
    }
  }
}
module.exports = Inventory
