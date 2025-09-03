export interface ServerRule {
  id: number;
  text: string;
}

export interface RuleCategory {
  title: string;
  icon: string;
  rules: ServerRule[];
}

export const serverRules: RuleCategory[] = [
  {
    title: "GENERAL RULES",
    icon: "fas fa-exclamation-triangle",
    rules: [
      {
        id: 1,
        text: "External mods/hacks/glitches/duping/scripts/NVinspect are not permitted (Filters and external crosshairs are allowed)"
      },
      {
        id: 2,
        text: "No alt accounts or stream sniping"
      },
      {
        id: 3,
        text: "Do not evade combat/combat log. Wait 10 minutes after a PVP encounter before you log out or enter safezone unless it could not realistically continue"
      },
      {
        id: 4,
        text: "If you log in inside someone else's base or a locked room unexpectedly - make a ticket and do not touch anything. This includes if you log in to find your own base has been raided."
      },
      {
        id: 5,
        text: "Glitch movements (vortexing/meatballing/headglitching/etc) are banned at all times"
      },
      {
        id: 6,
        text: "Report any bugs/glitches. Abuse of bugs/glitches without reporting them will be punished. This includes de-rendering bases"
      }
    ]
  },
  {
    title: "BASE BUILDING",
    icon: "fas fa-home",
    rules: [
      {
        id: 1,
        text: "You are limited to one main base, and one stash base / FOB"
      },
      {
        id: 2,
        text: "Restricted to 25 code-locked doors/hatches/hangers/windows"
      },
      {
        id: 3,
        text: "It must be possible to raid all areas of your base on foot (No walling off loot or using a window kit as your only access to your loot room. Windows are not raid-able)."
      },
      {
        id: 4,
        text: "Your base must be constructed in a way that would be physically possible in real life. No unsupported structures. Do not build more than 2 floor kits out from a structure."
      },
      {
        id: 5,
        text: "When placing BBP Kits, you must not overlap kits in a way that prevents access or the use of raid tools"
      },
      {
        id: 6,
        text: "All mesh kits and fence kits must be fully constructed (floors/walls/fences/gates)"
      },
      {
        id: 7,
        text: "If you build onto a tall structure (such as the Municipal building, Silo or the tall Radio Tower), you must not build more than 2 floor kits out or two kits above the top of the structure."
      },
      {
        id: 8,
        text: "Secure your base, windows etc, don't give your codes to untrusted players - there is no compensation if it's your mistake"
      }
    ]
  },
  {
    title: "BASE STORAGE LIMIT",
    icon: "fas fa-boxes",
    rules: [
      {
        id: 1,
        text: "You are limited to 20 storage kits (lockers/boxes/safes/gun walls/etc) per base, plus an additional 5 per team member in your group."
      }
    ]
  },
  {
    title: "RAIDING",
    icon: "fas fa-bomb",
    rules: [
      {
        id: 1,
        text: "Alliances are allowed."
      },
      {
        id: 2,
        text: "Raiders and defenders cannot despawn/ruin loot, do any repairs or base modifications during an active raid."
      },
      {
        id: 3,
        text: "Raiders can only drop loot from storages if they are doing so to take the storage kit. Do not to despawn unwanted loot"
      },
      {
        id: 4,
        text: "Do not combat log with gear while being raided. If you need to log off with valid reason say so and don't log off with valuables"
      },
      {
        id: 5,
        text: "Do not abuse hologram/kit placement to raid (one ladder placed on the floor is allowed)"
      },
      {
        id: 6,
        text: "Glitch methods (I.E fireplaces/punching through windows/misusing vehicles/floating entities/etc) are not allowed"
      },
      {
        id: 7,
        text: "A raid is considered active for 15 minutes after the last use of explosives or raid tools."
      }
    ]
  },
  {
    title: "SAFEZONE",
    icon: "fas fa-shield-alt",
    rules: [
      {
        id: 1,
        text: "Unattended dropped items are free game. Otherwise, do not touch whats not yours (including vehicles that are not yours)"
      },
      {
        id: 2,
        text: "No safezone camping, blocking, following or abusing safezone protection. Should you need to kill another player in self defense while entering or leaving safezone, leave their loot"
      },
      {
        id: 3,
        text: "Unattended ungaraged vehicles at safezone may be deleted after 12hrs, (Place it or lose it.....)"
      }
    ]
  }
];
