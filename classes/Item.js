/**
 * @class
 * A Item for something.
 */
class Item {
  /**
   * @constructor
   * Creates a Item
   * @param {!Name} name - name
   * @param {!string} description - Item description
   * @param {!WorldAction[]} consequences - consequences of using the item
   */
  constructor (name, description, consequences) {
    this.name = name
    this.description = description
    if(consequences == undefined){
      this.consequences = new Array()
    } else {
      this.consequences = consequences
    }
  }
}
module.exports = Item
