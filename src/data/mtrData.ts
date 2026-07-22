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

export interface ExternalWaypoint {
  step: number;
  instruction: string;
  chineseInstruction: string;
  direction: 'walk_forward' | 'walk_left' | 'walk_right' | 'cross_road' | 'enter_station' | 'arrive';
  distance: number;
  landmark?: string;
}

export interface ExternalARRoute {
  id: string;
  fromExit: string;
  fromDescription: string;
  toExit: string;
  toDescription: string;
  toHasLift: boolean;
  distance: number;
  waypoints: ExternalWaypoint[];
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
  externalRoutes: ExternalARRoute[];
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
        liftLocationHint: "This exit has escalator only, no lift. Exit B2 has a lift just 40m away towards Queen's College, opposite McDonald's Hill Road.",
        alternativeExit: "Use Exit B2 (Queen's College, opposite McDonald's Hill Road) for the closest lift — only 40m walk."
      },
      {
        name: "B2",
        hasLift: true,
        hasEscalator: true,
        description: "Pok Fu Lam Road / Queen's College",
        chineseDescription: "薄扶林道 / 皇仁書院",
        wheelchairFriendly: true,
        barcodeId: "HKU-B2",
        liftLocationHint: "The elevator is located about 20m behind this exit near the Queen's College park entrance, across from McDonald's Hill Road.",
        alternativeExit: "Exit B1 (nearby, opposite McDonald's Hill Road) has no lift. Use this exit B2 for step-free access."
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
    arRoutes: [
      {
        id: "hku-p1-to-exitA1",
        from: "Platform 1 (Island Line)",
        to: "Exit A1 (University Main Gate / Lift)",
        type: "to_exit",
        targetExit: "A1",
        waypoints: [
          {
            step: 1,
            instruction: "Exit the train and walk towards the rear of the platform. Look for the blue 'Lift to Concourse' sign.",
            chineseInstruction: "落車後步向月台後方，尋找藍色「往大堂升降機」標誌。",
            direction: "forward",
            distance: 15,
            landmark: "Platform 1 Lift Sign"
          },
          {
            step: 2,
            instruction: "Take the high-speed passenger lift up to the Concourse level (70m ascent).",
            chineseInstruction: "乘搭高速升降機往大堂 (上升70米)。",
            direction: "up_elevator",
            distance: 0,
            landmark: "High-Speed Platform Lift"
          },
          {
            step: 3,
            instruction: "Exit the lift on Concourse level and walk straight ahead for 25 meters, following the Exit A1 signs.",
            chineseInstruction: "在大堂落升降機後直行25米，沿A1出口指示前行。",
            direction: "forward",
            distance: 25,
            landmark: "Concourse Passage"
          },
          {
            step: 4,
            instruction: "Turn right towards Exit A1 gates. Use the wide ticket gates on the right.",
            chineseInstruction: "向右轉往A1出口閘口，使用右側的闊閘機。",
            direction: "right",
            distance: 10,
            landmark: "Wide Ticket Gates"
          },
          {
            step: 5,
            instruction: "Go through the gates and take the street-level lift to reach Pok Fu Lam Road at the University main gate.",
            chineseInstruction: "出閘後乘搭地面升降機前往薄扶林道香港大學正門。",
            direction: "up_elevator",
            distance: 5,
            landmark: "Exit A1 Street Lift"
          },
          {
            step: 6,
            instruction: "You have arrived at Pok Fu Lam Road / HKU Main Gate street level safely.",
            chineseInstruction: "你已安全抵達薄扶林道香港大學正門。",
            direction: "arrive",
            distance: 0,
            landmark: "HKU Main Gate"
          }
        ]
      }
    ],
    externalRoutes: [
      {
        id: "hku-b1-to-b2",
        fromExit: "B1",
        fromDescription: "Exit B1 (Pok Fu Lam Road / Queen Mary Hospital - Escalator only)",
        toExit: "B2",
        toDescription: "Exit B2 (Pok Fu Lam Road / Queen's College - Has Lift)",
        toHasLift: true,
        distance: 40,
        waypoints: [
          { step: 1, instruction: "From Exit B1, walk south along Pok Fu Lam Road towards Queen's College.", chineseInstruction: "從B1出口沿薄扶林道向南行，往皇仁書院方向。", direction: "walk_forward", distance: 25, landmark: "Pok Fu Lam Road" },
          { step: 2, instruction: "Cross the street at the pedestrian crossing near McDonald's Hill Road.", chineseInstruction: "在近麥當勞山道的位置使用行人過路處橫過馬路。", direction: "cross_road", distance: 0, landmark: "McDonald's Hill Road Crossing" },
          { step: 3, instruction: "Continue walking south for 15 meters to Exit B2, located near Queen's College entrance.", chineseInstruction: "繼續向南行15米到達皇仁書院入口旁的B2出口。", direction: "walk_forward", distance: 15, landmark: "Queen's College" },
          { step: 4, instruction: "You have arrived at Exit B2. Take the passenger lift here for step-free street access.", chineseInstruction: "已抵達B2出口，此處有升降機提供無障礙通道。", direction: "arrive", distance: 0, landmark: "Exit B2 Lift" }
        ]
      },
      {
        id: "hku-c2-to-c1",
        fromExit: "C2",
        fromDescription: "Exit C2 (St. John's College / Bonham Road - Escalator only)",
        toExit: "C1",
        toDescription: "Exit C1 (Bonham Road / Pok Fu Lam Road - Has Lift)",
        toHasLift: true,
        distance: 30,
        waypoints: [
          { step: 1, instruction: "From Exit C2, walk east along Bonham Road towards the Bonham Road / Pok Fu Lam Road junction.", chineseInstruction: "從C2出口沿般咸道向東行，前往般咸道與薄扶林道交界。", direction: "walk_forward", distance: 25, landmark: "Bonham Road" },
          { step: 2, instruction: "Exit C1 is located on the corner. Enter and take the lift to street level.", chineseInstruction: "C1出口位於交界處，進入後乘搭升降機前往地面。", direction: "enter_station", distance: 5, landmark: "Exit C1 Entrance" },
          { step: 3, instruction: "You have arrived at Exit C1 with step-free lift access.", chineseInstruction: "已抵達C1出口，備有升降機無障礙設施。", direction: "arrive", distance: 0, landmark: "Exit C1 Lift" }
        ]
      }
    ]
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
    ],
    externalRoutes: [
      {
        id: "cen-c-to-a",
        fromExit: "C",
        fromDescription: "Exit C (Li Yuen Street / Queen's Road Central - Stairs only)",
        toExit: "A",
        toDescription: "Exit A (Connaught Road Central / Bus Terminus - Has Lift)",
        toHasLift: true,
        distance: 100,
        waypoints: [
          { step: 1, instruction: "From Exit C on Queen's Road Central, walk north along Li Yuen Street East towards Des Voeux Road Central.", chineseInstruction: "從皇后大道中的C出口沿利源東街向北行，往德輔道中方向。", direction: "walk_forward", distance: 30, landmark: "Li Yuen Street East" },
          { step: 2, instruction: "Continue straight across Des Voeux Road Central onto Pedder Street.", chineseInstruction: "直行橫過德輔道中，進入畢打街。", direction: "walk_forward", distance: 40, landmark: "Pedder Street" },
          { step: 3, instruction: "Cross Connaught Road Central at the pedestrian crossing.", chineseInstruction: "在行人過路處橫過干諾道中。", direction: "cross_road", distance: 0, landmark: "Connaught Road Crossing" },
          { step: 4, instruction: "Exit A entrance is on the left. Enter and take the lift for step-free access.", chineseInstruction: "A出口入口在左方，進入後乘搭升降機。", direction: "enter_station", distance: 30, landmark: "Exit A Entrance" },
          { step: 5, instruction: "You have arrived at Exit A with passenger lift access to all levels.", chineseInstruction: "已抵達A出口，備有升降機連接各層。", direction: "arrive", distance: 0, landmark: "Exit A Lift" }
        ]
      },
      {
        id: "cen-b-to-a",
        fromExit: "B",
        fromDescription: "Exit B (World-Wide House / Des Voeux Road Central - Escalator only)",
        toExit: "A",
        toDescription: "Exit A (Connaught Road Central / Bus Terminus - Has Lift)",
        toHasLift: true,
        distance: 80,
        waypoints: [
          { step: 1, instruction: "From Exit B at World-Wide House, walk west along Des Voeux Road Central towards Pedder Street.", chineseInstruction: "從環球大廈B出口沿德輔道中西行，往畢打街方向。", direction: "walk_forward", distance: 50, landmark: "Des Voeux Road Central" },
          { step: 2, instruction: "Turn right onto Pedder Street and walk north towards Connaught Road Central.", chineseInstruction: "右轉入畢打街向北行，往干諾道中方向。", direction: "walk_right", distance: 20, landmark: "Pedder Street" },
          { step: 3, instruction: "Cross Connaught Road Central at the pedestrian crossing.", chineseInstruction: "在行人過路處橫過干諾道中。", direction: "cross_road", distance: 0, landmark: "Connaught Road Crossing" },
          { step: 4, instruction: "Exit A entrance is ahead. Enter and take the lift.", chineseInstruction: "前方為A出口入口，進入後乘搭升降機。", direction: "enter_station", distance: 10, landmark: "Exit A Entrance" },
          { step: 5, instruction: "You have arrived at Exit A with step-free lift access.", chineseInstruction: "已抵達A出口，備有升降機無障礙設施。", direction: "arrive", distance: 0, landmark: "Exit A Lift" }
        ]
      },
      {
        id: "cen-d1-to-a",
        fromExit: "D1",
        fromDescription: "Exit D1 (Pedder Street / Queen's Road Central - Stairs only)",
        toExit: "A",
        toDescription: "Exit A (Connaught Road Central / Bus Terminus - Has Lift)",
        toHasLift: true,
        distance: 120,
        waypoints: [
          { step: 1, instruction: "From Exit D1 at Pedder Street, walk north along Pedder Street towards Des Voeux Road Central.", chineseInstruction: "從畢打街D1出口沿畢打街向北行，往德輔道中方向。", direction: "walk_forward", distance: 50, landmark: "Pedder Street" },
          { step: 2, instruction: "Continue straight across Des Voeux Road Central, following Pedder Street towards Connaught Road Central.", chineseInstruction: "直行橫過德輔道中，沿畢打街繼續往干諾道中。", direction: "walk_forward", distance: 40, landmark: "Upper Pedder Street" },
          { step: 3, instruction: "Cross Connaught Road Central at the pedestrian crossing.", chineseInstruction: "在行人過路處橫過干諾道中。", direction: "cross_road", distance: 0, landmark: "Connaught Road Crossing" },
          { step: 4, instruction: "Exit A entrance is on the left. Enter and take the lift.", chineseInstruction: "A出口入口在左方，進入後乘搭升降機。", direction: "enter_station", distance: 30, landmark: "Exit A Entrance" },
          { step: 5, instruction: "You have arrived at Exit A with step-free lift access.", chineseInstruction: "已抵達A出口，備有升降機無障礙設施。", direction: "arrive", distance: 0, landmark: "Exit A Lift" }
        ]
      },
      {
        id: "cen-j-to-k",
        fromExit: "J",
        fromDescription: "Exit J (Chater Garden / Supreme Court - Escalator only)",
        toExit: "K",
        toDescription: "Exit K (Statue Square / Prince's Building - Has Lift)",
        toHasLift: true,
        distance: 50,
        waypoints: [
          { step: 1, instruction: "From Exit J at Chater Garden, walk east through the garden towards Statue Square.", chineseInstruction: "從遮打花園J出口向東步行穿過花園，往皇后像廣場方向。", direction: "walk_forward", distance: 40, landmark: "Chater Garden" },
          { step: 2, instruction: "Exit K is inside Prince's Building at Statue Square. Enter and use the lift.", chineseInstruction: "K出口位於皇后像廣場太子大廈內，進入後使用升降機。", direction: "enter_station", distance: 10, landmark: "Prince's Building" },
          { step: 3, instruction: "You have arrived at Exit K with lift access.", chineseInstruction: "已抵達K出口，備有升降機設施。", direction: "arrive", distance: 0, landmark: "Exit K Lift" }
        ]
      },
      {
        id: "cen-l-to-g",
        fromExit: "L1 / L2",
        fromDescription: "Exit L1/L2 (Landmark / Pedder Street - Escalator only)",
        toExit: "G",
        toDescription: "Exit G (Landmark / Queen's Road Central - Has Lift)",
        toHasLift: true,
        distance: 60,
        waypoints: [
          { step: 1, instruction: "From Exit L1/L2 at Landmark, walk through the Landmark shopping atrium towards Queen's Road Central.", chineseInstruction: "從置地廣場L1/L2出口穿過置地廣場中庭，往皇后大道中方向。", direction: "walk_forward", distance: 50, landmark: "Landmark Atrium" },
          { step: 2, instruction: "Exit G is inside Landmark with a passenger lift. Enter and use the lift for step-free access.", chineseInstruction: "G出口位於置地廣場內，備有升降機。進入後使用升降機。", direction: "enter_station", distance: 10, landmark: "Exit G Lift" },
          { step: 3, instruction: "You have arrived at Exit G with lift access.", chineseInstruction: "已抵達G出口，備有升降機設施。", direction: "arrive", distance: 0, landmark: "Exit G Lift" }
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
    ],
    externalRoutes: [
      {
        id: "mok-b1-to-c3",
        fromExit: "B1",
        fromDescription: "Exit B1 (Sai Yeung Choi Street South - Escalator only)",
        toExit: "C3",
        toDescription: "Exit C3 (Langham Place Mall Lift - Has Lift)",
        toHasLift: true,
        distance: 100,
        waypoints: [
          { step: 1, instruction: "From Exit B1 on Sai Yeung Choi Street South, walk north towards Argyle Street.", chineseInstruction: "從西洋菜南街B1出口向北行，往亞皆老街方向。", direction: "walk_forward", distance: 60, landmark: "Sai Yeung Choi Street" },
          { step: 2, instruction: "Turn right onto Argyle Street and walk east towards Langham Place.", chineseInstruction: "右轉入亞皆老街向東行，往朗豪坊方向。", direction: "walk_right", distance: 30, landmark: "Argyle Street" },
          { step: 3, instruction: "Enter Langham Place through the main entrance on Argyle Street.", chineseInstruction: "從亞皆老街正門進入朗豪坊。", direction: "enter_station", distance: 10, landmark: "Langham Place Entrance" },
          { step: 4, instruction: "Take the mall lift in the main atrium down to Basement 2 to reach Exit C3.", chineseInstruction: "乘搭中庭商場升降機到地庫2層到達C3出口。", direction: "enter_station", distance: 0, landmark: "Langham Place Atrium" },
          { step: 5, instruction: "You have arrived at Exit C3 with lift access from Langham Place.", chineseInstruction: "已抵達C3出口，可經朗豪坊升降機直達。", direction: "arrive", distance: 0, landmark: "Exit C3 Lift" }
        ]
      },
      {
        id: "mok-e2-to-c3",
        fromExit: "E2",
        fromDescription: "Exit E2 (Nathan Road / Dundas Street - Escalator only)",
        toExit: "C3",
        toDescription: "Exit C3 (Langham Place Mall Lift - Has Lift)",
        toHasLift: true,
        distance: 120,
        waypoints: [
          { step: 1, instruction: "From Exit E2 on Nathan Road, walk north along Nathan Road towards Argyle Street.", chineseInstruction: "從彌敦道E2出口沿彌敦道向北行，往亞皆老街方向。", direction: "walk_forward", distance: 80, landmark: "Nathan Road" },
          { step: 2, instruction: "Turn left onto Argyle Street and walk west towards Langham Place.", chineseInstruction: "左轉入亞皆老街向西行，往朗豪坊方向。", direction: "walk_left", distance: 30, landmark: "Argyle Street" },
          { step: 3, instruction: "Enter Langham Place through the main entrance.", chineseInstruction: "進入朗豪坊正門。", direction: "enter_station", distance: 10, landmark: "Langham Place Entrance" },
          { step: 4, instruction: "Take the mall lift down to Basement 2 to reach Exit C3.", chineseInstruction: "乘搭商場升降機到地庫2層到達C3出口。", direction: "enter_station", distance: 0, landmark: "Langham Place Lift" },
          { step: 5, instruction: "You have arrived at Exit C3 with step-free lift access.", chineseInstruction: "已抵達C3出口，備有無障礙升降機設施。", direction: "arrive", distance: 0, landmark: "Exit C3 Lift" }
        ]
      },
      {
        id: "mok-a1-to-c3",
        fromExit: "A1",
        fromDescription: "Exit A1 (Lok Man Sun Chuen / Mong Kok Road - Escalator only)",
        toExit: "C3",
        toDescription: "Exit C3 (Langham Place Mall Lift - Has Lift)",
        toHasLift: true,
        distance: 150,
        waypoints: [
          { step: 1, instruction: "From Exit A1 on Mong Kok Road, walk south along Nathan Road.", chineseInstruction: "從旺角道A1出口沿彌敦道向南行。", direction: "walk_forward", distance: 100, landmark: "Nathan Road" },
          { step: 2, instruction: "Turn right onto Argyle Street and walk west towards Langham Place.", chineseInstruction: "右轉入亞皆老街向西行，往朗豪坊方向。", direction: "walk_right", distance: 40, landmark: "Argyle Street" },
          { step: 3, instruction: "Enter Langham Place and take the mall lift to Basement 2 Exit C3.", chineseInstruction: "進入朗豪坊，乘搭商場升降機到地庫2層C3出口。", direction: "enter_station", distance: 10, landmark: "Langham Place" },
          { step: 4, instruction: "You have arrived at Exit C3 with lift access.", chineseInstruction: "已抵達C3出口，備有升降機設施。", direction: "arrive", distance: 0, landmark: "Exit C3 Lift" }
        ]
      },
      {
        id: "mok-d1-to-c3",
        fromExit: "D1",
        fromDescription: "Exit D1 (Argyle Street / Sai Yeung Choi Street South - Escalator only)",
        toExit: "C3",
        toDescription: "Exit C3 (Langham Place Mall Lift - Has Lift)",
        toHasLift: true,
        distance: 80,
        waypoints: [
          { step: 1, instruction: "From Exit D1 at Argyle Street and Sai Yeung Choi, walk west along Argyle Street towards Langham Place.", chineseInstruction: "從亞皆老街D1出口沿亞皆老街向西行，往朗豪坊方向。", direction: "walk_forward", distance: 70, landmark: "Argyle Street" },
          { step: 2, instruction: "Enter Langham Place through the main entrance on Argyle Street.", chineseInstruction: "從亞皆老街正門進入朗豪坊。", direction: "enter_station", distance: 10, landmark: "Langham Place Entrance" },
          { step: 3, instruction: "Take the mall lift down to Basement 2 to reach Exit C3.", chineseInstruction: "乘搭商場升降機到地庫2層到達C3出口。", direction: "enter_station", distance: 0, landmark: "Langham Place Lift" },
          { step: 4, instruction: "You have arrived at Exit C3 with lift access.", chineseInstruction: "已抵達C3出口，備有升降機設施。", direction: "arrive", distance: 0, landmark: "Exit C3 Lift" }
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
    ],
    externalRoutes: [
      {
        id: "adm-a-to-e",
        fromExit: "A",
        fromDescription: "Exit A (Admiralty Centre / Bus Terminus - Stairs only)",
        toExit: "E",
        toDescription: "Exit E (Rodney Street / Tamar Park - Has Lift)",
        toHasLift: true,
        distance: 100,
        waypoints: [
          { step: 1, instruction: "From Exit A at Admiralty Centre, walk east along Queensway towards Rodney Street.", chineseInstruction: "從金鐘中心A出口沿金鐘道向東行，往樂禮街方向。", direction: "walk_forward", distance: 70, landmark: "Queensway" },
          { step: 2, instruction: "Turn right onto Rodney Street. Exit E entrance is on the right side.", chineseInstruction: "右轉入樂禮街，E出口入口在右方。", direction: "walk_right", distance: 25, landmark: "Rodney Street" },
          { step: 3, instruction: "Enter Exit E and take the passenger lift for step-free access.", chineseInstruction: "進入E出口，乘搭升降機。", direction: "enter_station", distance: 5, landmark: "Exit E Entrance" },
          { step: 4, instruction: "You have arrived at Exit E with lift access to Tamar Park and streets.", chineseInstruction: "已抵達E出口，備有升降機前往添馬公園及街道。", direction: "arrive", distance: 0, landmark: "Exit E Lift" }
        ]
      },
      {
        id: "adm-b-to-e",
        fromExit: "B",
        fromDescription: "Exit B (Drake Street / Lippo Centre - Stairs only)",
        toExit: "E",
        toDescription: "Exit E (Rodney Street / Tamar Park - Has Lift)",
        toHasLift: true,
        distance: 80,
        waypoints: [
          { step: 1, instruction: "From Exit B at Lippo Centre on Drake Street, walk east along Drake Street towards Rodney Street.", chineseInstruction: "從力寶中心B出口沿德立街向東行，往樂禮街方向。", direction: "walk_forward", distance: 50, landmark: "Drake Street" },
          { step: 2, instruction: "Turn left onto Rodney Street. Exit E entrance is ahead.", chineseInstruction: "左轉入樂禮街，E出口入口在前方。", direction: "walk_left", distance: 25, landmark: "Rodney Street" },
          { step: 3, instruction: "Enter Exit E and take the passenger lift.", chineseInstruction: "進入E出口，乘搭升降機。", direction: "enter_station", distance: 5, landmark: "Exit E Entrance" },
          { step: 4, instruction: "You have arrived at Exit E with step-free lift access.", chineseInstruction: "已抵達E出口，備有無障礙升降機。", direction: "arrive", distance: 0, landmark: "Exit E Lift" }
        ]
      },
      {
        id: "adm-c1-to-e",
        fromExit: "C1",
        fromDescription: "Exit C1 (Queensway Plaza / Queensway - Stairs only)",
        toExit: "E",
        toDescription: "Exit E (Rodney Street / Tamar Park - Has Lift)",
        toHasLift: true,
        distance: 120,
        waypoints: [
          { step: 1, instruction: "From Exit C1 at Queensway Plaza, walk east along Queensway, past Pacific Place.", chineseInstruction: "從金鐘廊C1出口沿金鐘道向東行，經過太古廣場。", direction: "walk_forward", distance: 90, landmark: "Queensway" },
          { step: 2, instruction: "Turn right onto Rodney Street. Exit E entrance is on the right.", chineseInstruction: "右轉入樂禮街，E出口入口在右方。", direction: "walk_right", distance: 25, landmark: "Rodney Street" },
          { step: 3, instruction: "Enter Exit E and take the lift.", chineseInstruction: "進入E出口，乘搭升降機。", direction: "enter_station", distance: 5, landmark: "Exit E Lift" },
          { step: 4, instruction: "You have arrived at Exit E with lift access.", chineseInstruction: "已抵達E出口，備有升降機設施。", direction: "arrive", distance: 0, landmark: "Exit E Lift" }
        ]
      },
      {
        id: "adm-d-to-e",
        fromExit: "D",
        fromDescription: "Exit D (Pacific Place - Stairs to concourse, mall lift available)",
        toExit: "E",
        toDescription: "Exit E (Rodney Street / Tamar Park - Has Lift)",
        toHasLift: true,
        distance: 60,
        waypoints: [
          { step: 1, instruction: "From Exit D at Pacific Place, exit the mall onto Queensway and walk east.", chineseInstruction: "從太古廣場D出口出商場到金鐘道向東行。", direction: "walk_forward", distance: 40, landmark: "Queensway" },
          { step: 2, instruction: "Turn right onto Rodney Street. Exit E entrance is ahead.", chineseInstruction: "右轉入樂禮街，E出口入口在前方。", direction: "walk_right", distance: 15, landmark: "Rodney Street" },
          { step: 3, instruction: "Enter Exit E and take the lift to street level.", chineseInstruction: "進入E出口，乘搭升降機往地面。", direction: "enter_station", distance: 5, landmark: "Exit E Lift" },
          { step: 4, instruction: "You have arrived at Exit E with lift access.", chineseInstruction: "已抵達E出口，備有升降機設施。", direction: "arrive", distance: 0, landmark: "Exit E Lift" }
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
    ],
    externalRoutes: [
      {
        id: "tst-a2-to-a1",
        fromExit: "A2",
        fromDescription: "Exit A2 (Kowloon Park / Haiphong Road South - Escalator only)",
        toExit: "A1",
        toDescription: "Exit A1 (Kowloon Park / Haiphong Road - Has Lift)",
        toHasLift: true,
        distance: 60,
        waypoints: [
          { step: 1, instruction: "From Exit A2 on Haiphong Road, walk north along the park side of Haiphong Road towards Kowloon Park Drive.", chineseInstruction: "從海防道A2出口沿海防道公園側向北行，往九龍公園徑方向。", direction: "walk_forward", distance: 50, landmark: "Haiphong Road" },
          { step: 2, instruction: "Exit A1 entrance is on the left near the junction. Enter and use the lift.", chineseInstruction: "A1出口入口在左方交界處，進入後使用升降機。", direction: "enter_station", distance: 10, landmark: "Exit A1 Entrance" },
          { step: 3, instruction: "You have arrived at Exit A1 with step-free lift access.", chineseInstruction: "已抵達A1出口，備有無障礙升降機。", direction: "arrive", distance: 0, landmark: "Exit A1 Lift" }
        ]
      },
      {
        id: "tst-b1-to-a1",
        fromExit: "B1",
        fromDescription: "Exit B1 (Cameron Road / The ONE - Escalator only)",
        toExit: "A1",
        toDescription: "Exit A1 (Kowloon Park / Haiphong Road - Has Lift)",
        toHasLift: true,
        distance: 100,
        waypoints: [
          { step: 1, instruction: "From Exit B1 on Cameron Road, walk west towards Nathan Road.", chineseInstruction: "從金馬倫道B1出口向西行，往彌敦道方向。", direction: "walk_forward", distance: 40, landmark: "Cameron Road" },
          { step: 2, instruction: "Turn right onto Nathan Road and walk north.", chineseInstruction: "右轉入彌敦道向北行。", direction: "walk_right", distance: 30, landmark: "Nathan Road" },
          { step: 3, instruction: "Turn left onto Haiphong Road and walk west towards Kowloon Park.", chineseInstruction: "左轉入海防道向西行，往九龍公園方向。", direction: "walk_left", distance: 25, landmark: "Haiphong Road" },
          { step: 4, instruction: "Exit A1 entrance is on the right. Enter and use the lift.", chineseInstruction: "A1出口入口在右方，進入後使用升降機。", direction: "enter_station", distance: 5, landmark: "Exit A1 Entrance" },
          { step: 5, instruction: "You have arrived at Exit A1 with lift access.", chineseInstruction: "已抵達A1出口，備有升降機設施。", direction: "arrive", distance: 0, landmark: "Exit A1 Lift" }
        ]
      },
      {
        id: "tst-c1-to-h",
        fromExit: "C1",
        fromDescription: "Exit C1 (Peking Road / Chungking Mansions - Escalator only)",
        toExit: "H",
        toDescription: "Exit H (iSQUARE Mall Lift - Has Lift)",
        toHasLift: true,
        distance: 80,
        waypoints: [
          { step: 1, instruction: "From Exit C1 on Peking Road, walk east towards Nathan Road.", chineseInstruction: "從北京道C1出口向東行，往彌敦道方向。", direction: "walk_forward", distance: 40, landmark: "Peking Road" },
          { step: 2, instruction: "Turn right onto Nathan Road and walk south towards iSQUARE.", chineseInstruction: "右轉入彌敦道向南行，往國際廣場方向。", direction: "walk_right", distance: 30, landmark: "Nathan Road" },
          { step: 3, instruction: "Enter iSQUARE mall and take the passenger lift inside for step-free access.", chineseInstruction: "進入國際廣場，使用商場內的升降機。", direction: "enter_station", distance: 10, landmark: "iSQUARE Mall" },
          { step: 4, instruction: "You have arrived at Exit H (iSQUARE) with mall lift access.", chineseInstruction: "已抵達H出口（國際廣場），備有商場升降機。", direction: "arrive", distance: 0, landmark: "Exit H Lift" }
        ]
      },
      {
        id: "tst-e-to-a1",
        fromExit: "E",
        fromDescription: "Exit E (Mody Road / Chatham Road South - Stairs only)",
        toExit: "A1",
        toDescription: "Exit A1 (Kowloon Park / Haiphong Road - Has Lift)",
        toHasLift: true,
        distance: 200,
        waypoints: [
          { step: 1, instruction: "From Exit E on Mody Road, walk west towards Nathan Road.", chineseInstruction: "從麼地道E出口向西行，往彌敦道方向。", direction: "walk_forward", distance: 100, landmark: "Mody Road" },
          { step: 2, instruction: "Turn left onto Nathan Road and walk south towards Haiphong Road.", chineseInstruction: "左轉入彌敦道向南行，往海防道方向。", direction: "walk_left", distance: 70, landmark: "Nathan Road" },
          { step: 3, instruction: "Turn right onto Haiphong Road and walk west towards Kowloon Park.", chineseInstruction: "右轉入海防道向西行，往九龍公園方向。", direction: "walk_right", distance: 25, landmark: "Haiphong Road" },
          { step: 4, instruction: "Exit A1 entrance is on the right. Enter and use the lift.", chineseInstruction: "A1出口入口在右方，進入後使用升降機。", direction: "enter_station", distance: 5, landmark: "Exit A1 Entrance" },
          { step: 5, instruction: "You have arrived at Exit A1 with lift access.", chineseInstruction: "已抵達A1出口，備有升降機設施。", direction: "arrive", distance: 0, landmark: "Exit A1 Lift" }
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
    arRoutes: [],
    externalRoutes: [
      {
        id: "ken-c-to-a",
        fromExit: "C",
        fromDescription: "Exit C (Forbes Street / Sai Ning Street - Stairs only)",
        toExit: "A",
        toDescription: "Exit A (Catchick Street / New Praya - Has Lift)",
        toHasLift: true,
        distance: 80,
        waypoints: [
          { step: 1, instruction: "From Exit C on Forbes Street, walk west along Forbes Street towards Catchick Street.", chineseInstruction: "從科士街C出口沿科士街向西行，往吉席街方向。", direction: "walk_forward", distance: 50, landmark: "Forbes Street" },
          { step: 2, instruction: "Turn left onto Catchick Street. Exit A entrance is on the left side.", chineseInstruction: "左轉入吉席街，A出口入口在左方。", direction: "walk_left", distance: 25, landmark: "Catchick Street" },
          { step: 3, instruction: "Enter Exit A and take the passenger lift for step-free access.", chineseInstruction: "進入A出口，乘搭升降機。", direction: "enter_station", distance: 5, landmark: "Exit A Entrance" },
          { step: 4, instruction: "You have arrived at Exit A with lift access to the harbourfront.", chineseInstruction: "已抵達A出口，備有升降機前往海濱長廊。", direction: "arrive", distance: 0, landmark: "Exit A Lift" }
        ]
      },
      {
        id: "ken-c-to-b",
        fromExit: "C",
        fromDescription: "Exit C (Forbes Street / Sai Ning Street - Stairs only)",
        toExit: "B",
        toDescription: "Exit B (Victoria Road / Belcher's Bay - Has Lift)",
        toHasLift: true,
        distance: 100,
        waypoints: [
          { step: 1, instruction: "From Exit C on Forbes Street, walk north along Sai Ning Street towards Victoria Road.", chineseInstruction: "從科士街C出口沿西寧街向北行，往維多利亞道方向。", direction: "walk_forward", distance: 70, landmark: "Sai Ning Street" },
          { step: 2, instruction: "Turn right onto Victoria Road. Exit B entrance is on the right.", chineseInstruction: "右轉入維多利亞道，B出口入口在右方。", direction: "walk_right", distance: 25, landmark: "Victoria Road" },
          { step: 3, instruction: "Enter Exit B and take the passenger lift.", chineseInstruction: "進入B出口，乘搭升降機。", direction: "enter_station", distance: 5, landmark: "Exit B Entrance" },
          { step: 4, instruction: "You have arrived at Exit B with lift access to Belcher's Bay Park.", chineseInstruction: "已抵達B出口，備有升降機前往卑路乍灣公園。", direction: "arrive", distance: 0, landmark: "Exit B Lift" }
        ]
      }
    ]
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
