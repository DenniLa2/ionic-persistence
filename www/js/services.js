angular.module('starter.services', [])

  .factory('Persistence', function ($q) {
    //persistence.store.memory.config(persistence);

    persistence.store.cordovasql.config(persistence, 'app_db', '0.0.1', 'Database description', 5 * 1024 * 1024, 0);

    var entities = {};

    entities.Playlist = persistence.define('Playlist', {
      title: 'TEXT',
      order: 'INT'
    });

    persistence.debug = true;
    persistence.schemaSync();

    return {
      Entities: entities,

      add: function (playlist) {
        entities.Playlist.all().count(null, function (cnt) {
          console.log('pl count = ' + cnt);
          playlist.order = cnt;
          persistence.add(playlist);
          persistence.flush();
        });
      },
      remove: function (playlist) {
        var deferred = $q.defer();
        
        persistence.remove(playlist).flush(function () {
          deferred.resolve({state: 'ok'});
        });

        return deferred.promise;
      },
      getPlaylists: function (from, to) {
        var defer = $q.defer();

        entities.Playlist.all().list(null, function (playlists) {
          defer.resolve(playlists);
        });

        return defer.promise;
      },
      getAllPlaylists: function () {
        var defer = $q.defer();

        entities.Playlist.all().order("order", true).list(null, function (playlists) {
          defer.resolve(playlists);
        });

        return defer.promise;
      },
      flush: function () {
        var deferred = $q.defer();

        persistence.flush(function () {
            deferred.resolve({state: 'ok'});
          });

        return deferred.promise;
      }
    };
  });