angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $timeout, Persistence) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

    // Playlist dialog part

    // Form data for the add playlist modal
    $scope.playlistData = {};

    // Create the add playlist modal that we will use later
    $ionicModal.fromTemplateUrl('templates/add-playlist.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.addDialog = modal;
    });

    // Triggered in the add playlist modal to close it
    $scope.closeAddDialog = function () {
      $scope.addDialog.hide();
    };

    // Open the add playlist modal
    $scope.showAddDialog = function () {
      $scope.addDialog.show();
    };

    // Perform the add playlist action when the user submits the add playlist form
    $scope.doAddDialog = function () {

      var playlist = new Persistence.Entities.Playlist({title: $scope.playlistData.title});
      console.log('title: ' + $scope.playlistData.title);
      Persistence.add(playlist);
      $scope.$broadcast('playlistAdded', playlist);

      $scope.playlistData.title = '';
      $scope.closeAddDialog();
    };
  })

  // ! >>  Play List Controller >>----------------------------->

  .controller('PlaylistsCtrl', function ($scope, $ionicModal, Persistence, $q) {
    $scope.ctrls = {del: false, reorder: false};
    $scope.playlists = [];

    var getPlaylists = function () {
      var deferred = $q.defer();
      
      Persistence.getAllPlaylists().then(function (response) {
        $scope.playlists.length = 0;
        for (var i = 0; i < response.length; i++) {
          $scope.playlists.push(response[i]);
        }
        deferred.resolve({state: 'ok'});
      });

      return deferred.promise;
    };

    getPlaylists();

    $scope.movePlayList = function (playList, fromI, toI) {

      if (fromI < toI) {
        for (var i = fromI; i <= toI; i++) {
          if (i === fromI) {
            $scope.playlists[i].order = toI;
          } else {
            $scope.playlists[i].order = (i - 1);
          }
        }
      } else if (fromI > toI) {
        for (i = toI; i <= fromI; i++) {
          if (i === fromI) {
            $scope.playlists[i].order = toI;
          } else {
            $scope.playlists[i].order = (i + 1);
          }
        }
      }

      Persistence.flush()
        .then(function (data) {
          getPlaylists();
        })
      ;
    };

    /** >> edit playlist >> */
      // Create the edit playlist modal that we will use later
    $ionicModal.fromTemplateUrl('templates/edit-playlist.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.editDialog = modal;
    });

    // Triggered in the edit playlist modal to close it
    $scope.closeEditDialog = function () {
      $scope.editDialog.hide();
    };

    // Perform the edit playlist action when the user submits the edit playlist form
    $scope.doEditDialog = function () {

      var playlist = new Persistence.Entities.Playlist({title: $scope.playlistData.title});
      Persistence.flush();
      $scope.$broadcast('playlistEdited', playlist);

      $scope.closeEditDialog();
    };

    // Open the edit playlist modal
    $scope.editPlayList = function (playList) {
      $scope.playlist = playList;
      $scope.editDialog.show();
    };
    /** << edit playlist << */

    var reorderPlaylist = function () {
      for (var i = 0; i < $scope.playlists.length; i++) {
        console.log('i = ' + i);
        $scope.playlists[i].order = i;
      }
      Persistence.flush();
    };

    $scope.deletePlayList = function (playlist) {
      Persistence.remove(playlist)
        .then(function (data) {
          return getPlaylists();
        })
        .then(function (data) {
          reorderPlaylist();
        })
      ;
    };

    $scope.$on('playlistAdded', function (event, playlist) {
      getPlaylists();
    });
    $scope.$on('playlistEdited', function (event, playlist) {
      getPlaylists();
    });
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {

  });
