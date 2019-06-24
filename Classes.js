const Player = require('./Player.js')
const Name = require('./Name.js')
const Inventory = require('./Inventory.js')
const Item = require('./Item.js')
const WorldAction = require('./WorldAction.js')
const Teleportation = require('./Teleportation.js')
const Death = require('./Death.js')
const Unlock = require('./Unlock.js')

module.exports = {
  Player: Player,
  Inventory: Inventory,
  Name: Name,
  Item: Item,
  WorldAction: WorldAction,
  Teleportation: Teleportation,
  Death: Death,
  Unlock: Unlock
}
