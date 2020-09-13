import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {Howl, Howler} from 'howler';
import axios from 'axios';
import {Buffer} from 'buffer';
import SiriWave from "siriwave";
import FileSaver from 'file-saver';

declare var $ : any;


@Component({
  selector: 'app-lecteur-audio',
  templateUrl: './lecteur-audio.component.html',
  styleUrls: ['./lecteur-audio.component.css']
})
export class LecteurAudioComponent implements OnInit {

   
  
  constructor() { }

  ngOnInit(): void {
    $(document).ready(function () {

      var siriWave = new SiriWave({
        container: document.getElementById("siri-container")
      });
      siriWave.amplitude=0;

      axios.interceptors.request.use(function (config) {
        $(".loadImg").attr("src", "../../assets/images/loading/tenor.gif");
        $("#loadMe").modal({
          backdrop: "static", //remove ability to close modal with click
          keyboard: false, //remove option to close with keyboard
          show: true //Display loader!
        });
        return config;
      }, function (error) {
        LecteurAudioComponent.timeWait(1);
        return Promise.reject(error);
      });

      axios.get("http://localhost:3000/getallmusics", null).then(function (response) {
        if (response.data.lenght!==0) {
          $('#listmusic').append("<ol style = \"list-style-type: none; margin:0; padding:0;\">");
          response.data.forEach(function(value, index){
            $('#listmusic ol').append("<li class=\"music\">"+
            "<img src=\"../../assets/images/lecteur/note_music.png\" width=\"26px\" height=\"20px\" style=\"float:left;\"></img>"
            +value+"</li>");
            $('.music').css({
              'cursor': 'pointer',
              'padding': '10px',
              'text-align': 'center',
              'border': '0.5px solid black'
            });
            $(".music").mouseenter(function() {
              $(this).css("opacity", "0.6");
            }).mouseleave(function() {
               $(this).css("opacity", "1");
            });
          }); 
           
          $(".music").click(function(){
            const nameMusic = this.textContent;
            var params = {
              params: {
                namemusic: nameMusic
              }
            };
            axios.get("http://localhost:3000/music", params).then(function (response) {
              let bufferOriginal = Buffer.from(response.data);
              var blob = new Blob([bufferOriginal], {type: "audio/mpeg"});
              var url = URL.createObjectURL( blob );
              
              var sound = new Howl({
                src: [url],
                format: ['mp3']
              });
              sound.play();
              var title = response.headers['content-disposition'];
              
            })
            .catch(function (error) {
              $(".loadImg").attr("src", "../../assets/images/error/error.jpg");
            })
            .finally(function () {
              LecteurAudioComponent.timeWait(2);
            });
          });
          $('#listmusic').append("</ol>");
        }
             
      })
      .catch(function (error) {
        $(".loadImg").attr("src", "../../assets/images/error/error.jpg");   
      })
      .finally(function () {
        LecteurAudioComponent.timeWait(2);
      });
    });
  }

  static timeWait(sec : number){
    setTimeout(function(){
      $("#loadMe").modal("hide");
    }, sec*1000);
  }

  

  

  

}
