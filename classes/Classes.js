const Player = require('./Player.js')
const Name = require('./Name.js')
const Inventory = require('./Inventory.js')
const Item = require('./Item.js')
const WorldAction = require('./WorldAction.js')
const Teleportation = require('./Teleportation.js')
const Death = require('./Death.js')
const Unlock = require('./Unlock.js')
const Lock = require('./Lock.js')
const Interaction = require('./Interaction.js')
const Activable = require('./Activable.js')
const Grabbable = require('./Grabbable.js')
const WorldMap = require('./WorldMap.js')
const Direction = require('./Direction.js')
const Quest = require('./Quest.js')


module.exports = {
  Player: Player,
  Inventory: Inventory,
  Name: Name,
  Item: Item,
  WorldAction: WorldAction,
  Teleportation: Teleportation,
  Death: Death,
  Unlock: Unlock,
  Lock: Lock,
  WorldMap: WorldMap,
  Interaction: Interaction,
  Activable: Activable,
  Grabbable: Grabbable,
  Direction: Direction,
  Quest: Quest
}
