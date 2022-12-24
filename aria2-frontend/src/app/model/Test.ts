

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

interface DStats {
  bitfield: string;
  completedLength: string;
  connections: string;
  dir: string;
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

