export interface MtrExit {
  name: string;
  hasLift: boolean;
  hasEscalator: boolean;
  description: string;
  chineseDescription: string;
  wheelchairFriendly: boolean;
  locationDetails?: string;
  barcodeId?: string;
  liftLocationHint?: string;
  alternativeExit?: string;
}

export interface MtrPlatform {
  name: string;
  line: string;
  destination: string;
  hasLiftToConcourse: boolean;
  hasEscalatorToConcourse: boolean;
}

export interface ARWaypoint {
  step: number;
  instruction: string;
  chineseInstruction: string;
  direction: 'forward' | 'left' | 'right' | 'up_elevator' | 'up_escalator' | 'down_elevator' | 'down_escalator' | 'arrive';
  distance: number; // in meters
  landmark?: string;
}

export interface ARRoute {
  id: string;
  from: string;
  to: string;
  type: 'to_exit' | 'to_platform';
  targetExit?: string;
  targetPlatform?: string;
  waypoints: ARWaypoint[];
}

export interface MtrStation {
  id: string;
  name: string;
  chineseName: string;
  lines: string[];
  color: string; // Tailwind bg color class
  textColor: string; // Tailwind text color class
  exits: MtrExit[];
  platforms: MtrPlatform[];
  arRoutes: ARRoute[];
}

export const MTR_STATIONS: MtrStation[] = [
  {
    id: "hku",
    name: "HKU",
    chineseName: "香港大學",
    lines: ["Island Line"],
    color: "bg-blue-600",
    textColor: "text-white",
    exits: [
      {
        name: "A1",
        hasLift: true,
        hasEscalator: true,
        description: "Pok Fu Lam Road / The University of Hong Kong",
        chineseDescription: "薄扶林道 / 香港大學",
        wheelchairFriendly: true,
        locationDetails: "High-speed lift connects concourse directly to street level at the University main gate."
      },
      {
        name: "A2",
        hasLift: true,
        hasEscalator: true,
        description: "Pok Fu Lam Road / Hill Road",
        chineseDescription: "薄扶林道 / 山道",
        wheelchairFriendly: true,
        locationDetails: "Lift access to Pok Fu Lam Road near the HKU sports centre."
      },
      {
        name: "B1",
        hasLift: false,
        hasEscalator: true,
        description: "Pok Fu Lam Road / Queen Mary Hospital",
        chineseDescription: "薄扶林道 / 瑪麗醫院",
        wheelchairFriendly: false,
        locationDetails: "Escalator access only. No lift. For lift access, use Exits A1, A2, B2, or C1.",
        barcodeId: "HKU-B1",
        liftLocationHint: "This exit has escalator only. The nearest lift is at Exit B2, about 40m walk towards Queen's College.",
        alternativeExit: "Use Exit B2 (Queen's College) for the closest lift access with step-free route."
      },
      {
        name: "B2",
        hasLift: true,
        hasEscalator: true,
        description: "Pok Fu Lam Road / Queen's College",
        chineseDescription: "薄扶林道 / 皇仁書院",
        wheelchairFriendly: true,
        barcodeId: "HKU-B2",
        liftLocationHint: "The elevator is located about 20m behind this exit near the Queen's College park entrance.",
        alternativeExit: "Exit A1 at the University main gate also has lift access if this is crowded."
      },
      {
        name: "C1",
        hasLift: true,
        hasEscalator: true,
        description: "Bonham Road / Pok Fu Lam Road",
        chineseDescription: "般咸道 / 薄扶林道",
        wheelchairFriendly: true
      },
      {
        name: "C2",
        hasLift: false,
        hasEscalator: true,
        description: "St. John's College / Bonham Road",
        chineseDescription: "聖約翰學院 / 般咸道",
        wheelchairFriendly: false,
        locationDetails: "Escalator access only. No lift. Use Exit C1 for lift access nearby.",
        barcodeId: "HKU-C2",
        liftLocationHint: "Escalator only. The nearest lift is at Exit C1, about 30m towards Bonham Road.",
        alternativeExit: "Use Exit C1 (Bonham Road) for the closest lift access."
      }
    ],
    platforms: [
      {
        name: "Platform 1",
        line: "Island Line",
        destination: "Chai Wan",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 2",
        line: "Island Line",
        destination: "Kennedy Town",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      }
    ],
    arRoutes: []
  },
  {
    id: "central",
    name: "Central",
    chineseName: "中環",
    lines: ["Island Line", "Tsuen Wan Line", "Tung Chung Line", "Airport Express"],
    color: "bg-red-700",
    textColor: "text-white",
    exits: [
      {
        name: "A",
        hasLift: true,
        hasEscalator: true,
        description: "Concourse to Connaught Road Central / Bus Terminus",
        chineseDescription: "大堂至干諾道中 / 巴士總站",
        wheelchairFriendly: true,
        locationDetails: "Passenger lift located near Exit A connects Concourse and Street levels."
      },
      {
        name: "B",
        hasLift: false,
        hasEscalator: true,
        description: "World-Wide House / Des Voeux Road Central",
        chineseDescription: "環球大廈 / 德輔道中",
        wheelchairFriendly: false,
        locationDetails: "Escalator access only. For lifts, use Exit A."
      },
      {
        name: "C",
        hasLift: false,
        hasEscalator: false,
        description: "Li Yuen Street East & West / Queen's Road Central",
        chineseDescription: "利源東/西街 / 皇后大道中",
        wheelchairFriendly: false,
        locationDetails: "Stairs only. Not wheelchair accessible.",
        barcodeId: "CEN-C",
        liftLocationHint: "Stairs only. The nearest lift is at Exit A (Bus Terminus), about 100m walk through the concourse.",
        alternativeExit: "Use Exit A (Connaught Road Central / Bus Terminus) for step-free lift access."
      },
      {
        name: "D1",
        hasLift: false,
        hasEscalator: false,
        description: "Pedder Street / Queen's Road Central",
        chineseDescription: "畢打街 / 皇后大道中",
        wheelchairFriendly: false,
        locationDetails: "Stairs only. Not wheelchair accessible."
      },
      {
        name: "D2",
        hasLift: false,
        hasEscalator: false,
        description: "Theatre Lane / Queen's Road Central",
        chineseDescription: "戲院里 / 皇后大道中",
        wheelchairFriendly: false,
        locationDetails: "Stairs only. Not wheelchair accessible."
      },
      {
        name: "E",
        hasLift: false,
        hasEscalator: false,
        description: "Edinburgh Building / Queen's Road Central",
        chineseDescription: " Edinburgh Building / 皇后大道中",
        wheelchairFriendly: false,
        locationDetails: "Stairs only. Not wheelchair accessible."
      },
      {
        name: "F",
        hasLift: false,
        hasEscalator: false,
        description: "Chater Road / Bank of China Tower",
        chineseDescription: "遮打道 / 中銀大廈",
        wheelchairFriendly: false,
        locationDetails: "Stairs only. Not wheelchair accessible."
      },
      {
        name: "G",
        hasLift: true,
        hasEscalator: true,
        description: "Landmark / Queen's Road Central",
        chineseDescription: "置地廣場 / 皇后大道中",
        wheelchairFriendly: true,
        locationDetails: "Accessible lift connects Concourse with Landmark shopping atrium."
      },
      {
        name: "H",
        hasLift: true,
        hasEscalator: true,
        description: "Hang Seng Bank Headquarters / Des Voeux Road Central",
        chineseDescription: "恒生銀行總行 / 德輔道中",
        wheelchairFriendly: true,
        locationDetails: "Lift access available via Hang Seng Bank building."
      },
      {
        name: "J",
        hasLift: false,
        hasEscalator: true,
        description: "Chater Garden / Supreme Court",
        chineseDescription: "遮打花園 / 最高法院",
        wheelchairFriendly: false
      },
      {
        name: "K",
        hasLift: true,
        hasEscalator: true,
        description: "Statue Square / Prince's Building",
        chineseDescription: "皇后像廣場 / 太子大廈",
        wheelchairFriendly: true,
        locationDetails: "Lift inside Prince's Building can be used to reach Statue Square level."
      },
      {
        name: "L1 / L2",
        hasLift: false,
        hasEscalator: true,
        description: "Landmark / Pedder Street",
        chineseDescription: "置地廣場 / 畢打街",
        wheelchairFriendly: false
      }
    ],
    platforms: [
      {
        name: "Platform 1",
        line: "Tsuen Wan Line",
        destination: "Tsuen Wan",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 2",
        line: "Tsuen Wan Line",
        destination: "Admiralty / Central Terminus",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 3",
        line: "Island Line",
        destination: "Chai Wan",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 4",
        line: "Island Line",
        destination: "Kennedy Town",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      }
    ],
    arRoutes: [
      {
        id: "cen-p1-to-exitA",
        from: "Platform 1 (Tsuen Wan Line)",
        to: "Exit A (Lift)",
        type: "to_exit",
        targetExit: "A",
        waypoints: [
          {
            step: 1,
            instruction: "Exit the train and turn right. Walk towards the blue 'Lift to Concourse' sign.",
            chineseInstruction: "落車後向右轉，朝藍色「往大堂升降機」標誌前行。",
            direction: "right",
            distance: 12,
            landmark: "Platform 1 Lift Sign"
          },
          {
            step: 2,
            instruction: "Take the Passenger Lift L1 up to the Concourse level.",
            chineseInstruction: "乘搭 L1 號升降機往大堂。",
            direction: "up_elevator",
            distance: 0,
            landmark: "Platform Lift L1"
          },
          {
            step: 3,
            instruction: "Exit the lift on Concourse level, then go straight for 20 meters, passing the customer service center.",
            chineseInstruction: "在大堂落升降機後直行20米，經過客務中心。",
            direction: "forward",
            distance: 20,
            landmark: "Customer Service Center"
          },
          {
            step: 4,
            instruction: "Turn left towards Exit A gates. Locate the wide ticket gates on the right side.",
            chineseInstruction: "向左轉往 A 出口閘口。使用右側的闊閘機出閘。",
            direction: "left",
            distance: 15,
            landmark: "Wide Gates"
          },
          {
            step: 5,
            instruction: "Go through the gates and take the street-level Lift L2 on your immediate right to reach Connaught Road.",
            chineseInstruction: "出閘後，使用右側的 L2 號地面升降機前往干諾道中。",
            direction: "up_elevator",
            distance: 8,
            landmark: "Exit A Lift L2"
          },
          {
            step: 6,
            instruction: "You have arrived at Connaught Road Central street level safely.",
            chineseInstruction: "你已安全抵達干諾道中地面。",
            direction: "arrive",
            distance: 0,
            landmark: "Connaught Road Central"
          }
        ]
      }
    ]
  },
  {
    id: "mongkok",
    name: "Mong Kok",
    chineseName: "旺角",
    lines: ["Tsuen Wan Line", "Kwun Tong Line"],
    color: "bg-rose-500",
    textColor: "text-white",
    exits: [
      {
        name: "A1",
        hasLift: false,
        hasEscalator: true,
        description: "Lok Man Sun Chuen / Mong Kok Road",
        chineseDescription: "樂民新村 / 旺角道",
        wheelchairFriendly: false
      },
      {
        name: "A2",
        hasLift: false,
        hasEscalator: true,
        description: "Mong Kok Road / Gas Street",
        chineseDescription: "旺角道 / 氣體街",
        wheelchairFriendly: false
      },
      {
        name: "B1",
        hasLift: false,
        hasEscalator: true,
        description: "Sai Yeung Choi Street South / Industrial Trade Tower",
        chineseDescription: "西洋菜南街 / 工業貿易署大樓",
        wheelchairFriendly: false
      },
      {
        name: "B2",
        hasLift: false,
        hasEscalator: true,
        description: "Sai Yeung Choi Street South / Shantung Street",
        chineseDescription: "西洋菜南街 / 山東街",
        wheelchairFriendly: false
      },
      {
        name: "B3",
        hasLift: false,
        hasEscalator: true,
        description: "Nathan Road / Dundas Street",
        chineseDescription: "彌敦道 / 登打士街",
        wheelchairFriendly: false
      },
      {
        name: "B4",
        hasLift: false,
        hasEscalator: true,
        description: "Nathan Road / Sai Yeung Choi Street South",
        chineseDescription: "彌敦道 / 西洋菜南街",
        wheelchairFriendly: false
      },
      {
        name: "C1",
        hasLift: false,
        hasEscalator: true,
        description: "Langham Place / Portland Street",
        chineseDescription: "朗豪坊 / 砵蘭街",
        wheelchairFriendly: false
      },
      {
        name: "C2",
        hasLift: false,
        hasEscalator: true,
        description: "Langham Place / Argyle Street",
        chineseDescription: "朗豪坊 / 亞皆老街",
        wheelchairFriendly: false
      },
      {
        name: "C3",
        hasLift: true,
        hasEscalator: true,
        description: "Langham Place Basement (Direct Mall Lift Access)",
        chineseDescription: "朗豪坊地庫 (商場升降機直達)",
        wheelchairFriendly: true,
        locationDetails: "Direct indoor connection to Langham Place basement lift which goes to Portland Street and shopping levels."
      },
      {
        name: "C4",
        hasLift: false,
        hasEscalator: true,
        description: "Argyle Street / Sai Yeung Choi Street North",
        chineseDescription: "亞皆老街 / 西洋菜北街",
        wheelchairFriendly: false
      },
      {
        name: "D1",
        hasLift: false,
        hasEscalator: true,
        description: "Argyle Street / Sai Yeung Choi Street South",
        chineseDescription: "亞皆老街 / 西洋菜南街",
        wheelchairFriendly: false
      },
      {
        name: "D2",
        hasLift: false,
        hasEscalator: true,
        description: "Argyle Street / Nathan Road",
        chineseDescription: "亞皆老街 / 彌敦道",
        wheelchairFriendly: false
      },
      {
        name: "D3",
        hasLift: false,
        hasEscalator: true,
        description: "Argyle Street / Portland Street",
        chineseDescription: "亞皆老街 / 砵蘭街",
        wheelchairFriendly: false
      },
      {
        name: "E1",
        hasLift: true,
        hasEscalator: true,
        description: "Grand Plaza / Nathan Road (Wheelchair Lift)",
        chineseDescription: "雅蘭中心 / 彌敦道 (輪椅升降台)",
        wheelchairFriendly: true,
        locationDetails: "Equipped with a wheelchair stair lift. Contact station staff for assistance."
      },
      {
        name: "E2",
        hasLift: false,
        hasEscalator: true,
        description: "Nathan Road / Dundas Street",
        chineseDescription: "彌敦道 / 登打士街",
        wheelchairFriendly: false
      }
    ],
    platforms: [
      {
        name: "Platform 1",
        line: "Tsuen Wan Line",
        destination: "Tsuen Wan",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 2",
        line: "Kwun Tong Line",
        destination: "Tiu Keng Leng",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 3",
        line: "Tsuen Wan Line",
        destination: "Central",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 4",
        line: "Kwun Tong Line",
        destination: "Whampoa",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      }
    ],
    arRoutes: [
      {
        id: "mok-p3-to-exitC3",
        from: "Platform 3 (Tsuen Wan Line)",
        to: "Exit C3 (Langham Place Lift)",
        type: "to_exit",
        targetExit: "C3",
        waypoints: [
          {
            step: 1,
            instruction: "Step off the train and head towards the middle of the platform.",
            chineseInstruction: "落車後，前往月台中部。",
            direction: "forward",
            distance: 15,
            landmark: "Platform Center"
          },
          {
            step: 2,
            instruction: "Locate the Concourse Lift (Lift L3) next to the escalator.",
            chineseInstruction: "尋找位於扶手電梯旁的往大堂升降機 (L3)。",
            direction: "right",
            distance: 8,
            landmark: "Platform Lift L3"
          },
          {
            step: 3,
            instruction: "Take Lift L3 up to the upper concourse level.",
            chineseInstruction: "乘搭 L3 號升降機往高層大堂。",
            direction: "up_elevator",
            distance: 0,
            landmark: "Concourse Lift"
          },
          {
            step: 4,
            instruction: "Upon exiting the lift, turn left and walk 30 meters towards the Langham Place Exit C connection.",
            chineseInstruction: "出升降機後向左轉，直行30米朝朗豪坊C出口通道前行。",
            direction: "left",
            distance: 30,
            landmark: "Exit C Sign"
          },
          {
            step: 5,
            instruction: "Pass through the designated wide ticket gates on the right side.",
            chineseInstruction: "通過右側的闊閘機。",
            direction: "forward",
            distance: 10,
            landmark: "Wide Ticket Gates"
          },
          {
            step: 6,
            instruction: "Proceed straight into the Langham Place Basement 2 connection area and take the mall passenger lift up to Portland Street.",
            chineseInstruction: "直行進入朗豪坊地庫2層連接通道，使用商場客用升降機前往砵蘭街地面。",
            direction: "up_elevator",
            distance: 25,
            landmark: "Langham Place Mall Lift"
          },
          {
            step: 7,
            instruction: "You have arrived at the shopping atrium with elevator street access.",
            chineseInstruction: "你已抵達有升降機直達地面的商場中庭。",
            direction: "arrive",
            distance: 0,
            landmark: "Langham Place Street Level"
          }
        ]
      }
    ]
  },
  {
    id: "admiralty",
    name: "Admiralty",
    chineseName: "金鐘",
    lines: ["Tsuen Wan Line", "Island Line", "South Island Line", "East Rail Line"],
    color: "bg-blue-500",
    textColor: "text-white",
    exits: [
      {
        name: "A",
        hasLift: false,
        hasEscalator: false,
        description: "Admiralty Centre / Bus Terminus",
        chineseDescription: "金鐘中心 / 巴士總站",
        wheelchairFriendly: false,
        locationDetails: "Stairs only to concourse. Use Exit E for lift access to this area."
      },
      {
        name: "B",
        hasLift: false,
        hasEscalator: false,
        description: "Drake Street / Lippo Centre",
        chineseDescription: "德立街 / 力寶中心",
        wheelchairFriendly: false,
        locationDetails: "Stairs only to concourse."
      },
      {
        name: "C1",
        hasLift: false,
        hasEscalator: false,
        description: "Queensway Plaza / Queensway",
        chineseDescription: "金鐘廊 / 金鐘道",
        wheelchairFriendly: false,
        locationDetails: "Stairs only to concourse."
      },
      {
        name: "C2",
        hasLift: false,
        hasEscalator: false,
        description: "Queensway / Pacific Place",
        chineseDescription: "金鐘道 / 太古廣場",
        wheelchairFriendly: false,
        locationDetails: "Stairs only to concourse."
      },
      {
        name: "D",
        hasLift: false,
        hasEscalator: false,
        description: "Pacific Place (Direct Mall Lift)",
        chineseDescription: "太古廣場 (商場升降機直達)",
        wheelchairFriendly: false,
        locationDetails: "Stairs to concourse. Accessible lifts inside Pacific Place mall can be reached from the concourse."
      },
      {
        name: "E",
        hasLift: true,
        hasEscalator: true,
        description: "Rodney Street / Tamar Park / Civic Centre",
        chineseDescription: "樂禮街 / 添馬公園 / 政府總部",
        wheelchairFriendly: true,
        locationDetails: "Passenger lift located near Exit E connects the concourse to Drake Street / Rodney Street."
      }
    ],
    platforms: [
      {
        name: "Platform 1",
        line: "Tsuen Wan Line",
        destination: "Tsuen Wan",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 2",
        line: "Island Line",
        destination: "Chai Wan",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 3",
        line: "Tsuen Wan Line",
        destination: "Central",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 4",
        line: "Island Line",
        destination: "Kennedy Town",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 5",
        line: "East Rail Line",
        destination: "Lo Wu / Lok Ma Chau",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 6",
        line: "South Island Line",
        destination: "South Horizons",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      }
    ],
    arRoutes: [
      {
        id: "adm-p5-to-exitE",
        from: "Platform 5 (East Rail Line)",
        to: "Exit E (Tamar Park / Lift)",
        type: "to_exit",
        targetExit: "E",
        waypoints: [
          {
            step: 1,
            instruction: "Exit the East Rail Line train. Walk towards the central core atrium.",
            chineseInstruction: "落車後前往中庭核心區域。",
            direction: "forward",
            distance: 20,
            landmark: "Atrium Core"
          },
          {
            step: 2,
            instruction: "Take the primary vertical lift L8 up to the main Concourse level.",
            chineseInstruction: "乘搭 L8 號中庭升降機直上大堂。",
            direction: "up_elevator",
            distance: 0,
            landmark: "Core Lift L8"
          },
          {
            step: 3,
            instruction: "Exit Lift L8 on Concourse level, then proceed straight following the signs for Exit E.",
            chineseInstruction: "在大堂落升降機後直行，朝 E 出口標誌前進。",
            direction: "forward",
            distance: 25,
            landmark: "Concourse Passage"
          },
          {
            step: 4,
            instruction: "Go through the wide ticket gates next to the MTR shop.",
            chineseInstruction: "通過 MTR 商店旁的闊閘機。",
            direction: "forward",
            distance: 12,
            landmark: "Wide Gate"
          },
          {
            step: 5,
            instruction: "Look to your left to find Lift L5. Take Lift L5 up to Rodney Street.",
            chineseInstruction: "在左側尋找 L5 號升降機。乘升降機上至樂禮街地面。",
            direction: "up_elevator",
            distance: 8,
            landmark: "Exit E Lift L5"
          },
          {
            step: 6,
            instruction: "You have arrived at Rodney Street street level, with ramp access to Tamar Park.",
            chineseInstruction: "已抵達樂禮街地面，此處有斜道前往添馬公園。",
            direction: "arrive",
            distance: 0,
            landmark: "Rodney Street Street Level"
          }
        ]
      }
    ]
  },
  {
    id: "tsimshatsui",
    name: "Tsim Sha Tsui",
    chineseName: "尖沙咀",
    lines: ["Tsuen Wan Line", "West Rail Line Interchange"],
    color: "bg-yellow-600",
    textColor: "text-black",
    exits: [
      {
        name: "A1",
        hasLift: true,
        hasEscalator: true,
        description: "Kowloon Park / Haiphong Road",
        chineseDescription: "九龍公園 / 海防道",
        wheelchairFriendly: true,
        locationDetails: "Passenger lift located near Exit A1 connects the Concourse and Street level at Kowloon Park Drive."
      },
      {
        name: "A2",
        hasLift: false,
        hasEscalator: true,
        description: "Kowloon Park / Haiphong Road (South)",
        chineseDescription: "九龍公園 / 海防道 (南)",
        wheelchairFriendly: false
      },
      {
        name: "B1",
        hasLift: false,
        hasEscalator: true,
        description: "Cameron Road / The ONE",
        chineseDescription: "金馬倫道 / The ONE",
        wheelchairFriendly: false
      },
      {
        name: "B2",
        hasLift: false,
        hasEscalator: true,
        description: "Cameron Road / Mira Place",
        chineseDescription: "金馬倫道 / 美麗華商場",
        wheelchairFriendly: false
      },
      {
        name: "C1",
        hasLift: false,
        hasEscalator: true,
        description: "Peking Road / Chungking Mansions",
        chineseDescription: "北京道 / 重慶大廈",
        wheelchairFriendly: false
      },
      {
        name: "C2",
        hasLift: false,
        hasEscalator: true,
        description: "Peking Road / Knutsford Terrace",
        chineseDescription: "北京道 / 諾士佛臺",
        wheelchairFriendly: false
      },
      {
        name: "D1",
        hasLift: false,
        hasEscalator: true,
        description: "Nathan Road / Carnarvon Road",
        chineseDescription: "彌敦道 / 加拿分道",
        wheelchairFriendly: false
      },
      {
        name: "D2",
        hasLift: false,
        hasEscalator: true,
        description: "Nathan Road / Observatory Court",
        chineseDescription: "彌敦道 / 天文臺道",
        wheelchairFriendly: false
      },
      {
        name: "E",
        hasLift: false,
        hasEscalator: false,
        description: "Mody Road / Chatham Road South",
        chineseDescription: "麼地道 / 漆咸道南",
        wheelchairFriendly: false,
        locationDetails: "Stairs only. Not wheelchair accessible."
      },
      {
        name: "H",
        hasLift: true,
        hasEscalator: true,
        description: "iSQUARE (Direct Mall Lift)",
        chineseDescription: "國際廣場 (商場升降機直達)",
        wheelchairFriendly: true,
        locationDetails: "Direct connection to iSQUARE mall basement. Take the mall lift to Nathan Road or Peking Road levels."
      }
    ],
    platforms: [
      {
        name: "Platform 1",
        line: "Tsuen Wan Line",
        destination: "Tsuen Wan",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 2",
        line: "Tsuen Wan Line",
        destination: "Central",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      }
    ],
    arRoutes: [
      {
        id: "tst-p1-to-exitA1",
        from: "Platform 1 (Tsuen Wan Line)",
        to: "Exit A1 (Kowloon Park / Lift)",
        type: "to_exit",
        targetExit: "A1",
        waypoints: [
          {
            step: 1,
            instruction: "Exit the train and walk towards the front end (North) of the platform.",
            chineseInstruction: "落車後，步向月台前端 (北面)。",
            direction: "forward",
            distance: 18,
            landmark: "Platform North"
          },
          {
            step: 2,
            instruction: "Take Lift L1 near the stairs up to the Concourse level.",
            chineseInstruction: "乘搭樓梯旁的 L1 號升降機往大堂。",
            direction: "up_elevator",
            distance: 5,
            landmark: "Platform Lift L1"
          },
          {
            step: 3,
            instruction: "Exit the lift on Concourse level, turn right and walk towards the Exit A1 indicators.",
            chineseInstruction: "在大堂落升降機後向右轉，朝 A1 出口標示走。",
            direction: "right",
            distance: 22,
            landmark: "Concourse Passage"
          },
          {
            step: 4,
            instruction: "Go through the wide ticket gates.",
            chineseInstruction: "通過闊閘機。",
            direction: "forward",
            distance: 8,
            landmark: "Ticket Gates"
          },
          {
            step: 5,
            instruction: "Locate Lift L2 on your right side. Take Lift L2 up to Haiphong Road / Kowloon Park.",
            chineseInstruction: "在右邊尋找 L2 號升降機。乘升降機上至海防道/九龍公園地面。",
            direction: "up_elevator",
            distance: 12,
            landmark: "Exit A1 Lift L2"
          },
          {
            step: 6,
            instruction: "You have arrived at Haiphong Road street level with a smooth exit path.",
            chineseInstruction: "已抵達海防道地面，前方為平坦行人路。",
            direction: "arrive",
            distance: 0,
            landmark: "Haiphong Road Street Level"
          }
        ]
      }
    ]
  },
  {
    id: "kennedytown",
    name: "Kennedy Town",
    chineseName: "堅尼地城",
    lines: ["Island Line"],
    color: "bg-zinc-500",
    textColor: "text-white",
    exits: [
      {
        name: "A",
        hasLift: true,
        hasEscalator: true,
        description: "Catchick Street / New Praya",
        chineseDescription: "吉席街 / 新海旁",
        wheelchairFriendly: true,
        locationDetails: "Lift connects concourse to Catchick Street near the harbourfront promenade."
      },
      {
        name: "B",
        hasLift: true,
        hasEscalator: true,
        description: "Victoria Road / Belcher's Bay",
        chineseDescription: "維多利亞道 / 卑路乍灣",
        wheelchairFriendly: true,
        locationDetails: "Lift to Victoria Road near Belcher's Bay Park."
      },
      {
        name: "C",
        hasLift: false,
        hasEscalator: false,
        description: "Forbes Street / Sai Ning Street",
        chineseDescription: "科士街 / 西寧街",
        wheelchairFriendly: false,
        locationDetails: "Stairs only. Use Exits A or B for lift access."
      }
    ],
    platforms: [
      {
        name: "Platform 1",
        line: "Island Line",
        destination: "Chai Wan",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      },
      {
        name: "Platform 2",
        line: "Island Line",
        destination: "Kennedy Town",
        hasLiftToConcourse: true,
        hasEscalatorToConcourse: true
      }
    ],
    arRoutes: []
  }
];

export function findExitByBarcode(barcodeId: string): { station: MtrStation; exit: MtrExit } | null {
  for (const station of MTR_STATIONS) {
    for (const exit of station.exits) {
      if (exit.barcodeId === barcodeId) {
        return { station, exit };
      }
    }
  }
  return null;
}
