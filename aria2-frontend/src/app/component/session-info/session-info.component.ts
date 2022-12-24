import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.scss']
})
export class SessionInfoComponent implements OnInit {

  public sessionId: string;

  constructor(
    public dialogRef: MatDialogRef<SessionInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sessionId = data.sessionId;
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
