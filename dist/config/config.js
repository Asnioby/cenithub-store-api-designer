'use strict';

angular.module('storeapi', [])
    .constant('API', {
        'url': 'http://localhost:3001',
        'resource': '/api/v1/raml/file',
        'header': {
            'key': '',
            'token': ''
        }
    });