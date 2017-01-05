var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

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
        } 

        else{
            var storageTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => ((i.structureType == STRUCTURE_STORAGE) && _.sum(i.store) > 0)
                });

            if(storageTargets.length){
                if(creep.withdraw(storageTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storageTargets[0]);
                }
                else{
                    creep.withdraw(storageTargets[0], RESOURCE_ENERGY);
                }
            } 
        }
    }
};

module.exports = roleUpgrader;