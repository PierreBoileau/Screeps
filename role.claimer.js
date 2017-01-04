var roleClaimer = {

    // The goal of the claimer is to get in a target room and claim the controller

    run : function(creep){

        // go to the room"

        if (creep.room.name != creep.memory.target){
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }

        // when in the room

        else {

            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleClaimer; 