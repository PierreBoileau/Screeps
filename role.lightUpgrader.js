var roleLightUpgrader = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            var storageTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => ((i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && _.sum(i.store) > 0)
                });

            if(storageTargets.length){
                if(creep.withdraw(storageTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storageTargets[0]);
                }
                else{
                    creep.withdraw(storageTargets[0], RESOURCE_ENERGY);
                }
            }

            else {
                if(creep.carry.energy < creep.carryCapacity) {
                    var sources = creep.room.find(FIND_SOURCES);
                    var closestSource = creep.pos.findClosestByPath(sources);

                    if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSource);
                    }
                }
            }
        }
    }
};

module.exports = roleLightUpgrader;