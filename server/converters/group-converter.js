'use strict';

var exports = module.exports;

exports.convertGroupToGroupJSON = function (group) {

    let groupJSON = group.toJSON();

    let groupObj = {
        id: groupJSON.id,
        username: groupJSON.username,

    };

    return groupObj;

};
