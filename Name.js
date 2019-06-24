/**
 * @class
 * A name for something.
 */
class Name {
  /**
   * @constructor
   * Creates a Name
   * @param {!string} name - Real name
   * @param {?string[]} aliases - Aliases for the name
   */
  constructor (name, aliases) {
    this.name = name
    if(aliases == undefined){
      this.aliases = new Array()
    } else {
      this.aliases = aliases
    }
  }
}
module.exports = {
  Name: Name
}
