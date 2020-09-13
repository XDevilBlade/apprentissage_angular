import { Component, OnInit } from '@angular/core';
import FileSaver from 'file-saver';
import axios from 'axios';
import {Buffer} from 'buffer';
import {NgForm} from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import {Howl, Howler} from 'howler';

declare var $ : any;

@Component({
  selector: 'app-download-music',
  templateUrl: './download-music.component.html',
  styleUrls: ['./download-music.component.scss']
})
export class DownloadMusicComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  downloadFile(url : string){
    
    
    if (url.indexOf("youtube.com/watch?v=")!=-1) {
    
      var idVideo = url.split("watch?v=")[1];
      if(url.indexOf("&")!=-1){
        idVideo = idVideo.split("&")[0];  
      }

      this.addPreviewYoutube("<iframe width=\"420\" height=\"315\""+
      "src=\"https://www.youtube.com/embed/"+idVideo+"\">"+ 
      "</iframe>");
    } else {
      this.addPreviewYoutube("<h4>Inconnu</h4>");
    }

    var params = {
      params: {
        urlvideo: url
      }
    };

    axios.interceptors.request.use(function (config) {
      $("#msg").empty();
      $(".loadImg").attr("src", "../../assets/images/loading/tenor.gif");
      $("#loadMe").modal({
        backdrop: "static", //remove ability to close modal with click
        keyboard: false, //remove option to close with keyboard
        show: true //Display loader!
      });
      return config;
    }, function (error) {
      setTimeout(function(){
        $("#loadMe").modal("hide");
      }, 1000);
      return Promise.reject(error);
    });
    
    axios.get("http://localhost:3000/download", params).then(function (response) {
      let bufferOriginal = Buffer.from(response.data);
      var blob = new Blob([bufferOriginal], {type: "audio/mpeg"});
      /*var url = URL.createObjectURL( blob );
      var sound = new Howl({
        src: [url],
        format: ['mp3']
      });
      sound.play();*/
      var title = response.headers['content-disposition'];
      FileSaver.saveAs(blob, title.slice(1, title.length));
      $("#msg").css({"color": "green", "visibility" : "visible"});
      $("#msg").text("La musique a été téléchargé");
    })
    .catch(function (error) {
      $(".loadImg").attr("src", "../../assets/images/error/error.jpg");
      $("#msg").css({"color": "red", "visibility" : "visible"});
      $("#msg").text("Erreur produite pendant le téléchargement de la musique");
    })
    .finally(function () {
      DownloadMusicComponent.timeWait(2);
    });
  }

  addPreviewYoutube(content : string){
    $("#previewYoutube").empty();
    $( "#previewYoutube" ).append( $( "<br>"+content+"<br>"));
  }

  static timeWait(sec : number){
    setTimeout(function(){
      $("#loadMe").modal("hide");
    }, sec*1000);
  }

  onSubmit(form: NgForm) {
    this.downloadFile(form.value.urlVideo);
  }

}
