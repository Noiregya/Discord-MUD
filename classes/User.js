/**
 * @class
 * A humain user.
 */
class User {
  /**
   * @constructor
   * Creates a User
   * @param {!id} id - ID of the User
   * @param {!lastGuild} lastGuild - Last guild the user was seen in
   */
  constructor (id, lastGuild) {
    this.id = id
    this.lastGuild = lastGuild
  }

}
module.exports = User
