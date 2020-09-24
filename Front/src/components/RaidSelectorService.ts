import NameLevelDuet from "../models/NameLeveLDuet";

class RaidSelector {
  selector: Array<NameLevelDuet>;

  constructor() {
    this.selector = [];
  }

  exists(raid: NameLevelDuet): boolean {
    let res = false;
    const s = this.selector;
    try {
      Object.keys(s).forEach((key) => {
        const k = parseInt(key);
        if (s[k].name === raid.name && s[k].level === raid.level) {
          res = true;
          throw res;
        }
      });
    } catch {}
    return res;
  }

  push(raid: NameLevelDuet): RaidSelector {
    if (!this.exists(raid)) this.selector.push(raid);
    return this;
  }

  remove(raid: NameLevelDuet): RaidSelector {
    console.log("a");
    this.selector = this.selector.filter(
      (val) => val.name !== raid.name || val.level !== raid.level
    );
    console.log(this.list());
    return this;
  }

  list(): Array<NameLevelDuet> {
    return this.selector;
  }
}

export default RaidSelector;
