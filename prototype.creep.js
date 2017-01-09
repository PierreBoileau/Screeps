module.exports = function() {

	var roles = {
    builder: require('role.builder'),
    claimer: require('role.claimer'),
    harvester: require('role.harvester'),
    hauler: require('role.hauler'),
    lightUpgrader: require('role.lightUpgrader'), 
    longDistanceMiner: require('role.longDistanceMiner'),
    miner: require('role.miner'),
    multiRoomHauler: require('role.multiRoomHauler'),
    reserver: require('role.reserver'),
    upgrader: require('role.upgrader'),
    soldier: require('role.soldier'),
  };

  Creep.prototype.runRole = function () {
    roles[this.memory.role].run(this);
  }

  /** @function
      @param **/
  Creep.prototype.repairRoadYouTravelOnIfNecessary = function () {
    let targetRoads = this.pos.findInRange(FIND_STRUCTURES, 0, {filter: s => s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax});
    if(targetRoads.length>0){
      this.repair(targetRoads[0]);
    }
  }


  /** @function 
      @param {bool} useContainer
      @param {bool} useStorage
      @param {bool} useSource
      @param {int} priority */
  Creep.prototype.getEnergy = function (useContainer, useStorage, useSource, priority) {
    /** @type {StructureContainer} */
    let container;
    // if the Creep should look for containers and storages
    if (useContainer && useStorage) {
      // find closest container
      container = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > priority * 100 });
      // if one was found
      if (container != undefined) {
        // try to withdraw energy, if the container is not in range
        if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards it
          this.moveTo(container);
        }
        // when in range, withdraw
        else {
          this.withdraw(container, RESOURCE_ENERGY);
        }
      }  
    }
    // if the Creep should only look for containers
    else if (useContainer && !useStorage) {
      // find closest container
      container = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => (s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0 });
      // if one was found
      if (container != undefined) {
        // try to withdraw energy, if the container is not in range
        if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards it
          this.moveTo(container);
        }
        // when in range, withdraw
        else {
          this.withdraw(container, RESOURCE_ENERGY);
        }
      }
    }
    // if the Creep should only look for storages
    else if (!useContainer && useStorage) {
      // find closest container
      container = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => (s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0 });
      // if one was found
      if (container != undefined) {
        // try to withdraw energy, if the container is not in range
        if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards it
          this.moveTo(container);
        }
        // when in range, withdraw
        else {
          this.withdraw(container, RESOURCE_ENERGY);
        }
      }
    }
    // if no container was found and the Creep should look for Sources
    if (container == undefined && useSource) {
      // find closest source
      var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      // try to harvest energy, if the source is not in range
      if (this.harvest(source) == ERR_NOT_IN_RANGE) {
        // move towards it
        this.moveTo(source);
      }
      else {
        this.harvest(source);
      }
    }
  }
}