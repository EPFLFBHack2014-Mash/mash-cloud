
'use strict';

var VIDEO_SERVER_URL = '188.226.254.4:6862/';

function fetchVideos(group)
{
  var query = new Parse.Query('Video');
  var promise = new Parse.Promise();

  query.equalTo('group', group);
  query.find({
    success: function(videos) {
      promise.resolve(videos);
    }
  });

  return promise;
}

function pushToServer(data)
{
  Parse.Cloud.httpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    url: VIDEO_SERVER_URL,
    body: JSON.stringify(data)
  });
}

Parse.Cloud.afterSave('Video', function(req) {
  var group = req.object.get('group');
  fetchVideos(group).then(function(videos) {
    // var subset = videosAroundDuration(videos, 6, 30),
    var subset = randomSubset(videos, 6),
        data = {
          group: group,
          videos: subset
        };

    pushToServer(data);
  });

});

var Group = Parse.Object.extend('Group');

Parse.Cloud.define('randomVideo', function(req, res) {
  var groupId = req.params.group,
      group = new Group();
      group.id = groupId;

  fetchVideos(group).then(function(videos) {
    var video = videos[Math.floor(Math.random() * videos.length)];
    res.success(video);
  });
});

function shuffle(array) {
  var counter = array.length, temp, index;

  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter -= 1;
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function randomSubset(array, size)
{
  return shuffle(array.concat()).slice(0, size);
}

// function videosAroundDuration(videos, size, sec) {
//   var shuffled = shuffle(videos),
//       subset = [],
//       duration = 0;
//
//   do {
//     var vid = videos.shift();
//     if (vid.duration == null) {
//       continue;
//     }
//     duration += vid.duration | 0;
//     subset.push(vid);
//   }
//   while(shuffled.length > 0 && duration <= sec && subset.length <= size);
//
//   return subset;
// }
