// ===== RESUME CONTENT DATA =====

export const resumeContent = {
    home: {
        title: "Gustave 的數位宇宙 🚀",
        greeting: "嘿，我是 Gustave。",
        description: "這裡是我的一點紀錄 — 寫過的程式、做過的專案、還有一些關於我的事。",
        instruction: "左上角選單可以看看我在幹嘛。"
    },

    about: {
        title: "在霓虹燈閃爍的賽博龐克城市中",
        subtitle: "ABOUT ME",
        intro: `白天，我是 R&D 軟體工程師，負責軟韌開發。
晚上，我練電吉他、喝啤酒，或是研究自己的東西。`,

        background: `台科大資工系學生，目前在一位做 Linux Driver 的老師底下研究 HDD 的 IMR (主要) 和 SMR。同時在 Accton 做硬體驗證的工作 — 寫 Python 診斷工具、處理 log、搞網路測試。`,

        languages: "會三種語言：中文、英文、法文。曾經去比利時交換過一年，那段時間改變了不少想法。",

        achievements: `ICPC Taiwan Top 30%，喜歡解題，但現在更喜歡做點實際能用的東西。創了個調酒社，現在 50 多人，主要是覺得分子調酒這件事挺有意思的 — 精確、實驗性強，跟寫程式有點像。`,

        current: "最近在做 Unity 遊戲開發，一個調酒模擬器。也持續在優化之前寫的 log 解析系統，加了多人協作功能。",

        future: {
            title: "關於未來",
            content: "短期想把 HDD 的研究做出點成果，長期還在想。可能會往系統層的方向走，或是繼續做遊戲開發 — 還沒完全決定，但我覺得不用急著定下來。重要的是持續做有意思的事，技術會慢慢累積。"
        }
    },

    skills: {
        title: "搖滾舞台的聚光燈下",
        subtitle: "SKILLS",
        core: {
            title: "核心技能",
            items: [
                {
                    name: "Python",
                    icon: "🐍",
                    level: 95,
                    description: "我的程式母語，最熟悉的語言。從硬體診斷到 log 解析都在用。"
                },
                {
                    name: "C/C++",
                    icon: "⚡",
                    level: 85,
                    description: "目前在研究 Linux Driver 和 HDD，主要用這個。"
                },
                {
                    name: "JavaScript/React",
                    icon: "⚛️",
                    level: 80,
                    description: "做過不少 web 專案，Firebase 整合、前後端都摸過。"
                }
            ]
        },
        domains: {
            title: "開發領域",
            items: [
                "系統層開發 - Linux Driver 研究中，對底層的東西越來越感興趣。",
                "硬體驗證 - 64-worker 平行測試、iperf 網路驗證、自動化診斷。",
                "遊戲開發 - Unity 為主，之前用 Three.js 做過網頁版。",
                "全端開發 - React + Firebase + Node.js，做過社團管理、評分系統。"
            ]
        },
        other: {
            title: "其他",
            items: [
                "演算法 - ICPC Taiwan Top 30%，喜歡解題但不會特別刷題。",
                "多語言 - 中文、英文、法文，比利時交換學來的。"
            ]
        }
    },

    projects: {
        title: "走進復古遊戲廳",
        subtitle: "PROJECTS",
        items: [
            {
                name: "Bartender Simulator",
                icon: "🍸",
                type: "Unity 3D",
                description: "完整的 3D 調酒模擬遊戲。有 QTE 調酒系統、AI 顧客（會有情緒和喜好）、真實的調酒配方。多人協作開發，我負責核心機制。",
                tags: ["Unity", "C#", "Game AI", "QTE System"],
                color: 0xFF00FF
            },
            {
                name: "Drain3Parser Editor",
                icon: "🔍",
                type: "Web Platform",
                description: "多使用者 log 分析平台。Template matching + 規則引擎，支援 workspace 隔離的多人協作。從單機版做到雲端服務。",
                tags: ["Python", "React", "Firebase", "Log Parser"],
                color: 0x00FFFF
            },
            {
                name: "Hardware Validation Framework",
                icon: "🧪",
                type: "Enterprise System",
                description: "企業級測試系統。64-worker 平行記憶體測試、iperf 網路驗證、自動化診斷。在 Accton 實際使用。",
                tags: ["Python", "Parallel Testing", "Network", "Automation"],
                color: 0xFFFF00
            },
            {
                name: "Three.js Bar Simulator",
                icon: "🎲",
                type: "Web 3D",
                description: "我的第一個完整遊戲專案。網頁版 3D 調酒體驗，有 NPC 互動和物理引擎。",
                tags: ["Three.js", "WebGL", "3D", "Physics"],
                color: 0x9D00FF
            },
            {
                name: "Firebase 系列",
                icon: "🔥",
                type: "Full Stack",
                description: "社團管理系統 - 50+ 成員用的數位平台\nPeer evaluation - 團隊協作評分工具\n選課自動化 - 跟學校搶課系統對抗",
                tags: ["Firebase", "React", "Real-time", "Automation"],
                color: 0xFF6347
            }
        ]
    },

    experience: {
        title: "穿越時光隧道",
        subtitle: "EXPERIENCE",
        items: [
            {
                company: "Accton Technology",
                role: "R&D Software Engineer",
                period: "現在",
                icon: "🔧",
                description: "做硬體驗證相關的軟韌開發：",
                details: [
                    "Python 診斷框架",
                    "64-worker 平行測試架構",
                    "iperf 網路測試整合",
                    "Log 解析工具"
                ],
                color: 0xFF00FF
            },
            {
                company: "NTUST Research",
                role: "Research Assistant",
                period: "進行中",
                icon: "🔬",
                description: "在做 Linux Driver 的老師底下研究 HDD 的 IMR/SMR（主要是 IMR）。C/C++ 開發。",
                details: [],
                color: 0x00FFFF
            },
            {
                company: "過去的經驗",
                role: "Various",
                period: "2021-2023",
                icon: "💡",
                description: "",
                details: [
                    "無線通訊研究",
                    "網路安全研究",
                    "量化交易初探"
                ],
                color: 0x9D00FF
            }
        ]
    },

    education: {
        title: "在知識的星系中航行",
        subtitle: "EDUCATION",
        items: [
            {
                school: "National Taiwan University of Science and Technology",
                degree: "資訊工程系",
                period: "現在",
                icon: "🎓",
                description: "目前在這裡讀書，同時做 Linux Driver 和 HDD 相關研究。",
                courses: ["Linux Driver", "HDD Research", "Operating Systems", "Computer Networks"],
                color: 0xFF00FF
            },
            {
                school: "Université de Liège, Belgium",
                degree: "交換學生",
                period: "2021-2022",
                icon: "🌍",
                description: "在比利時待了一年。學會法文，也改變了一些看事情的角度。",
                courses: ["French Language", "European Culture", "International Experience"],
                color: 0x00FFFF
            },
            {
                school: "National Central University",
                degree: "起點",
                period: "2018-2021",
                icon: "🏆",
                description: "ICPC Taiwan Top 30% 是在這裡訓練出來的。演算法和資料結構的基礎也是。",
                courses: ["Algorithms", "Data Structures", "Competitive Programming"],
                color: 0xFFFF00
            }
        ]
    },

    hobbies: {
        title: "卡通樂園的奇幻世界",
        subtitle: "HOBBIES",
        items: [
            {
                name: "分子調酒研究社創辦人",
                icon: "🍹",
                description: "從 0 做到 50+ 成員。覺得分子調酒這件事很有意思 — 精確的配方、實驗性的嘗試，跟寫程式有點像。",
                color: 0xFF69B4
            },
            {
                name: "電吉他",
                icon: "🎸",
                description: "晚上的主要活動之一。還在練，但就是喜歡。",
                color: 0xFF6347
            },
            {
                name: "遊戲開發",
                icon: "🎮",
                description: "從 Three.js 到 Unity，用程式碼做自己想玩的遊戲。目前在做調酒模擬器。",
                color: 0x9D00FF
            },
            {
                name: "演算法 & 競程",
                icon: "💻",
                description: "ICPC Taiwan Top 30%。喜歡解題的感覺，但不會強迫自己刷題。",
                color: 0x00CED1
            },
            {
                name: "其他",
                icon: "🍺",
                description: "喝啤酒\n研究自己有興趣的技術\n剛開始一段新的關係\n偶爾思考未來要做什麼",
                color: 0xFFD700
            }
        ]
    },

    contact: {
        title: "網路節點連線中",
        subtitle: "CONTACT",
        quote: "\"還在找自己的節奏，但至少現在做的事情都挺有意思的。\" — Gustave",

        professional: {
            title: "💼 專業",
            items: [
                { label: "GitHub", value: "github.com/gustave", icon: "📂" },
                { label: "LinkedIn", value: "linkedin.com/in/gustave", icon: "💼" },
                { label: "Email", value: "gustave@example.com", icon: "📧" }
            ]
        },

        languages: {
            title: "🌐 語言",
            items: ["中文", "English", "Français"]
        },

        status: {
            title: "🔗 狀態",
            message: "通常 24 小時內會回"
        }
    }
};

export default resumeContent;
