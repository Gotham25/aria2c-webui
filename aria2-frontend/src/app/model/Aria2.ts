
export interface Aria2Response {
  aria2cRPCMethod: string;
  result: Version | SessionInfo | GlobalOptions | GlobalStats | string | string[];
  statusCode: number;
  error?: any;
}

export interface Aria2Request {
  uris: string[];
  params: any;
}

export interface Version {
  enabledFeatures: string[];
  version: string;
}

export interface SessionInfo {
  sessionId: string;
}

export interface GlobalOptions {
  'check-integrity': string;
  'connect-timeout': string;
  continue: string;
  'download-result': string;
  'enable-http-keep-alive': string;
  'enable-http-pipelining': string;
  'keep-unfinished-download-result': string;
  log: string;
  'log-level': string;
  'max-concurrent-downloads': string;
  'max-connection-per-server': string;
  'max-download-result': string;
  'max-tries': string;
  'optimize-concurrent-downloads': string;
  'remote-time': string;
  'reuse-uri': string;
  'save-cookies': string;
  'save-session': string;
  split: string;
  timeout: string;
  'use-head': string;
}

export interface GlobalStats {
  downloadSpeed: string;
  numActive: string;
  numStopped: string;
  numStoppedTotal: string;
  numWaiting: string;
  uploadSpeed: string;
}

