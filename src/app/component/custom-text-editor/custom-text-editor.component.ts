import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import Quill from 'quill';

// add image resize module
import ImageResize from 'quill-image-resize-module';
import { FileService } from 'src/app/service/file.service';
Quill.register('modules/imageResize', ImageResize);

// override p with div tag
const Parchment = Quill.import('parchment');
let Block = Parchment.query('block');

Block.tagName = 'DIV';
// or class NewBlock extends Block {}; NewBlock.tagName = 'DIV';
Quill.register(Block /* or NewBlock */, true);
@Component({
  selector: 'custom-editor',
  templateUrl: './custom-text-editor.component.html',
  styleUrls: ['./custom-text-editor.component.css']
})
export class CustomTextEditorComponent implements OnInit {
  quill: Quill;
  readonly toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['link', 'image'],

    ['clean']                                         // remove formatting button
  ];
  constructor(private fileService: FileService) {
  }



  ngOnInit() {
    // this.form
    //   .controls
    //   .editor
    //   .valueChanges
    //   .pipe(
    //   debounceTime(400),
    //   distinctUntilChanged())
    //   .subscribe(data => {
    //     console.log('native fromControl value changes with debounce', data)
    //   });

    // this.editor
    //   .onContentChanged
    //   .pipe(
    //   debounceTime(400),
    //   distinctUntilChanged())
    //   .subscribe(data => {
    //     console.log('view child + directly subscription', data)
    //   });

    this.quill = new Quill('#editor', {
      modules: {
        toolbar: this.toolbarOptions
      },
      theme: 'snow'  // or 'bubble'
    });

    var toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('image', this.showImageUI);
  }

  showImageUI(image, callback) {
    console.log(image);
    console.log(callback);


    let buttonInput: HTMLElement = document.getElementById('quillImageInput');
    buttonInput.click();

    //const ths = this
    // console.log($event)

    // ths['quill'].insertEmbed(0,'image','https://avatars2.githubusercontent.com/u/49151748?s=80&v=4','user');


  }

  quillUploadImage($event) {
    console.log($event);
    let file: File = $event.target.files[0];
    let formData:FormData = new FormData();
    formData.append('file',file, file.name);
    console.log(file);


    this.fileService.saveFile(formData).subscribe(success=>{
      console.log(success);
      var selection = this.quill.getSelection(true);
      this.quill.insertEmbed(selection.index,'image',success.fileDownloadUri);
    })

    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {

    //

    //   // this.editMode = false;
    // }
    // reader.onerror = function (error) {
    //   console.log('Error: ', error);
    // };
  }

  setFocus($event) {
    $event.focus();
  }

  logChange($event: any) {
    console.log($event);
  }

  logSelection($event: any) {
    console.log($event);
  }
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],                                         // remove formatting button

    ['link', 'image', 'video']                         // link and image, video
  ]
};
