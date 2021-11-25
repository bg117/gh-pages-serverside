const ytdl = require('ytdl-core');
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

function fileExists(file) {
  return fs.existsSync(file);
}

function timestamp() {
  return new Date().toTimeString().split(' ')[0];
}

function logWithTime(msg) {
  console.log(`[${timestamp()}] : ${msg}`);
}

app.use(require('./mw.js'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/download_video', function(req, res) {
  var videoId = req.query.id;
  var extension = '.' + ((req.query.format === undefined) ? 'mp4' : req.query.format);

  logWithTime(`Fetch file - https://www.youtube.com/watch?v=${videoId}\n`);

  var videoReadableStream = ytdl("https://www.youtube.com/watch?v=" + videoId);

  if (req.query.format == "mp3")
    videoReadableStream = ytdl("https://www.youtube.com/watch?v=" + videoId, { filter: 'audioonly' });

  var videoName = 'video';

  ytdl.getInfo("https://www.youtube.com/watch?v=" + videoId, function(err, info) {
    if (err) {
      logWithTime(err + '\n');
      return;
    }

    videoName = info.title;
    logWithTime(`Retrieve video name (${videoName})\n`);
  })

  logWithTime("Finished task \"Fetch file\"\n");
  logWithTime("Send file - " + videoName + extension + "\n")

  var contentType = (req.query.format == "mp3") ? "audio/mpeg" : "video/mp4";

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', 'attachment; filename=' + videoName + extension);

  videoReadableStream.pipe(res);

  logWithTime("Finished task \"Send file\"\n");
});

app.get('/dynamic_page', function(req, res) {
  res.send(decodeURI(req.query.code));
});

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/404.html');
});

let server = app.listen(3000, function() {
  logWithTime("Server successfully started; running on port 3000\n");
});
