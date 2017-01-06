var roleHarvester = {
    // a function to run the logic for this role
    run: function(creep) {
        
        //To reallocate a harvester to another room
        if(creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
            return;
        }


        // if creep is bringing energy to the spawn or an extension but has no energy left
        if (creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the spawn or an extension
        if (creep.memory.working == true) {
            let sourceTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
            })
            let targets = sourceTargets;
            if(sourceTargets.length == 0) {

                let storageTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => (i.structureType == STRUCTURE_STORAGE && _.sum(i.store) < i.storeCapacity)
                });

                targets = sourceTargets.concat(storageTargets);
            }

            if(targets.length > 0) {
                
                let closestTarget = creep.pos.findClosestByPath(targets);
                if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget);
                }
            } 

            else {
                let spawn = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN)
                })[0];
                if (!creep.pos.isEqualTo(spawn.pos)){
                    creep.moveTo(spawn);
                }
            }
        }
        
        // if creep is supposed to harvest
        else if (creep.memory.working == false) {

            let storageTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => (i.structureType == STRUCTURE_CONTAINER && _.sum(i.store) > 0)
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
                let sources = creep.room.find(FIND_SOURCES);
                let closestSource = creep.pos.findClosestByPath(sources);

                if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource);
                }
            }
            
        }    
    }
};

module.exports = roleHarvester;