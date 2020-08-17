export interface DeviceHeader {
  deviceID: string;
  introducedBy: string;
}

export interface MinDiskFree {
  value: number;
  unit: string;
}

export interface Params {
  keep: string;
  cleanoutDays: string;
  command: string;
  maxAge: string;
  versionsPath: string;
}

export interface Versioning {
  type: string;
  params: Params;
}

export interface Folder {
  id: string;
  label: string;
  filesystemType: string;
  path: string;
  type: string;
  devices: DeviceHeader[];
  rescanIntervalS: number;
  fsWatcherEnabled: boolean;
  fsWatcherDelayS: number;
  ignorePerms: boolean;
  autoNormalize: boolean;
  minDiskFree: MinDiskFree;
  versioning: Versioning;
  copiers: number;
  pullerMaxPendingKiB: number;
  hashers: number;
  order: string;
  ignoreDelete: boolean;
  scanProgressIntervalS: number;
  pullerPauseS: number;
  maxConflicts: number;
  disableSparseFiles: boolean;
  disableTempIndexes: boolean;
  paused: boolean;
  weakHashThresholdPct: number;
  markerName: string;
  copyOwnershipFromParent: boolean;
  modTimeWindowS: number;
  maxConcurrentWrites: number;
  disableFsync: boolean;
  blockPullOrder: string;
}

export interface Device extends DeviceHeader {
  name: string;
  addresses: string[];
  compression: string;
  certName: string;
  introducer: boolean;
  skipIntroductionRemovals: boolean;
  paused: boolean;
  allowedNetworks: any[];
  autoAcceptFolders: boolean;
  maxSendKbps: number;
  maxRecvKbps: number;
  ignoredFolders: any[];
  pendingFolders: any[];
  maxRequestKiB: number;
}

export interface Gui {
  enabled: boolean;
  address: string;
  unixSocketPermissions: string;
  user: string;
  password: string;
  authMode: string;
  useTLS: boolean;
  apiKey: string;
  insecureAdminAccess: boolean;
  theme: string;
  debugging: boolean;
  insecureSkipHostcheck: boolean;
  insecureAllowFrameLoading: boolean;
}

export interface Ldap {
  address: string;
  bindDN: string;
  transport: string;
  insecureSkipVerify: boolean;
  searchBaseDN: string;
  searchFilter: string;
}

export interface MinHomeDiskFree {
  value: number;
  unit: string;
}

export interface Options {
  listenAddresses: string[];
  globalAnnounceServers: string[];
  globalAnnounceEnabled: boolean;
  localAnnounceEnabled: boolean;
  localAnnouncePort: number;
  localAnnounceMCAddr: string;
  maxSendKbps: number;
  maxRecvKbps: number;
  reconnectionIntervalS: number;
  relaysEnabled: boolean;
  relayReconnectIntervalM: number;
  startBrowser: boolean;
  natEnabled: boolean;
  natLeaseMinutes: number;
  natRenewalMinutes: number;
  natTimeoutSeconds: number;
  urAccepted: number;
  urSeen: number;
  urUniqueId: string;
  urURL: string;
  urPostInsecurely: boolean;
  urInitialDelayS: number;
  restartOnWakeup: boolean;
  autoUpgradeIntervalH: number;
  upgradeToPreReleases: boolean;
  keepTemporariesH: number;
  cacheIgnoredFiles: boolean;
  progressUpdateIntervalS: number;
  limitBandwidthInLan: boolean;
  minHomeDiskFree: MinHomeDiskFree;
  releasesURL: string;
  alwaysLocalNets: any[];
  overwriteRemoteDeviceNamesOnConnect: boolean;
  tempIndexMinBlocks: number;
  unackedNotificationIDs: string[];
  trafficClass: number;
  defaultFolderPath: string;
  setLowPriority: boolean;
  maxFolderConcurrency: number;
  crURL: string;
  crashReportingEnabled: boolean;
  stunKeepaliveStartS: number;
  stunKeepaliveMinS: number;
  stunServers: string[];
  databaseTuning: string;
  maxConcurrentIncomingRequestKiB: number;
}

export interface Config {
  version: number;
  folders: Folder[];
  devices: Device[];
  gui: Gui;
  ldap: Ldap;
  options: Options;
  remoteIgnoredDevices: any[];
  pendingDevices: any[];
}

export interface Connection {
  address: string;
  at: Date;
  clientVersion: string;
  connected: boolean;
  crypto: string;
  inBytesTotal: number;
  outBytesTotal: number;
  paused: boolean;
  type: string;
}

export interface TotalConnections {
  address: string;
  at: string;
  clientVersion: string;
  connected: boolean;
  crypto: string;
  inBytesTotal: number;
  outBytesTotal: number;
  paused: boolean;
  type: string;
}

export interface Error {
  error: string;
  path: string;
}

export interface Address {
  Fragment: string;
  RawQuery: string;
  Scheme: string;
  Path: string;
  RawPath: string;
  User?: any;
  ForceQuery: boolean;
  Host: string;
  Opaque: string;
}

export interface Wan {
  ForceQuery: boolean;
  User?: any;
  Host: string;
  Opaque: string;
  Path: string;
  RawPath: string;
  RawQuery: string;
  Scheme: string;
  Fragment: string;
}

export interface Lan {
  RawQuery: string;
  Scheme: string;
  Fragment: string;
  RawPath: string;
  Path: string;
  Host: string;
  Opaque: string;
  ForceQuery: boolean;
  User?: any;
}

export interface Debug {
  enabled: string[];
  facilities: { [key: string]: string };
}

// ------------------- Events -------------------

interface EventBase {
  id: number;
  globalID: number;
  time: string;
}

export interface ConfigSaved extends EventBase {
  type: "ConfigSaved";
  data: Config;
}

export interface DeviceConnected extends EventBase {
  type: "DeviceConnected";
  data: {
    addr: string;
    clientName: string;
    clientVersion: string;
    deviceName: string;
    id: string;
    type: string;
  };
}

export interface DeviceDisconnected extends EventBase {
  type: "DeviceConnected";
  data: {
    error: string;
    id: string;
  };
}

export interface DeviceDiscovered extends EventBase {
  type: "DeviceDiscovered";
  data: {
    addrs: string[];
    device: string;
  };
}

export interface DevicePaused extends EventBase {
  type: "DevicePaused";
  data: {
    device: string;
  };
}

export interface DeviceRejected extends EventBase {
  type: "DeviceRejected";
  data: {
    address: string;
    name: string;
    device: string;
  };
}

export interface DeviceResumed extends EventBase {
  type: "DeviceResumed";
  data: {
    device: string;
  };
}

export interface DownloadProgress extends EventBase {
  type: "DownloadProgress";
  data: {
    [file: string]: {
      total: number;
      pulling: number;
      copiedFromOrigin: number;
      reused: number;
      copiedFromElsewhere: number;
      pulled: number;
      bytesTotal: number;
      bytesDone: number;
    };
  };
}

export interface FolderCompletion extends EventBase {
  type: "FolderCompletion";
  data: {
    completion: number;
    device: string;
    folder: string;
  };
}

export interface FolderErrors extends EventBase {
  type: "FolderErrors";
  data: {
    errors: Error[];
    folder: string;
  };
}

export interface FolderRejected extends EventBase {
  type: "FolderRejected";
  data: {
    device: string;
    folder: string;
    folderLabel: string;
  };
}

export interface FolderScanProgress extends EventBase {
  type: "FolderScanProgress";
  data: {
    total: number;
    rate: number;
    current: number;
    folder: string;
  };
}

export interface FolderSummary extends EventBase {
  type: "FolderSummary";
  data: {
    folder: string;
    summary: {
      errors: number;
      globalBytes: number;
      globalDeleted: number;
      globalDirectories: number;
      globalFiles: number;
      globalSymlinks: number;
      globalTotalItems: number;
      ignorePatterns: boolean;
      inSyncBytes: number;
      inSyncFiles: number;
      invalid: string;
      localBytes: number;
      localDeleted: number;
      localDirectories: number;
      localFiles: number;
      localSymlinks: number;
      localTotalItems: number;
      needBytes: number;
      needDeletes: number;
      needDirectories: number;
      needFiles: number;
      needSymlinks: number;
      needTotalItems: number;
      pullErrors: number;
      sequence: number;
      state: string;
      stateChanged: string;
      version: number;
    };
  };
}

export interface ItemFinished extends EventBase {
  type: "ItemFinished";
  data: {
    action: "update" | "metadata" | "delete";
    error: string | null;
    folder: string;
    item: string;
    type: string;
  };
}

export interface ItemStarted extends EventBase {
  type: "ItemStarted";
  data: {
    action: "update" | "metadata" | "delete";
    folder: string;
    item: string;
    type: string;
  };
}

export interface ListenAddressesChanged extends EventBase {
  type: "ListenAddressesChanged";
  data: {
    address: Address;
    wan: Wan[];
    lan: Lan[];
  };
}

export interface LocalChangeDetected extends EventBase {
  type: "LocalChangeDetected";
  data: {
    action: string;
    folderID: string;
    label: string;
    path: string;
    type: string;
  };
}

export interface LocalIndexUpdated extends EventBase {
  type: "LocalIndexUpdated";
  data: {
    folder: string;
    items: number;
  };
}

export interface LoginAttempt extends EventBase {
  type: "LoginAttempt";
  data: {
    username: string;
    success: boolean;
  };
}

export interface RemoteChangeDetected extends EventBase {
  type: "RemoteChangeDetected";
  data: {
    type: string;
    action: string;
    path: string;
    label: string;
    folderID: string;
    modifiedBy: string;
  };
}

export interface RemoteDownloadProgress extends EventBase {
  type: "RemoteDownloadProgress";
  data: {
    state: {
      [key: string]: number;
    };
    device: string;
    folder: string;
  };
}

export interface RemoteIndexUpdated extends EventBase {
  type: "RemoteIndexUpdated";
  data: {
    device: string;
    folder: string;
    items: number;
  };
}

export interface Starting extends EventBase {
  type: "Starting";
  data: {
    home: string;
  };
}

export interface StartupComplete extends EventBase {
  type: "StartupComplete";
  data: null;
}

export interface StateChanged extends EventBase {
  type: "StateChanged";
  data: {
    folder: string;
    from: string;
    duration: number;
    to: string;
  };
}

export type SyncthingEvent =
  | ConfigSaved
  | DeviceConnected
  | DeviceDisconnected
  | DeviceDiscovered
  | DevicePaused
  | DeviceRejected
  | DeviceResumed
  | DownloadProgress
  | FolderCompletion
  | FolderErrors
  | FolderRejected
  | FolderScanProgress
  | FolderSummary
  | ItemFinished
  | ItemStarted
  | ListenAddressesChanged
  | LocalChangeDetected
  | LocalIndexUpdated
  | LoginAttempt
  | RemoteChangeDetected
  | RemoteDownloadProgress
  | RemoteIndexUpdated
  | Starting
  | StartupComplete
  | StateChanged;

export type SyncthingEventFromType<
  T extends SyncthingEvent["type"]
> = T extends "ConfigSaved"
  ? ConfigSaved
  : T extends "DeviceConnected"
  ? DeviceConnected
  : T extends "DeviceDisconnected"
  ? DeviceDisconnected
  : T extends "DeviceDiscovered"
  ? DeviceDiscovered
  : T extends "DevicePaused"
  ? DevicePaused
  : T extends "DeviceRejected"
  ? DeviceRejected
  : T extends "DeviceResumed"
  ? DeviceResumed
  : T extends "DownloadProgress"
  ? DownloadProgress
  : T extends "FolderCompletion"
  ? FolderCompletion
  : T extends "FolderErrors"
  ? FolderErrors
  : T extends "FolderRejected"
  ? FolderRejected
  : T extends "FolderScanProgress"
  ? FolderScanProgress
  : T extends "FolderSummary"
  ? FolderSummary
  : T extends "ItemFinished"
  ? ItemFinished
  : T extends "ItemStarted"
  ? ItemStarted
  : T extends "ListenAddressesChanged"
  ? ListenAddressesChanged
  : T extends "LocalChangeDetected"
  ? LocalChangeDetected
  : T extends "LocalIndexUpdated"
  ? LocalIndexUpdated
  : T extends "LoginAttempt"
  ? LoginAttempt
  : T extends "RemoteChangeDetected"
  ? RemoteChangeDetected
  : T extends "RemoteDownloadProgress"
  ? RemoteDownloadProgress
  : T extends "RemoteIndexUpdated"
  ? RemoteIndexUpdated
  : T extends "Starting"
  ? Starting
  : T extends "StartupComplete"
  ? StartupComplete
  : StateChanged;

export interface Status {
  alloc: number;
  connectionServiceStatus: {
    [addr: string]: {
      error: null | string;
      lanAddresses: string[];
      wanAddresses: string[];
    };
  };
  cpuPercent: number;
  discoveryEnabled: boolean;
  discoveryErrors: { [key: string]: string };
  discoveryMethods: number;
  goroutines: number;
  guiAddressOverridden: boolean;
  guiAddressUsed: string;
  lastDialStatus: any;
  myID: string;
  pathSeparator: string;
  startTime: Date;
  sys: number;
  tilde: string;
  uptime: number;
  urVersionMax: number;
}

export interface Upgrade {
  latest: string;
  majorVersion: boolean;
  newer: boolean;
  running: string;
}

export interface Version {
  arch: string;
  codename: string;
  date: Date;
  isBeta: boolean;
  isCandidate: boolean;
  isRelease: boolean;
  longVersion: string;
  os: string;
  stamp: string;
  tags: string[];
  user: string;
  version: string;
}
