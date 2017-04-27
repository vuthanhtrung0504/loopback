'use strict';

var exports = module.exports;
var app = require('../server');
var async = require('async');
var transactionHelper = require('../libs/transaction-helper');

exports.createDepartment = function (department, options, callback) {

    var isInitTransaction = false;

    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    async.waterfall([
        function (next) {
            transactionHelper.beginTransaction(app.models.department, options, function (err, tx, isInit) {
                if (err) return next(err);
                isInitTransaction = isInit;
                next(null);
            });
        },
        function (next) {
            app.models.department.create(department, options, function (err, instance) {
                instance.forEach(function (mem) {
                    console.log(mem.name.getIdName())
                });
                
                next(err, instance);
            });
        },
        function (instance, next) {
            transactionHelper.commit(options.transaction, isInitTransaction, next);
        }
    ], function (err, instance) {

        if (!err) return callback(null, instance);

        console.error('ERROR : %s', err);

        transactionHelper.rollback(options.transaction, isInitTransaction, function () {
            callback(err, instance);
        });

    });
};

var createDepartments = function (departments, options, callback) {

    let departmentObjs = [];

    async.eachSeries(departments, function (department, next) {
        exports.createDepartment(department, options, function (err, instance) {
            if (err || !instance) return next(err, instance);
            departmentObjs.push(instance);
            next(null, instance);
        });

    }, function (err) {
        callback(err, departmentObjs);
    });

};

exports.createDepartments = function (departments, options, callback) {

    var isInitTransaction = false;

    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    async.waterfall([
        function (next) {
            transactionHelper.beginTransaction(app.models.department, options, function (err, tx, isInit) {
                if (err) return next(err);
                isInitTransaction = isInit;
                next(null);
            });
        },
        function (next) {
            createDepartments(departments, options, next);
        },
        function (departmentObjs, next) {
            transactionHelper.commit(options.transaction, isInitTransaction, function (err) {
                next(err, departmentObjs);
            });
        }],
        function (err, departmentObjs) {
            if (!err) return callback(null, departmentObjs);
            
            transactionHelper.rollback(options.transaction, isInitTransaction, function () {
                callback(err, departmentObjs);
            });
        });
};

exports.getDepartmentByName = function (departmentName, callback) {

    app.models.department.findByDepartmentName(departmentName, function (err, departmentObj) {

        if (err) return callback(err);

        callback(null, departmentObj);

    });

};