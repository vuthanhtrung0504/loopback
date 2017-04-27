'use strict';

var exports = module.exports;

exports.convertGroupToGroupJSON = function (group) {

    let groupJSON = group.toJSON();

    let groupObj = {
        id: groupJSON.id,
        name: groupJSON.name,

    };

    return groupObj;

};
