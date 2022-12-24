import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {Aria2Request, Aria2Response} from "../model/Aria2";
import {environment} from "../../environments/environment";
import {FeedResponse} from "../model/Response";
import {BaseURLService} from "./base-url.service";

@Injectable({
  providedIn: 'root'
})
export class Aria2BackendService {

  constructor(
    private httpClient: HttpClient,
    private baseURLService: BaseURLService
  ) { }

  getVersion(): Observable<Aria2Response> {
    let getVersionURL = this.getURL(environment.versionURL);
    return this.httpClient.get<Aria2Response>(getVersionURL)
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      )
  }

  fetchFeed(): Observable<FeedResponse> {
    let getFetchFeedURL = this.getURL(environment.fetchFeedURL);
    return this.httpClient.post<FeedResponse>(getFetchFeedURL,{})
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  addURI(url: string, params: any): Observable<Aria2Response> {
    let addUriURL = this.getURL(environment.addUriURL);
    let postBody = {
      uris: [url],
      params: params || {}
    } as Aria2Request;
    return this.httpClient.post<Aria2Response>(addUriURL, postBody)
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  addURIs(urls: string[], params: any): Observable<Aria2Response> {
    let addUriURL = this.getURL(environment.addUrisURL);
    let postBody = {
      uris: urls,
      params: params || {}
    } as Aria2Request;
    return this.httpClient.post<Aria2Response>(addUriURL, postBody)
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  pauseDownload(gid: string): Observable<Aria2Response> {
    let pauseDownloadURL = this.getURL(environment.pauseDownloadURL);

    return this.httpClient.post<Aria2Response>(`${pauseDownloadURL}/${gid}`, {})
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  unPauseDownload(gid: string): Observable<Aria2Response> {
    let unPauseDownloadURL = this.getURL(environment.unPauseDownloadURL);

    return this.httpClient.post<Aria2Response>(`${unPauseDownloadURL}/${gid}`, {})
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  pauseAllDownloads(): Observable<Aria2Response> {
    let pauseAllDownloadsURL = this.getURL(environment.pauseAllDownloadsURL);

    return this.httpClient.post<Aria2Response>(pauseAllDownloadsURL, {})
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  unPauseAllDownloads(gid: string): Observable<Aria2Response> {
    let unPauseAllDownloadsURL = this.getURL(environment.unPauseAllDownloadsURL);

    return this.httpClient.post<Aria2Response>(unPauseAllDownloadsURL, {})
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  getSessionInfo(): Observable<Aria2Response> {
    let sessionInfoURL = this.getURL(environment.sessionInfoURL);

    return this.httpClient.get<Aria2Response>(sessionInfoURL)
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  removeDownload(gid: string): Observable<Aria2Response> {
    let removeDownloadURL = this.getURL(environment.removeDownloadURL);

    return this.httpClient.post<Aria2Response>(`${removeDownloadURL}/${gid}`, {})
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  forceRemoveDownload(gid: string): Observable<Aria2Response> {
    let forceRemoveDownloadURL = this.getURL(environment.forceRemoveDownloadURL);

    return this.httpClient.post<Aria2Response>(`${forceRemoveDownloadURL}/${gid}`, {})
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  removeDownloadResult(gid: string): Observable<Aria2Response> {
    let removeDownloadResultURL = this.getURL(environment.removeDownloadResultURL);

    return this.httpClient.post<Aria2Response>(`${removeDownloadResultURL}/${gid}`, {})
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  forcePauseDownload(gid: string): Observable<Aria2Response> {
    let forcePauseDownloadURL = this.getURL(environment.forcePauseDownloadURL);

    return this.httpClient.post<Aria2Response>(`${forcePauseDownloadURL}/${gid}`, {})
      .pipe(
        map(data => data),
        catchError(error => throwError(error))
      );
  }

  private getURL(resourceURL: string): string {
    return `${this.baseURLService.getBaseURL()}/api${resourceURL}`;
  }
}
