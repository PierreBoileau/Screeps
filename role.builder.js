var roleLightUpgrader = require('role.lightUpgrader');

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

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.buildingTargetId = 'None';

        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        //How the builder works
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // if one is found
            if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite);
                }
            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
                roleLightUpgrader.run(creep);
            }
        }
        // if creep is supposed to get energy
        else {
            creep.getEnergy(true, true, true);
        }
    }
};

module.exports = roleBuilder;