var utilities = {

    sortBestMinerForCreep: function(array, creep) {
        return array.sort(function (a, b) {
            var pathToA = creep.pos.findPathTo(a);
            var pathToB = creep.pos.findPathTo(b);

            lengthToA = a.carry.energy * 2 - pathToA.length ;
            lengthToB = b.carry.energy * 2 - pathToB.length ;

            return (lengthToB - lengthToA);
        });
    }

};

module.exports = utilities;