'use strict';

var app = require('./server');
var ds = app.dataSources.Loopback;
var memberJSON = require('./data/members');
var groupJSON = require('./data/groups');
var departmentJSON = require('./data/departments');
var async = require('async');
let where = {
    id: 1
};

let includeGroups = {
    relation: 'groups'
};

let includeDepartments = {
    relation: 'departments'
};

let filter = {
    where: where,
    include: [includeGroups, includeDepartments]
};


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

function createGroups(callback) {

    app.models.Group.create(groupJSON.groups,callback)
    
}

function findMem(callback){
    app.models.Member.find(filter, callback)
}

function Mem(callback){
    
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
            createMembers(function(err){
                next(err)
            })
            
        },
        function (next){
            createGroups(function(err,group){
                next(err,group)
            })
            
        },
        function (group,next){
            findMem(function(err,mem){
                mem[0].groups.add(group[0].id)
                mem[0].groups.add(group[1].id)
                mem[0].groups.add(group[3].id)
                next(err)
            })
            
        },
        function (next){
            findMem(function(err,mem){
                console.log(mem)

                next(err,mem)
            })
            
        },
        function (mem,next){
            mem[0].groups.findById(1,function(err,gr){
                    console.log('avv',gr)
            })
        }
        
    ], function (err) {

        if (err) {
            console.error('ERROR : %s', err.message);
        }

        process.exit(0);
    });

});
