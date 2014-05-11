Mash = {};

Mash.groupId = 'FlQxA0TBRl';

Mash.loadNext = function () {
  Parse.Cloud.run('randomVideo', { group: Mash.groupId }, {
    success: function(response) {
      var file = response.get('file');
      video.src = file.url();
    },
    error: function(error) {
      console.error(error);
    }
  });
}

Mash.loadGroup = function(groupId) {
  Mash.groupId = groupId;
  Mash.loadNext();
}

Mash.fetchGroups = function() {

}

Mash.start = function(video) {
  video.addEventListener('ended', Mash.loadNext, false);
  Mash.loadGroup('FlQxA0TBRl');
}


