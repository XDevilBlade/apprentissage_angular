const express = require('express');
var cors = require('cors')
const readline = require('readline');
const Blob = require('node-blob');
var FileSaver = require('file-saver');
const mysql = require('mysql');
const streamBuffers = require('stream-buffers');
const save = require('save-file')
const createBuffer = require('audio-buffer-from')
//const saveSync = require('save-file/sync')
const app = express();
const bodyParser = require('body-parser');
const toStream = require('buffer-to-stream')

// parse application/x-www-form-urlencoded
//app.use(bodyParser.json({limit: '400mb', extended: true}))
//app.use(bodyParser.urlencoded({limit: '400mb', extended: true}))

// parse application/json
app.use(bodyParser.json());

const hbjs = require('handbrake-js')
const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg   = require('fluent-ffmpeg');
const ff = require('ffmpeg');
//const toStream = require('blob-to-stream');
const contentDisposition = require('content-disposition');
const Lame = require("node-lame").Lame;


 
let Duplex = require('stream').Duplex;  


function getTitleVideo (videoUrl){
  return new Promise ((resolve, reject) => {
     ytdl.getBasicInfo (videoUrl, (err, info) => {
           resolve (info.title)
     })
  })
} 

function bufferToStream(buffer) {  
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

app.get('/download', function (req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Custom-header");
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  //res.header("Access-Control-Allow-Headers", "x-total-count"); 
  
  var param = req.url;
  var urlDecode = decodeURIComponent(param);
  if (urlDecode.indexOf("youtube.com/watch?v=")!=-1) {
    var urlVideo = urlDecode.split("urlvideo=")[1];
    ytdl.getInfo(urlVideo, (err, info) => {
      if (err) throw err;
      var video = ytdl(''+urlVideo);
      var nameVideo = info.title;
      var files = fs.readdirSync('musiques');
      var nbFileFound = 0;
      files.forEach((nameFile)=>{
        if(nameFile.includes(nameVideo)){
          nbFileFound++;
        }
      });
      
      var path = "musiques/"+nameVideo+nbFileFound+".mp3";
      var nameVideoWithoutSpecialCharacter = nameVideo.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    
      ffmpeg(video)
        .audioBitrate(128)
        .on('progress', function(info){
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(`${info.targetSize}kb downloaded ${info.timemark}`);
        })
        .on('end', () => {
          if (fs.existsSync(path)) {
            var file = fs.readFileSync(path);
            var json = JSON.stringify(file);
            fs.unlinkSync(path);
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Content-Disposition": "\""+nameVideoWithoutSpecialCharacter+"\""
            });

            res.end(json);
          }
          else{
            
          }
        })
        .on('error', function(err){
          console.log("erreur");
        })
        .save(path);
    }); 
  }
});

app.get('/getallmusics', function (req, res){
  res.header("Access-Control-Allow-Origin", "*");
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root123,",
    database: "Musique"
  });
  var sqlSelect = "SELECT * FROM musique";
  con.query(sqlSelect, null, function(error, results, fields){
    if (error) throw error;
    var listMusic = [];
    if(results.length!==0){
      //console.log(results);
      results.forEach(function(value, index){
        listMusic[index]=value.name;
      });
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
    }
    var json = JSON.stringify(listMusic);
    res.end(json);
  });
});

app.put('/upload', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  var jsonStr = JSON.stringify(req.body);
  var nameFile = req.headers['content-disposition'];
  var buf = Buffer.from(jsonStr);
  let myBlob = new Blob([buf], { type: 'audio/mpeg' });

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root123,",
    database: "Musique"
  });
  con.connect(function(err) {
    if (err) throw err;
    var sqlSelect = "SELECT * FROM musique WHERE name = ?";
    var value = [''+nameFile+''];
    con.query(sqlSelect, [value], function (error, results, fields) {
      if (error) throw error;
      if (results.length===0) {

        var sqlInsert = "INSERT INTO musique (name, content) VALUES ?";
        var values = [[''+nameFile+'', ''+myBlob+'']];

        con.query(sqlInsert, [values], function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          res.end("fin");
        });
      }
      else {
        var sqlUpdate = "UPDATE musique SET name = ?, content = ? WHERE name = ? AND content = ?";
        con.query(sqlUpdate, [''+nameFile+'', ''+myBlob+'', ''+nameFile+'', ''+myBlob+''], function(err, result){
          if (err) throw err;
          console.log("1 record updated");
          res.end("fin");
        });
      }
    });    
  });  
});

app.get('/music', function (req, res){

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Expose-Headers", "Content-Disposition");

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root123,",
    database: "Musique"
  });
  var param = req.url;
  var urlDecode = decodeURIComponent(param);
  const search = '\\+';
  const searchRegExp = new RegExp(search, 'g');
  var nameMusic = urlDecode.split('=')[1].replace(searchRegExp, ' ');
  con.connect(function(err) {
    if (err) throw err;
    var sqlSelect = "SELECT * FROM musique WHERE name = ?";
    var value = [''+nameMusic+''];
    con.query(sqlSelect, [value], function (error, results, fields) {
      if (error) throw error;
      if (results.length===0) {
        console.log("error");
        res.status(404);
        res.end('music unknown');
      }
      else {
        console.log("good");
        var music = results[0];
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Disposition": "\""+music.name+"\""
        });
        var json = JSON.stringify(music.content);
        var buffer = new Buffer( music.content, 'binary' );
        var streamR = toStream(buffer);
        
        /*var streamR = toStream(new Blob([music.content], { type: 'audio/mpeg' }));
        */
       console.log(streamR.readable);
       ffmpeg(streamR)
       .audioBitrate(128)
       .on('progress', function(info){
         readline.cursorTo(process.stdout, 0);
         process.stdout.write(`${info.targetSize}kb downloaded ${info.timemark}`);
       })
       .on('end', () => {
         console.log("fin")
       })
       .on('error', function(err){
         console.log(err);
       })
       .save("path.mp3");


        res.end(json);
      }
    });    
  });

});

app.use(cors());
app.listen(3000)
