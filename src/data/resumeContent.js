// ===== RESUME CONTENT DATA =====

export const resumeContent = {
    home: {
        title: "Gustave 的數位宇宙 🚀",
        greeting: "嘿，我是 Gustave。",
        description: "這裡是我的一點紀錄 — 寫過的程式、做過的專案、還有一些關於我的事。\n\n在虛擬世界，我更常被叫 cake11298（競程和技術社群的 ID）或蛋糕大叔。\n\n目前是台科大資工系學生（GPA 4.21/4.3），同時在 Accton 做 R&D，研究 Linux Driver 和 HDD storage systems。",
        instruction: "左上角選單可以看看我在幹嘛。"
    },

    about: {
        title: "在霓虹燈閃爍的賽博龐克城市中",
        subtitle: "ABOUT ME",
        intro: `白天，我是 R&D 軟體工程師，負責軟韌開發和硬體驗證。
晚上，我練電吉他、喝啤酒、寫 code，或是研究自己有興趣的技術。`,

        background: `台科大資工系學生（GPA 4.21/4.3），目前在一位做 Linux Driver 的老師底下研究 HDD 的 IMR (主要) 和 SMR。同時在 Accton 做硬體驗證的工作 — 寫 Python 診斷工具、處理 log、搞網路測試。

在 Accton 的工作中，我主要負責開發自動化測試框架。最近做的 log 解析系統性能提升了 700%，還實作了支援多人協作的 workspace 隔離機制。`,

        languages: "會三種語言：中文、英文、法文（DELF B1）。曾經去比利時交換過一年，那段時間改變了不少想法。目前正在準備雅思。",

        achievements: `ICPC Taiwan Top 30%，喜歡解題，但現在更喜歡做點實際能用的東西。

創了個調酒社，從 0 做到 50 多人，主要是覺得分子調酒這件事挺有意思的 — 精確的配方、實驗性的嘗試，跟寫程式有點像。管理社團也學到不少 soft skills，像是如何帶人、如何讓大家有參與感。

技術上，我特別關注系統層的東西。最近在學 Modern C++ 的 coroutines、研究 Linux kernel、還有 CUDA C。覺得 embedded/firmware 這條路比較不會被 AI 取代，而且供需關係還不錯。`,

        current: "完成了軟體工程課的 Unity 調酒模擬器專案。也持續在優化之前在 Accton 寫的 log 解析系統，加了多人協作功能。同時在準備申請台大研究所，計畫往系統架構方向深入。",

        future: {
            title: "關於未來",
            content: "短期想把 HDD 的研究做出點成果，申請上台大研究所。長期往系統層/embedded 方向走，可能考慮出國深造。但我覺得不用急著定下來，重要的是持續做有意思的事，技術會慢慢累積。"
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
                    description: "我的程式母語，最熟悉的語言。從硬體診斷到 log 解析都在用。熟悉 asyncio、多執行緒、效能優化。"
                },
                {
                    name: "C/C++",
                    icon: "⚡",
                    description: "目前在研究 Linux Driver 和 HDD，主要用這個。正在學 Modern C++17/20 的新特性，特別是 coroutines。"
                },
                {
                    name: "JavaScript/React",
                    icon: "⚛️",
                    description: "做過不少 web 專案，Firebase 整合、前後端都摸過。這個網站就是用 Three.js 做的。"
                },
                {
                    name: "Linux/Embedded",
                    icon: "🐧",
                    description: "正在深入學習 Linux kernel、driver 開發、還有 embedded systems。這是我未來想專注的方向。"
                }
            ]
        },
        domains: {
            title: "開發領域",
            items: [
                "💾 系統層開發 - Linux Driver 研究中，IMR/SMR storage systems。對底層的東西越來越感興趣。熟悉 SSH/UART 監控、系統診斷。",
                "🧪 硬體驗證 - 64-worker 平行測試架構、iperf 網路驗證、自動化診斷框架。實際在企業環境使用的系統，支援多種硬體平台。",
                "⚡ 效能優化 - Log 解析系統從單執行緒優化到 700% 效能提升。懂得如何 profiling、找 bottleneck、然後解決它。",
                "🎮 遊戲開發 - Unity 為主，之前用 Three.js 做過網頁版。喜歡做互動性強的東西。目前在做調酒模擬器，整合 ML-Agents 和物理引擎。",
                "🌐 全端開發 - React + Firebase + Node.js 技術棧。做過社團管理系統、評分系統、選課自動化。這個 3D 網站也是我自己寫的。",
                "🤖 AI/ML - 對 ML 有基本了解，用過 ML-Agents 訓練遊戲 AI。正在學 CUDA C，想做一些 GPU programming。"
            ]
        },
        learning: {
            title: "正在學習",
            items: [
                "Modern C++ - Coroutines、RAII、move semantics、template metaprogramming",
                "Linux Kernel - Driver development、IMR/SMR storage、kernel module",
                "CUDA C - 對 GPU programming 和平行運算有興趣",
                "FFmpeg/Qt - 想做一些多媒體相關的專案",
                "System Design - 大型系統的架構設計和優化策略"
            ]
        },
        other: {
            title: "其他能力",
            items: [
                "🏆 演算法 - ICPC Taiwan Top 30%，喜歡解題但不會特別刷題。對 graph theory 和 dynamic programming 特別有興趣。",
                "🌍 多語言 - 中文（母語）、英文（Fluent）、法文（DELF B1），比利時交換學來的。能用英文做技術溝通。",
                "👥 領導力 - 創立並管理 50+ 人的調酒社。多人專案協作經驗（Unity 遊戲、測試框架）。",
                "📊 專案管理 - 平衡工作、研究、學業的時間管理能力。知道如何排優先順序、如何說不。"
            ]
        }
    },

    projects: {
        title: "走進復古遊戲廳",
        subtitle: "PROJECTS & WORKS",
        featured: {
            title: "精選專案",
            items: [
                {
                    name: "Drain3Parser Editor",
                    icon: "🔍",
                    type: "Web Platform",
                    description: "多使用者 log 分析平台。Template matching + 規則引擎，支援 workspace 隔離的多人協作。從單機版做到雲端服務。性能優化達到 700% 提升。",
                    techDetails: "使用 Firebase Firestore 做 real-time sync、React Context 管理狀態、Python 後端處理 log parsing。實作了 diff algorithm 讓多人編輯不衝突。加入 debouncing 和 throttling 優化效能。",
                    achievements: [
                        "⚡ 700% 效能提升（從單執行緒到多執行緒）",
                        "👥 支援多人協作，workspace 隔離",
                        "🔄 Real-time synchronization",
                        "🏢 Accton 團隊每天使用"
                    ],
                    tags: ["Python", "React", "Firebase", "Log Parser", "Real-time", "Collaboration"],
                    status: "已部署（生產環境）",
                    links: {
                        demo: "內部系統",
                        github: "私有 repo"
                    },
                    color: 0x00FFFF
                },
                {
                    name: "Hardware Validation Framework",
                    icon: "🧪",
                    type: "Enterprise System",
                    description: "企業級硬體測試系統。64-worker 平行記憶體測試、iperf 網路驗證、自動化診斷。在 Accton 實際使用，支援 SSH/UART 雙通道監控。",
                    techDetails: "使用 Python multiprocessing 實作平行架構、parametrize 驅動測試案例、整合 pytest 做報告生成。支援動態 worker 分配和錯誤隔離。實作了 SSH/UART 雙通道監控，確保測試可靠性。",
                    achievements: [
                        "⚡ 64-worker 平行架構，大幅提升測試效率",
                        "🔧 支援多種網路設備平台",
                        "📊 自動化報告生成和錯誤追蹤",
                        "🏢 企業級生產環境使用"
                    ],
                    tags: ["Python", "Parallel Testing", "Network", "Automation", "pytest", "SSH/UART"],
                    status: "生產環境（持續維護）",
                    links: {
                        demo: "內部系統",
                        github: "私有 repo"
                    },
                    color: 0xFFFF00
                }
            ]
        },
        others: {
            title: "其他專案",
            items: [
                {
                    name: "Three.js Bar Simulator",
                    icon: "🎲",
                    type: "Web 3D",
                    description: "我的第一個完整遊戲專案。網頁版 3D 調酒體驗，有 NPC 互動和物理引擎。這個專案讓我學會了 3D 開發的基礎，也是這個網站的前身。",
                    tags: ["Three.js", "WebGL", "3D", "Physics", "Game Design"],
                    status: "已完成",
                    color: 0x9D00FF
                },
                {
                    name: "ESP32 + Firebase IoT",
                    icon: "📡",
                    type: "IoT",
                    description: "使用 ESP32 開發的 IoT 專案，連接 Firebase 做 real-time 控制。學到了 embedded programming 和雲端整合的基礎。",
                    tags: ["ESP32", "Firebase", "IoT", "C++", "Real-time"],
                    status: "已完成",
                    color: 0x00FF00
                }
            ]
        },
        techWriting: {
            title: "技術分享",
            description: "記錄開發過程中遇到的問題和解決方案",
            items: [
                "如何優化 Python log parsing 達到 700% 效能提升",
                "64-worker 平行測試架構的設計心得",
                "從 Three.js 到 Unity：我的遊戲開發之路",
                "Firebase Real-time 多人協作的坑和解決方案"
            ]
        }
    },

    experience: {
        title: "穿越時光隧道",
        subtitle: "EXPERIENCE & JOURNEY",
        items: [
            {
                company: "Accton Technology",
                role: "R&D Software Engineer (Part-time)",
                period: "2025/6 - 現在",
                location: "Taiwan",
                icon: "🔧",
                description: "做硬體驗證相關的軟韌開發，每週工作三天：",
                details: [
                    "開發 Python 診斷框架，支援 SSH/UART 雙通道監控",
                    "設計 64-worker 平行測試架構，大幅提升測試效率",
                    "整合 iperf 網路測試，自動化網路設備驗證流程",
                    "Log 解析工具效能優化 700%，並加入多人協作功能",
                    "支援多種硬體平台的測試案例開發和維護"
                ],
                achievements: "從單機工具進化為企業級協作平台，實際解決團隊痛點。系統被團隊每天使用，大幅提升工作效率。",
                skills: ["Python", "Testing", "Automation", "Network", "Linux"],
                color: 0xFF00FF
            },
            {
                company: "NTUST Research Lab",
                role: "Research Assistant - Linux Driver & HDD",
                period: "2025/12 - 進行中",
                location: "Taiwan",
                icon: "🔬",
                description: "在做 Linux Driver 的老師底下研究 HDD 的 IMR/SMR（主要是 IMR）：",
                details: [
                    "研究 HDD 的 Interlaced Magnetic Recording (IMR) 技術",
                    "使用 C/C++ 進行 Linux kernel driver 開發",
                    "分析 storage system 的效能特性和優化策略",
                    "閱讀和理解 Linux kernel source code",
                    "實作和測試 driver module"
                ],
                learning: "深入理解 OS、storage、driver layer 的運作原理。學到如何讀 kernel code、如何 debug driver、如何用 C 寫 production-level 的 code。",
                skills: ["C/C++", "Linux Kernel", "Driver Development", "Storage Systems"],
                color: 0x00FFFF
            },
            {
                company: "Molecular Innovative Bartending Research Society",
                role: "Founder & President",
                period: "2023 - 現在",
                location: "NCU",
                icon: "🍹",
                description: "創立並管理分子調酒研究社：",
                details: [
                    "從 0 建立社團，成長到 50+ 活躍成員",
                    "設計和執行每週活動，包含理論和實作",
                    "開發社團管理系統（Firebase + React）",
                    "管理預算、採購設備、協調場地",
                    "培養幹部團隊，建立社團文化"
                ],
                learning: "學到很多 soft skills — 如何帶人、如何讓大家有參與感、如何處理衝突。也學會了專案管理、預算控制、活動企劃。",
                skills: ["Leadership", "Project Management", "Communication", "Event Planning"],
                color: 0x9D00FF
            },
            {
                company: "Past Experience",
                role: "Various Research & Projects",
                period: "2021-2023",
                location: "Taiwan & Belgium",
                icon: "💡",
                description: "累積多元經驗：",
                details: [
                    "無線通訊研究 - 在中央大學研究 5G/6G 相關技術",
                    "網路安全研究 - 學習 penetration testing 和 security analysis",
                    "量化交易初探 - 用 Python 寫 trading bot，學到金融和數據分析",
                    "比利時交換 - 在 Université de Liège 學習，拿到法文 DELF B1"
                ],
                learning: "這段時間讓我探索了很多不同領域，雖然最後選擇專注在系統層開發，但這些經驗拓寬了我的視野。",
                skills: ["Research", "Wireless Communication", "Security", "French", "Adaptability"],
                color: 0xFFFF00
            }
        ],
        timeline: {
            title: "關鍵時刻",
            events: [
                { year: "2024", event: "加入 Accton，開始 HDD 研究", impact: "找到系統層開發的興趣" },
                { year: "2023", event: "創立調酒社，轉學台科大", impact: "學會領導和管理" },
                { year: "2022", event: "從比利時回台，拿到 DELF B1", impact: "語言能力和國際視野" },
                { year: "2021", event: "ICPC Taiwan Top 30%", impact: "演算法基礎打穩" },
                { year: "2018", event: "進入中央大學資電不分系", impact: "開始程式之路" }
            ]
        }
    },

    education: {
        title: "在知識的星系中航行",
        subtitle: "EDUCATION & LEARNING",
        items: [
            {
                school: "National Taiwan University of Science and Technology",
                schoolCN: "國立臺灣科技大學",
                degree: "Computer Science & Information Engineering",
                degreeCN: "資訊工程系",
                period: "2025 - 2027 (預計)",
                gpa: "4.21 / 4.3",
                icon: "🎓",
                description: "目前在這裡讀書，同時做 Linux Driver 和 HDD 相關研究。正在準備申請研究所，目標系統架構方向。",
                highlights: [
                    "GPA 4.21/4.3，保持高學術水準",
                    "Linux Driver & HDD Research（IMR/SMR）",
                    "每學期修課 19-23 學分，同時兼顧工作和研究"
                ],
                courses: [
                    "Operating Systems",
                    "Computer Networks",
                    "Software Engineering",
                    "Linux Driver Development (研究)",
                    "Storage Systems (研究)"
                ],
                activities: [
                    "Part-time R&D Engineer at Accton"
                ],
                color: 0xFF00FF
            },
            {
                school: "Université de Liège",
                schoolCN: "比利時列日大學",
                degree: "Computer Science | Exchange Student",
                degreeCN: "電腦科學系 | 交換學生",
                period: "2024 - 2025",
                location: "Liège, Belgium",
                icon: "🌍",
                description: "在比利時待了一年。學會法文，也改變了一些看事情的角度。這段經驗讓我更獨立，也更清楚自己想要什麼。",
                highlights: [
                    "取得法文 DELF B1 證照",
                    "體驗歐洲文化和教育體系",
                    "培養跨文化溝通能力"
                ],
                courses: [
                    "French Language",
                    "Parallel Programming",
                    "Network Engineering",
                    "Network Infrastructure",
                    "Principle of Management"
                ],
                learning: "學到如何適應不同文化、如何獨立生活、如何用不同語言溝通。這段經驗對我的世界觀影響很大。",
                color: 0x00FFFF
            },
            {
                school: "National Central University",
                schoolCN: "國立中央大學",
                degree: "Electrical Engineering & Computer Science",
                degreeCN: "資訊電機不分系",
                period: "2022 - 2025",
                icon: "🏆",
                description: "我的程式啟蒙地。ICPC Taiwan Top 30% 是在這裡訓練出來的，演算法和資料結構的基礎也是。",
                highlights: [
                    "ICPC Taiwan Top 30%",
                    "建立紮實的演算法和資料結構基礎",
                    "完成多個競程專案和比賽"
                ],
                courses: [
                    "活動和社團：Founder of Cocktail Club",
                    "Developed Web and Game for club.",
                    "Completed Major Courses in Computer Science:",
                    "Compiler - A",
                    "Wireless Communication - A",
                    "Computer Networking - A",
                    "Algorithm - A",
                    "Data Structure - A+",
                    "Assembly and System Program - A+"
                ],
                activities: [
                    "ICPC Training & Competition",
                    "Programming Contest Club"
                ],
                learning: "打下紮實的 CS 基礎，培養解決問題的思維方式。雖然現在不常刷題，但這段訓練對我的影響很深。",
                color: 0xFFFF00
            }
        ],
        certifications: {
            title: "證照與成就",
            items: [
                { name: "DELF B1 (法文)", year: "2025", icon: "🇫🇷" },
                { name: "ICPC Taiwan Top 30%", year: "2021", icon: "🏆" },
                { name: "IELTS (準備中)", year: "2026", icon: "🇬🇧" }
            ]
        },
        goals: {
            title: "學習目標",
            items: [
                "申請台大研究所 - 系統架構方向",
                "深入研究 Linux kernel 和 driver development",
                "完成 HDD IMR/SMR 相關研究",
                "IELTS 達標，考慮未來出國深造"
            ]
        }
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
                { label: "GitHub", value: "github.com/cake11298", icon: "📂" },
                { label: "LinkedIn", value: "linkedin.com/in/gustave-yang-04562724a", icon: "💼" },
                { label: "Email", value: "cake11298@gmail.com", icon: "📧" }
            ]
        },

        languages: {
            title: "🌐 語言",
            items: ["中文 - 母語", "English - Fluent（正在準備雅思）", "Français - DELF B1（正在準備 TCF/DELF B2+）"]
        },

        status: {
            title: "🔗 狀態",
            message: "通常 24 小時內會回"
        }
    }
};

export default resumeContent;
