'use strict';
 
module.exports = function (member) {

    member.findByMemberId = function (memberId, callback) {

        let where = {
            id: memberId
        };

        let includeGroups = {
            relation: 'group'
        };

        let includeDepartments = {
            relation: 'derpartment'
        };

        let filter = {
            where: where,
            include: [includeGroups, includeDepartments]
        };

        member.findOne(filter, function (err, member) {

            if (err) {
                return callback(err);
            }

            if (!member) {
                return callback('err');
            }

            callback(null, member);
        });
    }
};
