'use strict';

var app = require('./server');
var ds = app.dataSources.Loopback;
var members = require('./data/members');
var groups = require('./data/groups');
var departments = require('./data/departments');
var memberService = require('../server/services/member-service');
var departmentService = require('../server/services/department-service');
var groupService = require('../server/services/group-service');


var async = require('async');

function setupGroups(callback) {

    groupService.createGroups(groups,callback)

}

function setupDepartments(callback) {

    departmentService.createDepartments(departments,callback)

}

function setupMembers(callback) {

    memberService.createMembers(members,callback)

}

function convertObjectsToMaps(objs) {

    let map = new Map();
    objs.forEach(function (obj) {
        map.set(obj.name, obj.id);
    });

    return map;
}

function setupMembersWithGroups(members,groups,callback) {

    let memberMaps = convertObjectsToMaps(members);
    let groupMaps = convertObjectsToMaps(groups);
    let grpPerPairs = [];

    groups.forEach(function (group) {

        let groupName = persGroups.getGroup(group.name);
        let groupId = groupMaps.get(groupName);

        if (!groupId) return;

        grpPerPairs.push({
            memberId: perId,
            groupId: groupId

        });

    });

    groupService.setupGroupPermission(grpPerPairs, function (err) {
        callback(err);
    });

}

ds.automigrate(function (err) {
    if (err) {
        console.error('ERROR : %s', err.message);
        process.exit(0);
    }

    async.waterfall([
        function ( next) {
            setupGroups(function (err, group) {
                next(err, group);
            });
        },

        function (group, next) {
            setupMembers(function (err, member) {
                next(err, member , group );
            });
        },

        function (member ,group ,next) {
            setupDepartments(function (err, department) {
                next(err, department);
            });
        }

    ], function (err) {

        if (err) {
            console.error('ERROR : %s', err.message);
        }

        process.exit(0);
    });

});
