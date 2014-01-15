(function() {
  'use strict';

  angular.module('ramlEditorApp').directive('ramlEditorFileBrowser', function($rootScope, $q, $window, ramlEditorNewFilePrompt, fileList, ramlRepository, config) {
    var controller = function($scope) {
      var unwatchSelectedFile = angular.noop;
      $scope.fileBrowser = this;
      $scope.homeDirectory = fileList;

      ramlRepository.getDirectory().then(function() {
        if (fileList.files.length > 0) {
          var lastFile = JSON.parse(config.get('currentFile', '{}'));

          var fileToOpen = fileList.files.filter(function(file) {
            return file.name === lastFile.name && file.path === lastFile.path;
          })[0];

          fileToOpen = fileToOpen || fileList.files[0];

          $scope.fileBrowser.selectFile(fileToOpen);
        } else {
          ramlEditorNewFilePrompt.open();
        }
      });

      $scope.$on('event:raml-editor-new-file', function(event, file) {
        $scope.fileBrowser.selectFile(file);
      });

      this.selectFile = function(file) {
        config.set('currentFile', JSON.stringify({ path: file.path, name: file.name }));
        unwatchSelectedFile();

        var isLoaded = angular.isString(file.contents);
        var afterLoading = isLoaded ? $q.when(file) : ramlRepository.loadFile(file);

        afterLoading.then(function(file) {

          $scope.fileBrowser.selectedFile = file;
          $scope.$emit('event:raml-editor-file-selected', file);
          unwatchSelectedFile = $scope.$watch('fileBrowser.selectedFile.contents', function(newContents, oldContents) {
            if (newContents !== oldContents) {
              file.dirty = true;
            }
          });
        });
      };

      this.saveFile = function(file) {
        ramlRepository.saveFile(file);
      };

      var saveListener = function(e) {
        if (e.which === 83 && e.metaKey) {
          e.preventDefault();
          $scope.$apply(function() {
            $scope.fileBrowser.saveFile($scope.fileBrowser.selectedFile);
          });
        }
      };

      $scope.clickedCog = function() {
        console.log('clicked cog');
      };

      $window.addEventListener('keydown', saveListener);

      $scope.$on('$destroy', function() {
        $window.removeEventListener('keydown', saveListener);
      });
    };

    return {
      restrict: 'E',
      templateUrl: 'views/raml-editor-file-browser.tmpl.html',
      controller: controller
    };
  });
})();
