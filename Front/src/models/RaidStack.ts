import MinimalBackupRequest from "./MinimalBackupRequest";

type RaidStack = {
  stack: Array<MinimalBackupRequest>;
  en_name: string;
  jp_name: string;
  level: number;
};
export default RaidStack;
