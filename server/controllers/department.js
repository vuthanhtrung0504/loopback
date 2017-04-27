'use strict';

var departmentService = require('../services/department-service');
var departmentConverter = require('../converters/department-converter');

module.exports = function (app) {
    var router = app.loopback.Router();
    
    router.get('/', function (req, res) {
        res.status(200).send({ message : 'pong' });
    });

    router.get('/:id', function (req, res) {

        var departmentName = req.params.id;

        if ( !departmentName ) {

            return res.status(403).send( err );
        }

        departmentService.getDepartmentByName( departmentName, function (err, userObj) {

            if (err) {
                
                return res.status(403).send( err );
            }

            return res.status(200).send( departmentConverter.convertDepartmentToDepartmentJSON( userObj ));

        });
    });

    return router;
};
