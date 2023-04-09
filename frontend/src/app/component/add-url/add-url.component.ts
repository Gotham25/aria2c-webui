import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-url',
  templateUrl: './add-url.component.html',
  styleUrls: ['./add-url.component.scss']
})
export class AddUrlComponent implements OnInit {

  public urls: string = "";

  constructor(
    public dialogRef: MatDialogRef<AddUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  validateAndClose() {

    if(this.urls !== undefined && this.urls.trim().length !== 0) {
      let urlArray = this.urls.trim().split(/\r?\n/);

      let urls=[], isError=0;
      for (let i = 0; i < urlArray.length; i++) {
        let trimmedURL = urlArray[i].trim();
        if(trimmedURL.length === 0) {
          continue;
        }

        if(trimmedURL.startsWith("http://") || trimmedURL.startsWith("https://")) {
          urls.push(trimmedURL);
        } else {
          alert("One of the URL starts with different protocol. Only http/https are allowed");
          isError=1;
          break;
        }
      }

      if(urls.length != 0) {
        if(!isError) {
          this.dialogRef.close({
            urls: urls
          });
        }
      } else {
        alert("Please enter at-least one URL to proceed");
      }
    }
  }
}
