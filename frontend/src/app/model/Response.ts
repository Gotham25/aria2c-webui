
interface ResponseCommon {
  statusCode: number;
  status: string;
  timestamp: string;
}


export interface APIStatus extends ResponseCommon {
  message: string;
}


export interface FeedResponse extends ResponseCommon{
  systemStats: SystemStats;
  downloadStats: [DStats[]];
}


interface URI {
  status: string;
  uri: string;
}

interface File {
  completedLength: string;
  index: string;
  length: string;
  path: string;
  selected: string;
  uris: URI[];
}

export interface DStats {
  bitfield: string;
  completedLength: string;
  connections: string;
  dir: string;
  downloadUrl: string;
  downloadSpeed: string;
  files: File[],
  gid: string;
  numPieces: string;
  pieceLength: string;
  status: string;
  totalLength: string;
  uploadLength: string;
  uploadSpeed: string;
}

export interface OsInfo {
  name: string;
  type: string;
  release: string;
  platform: string;
  architecture: string;
  version: string;
}

export interface MemoryInfo {
  totalMemory: string;
  freeMemory: string;
  loadAverage: string;
}

export interface MiscellaneousInfo {
  uptime: string;
  homeDir: string;
  tmpDir: string;
}

export interface UserInfo {
  uid: number;
  gid: number;
  username: string;
  homedir: string;
  shell?: any;
}

export interface NetworkStats {
  address: string;
  netmask: string;
  family: string;
  mac: string;
  internal: boolean;
  cidr: string;
  scopeid: number;
  name: string;
}

export interface SystemStats {
  osInfo: OsInfo;
  memoryInfo: MemoryInfo;
  miscellaneousInfo: MiscellaneousInfo;
  userInfo: UserInfo;
  networkInfo: NetworkStats[];
}
