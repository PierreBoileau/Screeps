require('prototype.spawn')();

var utilities = require('utilities');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleClaimer = require('role.claimer');

module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');

    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;

    if(miners.length < 2) {
        var newName = Game.spawns.Spawn1.createCustomCreep(energy, 'miner');
    } else if(harvesters.length < 3) {
        var newName = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
    //} else if(Game.spawns.Spawn1.memory.claimRoom != undefined){
    //    var newName = Game.spawns['Spawn1'].createClaimer(Game.spawns.Spawn1.memory.claimRoom);
    //    if(!(newName < 0)) {
    //        delete Game.spawns.Spawn1.memory.claimRoom;
    //    }
    } else if(builders.length < 2) {
        var newName = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
    } else if(upgraders.length < 2) {
        var newName = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep, miners);
        } else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, miners);
        } else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep, miners);
        } else if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        } else if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }
    
    var towers = Game.rooms.W71N21.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (let tower of towers){
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        }
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}