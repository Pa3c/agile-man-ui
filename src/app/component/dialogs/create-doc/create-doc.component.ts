import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrls: ['./create-doc.component.css']
})
export class CreateDocComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateDocComponent>) { }


  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
