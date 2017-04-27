'use strict';

var memberService = require('../services/member-service');
var memberConverter = require('../converters/member-converter');

module.exports = function (app) {
    var router = app.loopback.Router();
    
    router.get('/', function (req, res) {
        res.status(200).send({ message : 'pong' });
    });

    router.get('/:id', function (req, res) {

        var memberId = req.params.id;

        if ( !memberId ) {

            return res.status(403).send( err );
        }

        memberService.getMemberById( memberId, function (err, userObj) {

            if (err) {
                
                return res.status(403).send( err );
            }

            return res.status(200).send( memberConverter.convertMemberToMemberJSON( userObj ));

        });
    });

    return router;
};
