'use strict';

var app = require('./server');
var ds = app.dataSources.Loopback;
var members = require('./data/members');
var memberService = require('../server/services/member-service');
var groupService = require('../server/services/group-service');


var async = require('async');

ds.automigrate(function (err) {
    if (err) {
        console.error('ERROR : %s', err.message);
        process.exit(0);
    }

    async.waterfall([
    
        function (next) {
            memberService.createMembers(members,function (err, member) {
                next(err, member);
            });
        }

    ], function (err) {

        if (err) {
            console.error('ERROR : %s', err.message);
        }

        process.exit(0);
    });

});
