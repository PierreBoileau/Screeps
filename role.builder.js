var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //To reallocate a builder to another room
        if(creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
            return;
        }

        //Working part of the builder

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.buildingTargetId = 'None';

        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        //How the builder works
        if(creep.memory.building) {
            if (creep.memory.buildingTargetId = 'None') {
                var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);

                var damagedStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ( structure.hits < structure.hitsMax &&
                        ((structure.structureType == STRUCTURE_WALL && structure.hits < 100000) ||
                        (structure.structureType != STRUCTURE_WALL)));
                    }
                })
                targets = constructionSites.concat(damagedStructures);

                if(targets.length) {
                    var closestTarget = creep.pos.findClosestByPath(targets);
                    if (closestTarget != null) {creep.memory.buildingTargetId = closestTarget.id;}
                } else {
                    creep.memory.buildingTargetId = 'None';
                }
            }

            if(creep.memory.buildingTargetId != 'None') {
                var target = Game.getObjectById(creep.memory.buildingTargetId);

                var error = creep.build(target);

                if(error == ERR_INVALID_TARGET) {
                    error = creep.repair(target);
                }
                if(error == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                let spawn = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN)
                })[0];
                if (!creep.pos.isEqualTo(spawn.pos)){
                    creep.moveTo(spawn);
                }
            }
        }

        //How the builder gets energy
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

module.exports = roleBuilder;