import { Component, OnInit } from '@angular/core';
import FileSaver from 'file-saver';

import axios from 'axios';
import fileToArrayBuffer from 'file-to-array-buffer';
import {Buffer} from 'buffer';
import {NgForm} from '@angular/forms';
import { FormsModule }   from '@angular/forms';

declare var $ : any;


@Component({
  selector: 'app-upload-music',
  templateUrl: './upload-music.component.html',
  styleUrls: ['./upload-music.component.scss']
})
export class UploadMusicComponent implements OnInit {

  private fileToUpload: File;


  constructor() { 
  
  }

  ngOnInit(): void {

    $(".file").on("change", function() {
      var fileName = $(this).val().split("\\").pop();
      $("#zoneAffichageNameFile").val(fileName);
      //$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
  }

  uploadFile(event) {
   
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
      UploadMusicComponent.timeWait(1);
      return Promise.reject(error);
    });

    this.fileToUpload = (event.target as HTMLInputElement).files[0];
    if (this.fileToUpload !== undefined) {
   
      const nameFile = this.fileToUpload.name.split('.')[0];
      fileToArrayBuffer(this.fileToUpload).then((data) => {
        var buffer = Buffer.from(data);
      
        const headers = {
          headers : {
            'Content-Disposition': ''+nameFile.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')+'' 
          }
        };
        axios.put("http://localhost:3000/upload", JSON.stringify(buffer), headers).then(function (response) {
          $("#msg").css({"color": "green", "visibility" : "visible"});
          $("#msg").text("L'upload de la musique c'est bien effectué");
        })
        .catch(function (error) {
            $(".loadImg").attr("src", "../../assets/images/error/error.jpg");
            $("#msg").css({"color": "red", "visibility" : "visible"});
            $("#msg").text("Erreur produite pendant l'upload de la musique");
        })
        .finally(function () {
          UploadMusicComponent.timeWait(2);
        });
      })
    }
  }

  static timeWait(sec : number){
    setTimeout(function(){
      $("#loadMe").modal("hide");
    }, sec*1000);
  }

}
