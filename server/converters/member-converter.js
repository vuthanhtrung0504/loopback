'use strict';

var exports = module.exports;

exports.convertMemberToMemberJSON = function (member) {

    let memberJSON = member.toJSON();

    let memberObj = {
        id: memberJSON.id,
        username: memberJSON.username,
        email: memberJSON.email,
        birthday: memberJSON.birthday,
        sex: memberJSON.sex,
        department: memberJSON.department,
    };

    return memberObj;

};
