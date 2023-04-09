import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Version} from "../../model/Aria2";

@Component({
  selector: 'app-supported-features',
  templateUrl: './supported-features.component.html',
  styleUrls: ['./supported-features.component.scss']
})
export class SupportedFeaturesComponent implements OnInit {

  public supportedFeatures: Version;

  constructor(
    public dialogRef: MatDialogRef<SupportedFeaturesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.supportedFeatures = (data.supportedFeatures as Version);
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
