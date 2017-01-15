var roleLongDistanceMiner = {

    // The goal of the longDistanceMiner is to harvest in another zone. For this, he has a target, aims for the target zone, create a container and mine into the container.

    run : function(creep){

        // go to the room"

        if (creep.room.name != creep.memory.target){
            let exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }

        // when in the room

        else {

            //Check si il ya des containers à fabriquer, réparer
            var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            var damagedStructures = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ( structure.hits < structure.hitsMax &&
                    structure.structureType == STRUCTURE_CONTAINER);
                }
            })
            var buildAndRepairTargets = constructionSites.concat(damagedStructures);

            var source = Game.getObjectById(creep.memory.sourceId);
            let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            });

            if(containers.length){
                var container = containers[0];
                if (!creep.pos.isEqualTo(container.pos)) {
                    // harvest source
                    creep.moveTo(container);
                }

                // if creep is not on top of the container
                else {
                    // move towards it
                    creep.harvest(source);
                }

                
                if(containers[0].hits < containers[0].hitsMax){
                    creep.repair(containers[0]);
                }
            }

            else {
                //Move to the source
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }

                //How to get energy
                else if(creep.carry.energy < creep.carryCapacity) {
                    creep.harvest(source);
                }

                //Si il y a des trucs à fabriquer/réparer
                else if(buildAndRepairTargets.length) {
                    let target = buildAndRepairTargets[0];
                    var error = creep.build(target);
                    if(error == ERR_INVALID_TARGET) {
                        error = creep.repair(target);
                    }
                    if(error == ERR_NOT_IN_RANGE){
                        creep.harvest(source);
                    }
                }

                else{
                    creep.harvest(source);
                }
            }

            
        }
    }
};

module.exports = roleLongDistanceMiner; 