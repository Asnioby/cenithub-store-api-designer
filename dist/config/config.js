'use strict';

angular.module('storeapi', [])
    .constant('API', {
        'url': 'https://www.cenithub.com',
        'resource': '/api/v1/raml/file',
        'header': {
            'key': '',
            'token': ''
        }
    });
