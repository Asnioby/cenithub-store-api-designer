# API Designer

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/mulesoft/api-designer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/mulesoft/api-designer.png)](https://travis-ci.org/mulesoft/api-designer)
[![Dependency Status](https://david-dm.org/mulesoft/api-designer.png)](https://david-dm.org/mulesoft/api-designer#info=dependencies)
[![DevDependency Status](https://david-dm.org/mulesoft/api-designer/dev-status.png)](https://david-dm.org/mulesoft/api-designer#info=devDependencies) [![npm version](https://badge.fury.io/js/api-designer.svg)](https://badge.fury.io/js/api-designer) [![Bower version](https://badge.fury.io/bo/api-designer.svg)](https://badge.fury.io/bo/api-designer)

**API Designer** is a standalone/embeddable editor for [RAML](http://raml.org) (RESTful API Modeling Language) written in JavaScript using Angular.JS. By default, the editor uses an in-browser filesystem stored in HTML5 Localstorage.

## Examples of designing RAML with API Designer in the Wild

* [Remote Medicine API](http://static-anypoint-mulesoft-com.s3.amazonaws.com/API_examples_notebooks/raml-design4.html)
* [Notes API](http://static-anypoint-mulesoft-com.s3.amazonaws.com/API_examples_notebooks/raml-design3.html)
* [Congo API for Drone Delivery](http://static-anypoint-mulesoft-com.s3.amazonaws.com/API_examples_notebooks/raml-design2.html)

## Running Locally

```
npm install -g api-designer

api-designer
```

This will start a local designer instance using the in-browser filesystem.

## CENITHub Store Confuguration

1. Configure CenitSaaS Store [Sign Up](https://cenitsaas.com/users/sign_up) or [Sign In](https://cenitsaas.com/users/sign_in) 
2. Go to Cenithub
3. Pull Shared Collection RAMLStore
4. Configure Cenithub API Header ``` X-User-Access-Key ``` and ```X-User-Access-Token```
5. Define ```url_base = https://www.cenithub.com``` and ```resource = /api/v1/raml/file```

## Embedding

The following example details how to embed the API Designer:

```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>RAML API Designer - CENITHub Store</title>
    <link rel="stylesheet" href="styles/api-designer-vendor.css">
    <link rel="stylesheet" href="styles/api-designer.css">
</head>
<body ng-app="ramlEditorApp">
<raml-editor></raml-editor>
<script src="scripts/api-designer-vendor.js"></script>
<script src="scripts/api-designer.js"></script>
<script src="scripts/angular-uuid4.js"></script>
<script>
    // This part is needed only if you want to provide your own Persistance Implementation
    // Angular Module must match "ramlEditorApp"
    angular.module('ramlEditorApp')
            .factory('MyFileSystem', function ($http, $q, config, $rootScope, uuid4) {

                var files = {};
                var service = {};
                var url_base = "http://localhost:3001";
                var resource = "/api/v1/raml/file";
                //Header for testing only
                var header = {
                              'X-User-Access-Key': 'Your Key',
                              'X-User-Access-Token': 'Your Token'
                             };

                var copychildrenPath = childrenPath;

                function childrenPath(data, fileExplore) {
                    var children = []
                    for (id in data){
                        var file = data[id].file;
                        if(((fileExplore.path + file.name) == file.path) || ((fileExplore.path + '/'+ file.name) == file.path)) {
                            if (file.type == 'folder') {
                                //delete data[id];
                                var folder = childrenPath(data, file);
                                children.push(folder);
                                files[file.path] = file;
                            }else {
                                //delete data[id];
                                children.push(file);
                                files[file.path] = file;
                            }
                        }
                    }
                    return { name: fileExplore.name, path: fileExplore.path, type: fileExplore.type, meta: fileExplore.meta, children: children };
                }
                service.directory = function (path) {
                    var deferred = $q.defer();
                    //alert($path.parse(path))
                    baseFS = {}
                    $http({
                        method: 'GET',
                        data: '',
                        url: url_base + resource + '?sort_by=path&asc',
                        headers: header,
                        withCredentials: false
                    }).success(function (data, status) {
                        if(status == 200){
                            root = {path: '/', type: 'folder', meta: {}, name: 'Root', content: ''};
                            rootFS = copychildrenPath(data,root);
                        }
                        else{
                            alert(data.message)
                        }
                        deferred.resolve(rootFS);
                        setTimeout(putColors, 100)
                    })
                            .error(errorFunction);
                    return deferred.promise;
                };

                function errorFunction(data, status, headers, config) {
                    //console.log("errorFunction", data, status, headers, config);
                    if(status >= 401){
                        alert(data.message)
                    }
                }

                function putColors(){
                    $(".file-name").each(function() {
                        //console.log($(this).html().length, $(this).html().lastIndexOf(".raml"));
                        if($(this).html().lastIndexOf(".raml")  != -1 ){
                            $(this).addClass("raml-file-browser");
                        }
                        else if($(this).html().lastIndexOf(".md")  != -1 ){
                            $(this).addClass("md-file-browser");
                        }
                        else if($(this).html().lastIndexOf(".json")  != -1 ){
                            $(this).addClass("json-file-browser");
                        }
                        //console.log(this);
                    });
                }

                service.load = function (path) {
                    var deferred = $q.defer();
                    if (files[path]) {
                        $http({
                            method: 'GET',
                            data: '',
                            url: url_base + resource + '/' + files[path].id,
                            withCredentials: false,
                            headers: header
                        }).success(function (data) {
                            deferred.resolve(decodeURI(data.file.content));
                        })
                                .error(deferred.reject.bind(deferred));
                        //.error(deferred.reject(fileNotFoundInStoreMessage(path)));
                    }
                    return deferred.promise;
                };

                service.remove = function (path) {
                    var deferred = $q.defer();
                    if (!files[path]){
                        deferred.reject('file at path "' + path + '" does not exist');
                        return deferred.promise;
                    }
                    $http({
                        method: 'DELETE',
                        data: '',
                        url: url_base + resource + '/' + files[path].id,
                        withCredentials: false,
                        headers: header
                    }).success(function (data) {
                        if(data.status=='ok'){
                            delete files[path];
                            deferred.resolve();
                        }
                        else{
                            alert(data.message);
                        }
                    }).error(deferred.reject.bind(deferred));
                    return deferred.promise;
                };

                function ab2str(buf) {
                    return String.fromCharCode.apply(null, new Uint16Array(buf));
                }

                service.save = function (path, content) {
                    var deferred = $q.defer();
                    var file = {};
                    var filename = '';
                    if (!files[path]) {
                      file.id = uuid4.generate();
                      file.meta = {lastUpdated: new Date(),created: new Date()}
                    }else {
                        file.id = files[path].id;
                        file.meta = {lastUpdated: new Date(),created: files[path].meta.created}
                    }
                    file.path = path;
                    file.content = encodeURI(content);
                    file.name = extractNameFromPath(path);
                    file.type = 'file';
                        $http({
                            method: 'POST',
                            data: JSON.stringify(file),
                            url: url_base + resource,
                            withCredentials: false,
                            headers: header
                        }).success(deferred.resolve.bind(deferred))
                                .error(deferred.reject.bind(deferred));
                     files[path] = file;
                    return deferred.promise;
                };

                function extractNameFromPath(path) {
                    var pathInfo = validatePath(path);
                    if (!pathInfo.valid) {
                        throw 'Invalid Path!';
                    }
                    // When the path is ended in '/'
                    if (path.lastIndexOf('/') === path.length - 1) {
                        path = path.slice(0, path.length - 1);
                    }
                    return path.slice(path.lastIndexOf('/') + 1);
                }

                function validatePath(path) {
                    if (path.indexOf('/') !== 0) {
                        return {valid: false, reason: 'Path should start with "/"'};
                    }
                    return {valid: true};
                }

                service.createFolder = function (path) {
                    var deferred = $q.defer();
                    var file = {};
                    if (!files[path]) {
                        file.id = uuid4.generate();
                    }else {
                        file.id = files[path].id;
                    }
                    file.path = path;
                    file.name = extractNameFromPath(path);
                    file.type = 'folder';
                    file.lastUpdated = new Date();
                    file.meta = {lastUpdated: new Date(),created: new Date()}
                    //  We dont manage already existing folders
                    $http({
                        method: 'POST',
                        data: JSON.stringify(file),
                        url: url_base + resource,
                        withCredentials: false,
                        headers: header
                    }).success(function (data) {
                        files[path] = file;
                        deferred.resolve();
                    })
                            .error(deferred.reject.bind(deferred));
                    return deferred.promise;
                };

                service.rename = function (source, destination) {
                    var promise = service.load(source).then(function (retour) {
                        // on enregistre le nouveau fichier
                        return service.save(destination, retour);
                    }, function (reason) {
                        // Error in any request
                        return $q.reject(reason);
                    }).then(function () {
                        // on supprime l'ancien fichier
                        return service.remove(source);
                    }, function(reason) {
                        console.log('Failed: ' + reason);
                    });
                    return promise;
                };

                return service;
            })
            .run(function (MyFileSystem, config, $rootScope) {
                // Set MyFileSystem as the filesystem to use
                config.set('fsFactory', 'MyFileSystem');

                // In case you want to send notifications to the user
                // (for instance, that he must login to save).
                // The expires flags means whether
                // it should be hidden after a period of time or the
                // user should dismiss it manually.
                $rootScope.$broadcast('event:notification',
                        {message: 'File saved.', expires: true});

            });
</script>
<style>
    html,
    body {
        height: 100%;
    }
</style>
</body>
</html>
```

## Contribution

If you want to contribute to this project, please read our [contribution guide](https://github.com/mulesoft/api-designer/blob/master/CONTRIBUTING.md) first.

## License

Copyright 2013 MuleSoft, Inc. Licensed under the Common Public Attribution License (CPAL), Version 1.0
