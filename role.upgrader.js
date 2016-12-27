var utilities = require('utilities');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, miners) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.memory.lastBestMinerChoice = 10;
        }

        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.memory.lastBestMinerChoice = 10;
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            var bestMiner = Game.getObjectById(creep.memory.bestMinerId);

            if(creep.memory.lastBestMinerChoice > 3 || bestMiner == null) {
                creep.say('recalculating miner');
                bestMiner = utilities.sortBestMinerForCreep(miners, creep)[0];

                creep.memory.bestMinerId = bestMiner.id;
                creep.memory.lastBestMinerChoice = 0;
            }

            if( bestMiner.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(bestMiner);
            }
            creep.memory.lastBestMinerChoice = creep.memory.lastBestMinerChoice + 1;
        }
    }
};

module.exports = roleUpgrader;