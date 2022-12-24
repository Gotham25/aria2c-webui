import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PreviewDialogComponent} from '../preview-dialog/preview-dialog.component';
import {environment} from "../../../environments/environment";
import {DStats} from "../../model/Response";
import {Aria2BackendService} from "../../service/aria2-backend.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-row-item',
  templateUrl: './row-item.component.html',
  styleUrls: ['./row-item.component.scss'],
  animations: [
    trigger("animateDiv", [
      transition(":enter", [
        style({
          opacity: 0,
          transform: "translateY(-25%)"
        }), animate(400)
      ])
    ])
  ]
})
export class RowItemComponent implements OnInit {

  @Input() dStats!: DStats;
  @ViewChild('tp') _matTooltip!: MatTooltip;
  public isExpanded: boolean = false;
  degradedProgressBarColors = {
    "0": "#3498db",
    "25": "#ffa500",
    "50": "#9b59b6",
    "75": "#12ad2b"
  };

  matTooltipText1: string = "Copy to clipboard..."

  matTooltipText2: string = "Copied!!!"

  constructor(
    public dialog: MatDialog,
    public aria2BackendService: Aria2BackendService
  ) {
    //console.log("dStats", this.dStats);
  }

  ngOnInit(): void {
  }

  toggleRowDisplay(): void {
    this.isExpanded = !this.isExpanded;
  }

  previewFile(): void {
    let fileName = this.getFileName();
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: environment.previewWidth,
      height: environment.previewHeight,
      data: {
        fileName: fileName,
        fileURL: `${environment.downloadsPath}/${fileName}`,
        previewWidth: environment.previewWidth,
        previewHeight: environment.previewHeight
      }
    });
  }

  removeDownload() {
    this.aria2BackendService.removeDownload(this.dStats.gid).subscribe(data => {
      console.log(data);
    }, error => {
      console.error(error);
    });
  }

  pauseDownload() {
    this.aria2BackendService.pauseDownload(this.dStats.gid).subscribe(data => {
      console.log(data);
    }, error => {
      console.error(error);
    });
  }

  unPauseDownload() {
    this.aria2BackendService.unPauseDownload(this.dStats.gid).subscribe(data => {
      console.log(data);
    }, error => {
      console.error(error);
    });
  }

  forcePauseDownload() {
    alert(`Force Pause download ${this.dStats.gid}`);
    this.aria2BackendService.forcePauseDownload(this.dStats.gid).subscribe(data => {
      console.log(data);
    }, error => {
      console.error(error);
    });
  }

  forceRemoveDownload() {
    this.aria2BackendService.forceRemoveDownload(this.dStats.gid).subscribe(data => {
      console.log(data);
    }, error => {
      console.error(error);
    });
  }

  removeDownloadResult() {
    this.aria2BackendService.removeDownloadResult(this.dStats.gid).subscribe(data => {
      console.log(data);
    }, error => {
      console.error(error);
    });
  }

  getFileName() {
    let filePath = this.dStats.files[0].path;
    return (filePath.substring(filePath.lastIndexOf('/')+1) || 'Unknown_download_'+this.dStats.gid);
  }

  formatBytes(_bytes: string, decimals: number = 2): string {

    _bytes = _bytes || '0';

    let bytes = Number(_bytes)

    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  isVideoFile(): boolean {
    let fileName = this.getFileName();
    if(fileName == undefined || fileName.trim() == '') {
      return false;
    }

    let supportedFormats = [ ".mp3", ".mp4", ".mkv"];

    return supportedFormats.reduce((result, supportedFormat) => {
      return result || (fileName.indexOf(supportedFormat) !== -1 || fileName.endsWith(supportedFormat));
    }, false);
  }

  getProgress(): string {
    let completedLength = Number(this.dStats?.completedLength || 0);
    let totalLength = Number(this.dStats?.totalLength || 0);

    if(totalLength == 0) {
      return "0";
    }

    return ((completedLength / totalLength) * 100).toFixed(2);
  }

  getEta(): string {
    let totalLength = this.dStats.totalLength;
    let completedLength = this.dStats.completedLength;
    let downloadSpeed = this.dStats.downloadSpeed;

    if(totalLength == undefined || completedLength == undefined || downloadSpeed == undefined || Math.floor(Number(downloadSpeed)) == 0) {
      return "N/A";
    }

    let etaInSeconds = (Number(totalLength) - Number(completedLength)) / Number(downloadSpeed);
    return new Date(etaInSeconds * 1000).toISOString().substring(11, 23);
  }

  getStatusIcon(): string {
    let status = this.dStats?.status || "";

    switch (status) {
      case "active": return "play_circle_outline";
      case "paused": return "pause_circle_outline";
      case "complete": return "check_circle_outline";
      case "error": return "error_outline";
      case "waiting": return "queue";
      default: return "";
    }
  }

  isActionBtnShown(actionName: string): boolean {
    let status = this.dStats?.status || "";

    switch (actionName) {
      case "removeDownloadResult": return status !== "active" && status !== "paused" && status !== "waiting";
      case "resumeDownload": return status == "paused";

      case "pauseDownload":
      case "forcePauseDownload": return status == "active" || status == "waiting";

      case "removeDownload":
      case "forceRemoveDownload": return status !== "error" && status !== "complete";

      case "downloadFile": return status == "complete";
      default: return true;
    }
  }

  downloadFile(): void {
    const fileName = this.getFileName();
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", `/downloads/${fileName}`);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  copyToClipboard(): void {
    setTimeout(() => {
      this._matTooltip.show();
      this._matTooltip.message = this.matTooltipText2;
    });

    setTimeout(() => {
      this._matTooltip.message = this.matTooltipText1;
      this._matTooltip.hide();
    }, 1000);
  }
}
