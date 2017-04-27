'use strict';

var exports = module.exports;

exports.convertDepartmentToDepartmentJSON = function (department) {

    let departmentJSON = department.toJSON();

    let departmentObj = {
        id: departmentJSON.id,
        name: departmentJSON.name,

    };

    return departmentObj;

};
