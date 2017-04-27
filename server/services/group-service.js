'use strict';

var exports = module.exports;
var app = require('../server');
var async = require('async');
var transactionHelper = require('../libs/transaction-helper');

exports.createGroup = function (group, options, callback) {

    var isInitTransaction = false;

    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    async.waterfall([
        function (next) {
            transactionHelper.beginTransaction(app.models.group, options, function (err, tx, isInit) {
                if (err) return next(err);
                isInitTransaction = isInit;
                next(null);
            });
        },
        function (next) {
            app.models.group.create(group, options, function (err, instance) {
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

var createGroups = function (groups, options, callback) {

    let groupObjs = [];

    async.eachSeries(groups, function (group, next) {
        exports.createGroup(group, options, function (err, instance) {
            if (err || !instance) return next(err, instance);
            groupObjs.push(instance);
            next(null, instance);
        });

    }, function (err) {
        callback(err, groupObjs);
    });

};

exports.createGroups = function (groups, options, callback) {

    var isInitTransaction = false;

    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    async.waterfall([
        function (next) {
            transactionHelper.beginTransaction(app.models.group, options, function (err, tx, isInit) {
                if (err) return next(err);
                isInitTransaction = isInit;
                next(null);
            });
        },
        function (next) {
            createGroups(groups, options, next);
        },
        function (groupObjs, next) {
            transactionHelper.commit(options.transaction, isInitTransaction, function (err) {
                next(err, groupObjs);
            });
        }],
        function (err, groupObjs) {
            if (!err) return callback(null, groupObjs);
            
            transactionHelper.rollback(options.transaction, isInitTransaction, function () {
                callback(err, groupObjs);
            });
        });
};

exports.setupMemberGroup = function ( pairs, callback ) {
    app.models.group.create( pairs, function (err, pairs ) {

        if ( err ) {
            console.error('ERROR : %s', err );
        }

        callback( err, pairs);

    });
};