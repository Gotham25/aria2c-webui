import {AfterViewInit, Component} from '@angular/core';
import {Aria2BackendService} from './service/aria2-backend.service';
import {DStats, MemoryInfo, MiscellaneousInfo, OsInfo, SystemStats} from "./model/Response";
import {MatDialog} from "@angular/material/dialog";
import {SessionInfoComponent} from "./component/session-info/session-info.component";
import {environment} from "../environments/environment";
import {SessionInfo, Version} from "./model/Aria2";
import {SupportedFeaturesComponent} from "./component/supported-features/supported-features.component";
import {AddUrlComponent} from "./component/add-url/add-url.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'tmp1';

  tableDataSource$!: DStats[];
  systemStats!: SystemStats;
  selectedStates!: string[];

  isFilterShown = true;

  showFilterBox = false;

  constructor(
    public dialog: MatDialog,
    private aria2BackendService: Aria2BackendService
  ) {

    /*setTimeout(() => {
      let testURL = 'https://s3.amazonaws.com/downloads.eviware/soapuios/5.7.0/SoapUI-x64-5.7.0.exe';
      aria2BackendService.addURI(testURL, {})
        .subscribe(data => {
          console.log(data);
        }, error => {
          console.error(error);
        });
    }, 15000);*/

    /*setTimeout(() => {
      let uris = [
        'https://s3.amazonaws.com/downloads.eviware/soapuios/5.7.0/SoapUI-x64-5.7.0.exe',
        'https://collections.lib.utah.edu/file?id=423522'
      ];
      let params = {
        'continue': 'true'
      };

      aria2BackendService.addURIs(uris, params).subscribe(data => {
        console.log(data);
      }, error => {
        console.error(error);
      });
    }, 1000);*/

    setInterval(() => {
      aria2BackendService.fetchFeed().subscribe(data => {
        console.log(data);
        this.systemStats = data.systemStats;
        //console.log(this.systemStats);
        this.tableDataSource$ = data.downloadStats.flat(1);
      }, error => {
        console.error(error);
      });
    }, 1000);
  }

  ngAfterViewInit() {
  }

  stateChange($event: string[]) {
    console.log("$event", $event);
    this.selectedStates = $event;
    /*this.aria2BackendService.getVersion().subscribe(data => {
      console.log("data", data);
    });*/
  }

  dStatByGID(index: number, stat: DStats): string {
    return stat.gid;
  }

  getSystemInfoTooltip(): string {

    let systemInfoTooltip = '';
    if(this.systemStats != undefined) {
      let memoryInfo: MemoryInfo = this.systemStats.memoryInfo;
      let miscellaneousInfo: MiscellaneousInfo = this.systemStats.miscellaneousInfo;
      let osInfo: OsInfo = this.systemStats.osInfo;
      systemInfoTooltip += "Memory Usage";
      systemInfoTooltip += " \n Total Memory : " + memoryInfo.totalMemory;
      systemInfoTooltip += " \n Free Memory : " + memoryInfo.freeMemory;
      systemInfoTooltip += " \n ";
      systemInfoTooltip += " \n UpTimeInfo";
      systemInfoTooltip += " \n "+miscellaneousInfo.uptime;
      systemInfoTooltip += " \n ";
      systemInfoTooltip += " \n Host info";
      systemInfoTooltip += " \n Platform : "+osInfo.platform;
      systemInfoTooltip += " \n Version : "+osInfo.version;
      systemInfoTooltip += " \n Architecture : "+osInfo.architecture;
      systemInfoTooltip += " \n Release : "+osInfo.release;
      systemInfoTooltip += " \n ";
      systemInfoTooltip += " \n Click to view detailed info...";
    }
    return systemInfoTooltip;
  }

  navigateToSystemInfo() {
    alert("navigateToSystemInfo functionality yet to be implemented");
  }

  sessionInfo() {
    this.aria2BackendService.getSessionInfo().subscribe(data => {
      console.log(data);
      const dialogRef = this.dialog.open(SessionInfoComponent, {
        width: environment.sessionInfoWidth,
        height: environment.sessionInfoHeight,
        disableClose: true,
        data: {
          sessionId: (data.result as SessionInfo).sessionId
        }
      });
    }, error => {
      console.error(error);
    });
  }

  supportedFeatures() {
    this.aria2BackendService.getVersion().subscribe(data => {
      console.log(data);
      const dialogRef = this.dialog.open(SupportedFeaturesComponent, {
        width: environment.supportedFeaturesWidth,
        height: environment.supportedFeaturesHeight,
        disableClose: true,
        data: {
          supportedFeatures: (data.result as Version)
        }
      });
    }, error => {
      console.error(error);
    });
  }

  addURLs() {
    const dialogRef = this.dialog.open(AddUrlComponent, {
      width: "720px",
      height: "350px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data != undefined && data.urls != undefined) {
        let urls: string[] = data.urls;
        //console.log("urls", urls);
        let params = {
          'continue': 'true'
        };

        this.aria2BackendService.addURIs(urls, params).subscribe(data => {
          console.log(data);
        }, error => {
          console.error(error);
        });
      }
    });
  }
}
