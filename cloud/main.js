
'use strict';

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

function videosAroundDuration(videos, size, sec) {
  var shuffled = shuffle(videos),
      subset = [],
      duration = 0;

  do {
    var vid = videos.shift();
    duration += (+vid.duration);
    subset.push(vid);
  }
  while(shuffled.length > 0 && duration <= sec && subset.length <= size);

  return subset;
}

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

var VIDEO_SERVER_URL = 'http://requestb.in/1arwn501';

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
    var subset = videosAroundDuration(videos, 6, 30),
        data = {
          group: group,
          videos: subset
        };

    pushToServer(data);
  });

});
