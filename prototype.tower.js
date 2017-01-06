module.exports = function() {

	// create a new function for StructureTower
	StructureTower.prototype.spendEnergy = function () {

	  // find closest hostile creep
	  let enemyTarget = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	 	// if one is found...
	 	if (enemyTarget != undefined) {
	    // ...FIRE!
	    this.attack(enemyTarget);
	  }
	  // if no enemy is found
	  else{
	   	// find closest hurt allied creep
	   	alliedTarget = this.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
	   	// if one is found...
	   	if (alliedTarget != undefined) {
	   		//...HEAL!
	   		this.heal(alliedTarget);
	   	}
	   	// if no available target for either attack or heal is found
	   	else{
	   		// find closest structure to repair
	   		repairTarget = this.room.find(FIND_STRUCTURES, {filter: s => s.hits < Math.min(150000, s.hitsMax)});
	   		// if one is found...
	   		if (repairTarget.length) {
	   			//...REPAIR!
	   			this.repair(repairTarget[0]);
	   		}
	   	}
	  }
	}
}