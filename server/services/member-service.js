'use strict';

var exports = module.exports;
var app = require('../server');
var async = require('async');
var transactionHelper = require('../libs/transaction-helper');

exports.createMember = function (member, options, callback) {

    var isInitTransaction = false;

    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    async.waterfall([
        function (next) {
            transactionHelper.beginTransaction(app.models.member, options, function (err, tx, isInit) {
                if (err) return next(err);
                isInitTransaction = isInit;
                next(null);
            });
        },
        function (next) {
            app.models.member.create(member, options, function (err, instance) {
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

var createMembers = function (members, options, callback) {

    let memberObjs = [];

    async.eachSeries(members, function (member, next) {
        exports.createMember(member, options, function (err, instance) {
            if (err || !instance) return next(err, instance);
            memberObjs.push(instance);
            next(null, instance);
        });

    }, function (err) {
        callback(err, memberObjs);
    });

};

exports.createMembers = function (members, options, callback) {

    var isInitTransaction = false;

    if (typeof options == 'function') {
        callback = options;
        options = {};
    }

    async.waterfall([
        function (next) {
            transactionHelper.beginTransaction(app.models.member, options, function (err, tx, isInit) {
                if (err) return next(err);
                isInitTransaction = isInit;
                next(null);
            });
        },
        function (next) {
            createMembers(members, options, next);
        },
        function (memberObjs, next) {
            transactionHelper.commit(options.transaction, isInitTransaction, function (err) {
                next(err, memberObjs);
            });
        }],
        function (err, memberObjs) {
            if (!err) return callback(null, memberObjs);
            
            transactionHelper.rollback(options.transaction, isInitTransaction, function () {
                callback(err, memberObjs);
            });
        });
};

exports.getMemberById = function (memberId, callback) {
    app.models.member.findByMemberId(memberId, callback)
};
