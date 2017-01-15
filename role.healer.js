var roleHealer = {

    // The goal of the healer is to get in a target room and heal the closest target!

    run : function(creep){

        // go to the room"

        if (creep.room.name != creep.memory.target){
            let exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }

        // when in the room

        else {

            // let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter : (s) => s.structureType == STRUCTURE_TOWER });
            let target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (c) => c.hits < c.hitsMax});

            if(target != null) {
                if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else{
                    creep.heal(target);
                }
            }
        }
    }
};

module.exports = roleHealer; 