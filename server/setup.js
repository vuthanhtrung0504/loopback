'use strict';

var app = require('./server');
var ds = app.dataSources.Loopback;
var memberJSON = require('./data/members');
var groupJSON = require('./data/groups');
var departmentJSON = require('./data/departments');
var async = require('async');


function createDepartments(callback) {

    app.models.Department.create(departmentJSON.departments,callback)

}

function setupDeptMembers(departments) {
    for (let member of memberJSON.members){
        for(let dept of departments ){
            if(dept.name === member.department){
                member.departmentId = dept.id
            }
        }              
    }
}

function createMembers(callback) {

    app.models.Member.create(memberJSON.members,callback)
    
}

ds.automigrate(function (err) {
    if (err) {
        console.error('ERROR : %s', err.message);
        process.exit(0);
    }

    async.waterfall([
        function (next) {
            createDepartments(function (err, departments){
                next(err,departments)
            })
        },
        function (departments,next){
            setupDeptMembers(departments)
            next()            
        },
        function (next){
            console.log('member2',memberJSON.members)
            createMembers(function(err){
                next(err)
            })
            
        }
        
    ], function (err) {

        if (err) {
            console.error('ERROR : %s', err.message);
        }

        process.exit(0);
    });

});
