/* Game Collection — shared i18n module.
   Loaded as classic <script src="/i18n.js"></script> from every page that wants
   translations. Reads/writes `localStorage['gc.lang']`. Apply translations with
   I18N.apply(rootEl), and language switch by I18N.setLang(code).

   Supported languages: vi (default) · en · ja · zh · ar (RTL).
*/
(function(){
  'use strict';

  const STORAGE_KEY = 'gc.lang';
  const DEFAULT_LANG = 'vi';
  const SUPPORTED = ['vi', 'en', 'ja', 'zh', 'ar'];
  const RTL_LANGS = new Set(['ar']);

  const LANG_LABELS = {
    vi: '🇻🇳 Tiếng Việt',
    en: '🇬🇧 English',
    ja: '🇯🇵 日本語',
    zh: '🇨🇳 中文',
    ar: '🇸🇦 العربية',
  };

  /* ============================================================
     TRANSLATION DICTIONARY
     ============================================================ */
  const STRINGS = {
    /* ---- Hub (main index.html) ---- */
    'hub.title':            { vi: 'Reply1999 Games',                    en: 'Reply1999 Games',                  ja: 'ゲームコレクション',                zh: '游戏合集',                       ar: 'مجموعة الألعاب' },
    'hub.subtitle':         { vi: 'Bộ sưu tập game offline luyện tư duy', en: 'Offline brain-training game collection', ja: 'オフラインで遊べる思考力ゲーム集', zh: '离线益智游戏合集',               ar: 'مجموعة ألعاب تفكير دون إنترنت' },
    'hub.lang.label':       { vi: 'Ngôn ngữ',                            en: 'Language',                         ja: '言語',                             zh: '语言',                           ar: 'اللغة' },
    'hub.cta.play':         { vi: 'Chơi ▶',                              en: 'Play ▶',                           ja: 'プレイ ▶',                          zh: '开始 ▶',                         ar: '▶ ابدأ' },
    'hub.chip.new':         { vi: 'Mới',                                 en: 'New',                              ja: '新規',                             zh: '新',                             ar: 'جديد' },
    'hub.chip.offline':     { vi: 'Offline',                             en: 'Offline',                          ja: 'オフライン',                        zh: '离线',                           ar: 'دون اتصال' },
    'hub.chip.4-bots':      { vi: '4 mức bot',                           en: '4 bot levels',                     ja: 'ボット4段階',                       zh: '4 个机器人难度',                 ar: '4 مستويات روبوت' },
    'hub.chip.daily':       { vi: 'Daily challenge',                     en: 'Daily challenge',                  ja: 'デイリーチャレンジ',                zh: '每日挑战',                       ar: 'تحدي يومي' },
    'hub.chip.coming':      { vi: 'Coming soon',                         en: 'Coming soon',                      ja: '近日公開',                          zh: '即将推出',                       ar: 'قريبا' },
    'hub.coming.title':     { vi: 'Sắp ra mắt',                          en: 'Coming soon',                      ja: '近日公開',                          zh: '即将推出',                       ar: 'قريبًا' },
    'hub.coming.desc':      { vi: 'Game mới sẽ được thêm vào trong tương lai. Hãy ghé lại sau.', en: 'New games will be added in the future. Come back later.', ja: '今後新しいゲームを追加します。またお越しください。', zh: '更多游戏即将加入，敬请期待。', ar: 'سيتم إضافة ألعاب جديدة قريبًا. عد لاحقًا.' },

    /* ---- Card: Binh Xập Xám ---- */
    'card.binh.title':      { vi: 'Binh Xập Xám',                        en: 'Binh Xap Xam (13-card)',           ja: 'ビン・サップ・サム（13枚）',         zh: '十三张 (Binh Xập Xám)',         ar: 'لعبة بنه (13 ورقة)' },
    'card.binh.desc':       { vi: 'Game 13 lá Việt Nam (Mậu Binh). Chơi với bot AI nhiều mức độ, có gợi ý xếp bài và phân tích EV.', en: '13-card Vietnamese Pusoy variant. Play against AI bots, hand-arrangement hints, EV analysis.', ja: 'ベトナム式13枚プソイ。AIボットと対戦、手札配置ヒント、EV分析。', zh: '越南十三张扑克。AI 对战，提示与 EV 分析。', ar: 'بوسوي فيتنامية 13 ورقة. لعب ضد روبوتات بالذكاء الاصطناعي.' },

    /* ---- Card: Cờ Tướng ---- */
    'card.cotuong.title':   { vi: 'Cờ Tướng',                            en: 'Xiangqi (Chinese Chess)',          ja: 'シャンチー（中国将棋）',             zh: '象棋',                           ar: 'الشطرنج الصيني' },
    'card.cotuong.desc':    { vi: 'Cờ Tướng (Xiangqi) — chơi với bot AI nhiều cấp độ, có gợi ý nước đi, undo, luật chuẩn.', en: 'Xiangqi — multi-level AI, move hints, undo, standard rules.', ja: 'シャンチー — AI複数レベル、ヒント、アンドゥ、標準ルール。', zh: '象棋 — 多级 AI、提示、悔棋、标准规则。', ar: 'الشطرنج الصيني — روبوتات بمستويات متعددة وقواعد قياسية.' },

    /* ---- Card: Cờ Vua ---- */
    'card.chess.title':     { vi: 'Cờ Vua',                              en: 'Chess',                            ja: 'チェス',                            zh: '国际象棋',                       ar: 'الشطرنج' },
    'card.chess.desc':      { vi: "Chess (FIDE rules) — bot AI 4 mức, castling, en passant, phong cấp, 50-move, threefold.", en: 'Chess (FIDE rules) — 4 AI levels, castling, en passant, promotion, 50-move, threefold.', ja: 'チェス（FIDE規則） — AI 4段階、キャスリング、アンパッサン、プロモーション。', zh: '国际象棋（FIDE 规则）— 4 级 AI、王车易位、吃过路兵、升变。', ar: 'الشطرنج (قواعد فيدي) — 4 مستويات للروبوت.' },
    'card.chess.fide':      { vi: 'Luật chuẩn FIDE',                     en: 'FIDE rules',                       ja: 'FIDE規則',                          zh: 'FIDE 规则',                      ar: 'قواعد فيدي' },

    /* ---- Card: Caro / Gomoku ---- */
    'card.caro.title':      { vi: 'Caro · Gomoku',                       en: 'Caro · Gomoku',                    ja: '五目並べ',                          zh: '五子棋',                         ar: 'كارو · غومُوكو' },
    'card.caro.desc':       { vi: 'Cờ 5 lá liên tiếp thắng — luật Tự do hoặc Caro VN (chặn 2 đầu). 4 cỡ bàn 9-19, 4 mức bot.', en: 'Five-in-a-row — Free or VN rules (blocked-on-both-ends). 4 board sizes 9-19, 4 AI levels.', ja: '5目並べ — フリー/ベトナム規則、4盤面サイズ、AI 4段階。', zh: '五子棋 — 自由/越南规则，4 种棋盘，4 级 AI。', ar: 'خمسة على التوالي — قواعد حرة أو فيتنامية.' },

    /* ---- Card: Cờ Úp / Coup ---- */
    'card.coup.title':      { vi: 'Cờ Úp',                               en: 'Banqi (Coup)',                     ja: '半棋（暗将棋）',                    zh: '暗棋 (翻翻棋)',                  ar: 'بانكي (شطرنج معكوس)' },
    'card.coup.desc':       { vi: 'Banqi Việt Nam — 32 quân cờ tướng úp ngẫu nhiên 4×8. Lật hoặc đi quân. Hierarchy capture + Pháo nhảy đệm.', en: 'Vietnamese Banqi — 32 face-down xiangqi pieces on 4×8. Flip or move. Hierarchy capture + Cannon-jump.', ja: 'ベトナム式半棋 — 32枚を伏せた4×8盤面。めくる or 動かす。', zh: '越南暗棋 — 32 枚棋子背面朝上 4×8。翻或走。', ar: 'بانكي فيتنامي — 32 قطعة معكوسة على رقعة 4×8.' },

    /* ---- Card: Mahjong ---- */
    'card.mahjong.title':   { vi: 'Mahjong Solitaire',                   en: 'Mahjong Solitaire',                ja: '上海マージャン',                    zh: '麻将连连看',                     ar: 'سوليتر ماجونغ' },
    'card.mahjong.desc':    { vi: 'Mạt chược 1 người — xếp 144 quân, ghép cặp giống nhau theo các tầng. Giải seed mỗi ngày khác nhau.', en: 'Mahjong solitaire — match 144 tiles by pairs across layers. Daily-seed.', ja: '麻雀ソリティア — 144牌のペアマッチ。日替わりシード。', zh: '麻将单人 — 144 张牌配对。每日 seed。', ar: 'سوليتر ماجونغ — تطابق 144 قطعة في طبقات.' },

    /* ---- Card: Sudoku ---- */
    'card.sudoku.title':    { vi: 'Sudoku',                              en: 'Sudoku',                           ja: '数独',                              zh: '数独',                           ar: 'سودوكو' },
    'card.sudoku.desc':     { vi: 'Sudoku 9×9 — 4 mức độ, hints, undo, daily challenge, save state.', en: 'Sudoku 9×9 — 4 difficulties, hints, undo, daily challenge, save state.', ja: '数独 9×9 — 難易度4段階、ヒント、アンドゥ。', zh: '数独 9×9 — 4 个难度、提示、悔棋。', ar: 'سودوكو 9×9 — 4 مستويات صعوبة.' },

    /* ---- Card: Tien Len ---- */
    'card.tienlen.title':   { vi: 'Tiến Lên Miền Nam',                   en: 'Tien Len (Vietnamese Cards)',      ja: 'ティエンレン（ベトナム式トランプ）',  zh: '前進 (越南扑克)',                ar: 'تين لين (ورق فيتنامي)' },
    'card.tienlen.desc':    { vi: 'Tiến Lên 4 người, 13 lá/người. AI Pro Engine (Bayesian opp inference + IS-MCTS + personalities), Rule Variants 5 rulesets, UX Polish.', en: '4-player Tien Len, 13 cards each. AI Pro Engine + 5 rulesets + UX polish.', ja: '4人プレイのティエンレン、各13枚。AIプロエンジン + 5ルール。', zh: '4 人前进牌，每人 13 张。AI Pro 引擎 + 5 套规则。', ar: 'تين لين 4 لاعبين، 13 ورقة لكل لاعب.' },

    /* ---- Card: Wordle ---- */
    'card.wordle.title':    { vi: 'Wordle Tiếng Việt',                   en: 'Wordle (Vietnamese)',              ja: 'ワードル（ベトナム語）',             zh: 'Wordle (越南语)',                 ar: 'وُوردِل (فيتنامي)' },
    'card.wordle.desc':     { vi: 'Đoán từ 5 chữ tiếng Việt trong 6 lượt. Daily mode + practice mode.', en: 'Guess a 5-letter Vietnamese word in 6 tries. Daily + practice mode.', ja: '5文字のベトナム語を6回で当てる。', zh: '6 次内猜 5 字母越南语单词。', ar: 'خمن كلمة فيتنامية من 5 أحرف في 6 محاولات.' },

    /* ---- Card: Crossword ---- */
    'card.crossword.title': { vi: 'Crossword Tiếng Việt',                en: 'Vietnamese Crossword',             ja: 'クロスワード（ベトナム語）',         zh: '越南语填字游戏',                 ar: 'كلمات متقاطعة (فيتنامي)' },
    'card.crossword.desc':  { vi: 'Ô chữ tiếng Việt — clue tương ứng từ vựng phổ biến.', en: 'Vietnamese crossword puzzle — clues for common vocabulary.', ja: 'ベトナム語クロスワード — 一般的な語彙の手がかり。', zh: '越南语填字 — 常用词汇线索。', ar: 'كلمات متقاطعة فيتنامية مع تلميحات.' },

    /* ---- Card: Poker ---- */
    'card.poker.title':     { vi: "Poker Texas Hold'em",                 en: "Poker Texas Hold'em",              ja: 'ポーカー（テキサスホールデム）',      zh: '德州扑克',                       ar: 'بوكر تكساس هولدم' },
    'card.poker.desc':      { vi: "No-Limit Texas Hold'em chuẩn FIDE rules. 4 mức bot · 7-card evaluator · equity Monte Carlo · pot odds · puzzle training · mobile-first UI.", en: 'No-Limit Hold’em standard rules. 4 AI levels · 7-card evaluator · Monte-Carlo equity · pot odds · puzzles · mobile-first.', ja: 'ノーリミットホールデム標準ルール。AI 4段階・7枚評価器・モンテカルロエクイティ。', zh: '无限注德州扑克标准规则。4 级 AI · 7 张牌评估器 · 蒙特卡洛胜率 · 池底赔率。', ar: 'بوكر تكساس هولدم بلا حد. 4 مستويات روبوت.' },

    /* ---- Footer ---- */
    'hub.footer.disclaimer': { vi: 'Mỗi game chạy hoàn toàn offline trong trình duyệt. Settings tự lưu localStorage.', en: 'Every game runs fully offline in your browser. Settings persist via localStorage.', ja: '各ゲームはブラウザでオフラインで動作します。設定は localStorage に保存されます。', zh: '所有游戏完全离线运行，设置自动保存到 localStorage。', ar: 'كل لعبة تعمل بدون إنترنت في متصفحك. تُحفظ الإعدادات في localStorage.' },
    'hub.footer.dev':        { vi: 'Developed by',                       en: 'Developed by',                     ja: '開発者',                            zh: '开发者',                         ar: 'تطوير' },
    'hub.footer.warning':    { vi: '💛 Dành cho <b>trẻ em học mà chơi, chơi mà học</b>. Không được sao chép, phân phối lại dưới mọi hình thức khi chưa có sự đồng ý.', en: '💛 Made for <b>kids to learn while playing</b>. Unauthorized copying or redistribution is prohibited.', ja: '💛 <b>遊びながら学べる</b>子ども向けコンテンツです。無断複製・再配布禁止。', zh: '💛 专为<b>寓教于乐</b>的儿童设计。未经许可禁止复制或再发布。', ar: '💛 مخصص لتعليم الأطفال أثناء اللعب. يُمنع النسخ غير المصرّح به.' },
    'hub.footer.copy':       { vi: '© 2026 tungtran. All rights reserved.', en: '© 2026 tungtran. All rights reserved.', ja: '© 2026 tungtran. 無断転載禁止。', zh: '© 2026 tungtran 版权所有。', ar: '© 2026 تونغ تران. جميع الحقوق محفوظة.' },

    /* ============================================================
       POKER — welcome + actions + key labels
       ============================================================ */
    'poker.title':            { vi: "Texas Hold'em",          en: "Texas Hold'em",           ja: 'テキサスホールデム',        zh: '德州扑克',         ar: 'تكساس هولدم' },
    'poker.welcome.tagline':  { vi: 'Học · Chơi · Phân tích', en: 'Learn · Play · Analyze',  ja: '学ぶ・遊ぶ・分析',          zh: '学习 · 游戏 · 分析', ar: 'تعلّم · العب · حلِّل' },
    'poker.welcome.start':    { vi: 'Bắt đầu ván mới',        en: 'Start a new hand',        ja: '新しいハンドを開始',         zh: '开始新一局',        ar: 'ابدأ يدًا جديدة' },
    'poker.menu.stats':       { vi: '📈 Tiến bộ',              en: '📈 Progress',              ja: '📈 進歩',                    zh: '📈 进度',           ar: '📈 التقدم' },
    'poker.menu.puzzles':     { vi: '🎯 Luyện puzzle',         en: '🎯 Puzzles',               ja: '🎯 パズル',                  zh: '🎯 题目训练',        ar: '🎯 الألغاز' },
    'poker.menu.equity':      { vi: '📊 Equity Calculator',    en: '📊 Equity Calculator',     ja: '📊 エクイティ計算',          zh: '📊 胜率计算器',      ar: '📊 حاسبة الاحتمال' },
    'poker.menu.rules':       { vi: '📖 Luật',                 en: '📖 Rules',                 ja: '📖 ルール',                  zh: '📖 规则',           ar: '📖 القواعد' },
    'poker.menu.polish':      { vi: '✨ Polish',               en: '✨ Polish',                ja: '✨ 演出',                    zh: '✨ 设置',           ar: '✨ تحسينات' },
    'poker.menu.advAI':       { vi: '🤖 AI Pro',               en: '🤖 AI Pro',                ja: '🤖 AIプロ',                  zh: '🤖 AI Pro',          ar: '🤖 ذكاء متقدم' },
    'poker.menu.replay':      { vi: '🎬 Replay Luật — Học bằng cách xem', en: '🎬 Rule Replay — Learn by watching', ja: '🎬 ルール再生 — 見て学ぶ', zh: '🎬 规则回放 — 看着学', ar: '🎬 إعادة عرض القواعد' },

    /* Action buttons */
    'poker.action.fold':      { vi: 'Fold',                    en: 'Fold',                    ja: 'フォールド',                 zh: '弃牌',              ar: 'انسحاب' },
    'poker.action.check':     { vi: 'Check',                   en: 'Check',                   ja: 'チェック',                   zh: '过牌',              ar: 'تمرير' },
    'poker.action.call':      { vi: 'Call',                    en: 'Call',                    ja: 'コール',                     zh: '跟注',              ar: 'مجاراة' },
    'poker.action.bet':       { vi: 'Bet',                     en: 'Bet',                     ja: 'ベット',                     zh: '下注',              ar: 'مراهنة' },
    'poker.action.raise':     { vi: 'Raise',                   en: 'Raise',                   ja: 'レイズ',                     zh: '加注',              ar: 'رفع' },
    'poker.action.allin':     { vi: 'All-in',                  en: 'All-in',                  ja: 'オールイン',                 zh: '全下',              ar: 'كل الرقائق' },

    /* Stage labels */
    'poker.stage.preflop':    { vi: 'PREFLOP',                 en: 'PREFLOP',                 ja: 'プリフロップ',                zh: '翻牌前',            ar: 'قبل الفلوب' },
    'poker.stage.flop':       { vi: 'FLOP',                    en: 'FLOP',                    ja: 'フロップ',                    zh: '翻牌',              ar: 'الفلوب' },
    'poker.stage.turn':       { vi: 'TURN',                    en: 'TURN',                    ja: 'ターン',                      zh: '转牌',              ar: 'ترن' },
    'poker.stage.river':      { vi: 'RIVER',                   en: 'RIVER',                   ja: 'リバー',                      zh: '河牌',              ar: 'ريفر' },
    'poker.stage.showdown':   { vi: 'SHOWDOWN',                en: 'SHOWDOWN',                ja: 'ショーダウン',                zh: '摊牌',              ar: 'كشف الأوراق' },

    /* Common labels on table */
    'poker.label.pot':        { vi: 'POT',                     en: 'POT',                     ja: 'ポット',                      zh: '底池',              ar: 'القدر' },
    'poker.label.youturn':    { vi: 'Đến lượt bạn',            en: 'Your turn',               ja: 'あなたの番',                  zh: '该你了',            ar: 'دورك' },

    /* Rules modal title (uses existing modal) */
    'poker.rules.modaltitle': { vi: '📖 Luật + Hand ranking',  en: '📖 Rules + Hand ranking',  ja: '📖 ルールと役の強さ',          zh: '📖 规则与牌型',     ar: '📖 القواعد + ترتيب الأوراق' },

    /* ============================================================
       POKER mode panel — welcome cards
       ============================================================ */
    'poker.mode.play':          { vi: 'Chơi với bot',           en: 'Play vs bots',           ja: 'ボットと対戦',                 zh: '与机器人对战',          ar: 'العب ضد الروبوتات' },
    'poker.mode.play.desc':     { vi: 'Cash game cơ bản',       en: 'Basic cash game',        ja: 'キャッシュゲーム',             zh: '基础现金桌',            ar: 'لعبة نقدية أساسية' },
    'poker.mode.puzzles':       { vi: 'Luyện puzzle',           en: 'Puzzle training',        ja: 'パズル訓練',                  zh: '题目训练',              ar: 'تدريب الألغاز' },
    'poker.mode.puzzles.desc':  { vi: 'Preflop · Flop · Turn · River', en: 'Preflop · Flop · Turn · River', ja: 'プリフロップ・フロップ・ターン・リバー', zh: '翻牌前 · 翻牌 · 转牌 · 河牌', ar: 'قبل الفلوب · فلوب · ترن · ريفر' },
    'poker.mode.equity':        { vi: 'Tính equity',            en: 'Equity calc',            ja: 'エクイティ計算',              zh: '胜率计算',              ar: 'حساب الاحتمال' },
    'poker.mode.equity.desc':   { vi: 'Pot odds · Outs · EV',   en: 'Pot odds · Outs · EV',   ja: 'ポットオッズ・アウツ・EV',     zh: '池底赔率 · 张数 · EV',  ar: 'احتمالات القدر · أوتس · EV' },
    'poker.mode.stats':         { vi: 'Tiến bộ',                en: 'Progress',               ja: '進歩',                       zh: '进度',                  ar: 'التقدم' },
    'poker.mode.stats.desc':    { vi: 'Stats · Lịch sử',        en: 'Stats · History',        ja: '統計・履歴',                  zh: '统计 · 历史',            ar: 'إحصائيات · تاريخ' },
    'poker.mode.range':         { vi: 'Range training',         en: 'Range training',         ja: 'レンジ訓練',                  zh: '范围训练',              ar: 'تدريب النطاق' },
    'poker.mode.range.desc':    { vi: '169-grid · standard ranges', en: '169-grid · standard ranges', ja: '169グリッド・標準レンジ', zh: '169 网格 · 标准范围', ar: 'شبكة 169 · نطاقات قياسية' },
    'poker.mode.prediction':    { vi: 'Prediction training',    en: 'Prediction training',    ja: '予測訓練',                    zh: '预测训练',              ar: 'تدريب التنبؤ' },
    'poker.mode.prediction.desc': { vi: 'Đoán next action villain', en: 'Guess villain next action', ja: '相手の次の手を予想', zh: '预测对手下一步',      ar: 'احزر حركة الخصم القادمة' },
    'poker.mode.tournament':    { vi: 'Tournament (SnG)',       en: 'Tournament (SnG)',       ja: 'トーナメント (SnG)',          zh: '锦标赛 (SnG)',          ar: 'بطولة (SnG)' },
    'poker.mode.tournament.desc': { vi: 'Escalating blinds · ICM equity', en: 'Escalating blinds · ICM equity', ja: '上昇盲注・ICMエクイティ', zh: '盲注递增 · ICM 胜率', ar: 'رهانات متصاعدة · ICM' },
    'poker.mode.replay':        { vi: 'Hand replay',            en: 'Hand replay',            ja: 'ハンド再生',                  zh: '手牌回放',              ar: 'إعادة عرض اليد' },
    'poker.mode.replay.desc':   { vi: 'Timeline · per-action equity', en: 'Timeline · per-action equity', ja: 'タイムライン・アクション別エクイティ', zh: '时间线 · 每步胜率', ar: 'الجدول الزمني · احتمال كل حركة' },

    /* ============================================================
       POKER settings (welcome screen)
       ============================================================ */
    'poker.field.numbots':      { vi: 'Số bot đối thủ',         en: 'Number of bots',         ja: 'ボット人数',                  zh: '机器人数量',            ar: 'عدد الروبوتات' },
    'poker.field.difficulty':   { vi: 'Mức bot',                en: 'Bot level',              ja: 'ボットレベル',                zh: '机器人难度',            ar: 'مستوى الروبوت' },
    'poker.field.stack':        { vi: 'Stack ban đầu',          en: 'Starting stack',         ja: '初期スタック',                zh: '初始筹码',              ar: 'الرصيد الابتدائي' },
    'poker.field.blinds':       { vi: 'Blinds',                 en: 'Blinds',                 ja: '盲注',                       zh: '盲注',                  ar: 'الرهانات العمياء' },
    'poker.diff.easy':          { vi: 'Dễ',                     en: 'Easy',                   ja: '簡単',                       zh: '简单',                  ar: 'سهل' },
    'poker.diff.medium':        { vi: 'Trung bình',             en: 'Medium',                 ja: '普通',                       zh: '中等',                  ar: 'متوسط' },
    'poker.diff.hard':          { vi: 'Khó',                    en: 'Hard',                   ja: '難しい',                     zh: '困难',                  ar: 'صعب' },
    'poker.diff.expert':        { vi: 'Chuyên gia',             en: 'Expert',                 ja: 'エキスパート',                zh: '专家',                  ar: 'خبير' },
    'poker.practice.title':     { vi: '🎓 Practice Mode (luyện tập rule)', en: '🎓 Practice Mode (rule training)', ja: '🎓 練習モード (ルール学習)', zh: '🎓 练习模式 (规则训练)', ar: '🎓 وضع التدريب (تعلم القواعد)' },
    'poker.practice.desc':      { vi: 'Mỗi lượt bot sẽ hiện <b>tất cả 6 actions</b> với trạng thái ✅ Available / ❌ Không thể + lý do. Bot\'s choice được highlight 🎯.', en: 'Each bot turn shows <b>all 6 actions</b> with ✅ Available / ❌ Not allowed + reason. Bot\'s pick highlighted 🎯.', ja: 'ボットの各ターン中に<b>6つのアクション</b>すべてと利用可否を表示。ボットの選択は🎯。', zh: '每个机器人回合显示<b>全部 6 个动作</b>及可用状态 + 原因。机器人选择带 🎯 高亮。', ar: 'في كل دور للروبوت يُعرض <b>كل الإجراءات الستة</b> مع الحالة والسبب. خيار الروبوت مميز بـ 🎯.' },

    /* ============================================================
       POKER game screen + menus
       ============================================================ */
    'poker.menu.tournament':    { vi: '🏆 Tournament status',   en: '🏆 Tournament status',   ja: '🏆 トーナメント状況',          zh: '🏆 锦标赛状态',         ar: '🏆 حالة البطولة' },
    'poker.menu.newHand':       { vi: '🔄 Ván mới',             en: '🔄 New hand',            ja: '🔄 新しいハンド',              zh: '🔄 新一局',             ar: '🔄 يد جديدة' },
    'poker.menu.leave':         { vi: '🚪 Rời bàn',             en: '🚪 Leave table',         ja: '🚪 テーブルを離れる',          zh: '🚪 离开桌子',           ar: '🚪 مغادرة الطاولة' },
    'poker.menu.autohint':      { vi: '💡 Auto-hint mỗi turn',  en: '💡 Auto-hint every turn', ja: '💡 毎ターン自動ヒント',        zh: '💡 每回合自动提示',      ar: '💡 تلميح تلقائي كل دور' },
    'poker.menu.actionlog':     { vi: '📜 Action log',          en: '📜 Action log',          ja: '📜 アクションログ',            zh: '📜 动作日志',           ar: '📜 سجل الإجراءات' },

    /* ============================================================
       POKER equity calc + puzzles + stats screens
       ============================================================ */
    'poker.eq.title':           { vi: '📊 Equity Calculator',   en: '📊 Equity Calculator',   ja: '📊 エクイティ計算機',          zh: '📊 胜率计算器',         ar: '📊 حاسبة الاحتمال' },
    'poker.eq.heroLabel':       { vi: 'Hand của bạn (vd: Ah Kh)', en: 'Your hand (e.g. Ah Kh)', ja: 'あなたの手 (例: Ah Kh)', zh: '你的手牌 (如 Ah Kh)', ar: 'ورقتاك (مثل Ah Kh)' },
    'poker.eq.boardLabel':      { vi: 'Board (vd: Qh 7d 2s)',   en: 'Board (e.g. Qh 7d 2s)',  ja: 'ボード (例: Qh 7d 2s)',      zh: '公共牌 (如 Qh 7d 2s)',  ar: 'الطاولة (مثل Qh 7d 2s)' },
    'poker.eq.boardPh':         { vi: '(rỗng = preflop)',       en: '(empty = preflop)',      ja: '(空 = プリフロップ)',          zh: '(空 = 翻牌前)',          ar: '(فارغ = قبل الفلوب)' },
    'poker.eq.oppLabel':        { vi: 'Số đối thủ random',      en: 'Random opponents',       ja: 'ランダム相手',                zh: '随机对手',              ar: 'الخصوم العشوائيون' },
    'poker.eq.calc':            { vi: '🎲 Tính equity (Monte Carlo)', en: '🎲 Calculate equity (Monte Carlo)', ja: '🎲 エクイティ計算 (モンテカルロ)', zh: '🎲 计算胜率 (蒙特卡洛)', ar: '🎲 احسب الاحتمال (مونت كارلو)' },
    'poker.puzzles.title':      { vi: '🎯 Luyện puzzle',        en: '🎯 Puzzles',             ja: '🎯 パズル',                  zh: '🎯 题目训练',            ar: '🎯 الألغاز' },
    'poker.puzzles.filter':     { vi: 'Lọc theo street',        en: 'Filter by street',       ja: 'ストリート別フィルタ',         zh: '按街筛选',              ar: 'تصفية حسب الشارع' },
    'poker.puzzles.all':        { vi: 'Tất cả',                 en: 'All',                    ja: 'すべて',                     zh: '全部',                  ar: 'الكل' },
    'poker.stats.title':        { vi: '📈 Tiến bộ',             en: '📈 Progress',            ja: '📈 進歩',                    zh: '📈 进度',               ar: '📈 التقدم' },

    /* ============================================================
       HUB — extra chips
       ============================================================ */
    'hub.chip.4-difficulties':  { vi: '4 độ khó',               en: '4 difficulties',         ja: '難易度4段階',                 zh: '4 个难度',              ar: '4 مستويات صعوبة' },
    'hub.chip.3-bots':          { vi: '3 mức bot',              en: '3 bot levels',           ja: 'ボット3段階',                 zh: '3 个机器人难度',         ar: '3 مستويات روبوت' },
    'hub.chip.daily-seed':      { vi: 'Daily seed',             en: 'Daily seed',             ja: 'デイリーシード',              zh: '每日 seed',             ar: 'بذرة يومية' },
    'hub.chip.daily-streak':    { vi: 'Daily streak',           en: 'Daily streak',           ja: 'デイリー連続記録',             zh: '每日连胜',              ar: 'سلسلة يومية' },
    'hub.chip.daily-word':      { vi: 'Daily word',             en: 'Daily word',             ja: 'デイリーワード',              zh: '每日单词',              ar: 'كلمة اليوم' },

    /* ============================================================
       UNO — hub card + welcome + game labels
       ============================================================ */
    'card.uno.title':           { vi: 'Uno',                                en: 'Uno',                                  ja: 'ウノ',                              zh: '乌诺',                          ar: 'أونو' },
    'card.uno.desc':            { vi: 'Uno chính thống — 108 lá, bot AI nhiều cấp độ, house rules đầy đủ (stacking / jump-in / 7-0 / progressive), first-to-500.', en: 'Standard Uno — 108 cards, multi-level AI bots, full house rules (stacking / jump-in / 7-0 / progressive), first-to-500.', ja: '標準ウノ — 108枚、AIボット複数レベル、ハウスルール完全対応 (スタッキング/ジャンプイン/7-0)、500点先取。', zh: '标准乌诺 — 108 张、多级 AI 机器人、完整家规（叠加/插队/7-0/累加）、先到 500 分。', ar: 'أونو قياسي — 108 ورقة، روبوتات بمستويات متعددة، قواعد منزل كاملة، الأول حتى 500.' },
    'uno.welcome.title':        { vi: 'Uno',                                en: 'Uno',                                  ja: 'ウノ',                              zh: '乌诺',                          ar: 'أونو' },
    'uno.welcome.tagline':      { vi: 'Học · Chơi · Thi đấu',               en: 'Learn · Play · Compete',               ja: '学ぶ・遊ぶ・競う',                  zh: '学习 · 游戏 · 竞赛',             ar: 'تعلّم · العب · تنافس' },
    'uno.mode.vsBot':           { vi: 'Chơi với bot',                       en: 'Play vs bots',                         ja: 'ボットと対戦',                       zh: '与机器人对战',                  ar: 'العب ضد الروبوتات' },
    'uno.mode.vsBot.desc':      { vi: 'Quick setup',                        en: 'Quick setup',                          ja: 'クイック設定',                       zh: '快速设置',                       ar: 'إعداد سريع' },
    'uno.menu.rules':           { vi: 'Luật chơi',                          en: 'Rules',                                ja: 'ルール',                            zh: '规则',                          ar: 'القواعد' },
    'uno.menu.leave':           { vi: '🚪 Rời bàn',                          en: '🚪 Leave table',                        ja: '🚪 テーブルを離れる',                zh: '🚪 离开桌子',                    ar: '🚪 مغادرة الطاولة' },
    'uno.menu.actionLog':       { vi: '📜 Action log',                       en: '📜 Action log',                         ja: '📜 アクションログ',                  zh: '📜 动作日志',                    ar: '📜 سجل الإجراءات' },
    'uno.field.numBots':        { vi: 'Số bot đối thủ',                     en: 'Number of bots',                       ja: 'ボット人数',                         zh: '机器人数量',                    ar: 'عدد الروبوتات' },
    'uno.field.difficulty':     { vi: 'Mức bot',                            en: 'Bot level',                            ja: 'ボットレベル',                       zh: '机器人难度',                    ar: 'مستوى الروبوت' },
    'uno.field.target':         { vi: 'Mục tiêu điểm',                      en: 'Target score',                         ja: '目標スコア',                         zh: '目标分数',                       ar: 'النقاط المستهدفة' },
    'uno.field.preset':         { vi: 'Ruleset',                            en: 'Ruleset',                              ja: 'ルールセット',                       zh: '规则集',                         ar: 'مجموعة القواعد' },
    'uno.diff.easy':            { vi: 'Dễ',                                 en: 'Easy',                                 ja: '簡単',                              zh: '简单',                          ar: 'سهل' },
    'uno.diff.medium':          { vi: 'Trung bình',                         en: 'Medium',                               ja: '普通',                              zh: '中等',                          ar: 'متوسط' },
    'uno.diff.hard':            { vi: 'Khó',                                en: 'Hard',                                 ja: '難しい',                            zh: '困难',                          ar: 'صعب' },
    'uno.diff.expert':          { vi: 'Pro',                                en: 'Pro',                                  ja: 'プロ',                              zh: '专业',                          ar: 'محترف' },
    'uno.action.draw':          { vi: 'Rút',                                en: 'Draw',                                 ja: 'ドロー',                            zh: '抽牌',                          ar: 'اسحب' },
    'uno.action.pass':          { vi: 'Pass',                               en: 'Pass',                                 ja: 'パス',                              zh: '跳过',                          ar: 'تمرير' },
    'uno.action.uno':           { vi: 'UNO!',                               en: 'UNO!',                                 ja: 'ウノ！',                             zh: '乌诺！',                          ar: 'أونو!' },
    'uno.action.challenge':     { vi: 'Challenge',                          en: 'Challenge',                            ja: 'チャレンジ',                         zh: '质疑',                          ar: 'تحدّى' },
    'uno.action.nextRound':     { vi: 'Round tiếp ▶',                        en: 'Next round ▶',                          ja: '次のラウンド ▶',                      zh: '下一轮 ▶',                       ar: '▶ الجولة التالية' },
    'uno.color.red':            { vi: 'Đỏ',                                 en: 'Red',                                  ja: '赤',                               zh: '红',                            ar: 'أحمر' },
    'uno.color.yellow':         { vi: 'Vàng',                               en: 'Yellow',                               ja: '黄',                               zh: '黄',                            ar: 'أصفر' },
    'uno.color.green':          { vi: 'Xanh lá',                            en: 'Green',                                ja: '緑',                               zh: '绿',                            ar: 'أخضر' },
    'uno.color.blue':           { vi: 'Xanh dương',                         en: 'Blue',                                 ja: '青',                               zh: '蓝',                            ar: 'أزرق' },
    'uno.modal.pickColor':      { vi: 'Chọn màu',                           en: 'Pick a color',                         ja: '色を選択',                           zh: '选择颜色',                       ar: 'اختر اللون' },
    'uno.label.cards':          { vi: 'lá',                                 en: 'cards',                                ja: '枚',                               zh: '张',                            ar: 'ورقة' },
    'uno.label.score':          { vi: 'Điểm',                               en: 'Score',                                ja: 'スコア',                            zh: '分数',                          ar: 'النقاط' },

    /* ============================================================
       GO (Cờ vây)
       ============================================================ */
    'card.go.title':            { vi: 'Cờ Vây',                             en: 'Go',                                   ja: '囲碁',                              zh: '围棋',                          ar: 'لعبة Go' },
    'card.go.desc':             { vi: 'Cờ vây cổ điển — 9×9/13×13/19×19, bot AI 2 cấp, luật chuẩn Japanese/Chinese, territory scoring.', en: 'Classic Go — 9×9/13×13/19×19, 2 AI levels, Japanese/Chinese rules, territory scoring.', ja: '伝統的な囲碁 — 9路/13路/19路盤、AI 2段階、日本/中国ルール対応', zh: '经典围棋 — 9×9/13×13/19×19、2 级 AI、日韩规则支持', ar: 'لعبة Go الكلاسيكية — 9×9/13×13/19×19' },
    'go.welcome.title':         { vi: 'Cờ Vây',                             en: 'Go',                                   ja: '囲碁',                              zh: '围棋',                          ar: 'لعبة Go' },
    'go.welcome.tagline':       { vi: 'Học · Chơi · Thi đấu',               en: 'Learn · Play · Compete',               ja: '学ぶ・打つ・競う',                   zh: '学习 · 对战 · 竞赛',             ar: 'تعلم · العب · تنافس' },
    'go.action.pass':           { vi: 'Pass',                               en: 'Pass',                                 ja: 'パス',                              zh: '弃权',                          ar: 'تخطٍ' },
    'go.action.resign':         { vi: '🏳 Đầu hàng',                         en: '🏳 Resign',                             ja: '🏳 投了',                           zh: '🏳 认输',                       ar: '🏳 استسلام' },
    'go.action.undo':           { vi: '↶ Undo',                             en: '↶ Undo',                                ja: '↶ 待った',                          zh: '↶ 悔棋',                        ar: '↶ تراجع' },

    /* ============================================================
       PIKACHU (Onet Connect)
       ============================================================ */
    'card.gamemini.title':      { vi: 'Game Mini',                          en: 'Mini Games',                           ja: 'ミニゲーム',                        zh: '迷你游戏',                      ar: 'ألعاب مصغرة' },
    'card.gamemini.desc':       { vi: 'Danh sách các trò nhỏ vui nhộn — bắt đầu với Đào Vàng, thêm dần theo thời gian.', en: 'A growing list of fun mini games — starting with Gold Digger.', ja: '楽しいミニゲーム集 — 金採りからスタート！', zh: '有趣的迷你游戏合集，从挖金子开始，逐渐增加。', ar: 'قائمة متنامية من الألعاب المصغرة — بدءًا من حفر الذهب.' },
    'card.gamemini.chip1':      { vi: 'Nhiều trò nhỏ',                      en: 'Growing list',                         ja: 'ぞくぞく追加',                      zh: '持续更新',                      ar: 'قائمة متنامية' },
    'card.pika.title':          { vi: 'Pikachu · Onet',                     en: 'Pikachu · Onet Connect',               ja: '四川省（二角取り）',                 zh: '连连看',                        ar: 'أونيت (توصيل الأزواج)' },
    'card.pika.desc':           { vi: 'Nối 2 hình giống nhau bằng đường ≤2 lần gấp khúc. 7 level với luật dồn ô khác nhau, combo, gợi ý.', en: 'Match identical tiles with a path of ≤2 turns. 7 levels with shifting rules, combos, hints.', ja: '2回まで曲がれる線で同じ絵柄を繋ぐ。7レベル、コンボ、ヒント付き。', zh: '用不超过两次转弯的线连接相同图案。7 个关卡、连击、提示。', ar: 'صل الصور المتطابقة بمسار لا يزيد عن انعطافين. 7 مستويات.' },
    'pika.btn.new':             { vi: 'MỚI',                                en: 'NEW',                                  ja: '新規',                              zh: '新游戏',                        ar: 'جديد' },
    'pika.btn.hint':            { vi: 'GỢI Ý',                              en: 'HINT',                                 ja: 'ヒント',                            zh: '提示',                          ar: 'تلميح' },
    'pika.btn.shuffle':         { vi: 'XÁO',                                en: 'SHUFFLE',                              ja: 'シャッフル',                        zh: '洗牌',                          ar: 'خلط' },
    'pika.btn.top':             { vi: 'TOP',                                en: 'TOP',                                  ja: 'ランキング',                        zh: '排行榜',                        ar: 'الأفضل' },
    'pika.btn.pause':           { vi: 'Tạm dừng (Esc)',                     en: 'Pause (Esc)',                          ja: '一時停止 (Esc)',                    zh: '暂停 (Esc)',                    ar: 'إيقاف مؤقت (Esc)' },
    'pika.btn.sound':           { vi: 'Âm thanh',                           en: 'Sound',                                ja: 'サウンド',                          zh: '声音',                          ar: 'الصوت' },
    'pika.btn.help':            { vi: 'Cách chơi',                          en: 'How to play',                          ja: 'あそびかた',                        zh: '玩法说明',                      ar: 'طريقة اللعب' },
    'pika.btn.icons':           { vi: 'Đổi bộ hình',                        en: 'Change tile set',                      ja: '絵柄を変更',                        zh: '更换图案',                      ar: 'تغيير مجموعة الصور' },
    'pika.btn.home':            { vi: 'TRANG CHỦ',                          en: 'HOME',                                 ja: 'ホーム',                            zh: '主页',                          ar: 'الرئيسية' },
    'pika.hints.title':         { vi: 'Lượt gợi ý còn lại',                 en: 'Hints remaining',                      ja: '残りヒント数',                      zh: '剩余提示次数',                  ar: 'التلميحات المتبقية' },
    'pika.time.aria':           { vi: 'Thời gian còn lại',                  en: 'Time remaining',                       ja: '残り時間',                          zh: '剩余时间',                      ar: 'الوقت المتبقي' },
    'pika.board.aria':          { vi: 'Bàn chơi Pikachu',                   en: 'Pikachu board',                        ja: 'ゲームボード',                      zh: '游戏面板',                      ar: 'لوحة اللعب' },
    'pika.menu.sub':            { vi: 'Nối 2 hình giống nhau — tối đa 2 lần gấp khúc. 7 level!', en: 'Match identical tiles — at most 2 turns per path. 7 levels!', ja: '同じ絵柄を繋ごう — 曲がりは2回まで。全7レベル！', zh: '连接相同图案 — 最多转弯两次。共 7 关！', ar: 'صل الصور المتطابقة — انعطافان كحد أقصى. 7 مستويات!' },
    'pika.menu.play':           { vi: 'CHƠI ▶',                             en: 'PLAY ▶',                               ja: 'プレイ ▶',                          zh: '开始 ▶',                        ar: '▶ ابدأ' },
    'pika.pause.title':         { vi: 'Tạm dừng',                           en: 'Paused',                               ja: '一時停止',                          zh: '已暂停',                        ar: 'متوقف مؤقتًا' },
    'pika.pause.resume':        { vi: 'TIẾP TỤC',                           en: 'RESUME',                               ja: '再開',                              zh: '继续',                          ar: 'استئناف' },
    'pika.level.clear':         { vi: 'Qua level!',                         en: 'Level clear!',                         ja: 'レベルクリア！',                    zh: '过关！',                        ar: 'اجتزت المستوى!' },
    'pika.level.next':          { vi: 'LEVEL TIẾP ▶',                       en: 'NEXT LEVEL ▶',                         ja: '次のレベル ▶',                      zh: '下一关 ▶',                      ar: '▶ المستوى التالي' },
    'pika.level.bonus':         { vi: 'Thưởng thời gian',                   en: 'Time bonus',                           ja: 'タイムボーナス',                    zh: '时间奖励',                      ar: 'مكافأة الوقت' },
    'pika.end.again':           { vi: 'CHƠI LẠI',                           en: 'PLAY AGAIN',                           ja: 'もう一度',                          zh: '再玩一次',                      ar: 'العب مجددًا' },
    'pika.end.timeout':         { vi: 'Hết giờ!',                           en: "Time's up!",                           ja: '時間切れ！',                        zh: '时间到！',                      ar: 'انتهى الوقت!' },
    'pika.end.victory':         { vi: 'Hoàn thành cả 7 level!',             en: 'All 7 levels complete!',               ja: '全7レベルクリア！',                 zh: '通关全部 7 关！',               ar: 'أكملت المستويات السبعة!' },
    'pika.end.score':           { vi: 'Điểm của bạn',                       en: 'Your score',                           ja: 'スコア',                            zh: '你的分数',                      ar: 'نتيجتك' },
    'pika.top.title':           { vi: 'Bảng điểm TOP',                      en: 'Top scores',                           ja: 'ランキング',                        zh: '排行榜',                        ar: 'أفضل النتائج' },
    'pika.top.close':           { vi: 'ĐÓNG',                               en: 'CLOSE',                                ja: '閉じる',                            zh: '关闭',                          ar: 'إغلاق' },
    'pika.top.empty':           { vi: 'Chưa có điểm nào — hãy chơi ván đầu tiên!', en: 'No scores yet — play your first game!', ja: 'まだ記録なし — 最初のゲームを！', zh: '还没有记录 — 来玩第一局吧！', ar: 'لا نتائج بعد — العب أول لعبة!' },
    'pika.toast.shuffled':      { vi: 'Hết nước đi — xáo trộn lại! 🔀',      en: 'No moves left — reshuffled! 🔀',        ja: '手詰まり — シャッフル！🔀',          zh: '无路可走 — 已重新洗牌！🔀',      ar: 'لا حركات — أعيد الخلط! 🔀' },
    'pika.toast.nohint':        { vi: 'Đã hết lượt gợi ý!',                 en: 'No hints left!',                       ja: 'ヒントがありません！',              zh: '提示已用完！',                  ar: 'نفدت التلميحات!' },
    'pika.toast.noshuffle':     { vi: 'Đã hết lượt xáo trộn!',              en: 'No shuffles left!',                    ja: 'シャッフルがありません！',          zh: '洗牌次数已用完！',              ar: 'نفدت مرات الخلط!' },
    'pika.toast.icons':         { vi: 'Bộ hình',                            en: 'Tile set',                             ja: '絵柄',                              zh: '图案',                          ar: 'مجموعة الصور' },
    'pika.user.title':          { vi: 'Người chơi',                         en: 'Player',                               ja: 'プレイヤー',                        zh: '玩家',                          ar: 'اللاعب' },
    'pika.user.add':            { vi: 'THÊM',                               en: 'ADD',                                  ja: '追加',                              zh: '添加',                          ar: 'إضافة' },
    'pika.user.placeholder':    { vi: 'Nhập tên của bé...',                 en: 'Enter your name...',                   ja: '名前を入力...',                     zh: '输入名字...',                   ar: 'أدخل الاسم...' },
    'pika.user.guest':          { vi: 'Khách',                              en: 'Guest',                                ja: 'ゲスト',                            zh: '访客',                          ar: 'ضيف' },
    'pika.stats.title':         { vi: 'Thống kê',                           en: 'Report',                               ja: 'レポート',                          zh: '报告',                          ar: 'التقرير' },
    'pika.stats.games':         { vi: 'Số ván',                             en: 'Games',                                ja: 'プレイ数',                          zh: '局数',                          ar: 'عدد الألعاب' },
    'pika.stats.gamesUnit':     { vi: 'ván',                                en: 'games',                                ja: '回',                                zh: '局',                            ar: 'ألعاب' },
    'pika.stats.winrate':       { vi: 'Tỷ lệ thắng',                        en: 'Win rate',                             ja: '勝率',                              zh: '胜率',                          ar: 'نسبة الفوز' },
    'pika.stats.time':          { vi: 'Giờ chơi',                           en: 'Play time',                            ja: 'プレイ時間',                        zh: '游戏时长',                      ar: 'وقت اللعب' },
    'pika.stats.wins':          { vi: 'Thắng',                              en: 'Wins',                                 ja: '勝ち',                              zh: '胜',                            ar: 'فوز' },
    'pika.stats.losses':        { vi: 'Thua',                               en: 'Losses',                               ja: '負け',                              zh: '负',                            ar: 'خسارة' },
    'pika.stats.days7':         { vi: 'Phút chơi 7 ngày gần nhất',          en: 'Minutes played — last 7 days',         ja: '直近7日間のプレイ分数',             zh: '最近7天游戏分钟数',             ar: 'دقائق اللعب — آخر 7 أيام' },
    'pika.stats.empty':         { vi: 'Chưa có ván nào — chơi ván đầu tiên nhé!', en: 'No games yet — play your first one!', ja: 'まだ記録なし — 最初のゲームを！',  zh: '还没有记录 — 来玩第一局吧！',   ar: 'لا ألعاب بعد — العب أول لعبة!' },
    'pika.stats.hourUnit':      { vi: 'g',                                  en: 'h',                                    ja: '時間',                              zh: '小时',                          ar: 'س' },
    'pika.stats.minUnit':       { vi: 'p',                                  en: 'm',                                    ja: '分',                                zh: '分',                            ar: 'د' },

    /* ============================================================
       TÔ MÀU CHỮ & SỐ
       ============================================================ */
    'card.tomau.title':         { vi: 'Tô Màu Chữ & Số',                    en: 'Color Letters & Numbers',              ja: '文字と数字のぬりえ',                zh: '字母数字涂色',                  ar: 'تلوين الحروف والأرقام' },
    'card.tomau.desc':          { vi: 'Bé tô màu 29 chữ cái tiếng Việt và số 0–9 theo vùng, nghe đọc phát âm, đếm con vật. Có chế độ tô theo số.', en: 'Kids color Vietnamese letters and digits 0–9 region by region, hear them read aloud, and count animals. Includes color-by-number mode.', ja: 'ベトナム語の文字と数字0–9を塗って、発音を聞いて、動物を数えよう。番号ぬりえモード付き。', zh: '孩子按区域给越南语字母和数字0–9涂色，听发音，数动物。含按数字涂色模式。', ar: 'يلوّن الأطفال الحروف والأرقام 0–9، ويستمعون للنطق، ويعدّون الحيوانات.' },
    'card.tomau.chip1':         { vi: 'Bé 3–8 tuổi',                        en: 'Ages 3–8',                             ja: '3–8歳向け',                         zh: '3–8岁',                         ar: 'من 3 إلى 8 سنوات' },
    'card.tomau.chip2':         { vi: 'Vừa chơi vừa học',                   en: 'Play & learn',                         ja: '遊んで学ぶ',                        zh: '边玩边学',                      ar: 'العب وتعلّم' },
    'tomau.title':              { vi: '🎨 Tô Màu Chữ & Số',                 en: '🎨 Color Letters & Numbers',           ja: '🎨 文字と数字のぬりえ',             zh: '🎨 字母数字涂色',               ar: '🎨 تلوين الحروف والأرقام' },
    'tomau.mode':               { vi: 'Đổi chế độ tô',                      en: 'Switch coloring mode',                 ja: 'モード切替',                        zh: '切换模式',                      ar: 'تبديل الوضع' },
    'tomau.mode.free':          { vi: 'Tô tự do',                           en: 'Free coloring',                        ja: '自由ぬりえ',                        zh: '自由涂色',                      ar: 'تلوين حر' },
    'tomau.mode.number':        { vi: 'Tô theo số — chọn màu đúng số nhé!', en: 'Color by number — pick the right color!', ja: '番号ぬりえ — 正しい色を選ぼう！',   zh: '按数字涂色 — 选对颜色哦！',     ar: 'التلوين بالأرقام — اختر اللون الصحيح!' },
    'tomau.say':                { vi: 'Đọc lại',                            en: 'Say it again',                         ja: 'もう一度読む',                      zh: '再读一遍',                      ar: 'اقرأ مرة أخرى' },
    'tomau.next':               { vi: 'TIẾP ▶',                             en: 'NEXT ▶',                               ja: 'つぎへ ▶',                          zh: '下一个 ▶',                      ar: '▶ التالي' },

    /* ============================================================
       TẬP VIẾT CHỮ
       ============================================================ */
    'card.tapviet.title':       { vi: 'Tập Viết Chữ',                       en: 'Letter Tracing',                       ja: 'もじのなぞりがき',                  zh: '写字练习',                      ar: 'تتبّع الحروف' },
    'card.tapviet.desc':        { vi: 'Bé rê tay viết theo nét: nét cơ bản, chữ hoa tiếng Việt, ABC tiếng Anh và viết tên của bé. Chấm 1–3 sao.', en: 'Trace strokes in order: basic strokes, Vietnamese capitals, English ABC, and writing your own name. 1–3 star scoring.', ja: '基本の線、ベトナム語の大文字、英語のABC、自分の名前をなぞって書こう。星1〜3で採点。', zh: '按笔顺描写：基础笔画、越南语大写字母、英语ABC、写自己的名字。1–3星评分。', ar: 'تتبّع الخطوط بالترتيب: خطوط أساسية، حروف فيتنامية، أبجدية إنجليزية، وكتابة اسمك. تقييم 1–3 نجوم.' },
    'tapviet.title':            { vi: '✍️ Tập Viết Chữ',                    en: '✍️ Letter Tracing',                    ja: '✍️ なぞりがき',                     zh: '✍️ 写字练习',                   ar: '✍️ تتبّع الحروف' },
    'tapviet.tab.basic':        { vi: '✏️ Nét',                             en: '✏️ Strokes',                           ja: '✏️ せん',                           zh: '✏️ 笔画',                       ar: '✏️ خطوط' },
    'tapviet.tab.name':         { vi: '⭐ Tên bé',                           en: '⭐ My name',                            ja: '⭐ なまえ',                          zh: '⭐ 我的名字',                    ar: '⭐ اسمي' },
    'tapviet.redo':             { vi: 'Viết lại',                           en: 'Start over',                           ja: 'やり直す',                          zh: '重写',                          ar: 'إعادة' },
    'tapviet.stroke':           { vi: 'Nét',                                en: 'Stroke',                               ja: '画',                                zh: '笔画',                          ar: 'خط' },

    /* ============================================================
       HỌC VUI — TỪ VỰNG & CON SỐ
       ============================================================ */
    'card.hocvui.title':        { vi: 'Học Vui — Từ Vựng & Con Số',         en: 'Fun Learning — Words & Numbers',       ja: 'たのしく学ぶ — ことばとかず',       zh: '快乐学习 — 词汇与数字',         ar: 'تعلّم ممتع — كلمات وأرقام' },
    'card.hocvui.desc':         { vi: '3 trò trong 1: ghép chữ với hình, đếm & so sánh & cộng trừ, nghe & tìm. Học song ngữ Việt–Anh.', en: '3 games in 1: match words to pictures, count/compare/add & subtract, listen & find. Bilingual Vietnamese–English.', ja: '3つの遊び：ことば合わせ、かぞえて比べて計算、きいて探す。ベトナム語と英語の二か国語。', zh: '三合一：图文配对、数数比较加减、听音找图。越英双语。', ar: 'ثلاث ألعاب في واحدة: طابق الكلمات بالصور، عدّ وقارن واجمع، استمع وابحث. ثنائية اللغة.' },
    'card.hocvui.chip':         { vi: 'Song ngữ VI–EN',                     en: 'Bilingual VI–EN',                      ja: '二か国語',                          zh: '双语',                          ar: 'ثنائي اللغة' },
    'hocvui.title':             { vi: '🧩 Học Vui',                         en: '🧩 Fun Learning',                      ja: '🧩 たのしく学ぶ',                   zh: '🧩 快乐学习',                   ar: '🧩 تعلّم ممتع' },
    'hocvui.mode.match':        { vi: 'Ghép chữ với hình',                  en: 'Match words to pictures',              ja: 'ことば合わせ',                      zh: '图文配对',                      ar: 'طابق الكلمة بالصورة' },
    'hocvui.mode.count':        { vi: 'Đếm & so sánh',                      en: 'Count & compare',                      ja: 'かぞえて比べる',                    zh: '数数与比较',                    ar: 'عدّ وقارن' },
    'hocvui.mode.listen':       { vi: 'Nghe & tìm',                         en: 'Listen & find',                        ja: 'きいて探す',                        zh: '听音找图',                      ar: 'استمع وابحث' },
    'hocvui.back':              { vi: 'Chọn trò khác',                      en: 'Pick another game',                    ja: 'ほかの遊びへ',                      zh: '选择其他游戏',                  ar: 'اختر لعبة أخرى' },
    'hocvui.lang':              { vi: 'Đổi ngôn ngữ học',                   en: 'Switch learning language',             ja: '学習言語を切替',                    zh: '切换学习语言',                  ar: 'تبديل لغة التعلم' },
    'hocvui.again':             { vi: 'CHƠI TIẾP ▶',                        en: 'PLAY AGAIN ▶',                         ja: 'もう一回 ▶',                        zh: '再玩一次 ▶',                    ar: '▶ العب مجددًا' },
    'hocvui.pick':              { vi: 'CHỌN TRÒ KHÁC',                      en: 'PICK ANOTHER',                         ja: 'ほかの遊び',                        zh: '选其他游戏',                    ar: 'اختر أخرى' },
    'hocvui.right':             { vi: 'Đúng ngay lần đầu',                  en: 'Right on first try',                   ja: '一発正解',                          zh: '一次答对',                      ar: 'صحيح من أول مرة' },

    /* ============================================================
       LẬT HÌNH TRÍ NHỚ + RẮN SĂN MỒI
       ============================================================ */
    'card.lathinh.title':       { vi: 'Lật Hình Trí Nhớ',                   en: 'Memory Match',                         ja: 'しんけいすいじゃく',                zh: '记忆翻牌',                      ar: 'لعبة الذاكرة' },
    'card.lathinh.desc':        { vi: 'Lật thẻ tìm cặp giống nhau. 3 chế độ: hình–hình, chữ–hình (học chữ cái), số–số lượng (học đếm).', en: 'Flip cards to find pairs. 3 modes: picture–picture, letter–picture (learn letters), number–quantity (learn counting).', ja: 'カードをめくってペア探し。絵合わせ・文字と絵・数と量の3モード。', zh: '翻牌找相同。三种模式：图配图、字母配图、数字配数量。', ar: 'اقلب البطاقات لإيجاد الأزواج. ثلاثة أوضاع للتعلّم.' },
    'card.lathinh.chip':        { vi: 'Luyện trí nhớ',                      en: 'Memory training',                      ja: '記憶力',                            zh: '记忆力',                        ar: 'تدريب الذاكرة' },
    'lathinh.title':            { vi: '🃏 Lật Hình Trí Nhớ',                en: '🃏 Memory Match',                      ja: '🃏 しんけいすいじゃく',             zh: '🃏 记忆翻牌',                   ar: '🃏 لعبة الذاكرة' },
    'lathinh.tab.classic':      { vi: '🃏 Hình',                            en: '🃏 Pictures',                          ja: '🃏 絵',                             zh: '🃏 图片',                       ar: '🃏 صور' },
    'lathinh.tab.letter':       { vi: '🅰️ Chữ–hình',                        en: '🅰️ Letter–picture',                    ja: '🅰️ 文字と絵',                       zh: '🅰️ 字母配图',                   ar: '🅰️ حرف وصورة' },
    'lathinh.tab.number':       { vi: '🔢 Số–lượng',                        en: '🔢 Number–quantity',                   ja: '🔢 数と量',                         zh: '🔢 数字配数量',                 ar: '🔢 رقم وكمية' },
    'lathinh.moves':            { vi: 'Số lượt',                            en: 'Moves',                                ja: '手数',                              zh: '步数',                          ar: 'المحاولات' },
    'card.ran.title':           { vi: 'Rắn Săn Mồi',                        en: 'Snake',                                ja: 'スネーク',                          zh: '贪吃蛇',                        ar: 'الثعبان' },
    'card.ran.desc':            { vi: 'Rắn cổ điển kiểu Nokia + chế độ học: ăn chữ cái theo thứ tự A→Z hoặc số 1→9. Đi xuyên tường, thân thiện với bé.', en: 'Classic Nokia-style snake + learning modes: eat letters A→Z or numbers 1→9 in order. Wall wrap-around, kid friendly.', ja: '懐かしのスネーク＋学習モード：A→Zや1→9の順に食べよう。壁すり抜けで子どもにやさしい。', zh: '经典贪吃蛇+学习模式：按顺序吃字母A→Z或数字1→9。穿墙模式，适合孩子。', ar: 'ثعبان كلاسيكي + وضع تعليمي: كل الحروف أو الأرقام بالترتيب.' },
    'card.ran.chip':            { vi: 'Phản xạ',                            en: 'Reflexes',                             ja: '反射神経',                          zh: '反应力',                        ar: 'ردود الفعل' },
    'ran.title':                { vi: '🐍 Rắn Săn Mồi',                     en: '🐍 Snake',                             ja: '🐍 スネーク',                       zh: '🐍 贪吃蛇',                     ar: '🐍 الثعبان' },
    'ran.tab.classic':          { vi: '🍎 Cổ điển',                         en: '🍎 Classic',                           ja: '🍎 クラシック',                     zh: '🍎 经典',                       ar: '🍎 كلاسيكي' },
    'ran.start':                { vi: 'Bấm để chơi!',                       en: 'Tap to play!',                         ja: 'タップしてスタート！',              zh: '点击开始！',                    ar: 'اضغط للعب!' },
    'ran.play':                 { vi: 'CHƠI ▶',                             en: 'PLAY ▶',                               ja: 'プレイ ▶',                          zh: '开始 ▶',                        ar: '▶ العب' },
    'ran.retry':                { vi: 'CHƠI LẠI ▶',                         en: 'PLAY AGAIN ▶',                         ja: 'もう一回 ▶',                        zh: '再来一次 ▶',                    ar: '▶ العب مجددًا' },
    'ran.resume':               { vi: 'TIẾP TỤC ▶',                         en: 'RESUME ▶',                             ja: '再開 ▶',                            zh: '继续 ▶',                        ar: '▶ استئناف' },
    'ran.paused':               { vi: 'Tạm dừng',                           en: 'Paused',                               ja: '一時停止',                          zh: '已暂停',                        ar: 'متوقف' },
    'ran.eat':                  { vi: 'Ăn',                                 en: 'Eat',                                  ja: '食べる',                            zh: '吃',                            ar: 'كُل' },
    'ran.find':                 { vi: 'Tìm',                                en: 'Find',                                 ja: '探して',                            zh: '找',                            ar: 'ابحث عن' },
    'ran.please':               { vi: 'nhé',                                en: 'please',                               ja: 'ね',                                zh: '哦',                            ar: 'من فضلك' },
    'ran.over':                 { vi: 'Ôi, rắn tự cắn mình rồi!',           en: 'Oops, the snake bit itself!',          ja: 'あっ、自分をかんじゃった！',        zh: '哎呀，蛇咬到自己了！',          ar: 'عضّ الثعبان نفسه!' },
    'ran.win.abc':              { vi: 'Tuyệt vời! Ăn hết A đến Z!',         en: 'Amazing! Ate A to Z!',                 ja: 'すごい！AからZまで完食！',          zh: '太棒了！吃完A到Z！',            ar: 'رائع! أكل من A إلى Z!' },
    'ran.win.num':              { vi: 'Tuyệt vời! Ăn hết 1 đến 9!',         en: 'Amazing! Ate 1 to 9!',                 ja: 'すごい！1から9まで完食！',          zh: '太棒了！吃完1到9！',            ar: 'رائع! أكل من 1 إلى 9!' },

    /* ============================================================
       GHÉP HÌNH TRƯỢT + CỜ CA-RÔ
       ============================================================ */
    'card.ghephinh.title':      { vi: 'Ghép Hình Trượt',                    en: 'Sliding Puzzle',                       ja: 'スライドパズル',                    zh: '滑块拼图',                      ar: 'أحجية الانزلاق' },
    'card.ghephinh.desc':       { vi: 'Trượt các mảnh về đúng chỗ để ghép lại bức hình Pokémon. 2 cỡ 3×3 và 4×4, có nút xem hình mẫu.', en: 'Slide the pieces back into place to rebuild the Pokémon picture. 3×3 and 4×4 sizes, with a peek button.', ja: 'ピースをスライドしてポケモンの絵を完成させよう。3×3と4×4、お手本ボタン付き。', zh: '滑动拼块还原宝可梦图片。3×3和4×4两种，带看原图按钮。', ar: 'حرّك القطع لإعادة بناء الصورة. حجمان 3×3 و4×4.' },
    'card.ghephinh.chip':       { vi: 'Tư duy không gian',                  en: 'Spatial thinking',                     ja: '空間認識',                          zh: '空间思维',                      ar: 'تفكير مكاني' },
    'ghephinh.title':           { vi: '🧩 Ghép Hình Trượt',                 en: '🧩 Sliding Puzzle',                    ja: '🧩 スライドパズル',                 zh: '🧩 滑块拼图',                   ar: '🧩 أحجية الانزلاق' },
    'ghephinh.easy':            { vi: 'Dễ 3×3',                             en: 'Easy 3×3',                             ja: 'かんたん 3×3',                      zh: '简单 3×3',                      ar: 'سهل 3×3' },
    'ghephinh.hard':            { vi: 'Khó 4×4',                            en: 'Hard 4×4',                             ja: 'むずかしい 4×4',                    zh: '困难 4×4',                      ar: 'صعب 4×4' },
    'ghephinh.peek':            { vi: 'Giữ để xem hình mẫu',                en: 'Hold to peek',                         ja: '長押しでお手本を見る',              zh: '按住看原图',                    ar: 'اضغط مطولًا لرؤية الصورة' },
    'card.caro.title':          { vi: 'Cờ Ca-rô',                           en: 'Tic-Tac-Toe · Caro',                   ja: '三目並べ・五目並べ',                zh: '井字棋·五子棋',                 ar: 'إكس-أو · كارو' },
    'card.caro.desc':           { vi: 'Tic-tac-toe 3×3 và ca-rô giấy vở 9×9 (5 thẳng hàng). Chơi 2 người trên cùng máy hoặc đấu với máy.', en: 'Tic-tac-toe 3×3 and notebook caro 9×9 (5 in a row). Two players on one device, or play against the computer.', ja: '3×3の三目並べと9×9の五目並べ。2人対戦かコンピュータ対戦。', zh: '3×3井字棋和9×9五子棋。双人同机或人机对战。', ar: 'إكس-أو 3×3 وكارو 9×9 (خمسة في صف). لاعبان أو ضد الحاسوب.' },
    'card.caro.chip':           { vi: 'Logic',                              en: 'Logic',                                ja: '論理',                              zh: '逻辑',                          ar: 'منطق' },
    'caro.title':               { vi: '⭕ Cờ Ca-rô',                         en: '⭕ Tic-Tac-Toe',                        ja: '⭕ 三目並べ',                        zh: '⭕ 井字棋',                      ar: '⭕ إكس-أو' },
    'caro.tab9':                { vi: '9×9 · 5 thẳng hàng',                 en: '9×9 · 5 in a row',                     ja: '9×9・五目',                         zh: '9×9·五连',                      ar: '9×9 · خمسة متتالية' },
    'caro.vsai':                { vi: '🤖 Với máy',                         en: '🤖 Vs computer',                       ja: '🤖 コンピュータ',                   zh: '🤖 人机',                       ar: '🤖 ضد الحاسوب' },
    'caro.vs2p':                { vi: '👥 2 người',                         en: '👥 2 players',                         ja: '👥 2人対戦',                        zh: '👥 双人',                       ar: '👥 لاعبان' },
    'caro.turn':                { vi: 'đi nào',                             en: 'your turn',                            ja: 'のばん',                            zh: '走棋',                          ar: 'دورك' },
    'caro.draw':                { vi: 'Hòa rồi!',                           en: "It's a draw!",                         ja: 'ひきわけ！',                        zh: '平局！',                        ar: 'تعادل!' },
    'caro.win':                 { vi: 'thắng rồi!',                         en: 'wins!',                                ja: 'のかち！',                          zh: '赢了！',                        ar: 'فاز!' },
    'caro.ai.win':              { vi: 'Máy thắng — thử lại nhé!',           en: 'Computer wins — try again!',           ja: 'コンピュータのかち — もう一回！',   zh: '电脑赢了 — 再试一次！',         ar: 'فاز الحاسوب — حاول مجددًا!' },
    'caro.next':                { vi: 'VÁN MỚI ▶',                          en: 'NEW ROUND ▶',                          ja: 'つぎのゲーム ▶',                    zh: '新一局 ▶',                      ar: '▶ جولة جديدة' },

    /* ============================================================
       XẾP GẠCH + BẮT VỊT + Ô ĂN QUAN + NHẢY LÒ CÒ
       ============================================================ */
    'card.xepgach.title':       { vi: 'Xếp Gạch',                           en: 'Brick Stacker',                        ja: 'ブロック積み',                      zh: '方块叠叠乐',                    ar: 'تكديس الطوب' },
    'card.xepgach.desc':        { vi: 'Xếp 7 loại gạch rơi thành hàng ngang để nổ dòng — như máy điện tử cầm tay 9999-in-1. Tốc độ khởi đầu chậm cho bé.', en: 'Stack the 7 falling bricks into full rows to clear lines — like the classic 9999-in-1 handheld. Slow start for kids.', ja: '落ちてくる7種のブロックを並べてライン消し。子ども向けにゆっくりスタート。', zh: '堆叠7种下落方块消行 — 像经典9999合1掌机。为孩子放慢起始速度。', ar: 'كدّس القطع السبع المتساقطة لمسح الصفوف. بداية بطيئة للأطفال.' },
    'xepgach.title':            { vi: '🏗️ Xếp Gạch',                        en: '🏗️ Brick Stacker',                     ja: '🏗️ ブロック積み',                   zh: '🏗️ 方块叠叠乐',                 ar: '🏗️ تكديس الطوب' },
    'xepgach.lines':            { vi: 'dòng',                               en: 'lines',                                ja: 'ライン',                            zh: '行',                            ar: 'صفوف' },
    'xepgach.next':             { vi: 'Tiếp theo',                          en: 'Next',                                 ja: 'つぎ',                              zh: '下一个',                        ar: 'التالي' },
    'xepgach.over':             { vi: 'Đầy bàn rồi!',                       en: 'The board is full!',                   ja: '積み上がっちゃった！',              zh: '堆满啦！',                      ar: 'امتلأت اللوحة!' },
    'card.batvit.title':        { vi: 'Bắt Vịt',                            en: 'Duck Whack',                           ja: 'アヒルたたき',                      zh: '打鸭子',                        ar: 'اضرب البطة' },
    'card.batvit.desc':         { vi: 'Vịt ngoi lên là đập! 45 giây ghi điểm. Chế độ học: chỉ đập con vịt mang đúng chữ cái được gọi tên.', en: 'Whack the ducks as they pop up! 45-second rounds. Learning mode: only whack the duck carrying the called-out letter.', ja: '出てきたアヒルをたたけ！45秒勝負。学習モードは呼ばれた文字のアヒルだけ。', zh: '鸭子冒头就打！45秒计分。学习模式：只打带指定字母的鸭子。', ar: 'اضرب البط عند ظهوره! وضع تعليمي: اضرب البطة التي تحمل الحرف المطلوب فقط.' },
    'batvit.title':             { vi: '🐤 Bắt Vịt',                         en: '🐤 Duck Whack',                        ja: '🐤 アヒルたたき',                   zh: '🐤 打鸭子',                     ar: '🐤 اضرب البطة' },
    'batvit.tab.classic':       { vi: '🐤 Đập hết',                         en: '🐤 Whack all',                         ja: '🐤 ぜんぶたたく',                   zh: '🐤 全都打',                     ar: '🐤 اضرب الكل' },
    'batvit.tab.letter':        { vi: '🅰️ Đập theo chữ',                    en: '🅰️ Whack by letter',                   ja: '🅰️ 文字でたたく',                   zh: '🅰️ 按字母打',                   ar: '🅰️ حسب الحرف' },
    'batvit.only':              { vi: 'Chỉ đập con mang chữ',               en: 'Only whack the duck with',             ja: 'この文字のアヒルだけ：',            zh: '只打带这个字母的：',            ar: 'اضرب فقط البطة التي تحمل' },
    'batvit.caught':            { vi: 'Bắt được',                           en: 'Caught',                               ja: 'つかまえた',                        zh: '抓到',                          ar: 'أمسكت' },
    'card.oanquan.title':       { vi: 'Ô Ăn Quan',                          en: 'Ô Ăn Quan (Mancala)',                  ja: 'オーアンクアン',                    zh: '越南播棋',                      ar: 'أو آن كوان' },
    'card.oanquan.desc':        { vi: 'Trò dân gian Việt Nam: rải quân, ăn chuỗi, ăn quan — "hết quan tàn dân". Chơi 2 người hoặc đấu với máy.', en: 'Vietnamese folk mancala: sow stones, chain captures, take the Quan. Two players or vs computer.', ja: 'ベトナムの伝統マンカラ：石をまいて連鎖キャプチャ。2人かコンピュータ対戦。', zh: '越南民间播棋：撒子、连吃、吃官。双人或人机对战。', ar: 'مانكالا فيتنامية شعبية: ازرع الأحجار والتقطها. لاعبان أو ضد الحاسوب.' },
    'card.oanquan.chip':        { vi: 'Tuổi thơ VN',                        en: 'VN childhood',                         ja: 'ベトナムの伝統',                    zh: '越南童年',                      ar: 'تراث فيتنامي' },
    'oanquan.title':            { vi: '🎲 Ô Ăn Quan',                       en: '🎲 Ô Ăn Quan',                         ja: '🎲 オーアンクアン',                 zh: '🎲 越南播棋',                   ar: '🎲 أو آن كوان' },
    'oanquan.hint':             { vi: 'Chạm 1 ô của mình → chọn hướng rải. Ô kế trống mà ô sau có quân là ăn!', en: 'Tap one of your squares → pick a direction. Empty next square + stones after it = capture!', ja: '自分のマスをタップ→方向を選ぶ。次が空でその先に石があれば取れる！', zh: '点自己的格→选方向。下一格空且再下一格有子就能吃！', ar: 'المس خانة لك ← اختر الاتجاه. خانة فارغة يليها أحجار = التقاط!' },
    'card.loco.title':          { vi: 'Nhảy Lò Cò Số',                      en: 'Number Hopscotch',                     ja: 'かずのけんけんぱ',                  zh: '数字跳房子',                    ar: 'الحجلة بالأرقام' },
    'card.loco.desc':           { vi: 'Chạm ô theo đúng dãy số cho ếch nhảy lò cò: 1→10, đếm cách 2, cách 5 — máy đọc to từng số tiếng Việt.', en: 'Tap the squares in sequence and the frog hops along: 1→10, count by 2s, by 5s — each number read aloud.', ja: '順番にマスをタップしてカエルがけんけんぱ：1→10、2とび、5とび。数を読み上げ。', zh: '按顺序点格子让青蛙跳：1→10、隔2数、隔5数 — 每个数都朗读。', ar: 'المس المربعات بالترتيب ويقفز الضفدع: 1→10، عدّ بالاثنين وبالخمسات.' },
    'loco.title':               { vi: '🐸 Nhảy Lò Cò Số',                   en: '🐸 Number Hopscotch',                  ja: '🐸 かずのけんけんぱ',               zh: '🐸 数字跳房子',                 ar: '🐸 الحجلة بالأرقام' },
    'loco.step2':               { vi: 'Cách 2',                             en: 'By 2s',                                ja: '2とび',                             zh: '隔2数',                         ar: 'بالاثنين' },
    'loco.step5':               { vi: 'Cách 5',                             en: 'By 5s',                                ja: '5とび',                             zh: '隔5数',                         ar: 'بالخمسات' },
    'loco.jump':                { vi: 'Nhảy vào ô số',                      en: 'Hop to number',                        ja: 'このかずへジャンプ：',              zh: '跳到数字',                      ar: 'اقفز إلى الرقم' },

    /* ============================================================
       HỌC VẦN TIẾNG VIỆT
       ============================================================ */
    'card.hocvan.title':        { vi: 'Học Vần Tiếng Việt',                 en: 'Vietnamese Phonics',                   ja: 'ベトナム語のつづり',                zh: '越南语拼读',                    ar: 'صوتيات فيتنامية' },
    'card.hocvan.desc':         { vi: 'Ghép âm với vần, điền chữ còn thiếu, nghe–viết. Máy đánh vần to như cô giáo: "bờ – o – bo – huyền – bò!"', en: 'Blend onsets and rimes, fill missing letters, listen & type. The app spells aloud like a first-grade teacher.', ja: '音と韻を組み合わせ、欠けた文字を埋め、聞いて書く。先生のように音読してくれる。', zh: '拼读声母韵母、填缺失字母、听写。像老师一样大声拼读。', ar: 'ركّب الأصوات، أكمل الحروف الناقصة، استمع واكتب. ينطق التطبيق بصوت عالٍ.' },
    'card.hocvan.chip':         { vi: 'Lớp lá – lớp 1',                     en: 'Pre-K – Grade 1',                      ja: '年長〜小1',                         zh: '学前班–一年级',                 ar: 'تمهيدي – أول ابتدائي' },
    'hocvan.title':             { vi: '🔤 Học Vần',                         en: '🔤 Phonics',                           ja: '🔤 つづり',                         zh: '🔤 拼读',                       ar: '🔤 صوتيات' },
    'hocvan.tab.ghep':          { vi: '🔤 Ghép vần',                        en: '🔤 Blend',                             ja: '🔤 くみあわせ',                     zh: '🔤 拼合',                       ar: '🔤 ركّب' },
    'hocvan.tab.dien':          { vi: '✏️ Điền chữ',                        en: '✏️ Fill in',                           ja: '✏️ うめる',                         zh: '✏️ 填空',                       ar: '✏️ أكمل' },
    'hocvan.tab.nghe':          { vi: '👂 Nghe – viết',                     en: '👂 Listen & type',                     ja: '👂 きいて書く',                     zh: '👂 听写',                       ar: '👂 استمع واكتب' },

    /* ============================================================
       TOÁN LỚP 1
       ============================================================ */
    'card.toan.title':          { vi: 'Toán Lớp 1',                         en: 'Grade 1 Math',                         ja: '小1さんすう',                       zh: '一年级数学',                    ar: 'رياضيات أول ابتدائي' },
    'card.toan.desc':           { vi: '5 trò trong 1: cộng trừ đến 20, so sánh > < = với cái cân, xem giờ, hình khối & quy luật, đi chợ trả tiền.', en: '5 games in 1: add & subtract to 20, compare with a balance scale, tell time, shapes & patterns, go shopping.', ja: '5つの遊び：20までのたし算ひき算、てんびんで比べる、時計、形と規則、お買い物。', zh: '五合一：20以内加减、天平比大小、认时钟、图形与规律、购物付钱。', ar: 'خمس ألعاب: جمع وطرح حتى 20، مقارنة بالميزان، قراءة الساعة، أشكال وأنماط، تسوّق.' },
    'toan.title':               { vi: '➕ Toán Lớp 1',                      en: '➕ Grade 1 Math',                      ja: '➕ さんすう',                       zh: '➕ 数学',                        ar: '➕ رياضيات' },
    'toan.tab.add':             { vi: 'Cộng trừ',                           en: 'Add & subtract',                       ja: 'たしひき',                          zh: '加减',                          ar: 'جمع وطرح' },
    'toan.tab.compare':         { vi: 'So sánh',                            en: 'Compare',                              ja: 'くらべる',                          zh: '比大小',                        ar: 'قارن' },
    'toan.tab.clock':           { vi: 'Xem giờ',                            en: 'Clock',                                ja: 'とけい',                            zh: '认时钟',                        ar: 'الساعة' },
    'toan.tab.shape':           { vi: 'Hình & quy luật',                    en: 'Shapes & patterns',                    ja: 'かたちと規則',                      zh: '图形与规律',                    ar: 'أشكال وأنماط' },
    'toan.tab.shop':            { vi: 'Đi chợ',                             en: 'Shopping',                             ja: 'お買い物',                          zh: '购物',                          ar: 'تسوّق' },
    'toan.q.add':               { vi: 'Bằng mấy nhỉ?',                      en: 'What does it equal?',                  ja: 'いくつかな？',                      zh: '等于几呢？',                    ar: 'كم الناتج؟' },
    'toan.q.missing':           { vi: 'Điền số còn thiếu!',                 en: 'Fill in the missing number!',          ja: '足りない数はどれ？',                zh: '填上缺少的数！',                ar: 'أكمل الرقم الناقص!' },
    'toan.q.compare':           { vi: 'Chọn dấu đúng!',                     en: 'Pick the right sign!',                 ja: '正しい記号は？',                    zh: '选对符号！',                    ar: 'اختر الإشارة الصحيحة!' },
    'toan.q.clock':             { vi: 'Đồng hồ chỉ mấy giờ?',               en: 'What time is it?',                     ja: '何時かな？',                        zh: '几点了？',                      ar: 'كم الساعة؟' },
    'toan.q.shape':             { vi: 'Đồ vật này giống hình gì?',          en: 'What shape is this object?',           ja: 'どんな形かな？',                    zh: '这个东西像什么形状？',          ar: 'ما شكل هذا الشيء؟' },
    'toan.q.pattern':           { vi: 'Hình nào tiếp theo?',                en: 'What comes next?',                     ja: 'つぎは何かな？',                    zh: '接下来是什么？',                ar: 'ما التالي؟' },
    'toan.q.shop':              { vi: 'Trả tiền cho đủ nhé!',               en: 'Pay the exact amount!',                ja: 'ぴったり払おう！',                  zh: '付对钱哦！',                    ar: 'ادفع المبلغ الصحيح!' },
    'toan.paid':                { vi: 'Đã trả',                             en: 'Paid',                                 ja: '払った',                            zh: '已付',                          ar: 'دفعت' },
    'toan.thousand':            { vi: 'nghìn',                              en: 'thousand',                             ja: '千',                                zh: '千',                            ar: 'ألف' },

    /* ============================================================
       LUYỆN TƯ DUY (6 trò trong 1)
       ============================================================ */
    'card.tuduy.title':         { vi: 'Luyện Tư Duy',                       en: 'Brain Training',                       ja: 'あたまの体操',                      zh: '思维训练',                      ar: 'تدريب العقل' },
    'card.tuduy.desc':          { vi: '6 trò trong 1: mê cung, sudoku con vật, tìm điểm khác, nối số thành hình, cái nào khác nhóm, xếp bánh tháp Hà Nội.', en: '6 games in 1: maze, animal sudoku, spot the difference, connect the dots, odd one out, Tower of Hanoi pancakes.', ja: '6つの遊び：迷路、どうぶつ数独、まちがい探し、点つなぎ、なかま外れ、ハノイの塔。', zh: '六合一：迷宫、动物数独、找不同、连点成画、找不同类、汉诺塔叠饼。', ar: 'ست ألعاب: متاهة، سودوكو، أوجد الاختلاف، صل النقاط، المختلف، برج هانوي.' },
    'card.tuduy.chip':          { vi: 'Tư duy logic',                       en: 'Logic',                                ja: '論理的思考',                        zh: '逻辑思维',                      ar: 'تفكير منطقي' },
    'tuduy.title':              { vi: '🧠 Luyện Tư Duy',                    en: '🧠 Brain Training',                    ja: '🧠 あたまの体操',                   zh: '🧠 思维训练',                   ar: '🧠 تدريب العقل' },
    'tuduy.maze':               { vi: 'Mê cung',                            en: 'Maze',                                 ja: '迷路',                              zh: '迷宫',                          ar: 'متاهة' },
    'tuduy.sudoku':             { vi: 'Sudoku bé',                          en: 'Kid sudoku',                           ja: 'どうぶつ数独',                      zh: '宝宝数独',                      ar: 'سودوكو الصغار' },
    'tuduy.spot':               { vi: 'Tìm điểm khác',                      en: 'Spot the difference',                  ja: 'まちがい探し',                      zh: '找不同',                        ar: 'أوجد الاختلاف' },
    'tuduy.dots':               { vi: 'Nối số thành hình',                  en: 'Connect the dots',                     ja: '点つなぎ',                          zh: '连点成画',                      ar: 'صل النقاط' },
    'tuduy.odd':                { vi: 'Cái nào khác nhóm?',                 en: 'Odd one out',                          ja: 'なかま外れ',                        zh: '找不同类',                      ar: 'من المختلف؟' },
    'tuduy.hanoi':              { vi: 'Xếp bánh cho gấu',                   en: 'Pancake tower',                        ja: 'パンケーキタワー',                  zh: '给熊叠饼',                      ar: 'برج الفطائر' },
    'tuduy.maze.hint':          { vi: 'Rê tay dắt chuột 🐭 đến miếng phô mai 🧀', en: 'Drag to lead the mouse 🐭 to the cheese 🧀', ja: '🐭をなぞって🧀まで案内しよう', zh: '拖动小鼠🐭找到奶酪🧀', ar: 'اسحب لتقود الفأر إلى الجبن' },
    'tuduy.maze.win':           { vi: 'tìm được',                           en: 'found the',                            ja: 'ゲット',                            zh: '找到了',                        ar: 'وجد' },
    'tuduy.sudoku.hint':        { vi: 'Mỗi hàng, cột, ô vuông: mỗi con vật đúng 1 lần', en: 'Each row, column and box: every animal exactly once', ja: '行・列・ブロックに同じ動物は1回だけ', zh: '每行每列每宫：每种动物只出现一次', ar: 'كل صف وعمود ومربع: كل حيوان مرة واحدة' },
    'tuduy.sudoku.win':         { vi: 'Giải xong sudoku!',                  en: 'Sudoku solved!',                       ja: '数独クリア！',                      zh: '数独完成！',                    ar: 'حُلّ السودوكو!' },
    'tuduy.spot.hint':          { vi: 'Tìm chỗ khác nhau',                  en: 'Find the differences',                 ja: 'ちがいを探そう',                    zh: '找出不同',                      ar: 'أوجد الاختلافات' },
    'tuduy.spot.win':           { vi: 'Tinh mắt quá!',                      en: 'Eagle eyes!',                          ja: 'よく見つけたね！',                  zh: '眼力真好！',                    ar: 'عين حادة!' },
    'tuduy.dots.hint':          { vi: 'Chạm các chấm theo thứ tự',          en: 'Tap the dots in order',                ja: '順番に点をタップ',                  zh: '按顺序点圆点',                  ar: 'المس النقاط بالترتيب' },
    'tuduy.odd.hint':           { vi: 'Cái nào KHÔNG cùng nhóm?',           en: 'Which one does NOT belong?',           ja: 'なかま外れはどれ？',                zh: '哪个不是同类？',                ar: 'أيها لا ينتمي للمجموعة؟' },
    'tuduy.hanoi.discs':        { vi: 'tầng bánh',                          en: 'pancakes',                             ja: '枚',                                zh: '层饼',                          ar: 'فطائر' },
    'tuduy.hanoi.best':         { vi: 'ít nhất',                            en: 'best',                                 ja: '最短',                              zh: '最少',                          ar: 'الأفضل' },
    'tuduy.hanoi.hint':         { vi: 'Chuyển cả chồng bánh sang đĩa 🍽️ — bánh to không đè bánh nhỏ', en: 'Move the whole stack to the plate 🍽️ — no big pancake on a small one', ja: '🍽️へ全部移そう — 大きいのは小さいのに乗せない', zh: '把整叠饼移到盘子🍽️ — 大饼不能压小饼', ar: 'انقل الكومة إلى الطبق — لا فطيرة كبيرة فوق صغيرة' },

    /* ============================================================
       TRÒ XƯA + CỜ GÁNH + CỜ CÁ NGỰA
       ============================================================ */
    'card.troxua.title':        { vi: 'Trò Xưa — Sân Chơi Ngày Bé',         en: 'Old-School Playground',                ja: 'なつかしの遊び場',                  zh: '怀旧游乐场',                    ar: 'ملعب الزمن الجميل' },
    'card.troxua.desc':         { vi: '3 trò hội chợ tuổi thơ: oẳn tù tì đấu máy, bắn bi văng khỏi vòng, ném bóng đổ lon — kéo thả căng lực như thật.', en: '3 childhood fair games: rock-paper-scissors vs computer, marble shooting, can knockdown — drag to aim with real physics.', ja: 'じゃんけん、ビー玉、缶倒し — 引っぱって狙う本格物理。', zh: '猜拳、弹珠、砸罐子 — 拖拽瞄准真实物理。', ar: 'حجر ورقة مقص، البلي، إسقاط العلب — بفيزياء حقيقية.' },
    'troxua.title':             { vi: '🪀 Trò Xưa',                         en: '🪀 Old-School Games',                  ja: '🪀 なつかし遊び',                   zh: '🪀 怀旧游戏',                   ar: '🪀 ألعاب قديمة' },
    'troxua.help.home':         { vi: 'Chọn một trò chơi: Oẳn tù tì, Bắn bi, Ném lon, hoặc Nhảy dây!', en: 'Pick a game: rock-paper-scissors, marbles, can knockdown, or jump rope!', ja: 'あそびをえらんでね：じゃんけん、ビー玉、缶倒し、なわとび！', zh: '选一个游戏：猜拳、弹珠、砸罐子或跳绳！', ar: 'اختر لعبة: حجر ورقة مقص، البلي، إسقاط العلب، أو نط الحبل!' },
    'troxua.rps':               { vi: 'Oẳn tù tì',                          en: 'Rock–paper–scissors',                  ja: 'じゃんけん',                        zh: '猜拳',                          ar: 'حجر ورقة مقص' },
    'troxua.marble':            { vi: 'Bắn bi',                             en: 'Marbles',                              ja: 'ビー玉',                            zh: '弹珠',                          ar: 'البلي' },
    'troxua.cans':              { vi: 'Ném lon',                            en: 'Can knockdown',                        ja: '缶倒し',                            zh: '砸罐子',                        ar: 'إسقاط العلب' },
    'troxua.rps.hint':          { vi: 'Thắng 3 ván trước là vô địch! Bao bọc búa, búa đập kéo, kéo cắt bao', en: 'First to 3 wins! Paper wraps rock, rock crushes scissors, scissors cut paper', ja: '先に3勝で優勝！', zh: '先赢3局获胜！', ar: 'أول من يفوز بثلاث جولات!' },
    'troxua.rps.win':           { vi: 'bé thắng ván này!',                  en: 'you win this round!',                  ja: 'きみの勝ち！',                      zh: '你赢了这局！',                  ar: 'فزت بهذه الجولة!' },
    'troxua.rps.lose':          { vi: 'máy thắng ván này!',                 en: 'computer wins this round!',            ja: 'コンピュータの勝ち！',              zh: '电脑赢了这局！',                ar: 'فاز الحاسوب!' },
    'troxua.rps.champion':      { vi: 'Bé vô địch oẳn tù tì!',              en: 'You are the champion!',                ja: 'じゃんけんチャンピオン！',          zh: '你是猜拳冠军！',                ar: 'أنت البطل!' },
    'troxua.marble.shots':      { vi: 'Lượt bắn',                           en: 'Shots',                                ja: '残り',                              zh: '次数',                          ar: 'رميات' },
    'troxua.marble.won':        { vi: 'Ăn được',                            en: 'Won',                                  ja: 'ゲット',                            zh: '赢得',                          ar: 'ربحت' },
    'troxua.cans.throws':       { vi: 'Lượt ném',                           en: 'Throws',                               ja: '残り',                              zh: '次数',                          ar: 'رميات' },
    'troxua.cans.knocked':      { vi: 'Lon rơi',                            en: 'Cans down',                            ja: '倒した缶',                          zh: '倒下的罐',                      ar: 'علب ساقطة' },
    'card.coganh.title':        { vi: 'Cờ Gánh',                            en: 'Cờ Gánh (VN Checkers)',                ja: 'コーガイン',                        zh: '越南夹棋',                      ar: 'كو غان' },
    'card.coganh.desc':         { vi: 'Cờ dân gian Việt Nam bàn 5×5: đứng giữa 2 quân địch là "gánh" cả 2 đổi màu theo mình. Đấu máy hoặc 2 người.', en: 'Vietnamese folk board game: land between two enemy pieces to "carry" them — both flip to your color. Vs computer or 2 players.', ja: 'ベトナムの伝統ボードゲーム：敵2つの間に入ると両方奪える。', zh: '越南民间棋：站在两敌子中间即可夹吃变色。', ar: 'لعبة فيتنامية شعبية: قف بين قطعتين للعدو لقلبهما.' },
    'coganh.title':             { vi: '⚫ Cờ Gánh',                          en: '⚫ Cờ Gánh',                            ja: '⚫ コーガイン',                      zh: '⚫ 越南夹棋',                    ar: '⚫ كو غان' },
    'coganh.hint':              { vi: 'Đứng giữa 2 quân địch thẳng hàng là "gánh" — cả 2 đổi màu theo mình!', en: 'Land between two enemy pieces in a line to flip them both!', ja: '敵2つの間に入ると両方とも自分の色に！', zh: '站到两个敌子中间，两个都变成你的颜色！', ar: 'قف بين قطعتين متحاذيتين للعدو لقلبهما!' },
    'card.cangua.title':        { vi: 'Cờ Cá Ngựa',                         en: 'Ludo (Cờ Cá Ngựa)',                    ja: 'ルード（馬ころがし）',              zh: '飞行棋',                        ar: 'لودو' },
    'card.cangua.desc':         { vi: 'Bàn cờ nhựa 4 màu ngày xưa: gieo 6 ra chuồng, đá ngựa đối thủ, về đích đúng bước. Đấu 1–3 máy hoặc 2 người.', en: 'The classic 4-color board: roll a 6 to leave the stable, kick opponents home, finish with exact rolls. Vs 1–3 AI or 2 players.', ja: '懐かしの4色ボード：6で出発、相手を蹴落とし、ぴったりゴール。', zh: '经典四色棋盘：掷6出马，踩子回营，精确到终。', ar: 'اللوحة الكلاسيكية: ارمِ 6 للخروج، اركل الخصوم، وأنهِ بدقة.' },
    'cangua.title':             { vi: '🐴 Cờ Cá Ngựa',                      en: '🐴 Ludo',                              ja: '🐴 ルード',                         zh: '🐴 飞行棋',                     ar: '🐴 لودو' },
    'cangua.vs1':               { vi: 'vs 1 máy',                           en: 'vs 1 AI',                              ja: 'vs コンピュータ1',                  zh: 'vs 1台电脑',                    ar: 'ضد حاسوب' },
    'cangua.vs3':               { vi: 'vs 3 máy',                           en: 'vs 3 AI',                              ja: 'vs コンピュータ3',                  zh: 'vs 3台电脑',                    ar: 'ضد 3 حواسيب' },
    'cangua.stuck':             { vi: 'Không đi được 😅',                   en: "Can't move 😅",                        ja: '動けない😅',                        zh: '走不了😅',                      ar: 'لا حركة 😅' },
    'cangua.pick':              { vi: 'Chọn ngựa nhấp nháy!',               en: 'Pick a blinking horse!',               ja: '光る馬を選ぼう！',                  zh: '选择闪烁的马！',                ar: 'اختر الحصان الوامض!' },
    'cangua.extra':             { vi: 'Được đi thêm lượt! 🎉',              en: 'Extra turn! 🎉',                       ja: 'もう1回！🎉',                       zh: '再走一次！🎉',                  ar: 'دور إضافي! 🎉' },
    'troxua.rope':              { vi: 'Nhảy dây',                           en: 'Jump rope',                            ja: 'なわとび',                          zh: '跳绳',                          ar: 'نط الحبل' },
    'troxua.rope.count':        { vi: 'Nhảy được',                          en: 'Jumps',                                ja: 'ジャンプ',                          zh: '跳了',                          ar: 'قفزات' },
    'troxua.rope.times':        { vi: 'cái',                                en: 'times',                                ja: '回',                                zh: '下',                            ar: 'مرة' },
    'daovang.title':            { vi: '⛏️ Đào Vàng',                        en: '⛏️ Gold Digger',                       ja: '⛏️ 金採り',                         zh: '⛏️ 挖金子',                     ar: '⛏️ حفر الذهب' },
    'daovang.mode.classic':     { vi: 'Đào Vàng',                           en: 'Gold Digger',                          ja: '金採り',                            zh: '挖金子',                        ar: 'حفر الذهب' },
    'daovang.mode.mice':        { vi: 'Cuộc Săn Vàng',                      en: 'Gold Chase',                           ja: '金のおいかけっこ',                  zh: '追金大战',                      ar: 'مطاردة الذهب' },
    'daovang.mode.hard':        { vi: 'Thợ Mỏ Liều Lĩnh',                   en: 'Daring Miner',                         ja: '勇気ある鉱夫',                      zh: '勇敢矿工',                      ar: 'عامل منجم جريء' },
    'daovang.level':            { vi: 'Màn',                                en: 'Level',                                 ja: 'ステージ',                          zh: '关卡',                          ar: 'المستوى' },
    'daovang.win':              { vi: 'Đủ tiền qua màn!',                   en: 'Goal reached!',                        ja: '目標達成！',                        zh: '达到目标！',                    ar: 'تم بلوغ الهدف!' },
    'daovang.lose':             { vi: 'Chưa đủ tiền rồi!',                  en: 'Not enough gold!',                     ja: '目標に届かなかった！',              zh: '还不够钱！',                    ar: 'لم يكفِ الذهب!' },
    'daovang.shop.title':       { vi: 'Cửa hàng',                           en: 'Shop',                                 ja: 'おみせ',                            zh: '商店',                          ar: 'المتجر' },
    'daovang.shop.next':        { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'daovang.shop.go':          { vi: 'ĐI MUA ĐỒ ▶',                        en: 'GO SHOPPING ▶',                        ja: 'おかいもの ▶',                      zh: '去购物 ▶',                      ar: 'اذهب للتسوق ▶' },
    'daovang.shop.owned':       { vi: 'Đã có',                              en: 'Owned',                                ja: 'もってる',                          zh: '已拥有',                        ar: 'لديك' },
    'daovang.shop.dynamite':    { vi: 'Thuốc nổ',                           en: 'Dynamite',                             ja: 'ダイナマイト',                      zh: '炸药',                          ar: 'ديناميت' },
    'daovang.shop.strength':    { vi: 'Nước tăng lực',                      en: 'Strength drink',                       ja: 'げんきドリンク',                    zh: '能量饮料',                      ar: 'مشروب الطاقة' },
    'daovang.shop.clover':      { vi: 'Cỏ 3 lá may mắn',                    en: 'Lucky clover',                         ja: 'よつばのクローバー',                zh: '幸运草',                        ar: 'نبتة الحظ' },
    'daovang.shop.book':        { vi: 'Sách sưu tầm đá',                    en: 'Rock collector book',                  ja: 'いしのずかん',                      zh: 'collector 石头图鉴',            ar: 'كتاب جامع الصخور' },
    'daovang.shop.polish':      { vi: 'Đánh bóng kim cương',                en: 'Diamond polish',                       ja: 'ダイヤのつやだし',                  zh: '钻石抛光',                      ar: 'تلميع الألماس' },
    'daovang.help.home':        { vi: 'Chọn kiểu chơi: Đào Vàng, Cuộc Săn Vàng, hoặc Thợ Mỏ Liều Lĩnh!', en: 'Pick a mode: Gold Digger, Gold Chase, or Daring Miner!', ja: 'モードをえらんでね：金採り、金のおいかけっこ、勇気ある鉱夫！', zh: '选一个模式：挖金子、追金大战或勇敢矿工！', ar: 'اختر نمطًا: حفر الذهب، مطاردة الذهب، أو عامل منجم جريء!' },
    'daovang.help.play':        { vi: 'Chờ cần câu đu tới chỗ muốn thả rồi bấm vào sân để thả mỏ xuống nhé! Mỏ chạm vật gì sẽ tự cuốn về.', en: 'Wait for the hook to swing where you want, then tap to drop it! It reels back automatically once it grabs something.', ja: 'フックがほしい場所にきたら画面をタップして落とそう！', zh: '等钩子摆到想要的位置再点一下放下！勾到东西会自动收回来。', ar: 'انتظر حتى يتأرجح الخطاف للمكان المطلوب ثم اضغط لإسقاطه!' },
    'daovang.help.shop':        { vi: 'Dùng tiền vừa đào được để mua đồ giúp màn sau dễ hơn nhé!', en: 'Spend your gold on upgrades to make the next level easier!', ja: 'あつめたお金でつぎのステージをらくにしよう！', zh: '用刚赚到的钱买道具，让下一关更轻松！', ar: 'استخدم الذهب لشراء ترقيات تسهّل المستوى التالي!' },
    'dapvang.title':            { vi: '🪓 Đập Vàng',                         en: '🪓 Rock Smash',                        ja: '🪓 いわわり',                        zh: '🪓 砸石头',                      ar: '🪓 تحطيم الصخور' },
    'dapvang.help':             { vi: 'Bấm vào cụm từ 2 viên đá cùng màu liền kề trở lên để đập vỡ — cụm càng to càng nhiều điểm!', en: 'Tap a group of 2 or more same-colored rocks touching each other to smash them — bigger groups score more!', ja: '同じ色の石が2つ以上つながっているところをタップして割ろう！大きいほど高得点！', zh: '点击2个以上相邻同色的石头就能砸碎——组合越大分数越高！', ar: 'اضغط على مجموعة من صخرتين أو أكثر متجاورتين بنفس اللون لتحطيمها!' },
    'dapvang.big':              { vi: 'Cụm to quá, giỏi ghê!',               en: 'Huge group, amazing!',                 ja: 'おおきい！すごいね！',              zh: '好大一组，真厉害！',            ar: 'مجموعة كبيرة، رائع!' },
    'dapvang.win':              { vi: 'Đủ điểm qua màn!',                   en: 'Goal reached!',                        ja: 'もくひょうたっせい！',              zh: '达到目标！',                    ar: 'تم بلوغ الهدف!' },
    'dapvang.lose':             { vi: 'Hết nước đập rồi!',                  en: 'Out of moves!',                        ja: 'てがなくなった！',                  zh: '没有次数了！',                  ar: 'نفدت المحاولات!' },
    'dapvang.next':             { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'vivua.title':              { vi: '👑 Vị Vua Vàng',                     en: '👑 Gold King',                         ja: '👑 きんのおうさま',                 zh: '👑 黄金国王',                    ar: '👑 ملك الذهب' },
    'vivua.help':               { vi: 'Chạm 1 hũ rồi chạm hũ bên cạnh để đổi chỗ — tạo được hàng 3 hũ cùng màu là ăn điểm!', en: 'Tap a pot, then tap a neighbor to swap — line up 3 same-colored pots to score!', ja: 'つぼをタップしてから、となりのつぼをタップして入れかえよう！同じ色を3つならべてね！', zh: '点一个罐子，再点旁边的罐子交换位置——排成3个同色就能得分！', ar: 'المس جرة ثم المس المجاورة لتبديلهما — رتّب 3 جرار بنفس اللون لتسجيل نقاط!' },
    'vivua.combo':              { vi: 'Combo!',                              en: 'Combo!',                                ja: 'コンボ！',                          zh: '连击！',                        ar: 'مزدوج!' },
    'vivua.win':                { vi: 'Đủ điểm qua màn!',                   en: 'Goal reached!',                        ja: 'もくひょうたっせい！',              zh: '达到目标！',                    ar: 'تم بلوغ الهدف!' },
    'vivua.lose':               { vi: 'Hết nước đi rồi!',                   en: 'Out of moves!',                        ja: 'てがなくなった！',                  zh: '没有次数了！',                  ar: 'نفدت المحاولات!' },
    'vivua.next':               { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'hamvang.title':            { vi: '⛏️ Đường Hầm Săn Vàng',              en: '⛏️ Gold Tunnel',                       ja: '⛏️ きんのトンネル',                 zh: '⛏️ 黄金隧道',                    ar: '⛏️ نفق الذهب' },
    'hamvang.help':             { vi: 'Bấm ô đá kề bên để đập lấy vàng, bấm ô trống để di chuyển. Đá phía trên có thể rơi xuống — nhớ tránh ra chỗ khác nhé!', en: 'Tap a neighboring rock to dig for gold, tap an empty cell to move. Rocks above can fall — dodge out of the way!', ja: 'となりの岩をタップしてほろう、空いているマスをタップして進もう。上から岩がおちてくるから気をつけてね！', zh: '点相邻的石头挖金子，点空格子就能移动。上面的石头可能会掉下来——记得躲开！', ar: 'المس صخرة مجاورة للحفر، أو خانة فارغة للتحرك. قد تسقط الصخور من الأعلى — تجنبها!' },
    'hamvang.hit':              { vi: 'Á, đá rơi trúng rồi!',               en: 'Ouch, a rock hit you!',                 ja: 'あっ、岩があたった！',              zh: '哎呀，被石头砸到了！',          ar: 'أوه، أصابتك صخرة!' },
    'hamvang.win':              { vi: 'Đủ vàng qua màn!',                   en: 'Goal reached!',                        ja: 'もくひょうたっせい！',              zh: '达到目标！',                    ar: 'تم بلوغ الهدف!' },
    'hamvang.lose':             { vi: 'Đá rơi trúng hết rồi!',              en: 'Out of lives!',                        ja: 'ライフがなくなった！',              zh: '生命值用完了！',                ar: 'نفدت المحاولات!' },
    'hamvang.next':             { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'hamvang2.title':           { vi: '🎳 Đào Hầm Vàng',                    en: '🎳 Rolling Gold Tunnel',                ja: '🎳 ボールでたんけん',               zh: '🎳 滚球寻宝',                    ar: '🎳 نفق الذهب المتدحرج' },
    'hamvang2.help':            { vi: 'Kéo tay từ quả bóng qua các ô liền kề để vẽ đường — bóng sẽ lăn theo, nhặt vàng và né chỗ có đá xám, cố về tới lá cờ nhé!', en: 'Drag from the ball through neighboring cells to draw a path — the ball rolls along it, collects gold, and avoids gray rocks. Try to reach the flag!', ja: 'ボールから となりのマスへ指をなぞって道をかこう！ボールはその道をころがって金をあつめ、灰色の岩をさけて旗をめざすよ！', zh: '从球开始拖动经过相邻格子画出路线——球会沿着路线滚动、捡金币、避开灰色石头，试着到达旗子吧！', ar: 'اسحب من الكرة عبر الخانات المجاورة لرسم مسار — تتدحرج الكرة وتجمع الذهب وتتجنب الصخور!' },
    'hamvang2.win':             { vi: 'Bóng về đích rồi!',                  en: 'The ball made it!',                    ja: 'ゴールできた！',                    zh: '球到达终点了！',                ar: 'وصلت الكرة!' },
    'hamvang2.allcoins':        { vi: 'Nhặt hết vàng luôn!',                en: 'Collected all the gold too!',          ja: '金貨も全部あつめた！',              zh: '还捡光了所有金币！',            ar: 'وجمعت كل الذهب أيضًا!' },
    'hamvang2.lose':            { vi: 'Hết bước rồi, bóng chưa về đích!',   en: 'Out of steps, the ball didn\'t make it!', ja: 'あるくかいすうがなくなった！',    zh: '步数用完了，球还没到终点！',    ar: 'نفدت الخطوات، لم تصل الكرة!' },
    'hamvang2.next':            { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'phinhi.title':             { vi: '✈️ Phi Đội Nhí',                     en: '✈️ Little Squadron',                   ja: '✈️ ちびひこうたい',                 zh: '✈️ 小小飞行队',                  ar: '✈️ السرب الصغير' },
    'phinhi.start':             { vi: 'Kéo tay để bay, máy bay tự động bắn!', en: 'Drag to fly, the plane auto-fires!', ja: 'ゆびでうごかそう、ひこうきは自動ではっしゃするよ！', zh: '拖动飞行，飞机会自动开火！', ar: 'اسحب للتحليق، تطلق الطائرة تلقائيًا!' },
    'phinhi.play':              { vi: 'BAY LÊN ▶',                          en: 'TAKE OFF ▶',                           ja: 'とびたつ ▶',                        zh: '起飞 ▶',                        ar: 'أقلع ▶' },
    'phinhi.help':              { vi: 'Kéo tay để máy bay bay trái phải né thiên thạch — máy bay tự động bắn giúp bé rồi, cứ nhặt sao vàng để được thêm điểm nhé!', en: 'Drag to move the plane left and right to dodge meteors — it auto-fires for you, just collect stars for bonus points!', ja: 'ゆびでひこうきをうごかしていんせきをよけよう。じどうではっしゃするから、ほしをあつめてね！', zh: '拖动飞机左右躲避陨石——飞机会自动开火，收集星星加分吧！', ar: 'اسحب لتحريك الطائرة يمينًا ويسارًا لتفادي النيازك — تطلق تلقائيًا، فقط اجمع النجوم!' },
    'phinhi.win':               { vi: 'Bay qua màn rồi!',                   en: 'Level cleared!',                       ja: 'クリアした！',                      zh: '过关了！',                      ar: 'اجتزت المستوى!' },
    'phinhi.lose':              { vi: 'Máy bay hết xăng rồi!',              en: 'Out of lives!',                        ja: 'ライフがなくなった！',              zh: '生命值用完了！',                ar: 'نفدت المحاولات!' },
    'phinhi.next':              { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'thucung.title':            { vi: '🐉 Thú Cưng Đại Chiến',              en: '🐉 Pet Battle',                        ja: '🐉 ペットたいけつ',                 zh: '🐉 宠物大对战',                  ar: '🐉 معركة الحيوانات الأليفة' },
    'thucung.pick':             { vi: 'Chọn thú cưng của bé!',              en: 'Pick your pet!',                       ja: 'ペットをえらんでね！',              zh: '选择你的宠物！',                ar: 'اختر حيوانك الأليف!' },
    'thucung.hint':             { vi: '🔥 Lửa khắc 🌿 Cỏ · 🌿 Cỏ khắc 💧 Nước · 💧 Nước khắc 🔥 Lửa', en: '🔥 Fire beats 🌿 Grass · 🌿 Grass beats 💧 Water · 💧 Water beats 🔥 Fire', ja: '🔥 ほのおは🌿くさに強い・🌿くさは💧みずに強い・💧みずは🔥ほのおに強い', zh: '🔥 火克🌿草 · 🌿草克💧水 · 💧水克🔥火', ar: '🔥 النار تهزم 🌿 العشب · 🌿 العشب يهزم 💧 الماء · 💧 الماء يهزم 🔥 النار' },
    'thucung.round':            { vi: 'Trận',                               en: 'Round',                                ja: 'たいせん',                          zh: '回合',                          ar: 'الجولة' },
    'thucung.nextfoe':          { vi: 'Thắng rồi! Đối thủ tiếp theo xuất hiện!', en: 'Victory! The next opponent appears!', ja: 'かった！つぎのあいてがあらわれた！', zh: '胜利了！下一个对手出现了！', ar: 'فزت! ظهر الخصم التالي!' },
    'thucung.win':              { vi: 'Đại thắng! Bé đã hạ hết đối thủ!',   en: 'Total victory! You defeated every opponent!', ja: 'だいしょうり！ぜんいんにかった！', zh: '大获全胜！打败了所有对手！',    ar: 'انتصار كامل! هزمت جميع الخصوم!' },
    'thucung.lose':             { vi: 'Thua rồi, thử lại nhé!',             en: 'You lost, try again!',                 ja: 'まけちゃった、またちょうせん！',    zh: '输了，再试一次吧！',            ar: 'خسرت، حاول مجددًا!' },
    'thucung.next':             { vi: 'ĐẤU TIẾP MÀN MỚI ▶',                 en: 'NEXT LEVEL ▶',                         ja: 'つぎのステージへ ▶',                zh: '挑战下一关 ▶',                  ar: 'المستوى التالي ▶' },
    'thucung.help.home':        { vi: 'Chọn 1 thú cưng của bé để bắt đầu đại chiến!', en: 'Pick one of your pets to start the battle!', ja: 'ペットをえらんでたいけつをはじめよう！', zh: '选一只宠物开始对战吧！', ar: 'اختر حيوانًا أليفًا لبدء المعركة!' },
    'thucung.help.battle':      { vi: 'Bấm vào 1 chiêu để tấn công — nhớ hệ khắc chế: Lửa khắc Cỏ, Cỏ khắc Nước, Nước khắc Lửa!', en: 'Tap a move to attack — remember the type triangle: Fire beats Grass, Grass beats Water, Water beats Fire!', ja: 'わざをタップしてこうげき！ほのお→くさ→みず→ほのおのじゃんけんをおぼえてね！', zh: '点一个招式进行攻击——记住相克关系：火克草、草克水、水克火！', ar: 'اضغط حركة للهجوم — تذكّر: النار تهزم العشب، العشب يهزم الماء، الماء يهزم النار!' },
    'pokedc.title':             { vi: '⚡ Pokémon Đại Chiến',                en: '⚡ Pokémon Battle',                     ja: '⚡ ポケモンだいけっせん',            zh: '⚡ 宝可梦大对战',                ar: '⚡ معركة البوكيمون' },
    'pokedc.pick':              { vi: 'Chọn Pokémon khởi đầu của bé!',      en: 'Pick your starter Pokémon!',           ja: 'さいしょのポケモンをえらんでね！',  zh: '选择你的初始宝可梦！',          ar: 'اختر البوكيمون الأول!' },
    'pokedc.all':               { vi: 'Tất cả',                             en: 'All',                                  ja: 'すべて',                            zh: '全部',                          ar: 'الكل' },
    'pokedc.hint':              { vi: '🔥 Lửa khắc 🌿 Cỏ · 🌿 Cỏ khắc 💧 Nước · 💧 Nước khắc 🔥 Lửa · ⚡ Điện khắc 💧 Nước', en: '🔥 Fire beats 🌿 Grass · 🌿 Grass beats 💧 Water · 💧 Water beats 🔥 Fire · ⚡ Electric beats 💧 Water', ja: '🔥→🌿・🌿→💧・💧→🔥・⚡→💧 のあいしょうだよ', zh: '🔥 火克🌿草 · 🌿草克💧水 · 💧水克🔥火 · ⚡电克💧水', ar: '🔥 النار تهزم 🌿 العشب · 🌿 العشب يهزم 💧 الماء · 💧 الماء يهزم 🔥 النار · ⚡ الكهرباء تهزم 💧 الماء' },
    'pokedc.evolvehint':        { vi: 'Thắng trận để Pokémon TIẾN HÓA mạnh hơn — trùm đang chờ ở trận cuối!', en: 'Win battles to EVOLVE your Pokémon — a boss awaits in the final round!', ja: 'かってポケモンをしんかさせよう！さいごにボスがまってるよ！', zh: '赢下战斗让宝可梦进化——最后一战有头目等着你！', ar: 'افز بالمعارك ليتطور البوكيمون — الزعيم ينتظر في الجولة الأخيرة!' },
    'pokedc.boss':              { vi: '👑 TRÙM XUẤT HIỆN!',                 en: '👑 BOSS APPEARS!',                     ja: '👑 ボスとうじょう！',               zh: '👑 头目出现了！',                ar: '👑 ظهر الزعيم!' },
    'pokedc.round':             { vi: 'Trận',                               en: 'Round',                                ja: 'たいせん',                          zh: '回合',                          ar: 'الجولة' },
    'pokedc.nextfoe':           { vi: 'Thắng rồi! Đối thủ tiếp theo xuất hiện!', en: 'Victory! The next opponent appears!', ja: 'かった！つぎのあいてがあらわれた！', zh: '胜利了！下一个对手出现了！', ar: 'فزت! ظهر الخصم التالي!' },
    'pokedc.evolve':            { vi: '{a} tiến hóa thành {b}!',            en: '{a} evolved into {b}!',                ja: '{a}は{b}にしんかした！',            zh: '{a}进化成{b}了！',              ar: 'تطور {a} إلى {b}!' },
    'pokedc.super':             { vi: 'Hiệu quả cực mạnh!',                 en: 'Super effective!',                     ja: 'こうかばつぐん！',                  zh: '效果拔群！',                    ar: 'فعّال للغاية!' },
    'pokedc.weak':              { vi: 'Không hiệu quả lắm...',              en: 'Not very effective...',                ja: 'こうかいまひとつ…',                 zh: '效果不太好……',                  ar: 'ليس فعالًا جدًا...' },
    'pokedc.win':               { vi: 'Đại thắng! Bé đã hạ cả trùm cuối!',  en: 'Total victory! You even beat the boss!', ja: 'だいしょうり！ボスもたおした！',   zh: '大获全胜！连头目都打败了！',    ar: 'انتصار كامل! هزمت حتى الزعيم!' },
    'pokedc.lose':              { vi: 'Thua rồi, chọn lại Pokémon và thử lần nữa nhé!', en: 'You lost — pick a Pokémon and try again!', ja: 'まけちゃった、もういちどえらんでちょうせん！', zh: '输了，重新选一只再挑战吧！', ar: 'خسرت — اختر بوكيمون وحاول مجددًا!' },
    'pokedc.next':              { vi: 'ĐẤU TIẾP MÀN MỚI ▶',                 en: 'NEXT LEVEL ▶',                         ja: 'つぎのステージへ ▶',                zh: '挑战下一关 ▶',                  ar: 'المستوى التالي ▶' },
    'pokedc.help.home':         { vi: 'Chọn 1 Pokémon khởi đầu để bắt đầu đại chiến!', en: 'Pick a starter Pokémon to begin the battle!', ja: 'さいしょのポケモンをえらんでたたかいをはじめよう！', zh: '选一只初始宝可梦开始对战吧！', ar: 'اختر بوكيمون للبدء!' },
    'pokedc.help.battle':       { vi: 'Bấm vào 1 chiêu để tấn công — nhớ hệ khắc chế: Lửa khắc Cỏ, Cỏ khắc Nước, Nước khắc Lửa, Điện khắc Nước. Thắng trận để Pokémon tiến hóa nhé!', en: 'Tap a move to attack — remember: Fire beats Grass, Grass beats Water, Water beats Fire, Electric beats Water. Win battles to evolve!', ja: 'わざをタップしてこうげき！あいしょうをおぼえて、かってしんかさせよう！', zh: '点招式攻击——记住相克关系，赢下战斗让宝可梦进化！', ar: 'اضغط حركة للهجوم — تذكّر التفاعلات، وافز لتتطور!' },
    'gopso.title':              { vi: '🔢 Gộp Số Vui',                       en: '🔢 Merge Fun',                          ja: '🔢 かずをがっちゃん',                zh: '🔢 数字合并',                    ar: '🔢 دمج الأرقام' },
    'gopso.help':               { vi: 'Vuốt tay theo 4 hướng để đẩy các ô số — 2 ô cùng số chạm nhau sẽ gộp thành 1 ô gấp đôi. Gộp đủ tới số mục tiêu để qua màn nhé!', en: 'Swipe in any of 4 directions to push the number tiles — two matching tiles merge into double! Reach the target number to win the level!', ja: 'ゆびで4ほうこうにスワイプしてすうじをおそう！おなじすうじがくっつくと2ばいになるよ！もくひょうのすうじにとどけばクリア！', zh: '向4个方向滑动推动数字方块——两个相同的数字碰到一起会合并成2倍！凑到目标数字就能过关！', ar: 'اسحب في أي من الاتجاهات الأربعة لدفع المربعات — يندمج رقمان متطابقان مضاعِفَين القيمة! صل إلى الرقم المستهدف للفوز!' },
    'gopso.win':                { vi: 'Gộp được số mục tiêu rồi!',          en: 'Reached the target number!',           ja: 'もくひょうたっせい！',              zh: '达到目标数字了！',              ar: 'وصلت إلى الرقم المستهدف!' },
    'gopso.lose':               { vi: 'Bàn đầy rồi, hết cách gộp nữa!',     en: 'Board full, no more merges possible!', ja: 'ばんがいっぱいでもうがっちゃんできない！', zh: '棋盘满了，没法再合并了！',      ar: 'امتلأت اللوحة، لا مزيد من الدمج!' },
    'gopso.next':               { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'vuonrau.title':            { vi: '🌻 Vườn Rau Thần Kỳ',                en: '🌻 Magic Garden',                      ja: '🌻 まほうのはたけ',                 zh: '🌻 神奇菜园',                    ar: '🌻 الحديقة السحرية' },
    'vuonrau.help':             { vi: 'Chọn 1 loại cây rồi bấm vào ô trống để trồng. Đậu Xanh mới bắn được côn trùng — nhưng chỉ bắn trúng côn trùng ĐI CÙNG HÀNG với nó thôi, nên mỗi hàng cần có ít nhất 1 cây Đậu Xanh mới an toàn! Hoa Mặt Trời tạo thêm nước tưới, Xương Rồng chắn đường không bắn được.', en: 'Pick a plant then tap an empty cell to plant it. Only Pea Shooter attacks — but it only hits bugs in ITS OWN ROW, so every row needs at least one to stay safe! Sunflower makes water, Cactus blocks the path but can\'t attack.', ja: 'しょくぶつをえらんでからマスをタップしてうえよう。こうげきできるのはまめだけ、しかもおなじれつのこんちゅうにしかあたらないよ！れつごとにまめをうえてね！ひまわりはみずをつくる、サボテンはみちをふさぐだけだよ。', zh: '选一种植物再点空格种下。只有豆豆射手能攻击——但只能打中和它同一行的虫子，所以每一行都要种至少一株才安全！向日葵产水，仙人掌只能挡路不能攻击。', ar: 'اختر نباتًا ثم اضغط على خانة فارغة. فقط بازلاء يهاجم — لكن فقط الحشرات في نفس صفه! ازرع واحدًا في كل صف. عباد الشمس ينتج الماء، والصبار يسد الطريق فقط.' },
    'vuonrau.win':              { vi: 'Vườn rau an toàn rồi!',              en: 'The garden is safe!',                  ja: 'はたけをまもりきった！',            zh: '菜园安全了！',                  ar: 'الحديقة آمنة!' },
    'vuonrau.lose':             { vi: 'Côn trùng tràn vào vườn rồi!',       en: 'Bugs got into the garden!',            ja: 'こんちゅうにやられちゃった！',      zh: '虫子闯进菜园了！',              ar: 'اقتحمت الحشرات الحديقة!' },
    'vuonrau.next':             { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'betimban.title':           { vi: '🙈 Bé Tìm Bạn',                      en: '🙈 Find My Friends',                   ja: '🙈 おともだちさがし',              zh: '🙈 找朋友',                      ar: '🙈 ابحث عن أصدقائي' },
    'betimban.help':            { vi: 'Nhìn hàng trên cùng xem cần tìm những bạn nào — rồi chạm đúng bạn đó lẫn trong đám đồ vật để tìm ra hết trước khi hết giờ nhé!', en: 'Look at the top row to see who to find — tap them among the clutter before time runs out!', ja: 'いちばんうえのれつをみて、だれをさがすかチェック！じかんがなくなるまえにみつけよう！', zh: '看看最上面一行要找谁——在杂物中点出他们，赶在时间用完前找齐！', ar: 'انظر إلى الصف العلوي لمعرفة من تبحث عنه — المسهم بين الأغراض قبل انتهاء الوقت!' },
    'betimban.findhint':        { vi: 'Tìm cho đủ các bạn ở hàng trên nhé!', en: 'Find everyone shown at the top!',      ja: 'うえにいるおともだちをぜんぶさがそう！', zh: '找齐上面显示的朋友吧！',        ar: 'ابحث عن جميع من في الأعلى!' },
    'betimban.win':             { vi: 'Tìm hết bạn rồi!',                   en: 'Found everyone!',                      ja: 'ぜんいんみつけた！',                zh: '全部找到了！',                  ar: 'وجدت الجميع!' },
    'betimban.lose':            { vi: 'Hết giờ rồi, còn bạn chưa tìm ra!',  en: 'Out of time, some friends are still hiding!', ja: 'じかんぎれ、まだかくれているおともだちがいるよ！', zh: '时间到了，还有朋友没找到！', ar: 'انتهى الوقت، ما زال هناك أصدقاء مختبئون!' },
    'betimban.next':            { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'kimcuong.title':           { vi: '💎 Kim Cương Lấp Lánh',              en: '💎 Sparkling Gems',                    ja: '💎 きらきらダイヤ',                 zh: '💎 闪亮钻石',                    ar: '💎 الجواهر المتلألئة' },
    'kimcuong.help':            { vi: 'Kéo tay nối 2 viên kim cương cùng màu thành 1 đường — các đường không được cắt ngang nhau. Nối đủ hết các cặp là qua màn nhé!', en: 'Drag to connect two same-color gems with one line — lines must never cross each other. Connect every pair to clear the level!', ja: 'おなじいろのダイヤを1本のせんでつなごう！せんどうしはこうさしちゃダメ。ぜんぶつないだらクリア！', zh: '拖动把两颗同色钻石连成一条线——线不能互相交叉。连好所有配对就过关！', ar: 'اسحب لتوصيل جوهرتين من نفس اللون بخط واحد — يجب ألا تتقاطع الخطوط. صِل كل الأزواج للفوز!' },
    'kimcuong.win':             { vi: 'Nối hết kim cương rồi, lấp lánh quá!', en: 'All gems connected, so sparkly!',    ja: 'ぜんぶつないだ、きらきら！',        zh: '全部连好了，好闪亮！',          ar: 'وصلت كل الجواهر، يا للتألق!' },
    'kimcuong.next':            { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'behai.title':              { vi: '🍉 Bé Hái Trái Cây',                 en: '🍉 Fruit Picker',                      ja: '🍉 くだものキャッチ',               zh: '🍉 宝宝摘水果',                  ar: '🍉 قاطف الفواكه' },
    'behai.start':              { vi: 'Vuốt tay ngang qua trái cây đang bay để hái — né chú ong nhé!', en: 'Swipe across the flying fruit to pick it — dodge the bee!', ja: 'とんでくるくだものをスワイプでキャッチ！ハチにはさわらないでね！', zh: '滑过飞起的水果来采摘——躲开小蜜蜂！', ar: 'اسحب عبر الفاكهة الطائرة لقطفها — تجنّب النحلة!' },
    'behai.play':               { vi: 'HÁI THÔI ▶',                         en: 'START PICKING ▶',                      ja: 'キャッチする ▶',                    zh: '开始采摘 ▶',                    ar: 'ابدأ القطف ▶' },
    'behai.help':               { vi: 'Vuốt tay ngang qua trái cây đang bay để hái — vuốt 1 đường trúng nhiều trái được thưởng combo. Đừng chạm vào chú ong kẻo bị chích, và đừng để rơi trái nhé!', en: 'Swipe across the flying fruit to pick it — hit several in one swipe for a combo bonus! Don\'t touch the bee or you\'ll get stung, and don\'t let fruit drop!', ja: 'とんでくるくだものをスワイプでキャッチ！1回のスワイプでたくさんとるとコンボボーナス！ハチにさわるとさされちゃう、くだものをおとさないでね！', zh: '滑过飞起的水果来采摘——一次滑到多个水果有连击奖励！别碰小蜜蜂会被蜇，也别让水果掉下去！', ar: 'اسحب عبر الفاكهة الطائرة لقطفها — اقطف عدة فواكه بسحبة واحدة لمكافأة كومبو! لا تلمس النحلة وإلا لُدغت، ولا تدع الفاكهة تسقط!' },
    'behai.win':                { vi: 'Hái đầy giỏ trái cây rồi!',          en: 'Basket full of fruit!',                ja: 'かごいっぱいにとれた！',            zh: '果篮装满了！',                  ar: 'امتلأت السلة بالفواكه!' },
    'behai.lose':               { vi: 'Hết tim mất rồi!',                   en: 'Out of hearts!',                       ja: 'ハートがなくなっちゃった！',        zh: '爱心用完了！',                  ar: 'نفدت القلوب!' },
    'behai.next':               { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'behai.fruit.tao':          { vi: 'quả táo',                            en: 'apple',                                ja: 'りんご',                            zh: '苹果',                          ar: 'تفاحة' },
    'behai.fruit.cam':          { vi: 'quả cam',                            en: 'orange',                               ja: 'オレンジ',                          zh: '橙子',                          ar: 'برتقالة' },
    'behai.fruit.chuoi':        { vi: 'quả chuối',                          en: 'banana',                               ja: 'バナナ',                            zh: '香蕉',                          ar: 'موزة' },
    'behai.fruit.duahau':       { vi: 'quả dưa hấu',                        en: 'watermelon',                           ja: 'すいか',                            zh: '西瓜',                          ar: 'بطيخة' },
    'behai.fruit.dau':          { vi: 'quả dâu',                            en: 'strawberry',                           ja: 'いちご',                            zh: '草莓',                          ar: 'فراولة' },
    'behai.fruit.nho':          { vi: 'chùm nho',                           en: 'grapes',                               ja: 'ぶどう',                            zh: '葡萄',                          ar: 'عنب' },
    'behai.fruit.xoai':         { vi: 'quả xoài',                           en: 'mango',                                ja: 'マンゴー',                          zh: '芒果',                          ar: 'مانجو' },
    'behai.fruit.dua':          { vi: 'quả dứa',                            en: 'pineapple',                            ja: 'パイナップル',                      zh: '菠萝',                          ar: 'أناناس' },
    'calon.title':              { vi: '🐟 Cá Lớn Biển Xanh',                en: '🐟 Big Fish Blue Sea',                 ja: '🐟 おおきなさかな',                 zh: '🐟 大鱼吃小鱼',                  ar: '🐟 السمكة الكبيرة' },
    'calon.start':              { vi: 'Đặt ngón tay để cá bơi theo — ăn cá nhỏ hơn mình, né cá to hơn!', en: 'Touch to guide your fish — eat smaller fish, dodge bigger ones!', ja: 'ゆびでさかなをうごかそう！ちいさいさかなをたべて、おおきいのはよけてね！', zh: '手指引导小鱼——吃比自己小的鱼，躲开大鱼！', ar: 'المس لتوجيه سمكتك — كُل الأصغر وتجنّب الأكبر!' },
    'calon.play':               { vi: 'BƠI THÔI ▶',                         en: 'SWIM ▶',                               ja: 'およぐ ▶',                          zh: '出发 ▶',                        ar: 'اسبح ▶' },
    'calon.help':               { vi: 'Đặt ngón tay vào màn hình để cá bơi theo — chỉ ăn được cá NHỎ hơn mình thôi, gặp cá to hơn thì bơi tránh xa nhé! Ăn đủ cá sẽ lớn lên, lớn đủ ba lần là thắng!', en: 'Touch the screen and your fish follows — you can only eat SMALLER fish, swim away from bigger ones! Eat enough to grow — grow three times to win!', ja: 'がめんにタッチするとさかながついてくるよ。じぶんよりちいさいさかなだけたべられる！たくさんたべて3かいおおきくなったらかち！', zh: '点住屏幕小鱼就跟着走——只能吃比自己小的鱼，遇到大鱼快躲开！吃够就长大，长大三次就赢了！', ar: 'المس الشاشة وستتبعك السمكة — كُل الأصغر فقط وابتعد عن الأكبر! كُل كثيرًا لتكبر — اكبر ثلاث مرات لتفوز!' },
    'calon.grew':               { vi: 'Lớn lên rồi!',                       en: 'You grew bigger!',                     ja: 'おおきくなった！',                  zh: '长大了！',                      ar: 'كبرت!' },
    'calon.win':                { vi: 'Thành cá lớn nhất biển rồi!',        en: 'You are the biggest fish in the sea!', ja: 'うみでいちばんおおきなさかなになった！', zh: '成为海里最大的鱼了！',          ar: 'أصبحت أكبر سمكة في البحر!' },
    'calon.lose':               { vi: 'Hết tim mất rồi!',                   en: 'Out of hearts!',                       ja: 'ハートがなくなっちゃった！',        zh: '爱心用完了！',                  ar: 'نفدت القلوب!' },
    'calon.next':               { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'rongcon.title':            { vi: '🐲 Rồng Con Bắn Trứng',              en: '🐲 Dragon Egg Shooter',                ja: '🐲 ドラゴンのたまごうち',           zh: '🐲 小龙射蛋',                    ar: '🐲 تنين البيض' },
    'rongcon.start':            { vi: 'Kéo tay để ngắm, thả tay để bắn — gom 3 trứng cùng màu là nổ!', en: 'Drag to aim, release to shoot — match 3 same-color eggs to pop!', ja: 'ドラッグでねらって、はなすとはっしゃ！おなじいろ3つでわれるよ！', zh: '拖动瞄准，松手发射——3个同色蛋就爆！', ar: 'اسحب للتصويب وأفلت للرمي — اجمع 3 بيضات متشابهة لتفرقع!' },
    'rongcon.play':             { vi: 'BẮN THÔI ▶',                         en: 'SHOOT ▶',                              ja: 'はっしゃ ▶',                        zh: '发射 ▶',                        ar: 'ارمِ ▶' },
    'rongcon.help':             { vi: 'Kéo tay để ngắm — đường chấm chấm cho biết trứng sẽ bay đi đâu, bắn vào tường còn nảy lại được! Gom đủ 3 trứng cùng màu dính nhau là nổ. Đừng để trứng tràn xuống vạch đỏ nhé!', en: 'Drag to aim — the dotted line shows where the egg will fly, it even bounces off walls! Match 3 touching same-color eggs to pop them. Don\'t let eggs reach the red line!', ja: 'ドラッグでねらおう。てんせんがたまごのとぶみちだよ、かべではねかえる！おなじいろ3つでわれる。あかいせんまでこないようにね！', zh: '拖动瞄准——虚线显示蛋的飞行路线，还能靠墙反弹！3个同色蛋相连就爆。别让蛋碰到红线！', ar: 'اسحب للتصويب — الخط المنقط يُظهر مسار البيضة، وترتد من الجدران! اجمع 3 بيضات متلاصقة متشابهة لتفرقع. لا تدع البيض يصل للخط الأحمر!' },
    'rongcon.great':            { vi: 'Giỏi quá!',                          en: 'Awesome!',                             ja: 'すごい！',                          zh: '太棒了！',                      ar: 'رائع!' },
    'rongcon.win':              { vi: 'Dọn sạch trứng rồi, rồng con vui quá!', en: 'All eggs cleared, baby dragon is so happy!', ja: 'たまごぜんぶクリア、ドラゴンだいよろこび！', zh: '蛋全清光，小龙好开心！',      ar: 'نظفت كل البيض، التنين الصغير سعيد!' },
    'rongcon.lose':             { vi: 'Trứng tràn tới vạch đỏ mất rồi!',    en: 'The eggs reached the red line!',       ja: 'たまごがあかいせんまできちゃった！', zh: '蛋碰到红线了！',                ar: 'وصل البيض إلى الخط الأحمر!' },
    'rongcon.next':             { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'chimnon.title':            { vi: '🐤 Chim Non Vượt Ống',               en: '🐤 Little Bird Flap',                  ja: '🐤 ことりのつつぬけ',               zh: '🐤 小鸟穿管',                    ar: '🐤 العصفور الصغير' },
    'chimnon.start':            { vi: 'Chạm màn hình để chim vỗ cánh — bay lọt qua khe giữa các ống nhé!', en: 'Tap to flap — fly through the gaps between the pipes!', ja: 'タップではばたき！パイプのすきまをとんでいこう！', zh: '点击拍翅膀——从管子的缝隙飞过去！', ar: 'انقر للرفرفة — طر عبر الفجوات بين الأنابيب!' },
    'chimnon.play':             { vi: 'BAY THÔI ▶',                         en: 'FLY ▶',                                ja: 'とぶ ▶',                            zh: '起飞 ▶',                        ar: 'طر ▶' },
    'chimnon.tap':              { vi: 'Chạm để bay!',                       en: 'Tap to fly!',                          ja: 'タップでとぶ！',                    zh: '点击起飞！',                    ar: 'انقر للطيران!' },
    'chimnon.help':             { vi: 'Chạm màn hình để chim vỗ cánh bay lên, thả tay thì chim rơi xuống — bay lọt qua khe giữa hai ống nhé! Mỗi năm ống có một chữ cái, bay qua sẽ được nghe đọc chữ đó!', en: 'Tap to flap upward, let go and the bird falls — fly through the gap between pipes! Every fifth pipe holds a letter, fly past to hear it read aloud!', ja: 'タップではばたき、はなすとおちるよ。パイプのすきまをとおりぬけよう！5ほんに1つもじがあって、とおるとよんでくれるよ！', zh: '点击向上拍翅，松手小鸟下落——穿过管子间的缝隙！每五根管子有一个字母，飞过就能听到读音！', ar: 'انقر للرفرفة لأعلى، واتركه فيسقط — طر عبر الفجوة! كل خمسة أنابيب حرف، طر لتسمعه!' },
    'chimnon.best':             { vi: 'Kỷ lục mới!',                        en: 'New record!',                          ja: 'しんきろく！',                      zh: '新纪录！',                      ar: 'رقم قياسي جديد!' },
    'chimnon.end':              { vi: 'Chim ngã rồi!',                      en: 'The bird fell!',                       ja: 'ことりがおちちゃった！',            zh: '小鸟摔倒了！',                  ar: 'سقط العصفور!' },
    'bongdo.title':             { vi: '🔴 Bóng Đỏ Phiêu Lưu',               en: '🔴 Red Ball Adventure',                ja: '🔴 あかいボールのぼうけん',          zh: '🔴 红球大冒险',                  ar: '🔴 مغامرة الكرة الحمراء' },
    'bongdo.start':             { vi: 'Bóng tự nảy — bé chỉ lái trái phải! Nhặt hết vòng rồi chạm cờ nhé!', en: 'The ball bounces by itself — just steer left and right! Collect all rings then touch the flag!', ja: 'ボールはじぶんではねるよ、みぎひだりだけそうさ！わっかをぜんぶあつめてはたにタッチ！', zh: '球会自己弹跳——只需左右操控！收集所有圆环再碰旗子！', ar: 'الكرة تقفز بنفسها — فقط وجّهها يمينًا ويسارًا! اجمع كل الحلقات ثم المس العلم!' },
    'bongdo.play':              { vi: 'LĂN THÔI ▶',                         en: 'ROLL ▶',                               ja: 'ころがる ▶',                        zh: '出发 ▶',                        ar: 'تدحرج ▶' },
    'bongdo.help':              { vi: 'Bóng tự nảy liên tục — bé chỉ cần bấm hai nút để lái trái phải! Nhặt hết các vòng vàng rồi chạm lá cờ để qua màn. Bóng xanh phồng to nảy cao hơn, bóng tím xì nhỏ chui được đường hầm thấp. Cẩn thận gai nhọn và hố sâu nhé!', en: 'The ball bounces on its own — just press the two buttons to steer! Collect all golden rings then touch the flag. Blue makes you big to bounce higher, purple makes you small to fit low tunnels. Watch out for spikes and pits!', ja: 'ボールはずっとはねてるよ、ボタンでみぎひだりだけ！わっかをあつめてはたへ。あおでおおきく、むらさきでちいさくなるよ。トゲとあなにきをつけて！', zh: '球会不停弹跳——按两个按钮左右操控！收集金环再碰旗子过关。蓝色变大弹更高，紫色变小钻矮隧道。小心尖刺和深坑！', ar: 'الكرة تقفز باستمرار — اضغط الزرين للتوجيه! اجمع الحلقات ثم المس العلم. الأزرق يكبّرك والبنفسجي يصغّرك. احذر الأشواك والحفر!' },
    'bongdo.grew':              { vi: 'Phồng to rồi!',                      en: 'You grew big!',                        ja: 'おおきくなった！',                  zh: '变大了！',                      ar: 'كبرت!' },
    'bongdo.shrank':            { vi: 'Xì nhỏ lại rồi!',                    en: 'You shrank small!',                    ja: 'ちいさくなった！',                  zh: '变小了！',                      ar: 'صغرت!' },
    'bongdo.win':               { vi: 'Tới cờ đích rồi!',                   en: 'You reached the flag!',                ja: 'ゴールのはたについた！',            zh: '到达终点旗了！',                ar: 'وصلت إلى العلم!' },
    'bongdo.lose':              { vi: 'Bóng xẹp mất rồi!',                  en: 'The ball went flat!',                  ja: 'ボールがぺしゃんこに！',            zh: '球瘪掉了！',                    ar: 'انكمشت الكرة!' },
    'bongdo.next':              { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'nembanh.title':            { vi: '🏰 Ném Banh Đổ Tháp',                en: '🏰 Tower Topple',                      ja: '🏰 タワーくずし',                   zh: '🏰 扔球倒塔',                    ar: '🏰 هدم البرج' },
    'nembanh.start':            { vi: 'Kéo quả banh ra sau rồi thả để phóng — đổ tháp đè trúng hết quái tinh nghịch!', en: 'Pull the ball back and release to launch — topple the tower onto the naughty critters!', ja: 'ボールをひっぱってはなそう！タワーをたおしていたずらものをやっつけよう！', zh: '把球往后拉再松手发射——推倒高塔压中调皮的小怪！', ar: 'اسحب الكرة للخلف وأفلت — اهدم البرج على المخلوقات المشاغبة!' },
    'nembanh.play':             { vi: 'NÉM THÔI ▶',                         en: 'LAUNCH ▶',                             ja: 'なげる ▶',                          zh: '发射 ▶',                        ar: 'ارمِ ▶' },
    'nembanh.help':             { vi: 'Kéo quả banh trên ná ra sau để ngắm — đường chấm chấm cho biết banh sẽ bay đi đâu — rồi thả tay để phóng! Kính vỡ ngay, gỗ chịu được vài nhát, đá thì phải ném thật mạnh. Đổ tháp đè trúng hết các chú quái tròn là thắng!', en: 'Pull the ball back on the slingshot to aim — dots show where it will fly — then release! Glass breaks instantly, wood takes a few hits, stone needs a really fast ball. Topple the tower onto every critter to win!', ja: 'ボールをひっぱってねらおう、てんせんがとぶみちだよ！ガラスはすぐわれる、きはなんかい、いしはつよくなげてね。ぜんいんやっつけたらかち！', zh: '在弹弓上把球往后拉瞄准——虚线是飞行轨迹——松手发射！玻璃一碰就碎，木头要几下，石头得用力扔。压中所有小怪就赢！', ar: 'اسحب الكرة على المقلاع للتصويب — النقاط تُظهر المسار — ثم أفلت! الزجاج ينكسر فورًا، الخشب يحتاج ضربات، الحجر يحتاج كرة سريعة. اهدم البرج على كل المخلوقات لتفوز!' },
    'nembanh.win':              { vi: 'Đổ sạch tháp rồi!',                  en: 'Tower toppled!',                       ja: 'タワーぜんぶたおした！',            zh: '塔全倒了！',                    ar: 'انهار البرج!' },
    'nembanh.lose':             { vi: 'Hết banh mất rồi!',                  en: 'Out of balls!',                        ja: 'ボールがなくなっちゃった！',        zh: '球用完了！',                    ar: 'نفدت الكرات!' },
    'nembanh.next':             { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'thamhiem.title':           { vi: '🧗 Nhà Thám Hiểm Tí Hon',            en: '🧗 Tiny Explorer',                     ja: '🧗 ちびたんけんか',                 zh: '🧗 小小探险家',                  ar: '🧗 المستكشف الصغير' },
    'thamhiem.start':           { vi: 'Chạy nhảy vượt hố, dậm đầu quái, ăn xu — chạm cờ là qua màn!', en: 'Run, jump over pits, stomp critters, grab coins — touch the flag to win!', ja: 'はしってとんで、てきをふんで、コインをあつめてはたへ！', zh: '奔跑跳跃越过坑洞、踩小怪、吃金币——碰到旗子就过关！', ar: 'اركض واقفز فوق الحفر، ودُس على الوحوش، واجمع العملات — المس العلم للفوز!' },
    'thamhiem.play':            { vi: 'ĐI THÔI ▶',                          en: 'GO ▶',                                 ja: 'しゅっぱつ ▶',                      zh: '出发 ▶',                        ar: 'انطلق ▶' },
    'thamhiem.help':            { vi: 'Bấm hai nút mũi tên để chạy, nút to bên phải để nhảy! Nhảy dậm lên ĐẦU quái thì thắng nó, đụng ngang hông là bị đau đấy. Ăn xu vàng, né hố sâu, chạm lá cờ để qua màn nhé!', en: 'Use the two arrow buttons to run and the big right button to jump! Stomp on a critter\'s HEAD to defeat it — touching its side hurts. Grab coins, avoid pits, reach the flag!', ja: 'やじるしボタンではしって、みぎのおおきいボタンでジャンプ！てきのあたまをふめばかてる、よこからさわるといたいよ。コインをあつめて、あなをよけて、はたまでいこう！', zh: '两个箭头按钮跑动，右边大按钮跳跃！踩到小怪头上能打败它，碰到侧面会受伤。吃金币、躲深坑、碰到旗子过关！', ar: 'استخدم زري السهم للركض والزر الكبير للقفز! دُس على رأس الوحش لتهزمه — لمسه من الجانب مؤلم. اجمع العملات وتجنب الحفر وصِل إلى العلم!' },
    'thamhiem.win':             { vi: 'Tới cờ đích rồi!',                   en: 'You reached the flag!',                ja: 'ゴールのはたについた！',            zh: '到达终点旗了！',                ar: 'وصلت إلى العلم!' },
    'thamhiem.lose':            { vi: 'Hết tim mất rồi!',                   en: 'Out of hearts!',                       ja: 'ハートがなくなっちゃった！',        zh: '爱心用完了！',                  ar: 'نفدت القلوب!' },
    'thamhiem.next':            { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'hangkim.title':            { vi: '⛏️ Hang Kim Cương Bí Ẩn',            en: '⛏️ Diamond Cave',                      ja: '⛏️ ダイヤのどうくつ',               zh: '⛏️ 神秘钻石洞',                  ar: '⛏️ كهف الماس' },
    'hangkim.start':            { vi: 'Vuốt để đào hang — gom đủ kim cương thì cửa mở, coi chừng đá rơi trúng đầu!', en: 'Swipe to dig — collect all diamonds to open the door, watch for falling rocks!', ja: 'スワイプでほろう！ダイヤをぜんぶあつめるとドアがひらく。おちてくるいわにちゅうい！', zh: '滑动挖洞——集齐钻石门就开，小心落石砸头！', ar: 'اسحب للحفر — اجمع كل الماس لفتح الباب، واحذر الصخور الساقطة!' },
    'hangkim.play':             { vi: 'ĐÀO THÔI ▶',                         en: 'DIG ▶',                                ja: 'ほる ▶',                            zh: '开挖 ▶',                        ar: 'احفر ▶' },
    'hangkim.help':             { vi: 'Vuốt theo bốn hướng để thợ mỏ đào đất từng bước. Gom đủ kim cương thì cửa vàng mở ra. Nhớ nhé: đào ô ngay dưới tảng đá thì đá sẽ RƠI xuống — đừng đứng bên dưới! Còn có thể đẩy đá sang ngang để mở đường.', en: 'Swipe in four directions to dig step by step. Collect all diamonds to open the golden door. Remember: digging under a rock makes it FALL — don\'t stand below! You can also push rocks sideways.', ja: '4ほうこうにスワイプしてほりすすもう。ダイヤをあつめるときんのドアがひらくよ。いわのしたをほるといわがおちてくる、したにたたないで！いわはよこにおせるよ。', zh: '向四个方向滑动一步步挖土。集齐钻石金门就开。记住：挖岩石正下方它会掉下来——别站在下面！还可以把岩石横着推开。', ar: 'اسحب في أربعة اتجاهات للحفر خطوة بخطوة. اجمع كل الماس ليفتح الباب الذهبي. تذكّر: الحفر تحت صخرة يجعلها تسقط — لا تقف تحتها! يمكنك دفع الصخور جانبيًا.' },
    'hangkim.dooropen':         { vi: 'Cửa mở rồi, chạy tới cửa thôi!',     en: 'The door is open, run to it!',        ja: 'ドアがひらいた、はしろう！',        zh: '门开了，快跑过去！',            ar: 'فُتح الباب، اركض إليه!' },
    'hangkim.win':              { vi: 'Thoát khỏi hang với túi đầy kim cương!', en: 'Escaped the cave with a bag full of diamonds!', ja: 'ダイヤいっぱいでどうくつをだっしゅつ！', zh: '带着满袋钻石逃出洞穴！',    ar: 'هربت من الكهف بحقيبة مليئة بالماس!' },
    'hangkim.lose':             { vi: 'Bị đá đè hết tim rồi!',              en: 'Crushed by rocks, out of hearts!',     ja: 'いわにつぶされてハートがなくなった！', zh: '被岩石压得爱心用完了！',      ar: 'سحقتك الصخور ونفدت القلوب!' },
    'hangkim.next':             { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'gavutru.title':            { vi: '🐔 Gà Vũ Trụ Xâm Lăng',              en: '🐔 Space Chicken Invasion',            ja: '🐔 うちゅうチキンぐんだん',         zh: '🐔 太空鸡入侵',                  ar: '🐔 غزو دجاج الفضاء' },
    'gavutru.start':            { vi: 'Đàn gà vũ trụ đang xâm lăng — kéo tay né trứng, súng tự bắn, nhặt sao lên 3 nòng!', en: 'Space chickens are invading — drag to dodge eggs, auto-fire, grab stars for triple guns!', ja: 'うちゅうチキンがしんりゃく！ドラッグでたまごをよけて、ほしをとって3れんそうに！', zh: '太空鸡入侵啦——拖动躲鸡蛋，自动开火，捡星星升3连炮！', ar: 'دجاج الفضاء يغزو — اسحب لتفادي البيض، نار تلقائية، اجمع النجوم لثلاثة مدافع!' },
    'gavutru.play':             { vi: 'XUẤT KÍCH ▶',                        en: 'LAUNCH ▶',                             ja: 'しゅつげき ▶',                      zh: '出击 ▶',                        ar: 'انطلق ▶' },
    'gavutru.help':             { vi: 'Đàn gà cưỡi đĩa bay đang xếp đội hình thả trứng xuống — kéo tay để máy bay né trứng, súng tự bắn giúp bé rồi! Nhặt ngôi sao để súng lên tới ba nòng. Hạ hết đàn gà thì gà chúa khổng lồ xuất hiện đấy!', en: 'Chickens on UFOs form up and drop eggs — drag your plane to dodge, it auto-fires! Grab stars to upgrade up to triple guns. Clear the flock and the giant chicken king appears!', ja: 'UFOにのったチキンがたいけいをくんでたまごをおとしてくる！ドラッグでよけよう、じどうではっしゃするよ。ほしで3れんそうまでパワーアップ。ぜんぶたおすときょだいチキンキングとうじょう！', zh: '骑UFO的鸡群列队扔鸡蛋——拖动飞机躲避，自动开火！捡星星最多升到3连炮。清完鸡群巨型鸡王就登场！', ar: 'الدجاج على الأطباق الطائرة يصطف ويرمي البيض — اسحب طائرتك للتفادي، تطلق تلقائيًا! اجمع النجوم للترقية حتى ثلاثة مدافع. أنهِ السرب ليظهر ملك الدجاج العملاق!' },
    'gavutru.upgrade':          { vi: 'Súng mạnh hơn rồi!',                 en: 'Guns upgraded!',                       ja: 'パワーアップ！',                    zh: '火力升级！',                    ar: 'ترقّت المدافع!' },
    'gavutru.boss':             { vi: 'Gà chúa xuất hiện!',                 en: 'The chicken king appears!',            ja: 'チキンキングとうじょう！',          zh: '鸡王出现了！',                  ar: 'ظهر ملك الدجاج!' },
    'gavutru.win':              { vi: 'Đuổi được đàn gà vũ trụ rồi!',       en: 'The space chickens are driven off!',   ja: 'うちゅうチキンをおいはらった！',    zh: '赶走太空鸡群了！',              ar: 'طردت دجاج الفضاء!' },
    'gavutru.lose':             { vi: 'Bị trứng rơi trúng hết tim rồi!',    en: 'Egged out of hearts!',                 ja: 'たまごにあたってハートがなくなった！', zh: '被鸡蛋砸得爱心用完了！',      ar: 'أصابك البيض ونفدت القلوب!' },
    'gavutru.next':             { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'taydua.title':             { vi: '🏎️ Tay Đua Nhí',                    en: '🏎️ Little Racer',                     ja: '🏎️ ちびレーサー',                  zh: '🏎️ 小小赛车手',                 ar: '🏎️ المتسابق الصغير' },
    'taydua.start':             { vi: 'Chạm vào làn nào là xe lách sang làn đó — né xe chậm, nhặt nitro, chạy tới vạch đích!', en: 'Tap a lane to swerve into it — dodge slow cars, grab nitro, race to the finish line!', ja: 'タップしたレーンにさっといどう！おそいくるまをよけて、ニトロをとって、ゴールへ！', zh: '点哪条车道就切到哪条——躲慢车、捡氮气、冲向终点线！', ar: 'انقر على مسار لتنعطف إليه — تفادَ السيارات البطيئة واجمع النيترو وسابق نحو خط النهاية!' },
    'taydua.play':              { vi: 'ĐUA THÔI ▶',                         en: 'RACE ▶',                               ja: 'レースかいし ▶',                    zh: '开赛 ▶',                        ar: 'سابق ▶' },
    'taydua.help':              { vi: 'Chạm vào làn nào là xe lách sang làn đó! Né xe chạy chậm phía trước, nhặt tia chớp xanh để tăng tốc vù vù. Chạy đủ quãng đường sẽ thấy vạch đích ca-rô — chạm vạch là thắng!', en: 'Tap any lane and your car swerves there! Dodge slower cars ahead, grab blue lightning for a speed boost. Drive far enough and the checkered finish line appears — cross it to win!', ja: 'タップしたレーンにいどう！まえのおそいくるまをよけて、あおいイナズマでスピードアップ。はしりつづけるとチェッカーのゴールライン、こえたらかち！', zh: '点哪条车道车就切过去！躲开前面的慢车，捡蓝色闪电加速。跑够路程就会出现格子终点线——冲过去就赢！', ar: 'انقر على أي مسار وستنعطف سيارتك! تفادَ السيارات الأبطأ، واجمع البرق الأزرق للتسارع. قُد بما يكفي ليظهر خط النهاية — اعبره لتفوز!' },
    'taydua.nitro':             { vi: 'Tăng tốc!',                          en: 'Boost!',                               ja: 'かそく！',                          zh: '加速！',                        ar: 'تسارع!' },
    'taydua.finish':            { vi: 'Vạch đích kia rồi!',                 en: 'There\'s the finish line!',            ja: 'ゴールがみえた！',                  zh: '终点线就在前面！',              ar: 'ها هو خط النهاية!' },
    'taydua.win':               { vi: 'Về đích rồi!',                       en: 'You crossed the finish line!',         ja: 'ゴールイン！',                      zh: '冲线啦！',                      ar: 'عبرت خط النهاية!' },
    'taydua.lose':              { vi: 'Xe móp hết rồi!',                    en: 'The car is all dented!',               ja: 'くるまがボコボコに！',              zh: '车撞瘪了！',                    ar: 'انبعجت السيارة!' },
    'taydua.next':              { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'vudieu.title':             { vi: '💃 Vũ Điệu Theo Nhịp',               en: '💃 Dance to the Beat',                 ja: '💃 リズムダンス',                   zh: '💃 节奏舞步',                    ar: '💃 ارقص مع الإيقاع' },
    'vudieu.start':             { vi: 'Bấm mũi tên theo đúng thứ tự, rồi chốt nhịp khi vòng tròn chạm viền!', en: 'Tap the arrows in order, then lock the beat when the circle touches the ring!', ja: 'やじるしをじゅんばんにおして、わがリングにふれたらビートをきめよう！', zh: '按顺序点箭头，圆圈碰到金环时锁定节拍！', ar: 'انقر الأسهم بالترتيب، ثم ثبّت الإيقاع عندما تلمس الدائرة الحلقة!' },
    'vudieu.play':              { vi: 'NHẢY THÔI ▶',                        en: 'DANCE ▶',                              ja: 'おどる ▶',                          zh: '起舞 ▶',                        ar: 'ارقص ▶' },
    'vudieu.help':              { vi: 'Nhìn dãy mũi tên trên sân khấu rồi bấm bốn nút bên dưới theo đúng thứ tự — xong dãy thì có vòng tròn co lại, chạm màn hình đúng lúc vòng chạm viền vàng để chốt nhịp! Càng đúng nhịp bạn nhảy càng đẹp!', en: 'Watch the arrow row on stage and press the four buttons in order — then a shrinking circle appears: tap right when it touches the golden ring! The better your timing, the cooler the dance!', ja: 'ステージのやじるしをみて、したの4つのボタンをじゅんばんにおそう。そのあとちぢむわがでてくるから、きんのリングにふれたしゅんかんにタップ！', zh: '看舞台上的箭头队列，按顺序按下面四个按钮——然后出现收缩圆圈，在碰到金环的瞬间点击锁定节拍！节奏越准舞姿越帅！', ar: 'انظر إلى صف الأسهم واضغط الأزرار الأربعة بالترتيب — ثم تظهر دائرة تتقلص: انقر عندما تلمس الحلقة الذهبية! كلما كان توقيتك أفضل، كان الرقص أروع!' },
    'vudieu.tapnow':            { vi: 'BẤM VÒNG TRÒN!',                     en: 'TAP THE CIRCLE!',                      ja: 'タップ！',                          zh: '点圆圈！',                      ar: 'انقر الدائرة!' },
    'vudieu.perfect':           { vi: 'TUYỆT VỜI!',                         en: 'PERFECT!',                             ja: 'パーフェクト！',                    zh: '完美！',                        ar: 'ممتاز!' },
    'vudieu.good':              { vi: 'TỐT LẮM!',                           en: 'GOOD!',                                ja: 'グッド！',                          zh: '很好！',                        ar: 'جيد!' },
    'vudieu.miss':              { vi: 'TRƯỢT RỒI!',                         en: 'MISS!',                                ja: 'ミス！',                            zh: '错过了！',                      ar: 'أخطأت!' },
    'vudieu.win':               { vi: 'Điệu nhảy hoàn hảo!',                en: 'A perfect dance!',                     ja: 'かんぺきなダンス！',                zh: '完美的舞蹈！',                  ar: 'رقصة مثالية!' },
    'vudieu.lose':              { vi: 'Hết tim mất rồi!',                   en: 'Out of hearts!',                       ja: 'ハートがなくなっちゃった！',        zh: '爱心用完了！',                  ar: 'نفدت القلوب!' },
    'vudieu.next':              { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'stylist.title':            { vi: '👗 Bé Làm Stylist',                  en: '👗 Little Stylist',                    ja: '👗 ちびスタイリスト',               zh: '👗 小小造型师',                  ar: '👗 المصمم الصغير' },
    'stylist.help':             { vi: 'Chọn ô quần áo bên phải rồi chạm món đồ để mặc cho bạn búp bê — máy sẽ đọc tên món đồ bằng tiếng Anh! Chạm chấm màu để đổi màu, chạm vào người búp bê để nghe tên bộ phận cơ thể. Bấm xúc xắc để trộn đồ, bấm máy ảnh để lưu bộ đồ đẹp!', en: 'Pick a wardrobe tab and tap an item to dress the doll — it reads the item name in English! Tap color dots to recolor, tap the doll to hear body part names. Dice mixes a random outfit, camera saves your look!', ja: 'みぎのタブからふくをえらんでタップすると、えいごでよみあげてくれるよ！いろのまるでいろがえ、にんぎょうにさわるとからだのなまえ。サイコロでランダム、カメラでほぞん！', zh: '选右边的衣柜标签，点衣服给娃娃穿上——会用英语读出名字！点色点换颜色，点娃娃身体听部位名称。骰子随机搭配，相机保存造型！', ar: 'اختر تبويب الخزانة وانقر قطعة لإلباس الدمية — يقرأ الاسم بالإنجليزية! انقر نقاط الألوان للتلوين، والمس الدمية لسماع أسماء أجزاء الجسم. النرد يخلط الملابس والكاميرا تحفظ الإطلالة!' },
    'stylist.saved':            { vi: 'Đã lưu bộ đồ!',                      en: 'Outfit saved!',                        ja: 'コーデをほぞんした！',              zh: '造型已保存！',                  ar: 'حُفظت الإطلالة!' },
    'phongxinh.title':          { vi: '🛏️ Phòng Xinh Của Bé',              en: '🛏️ My Cute Room',                     ja: '🛏️ わたしのおへや',                zh: '🛏️ 我的美丽房间',               ar: '🛏️ غرفتي الجميلة' },
    'phongxinh.help':           { vi: 'Chạm món đồ trên kệ để đặt vào phòng — máy đọc tên bằng tiếng Anh! Kéo món đồ tới chỗ bé thích, tranh với đồng hồ thì treo trên tường. Chọn món rồi bấm mũi tên để lật, thùng rác để cất đi. Đổi màu tường màu sàn, bấm máy ảnh lưu căn phòng xinh nhé!', en: 'Tap an item on the shelf to place it — its name is read in English! Drag items anywhere you like; pictures and clocks hang on the wall. Select an item then use the arrow to flip or the bin to put it away. Change wall and floor colors, and save your room with the camera!', ja: 'たなのアイテムをタップしておへやにおこう、えいごでよんでくれるよ！すきなばしょへドラッグ、えととけいはかべにかざる。えらんでからやじるしでフリップ、ゴミばこでかたづけ。かべとゆかのいろもかえられるよ！', zh: '点货架上的物品放进房间——会用英语读出名字！随意拖动摆放，画和钟挂墙上。选中后用箭头翻转、垃圾桶收起。换墙色地板色，用相机保存漂亮房间！', ar: 'انقر قطعة من الرف لوضعها — يُقرأ اسمها بالإنجليزية! اسحبها أينما تحب؛ الصور والساعات تُعلّق على الجدار. حدد قطعة ثم اقلبها بالسهم أو أزلها بالسلة. غيّر ألوان الجدار والأرضية واحفظ غرفتك بالكاميرا!' },
    'phongxinh.saved':          { vi: 'Đã lưu căn phòng!',                  en: 'Room saved!',                          ja: 'おへやをほぞんした！',              zh: '房间已保存！',                  ar: 'حُفظت الغرفة!' },
    'phongxinh.full':           { vi: 'Phòng chật quá rồi, cất bớt đồ nhé!', en: 'The room is full — put something away!', ja: 'おへやがいっぱい、すこしかたづけよう！', zh: '房间太挤啦，先收起一些吧！',  ar: 'الغرفة ممتلئة — أزل شيئًا أولًا!' },
    'phongxinh.room':           { vi: 'Phòng số',                           en: 'Room number',                          ja: 'おへや',                            zh: '房间',                          ar: 'الغرفة رقم' },
    'phaonuoc.title':           { vi: '💦 Pháo Nước Giữ Đảo',               en: '💦 Water Cannon Island',               ja: '💦 みずでっぽうのしま',             zh: '💦 水炮守岛',                    ar: '💦 جزيرة مدفع الماء' },
    'phaonuoc.start':           { vi: 'Chạm đâu pháo phun nước tới đó — đừng cho robot đồ chơi quậy lâu đài cát!', en: 'Tap anywhere to splash water there — don\'t let the toy robots wreck the sandcastle!', ja: 'タップしたところにみずをはっしゃ！おもちゃロボットにすなのおしろをこわさせないで！', zh: '点哪里水炮就喷哪里——别让玩具机器人拆沙堡！', ar: 'انقر في أي مكان لرش الماء — لا تدع الروبوتات تخرب قلعة الرمل!' },
    'phaonuoc.play':            { vi: 'GIỮ ĐẢO ▶',                          en: 'DEFEND ▶',                             ja: 'まもる ▶',                          zh: '守岛 ▶',                        ar: 'دافع ▶' },
    'phaonuoc.help':            { vi: 'Thuyền giấy và robot đồ chơi đang ập vào từ mọi phía đòi quậy lâu đài cát! Chạm vào đâu là pháo phun bóng nước tới đó — nước văng tung tóe ướt cả cụm luôn. Bắn tám phát là hết bình, nhớ bấm nút nạp nước. Giữ đảo qua hết các đợt sóng nhé!', en: 'Paper boats and toy robots rush in from every side to wreck the sandcastle! Tap anywhere and the cannon splashes water there — the splash soaks the whole bunch. Eight shots empty the tank, so press the refill button. Hold the island through every wave!', ja: 'かみのふねとおもちゃロボットがすなのおしろをねらってくる！タップしたところにみずボールがとんで、まわりまでびしょぬれ！8はつでタンクがからになるから、ほきゅうボタンをおしてね。ぜんぶのウェーブをまもりきろう！', zh: '纸船和玩具机器人从四面八方冲来要拆沙堡！点哪里水炮就喷哪里——水花溅湿一大片。八发打完水箱就空了，记得按加水按钮。守住小岛撑过所有波次！', ar: 'قوارب ورقية وروبوتات لعبة تندفع من كل جانب لتخريب قلعة الرمل! انقر في أي مكان ليرش المدفع الماء هناك — الرشاش يبلل المجموعة كلها. ثماني طلقات تفرغ الخزان فاضغط زر التعبئة. احمِ الجزيرة عبر كل الموجات!' },
    'phaonuoc.reload':          { vi: 'NẠP NƯỚC',                           en: 'REFILL',                               ja: 'みずほきゅう',                      zh: '加水',                          ar: 'تعبئة' },
    'phaonuoc.reloading':       { vi: 'ĐANG NẠP...',                        en: 'REFILLING...',                         ja: 'ほきゅうちゅう…',                   zh: '加水中……',                      ar: 'جارٍ التعبئة...' },
    'phaonuoc.empty':           { vi: 'Hết nước rồi, bấm nạp nước nhé!',    en: 'Out of water — press refill!',         ja: 'みずぎれ！ほきゅうボタンをおして！', zh: '没水了，按加水按钮！',          ar: 'نفد الماء — اضغط زر التعبئة!' },
    'phaonuoc.wave':            { vi: 'Đợt sóng mới!',                      en: 'New wave!',                            ja: 'つぎのウェーブ！',                  zh: '新的一波！',                    ar: 'موجة جديدة!' },
    'phaonuoc.win':             { vi: 'Giữ được đảo rồi, lâu đài cát an toàn!', en: 'Island defended — the sandcastle is safe!', ja: 'しまをまもった、すなのおしろはぶじ！', zh: '守住小岛了，沙堡安全！',      ar: 'دافعت عن الجزيرة — قلعة الرمل آمنة!' },
    'phaonuoc.lose':            { vi: 'Lâu đài cát bị quậy sập mất rồi!',   en: 'The sandcastle got wrecked!',          ja: 'すなのおしろがこわされちゃった！',  zh: '沙堡被拆掉了！',                ar: 'خُرّبت قلعة الرمل!' },
    'phaonuoc.next':            { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'vodai.title':              { vi: '🥊 Võ Đài Thú Nhí',                  en: '🥊 Plushie Ring',                      ja: '🥊 ぬいぐるみリング',               zh: '🥊 毛绒擂台',                    ar: '🥊 حلبة الدمى' },
    'vodai.pick':               { vi: 'Chọn bạn thú bông của bé!',          en: 'Pick your plushie!',                   ja: 'ぬいぐるみをえらんでね！',          zh: '选你的毛绒伙伴！',              ar: 'اختر دميتك!' },
    'vodai.hint':               { vi: 'Đòn CAO 🥊 thì ĐỠ 🛡 · đòn THẤP 🦵 thì NÉ 💨 · thấy SƠ HỞ ⭐ thì ĐẤM 🥊!', en: 'HIGH hit 🥊 → BLOCK 🛡 · LOW sweep 🦵 → DODGE 💨 · see an OPENING ⭐ → PUNCH 🥊!', ja: '上のパンチ🥊はガード🛡・下のわざ🦵はかわす💨・すき⭐があったらパンチ🥊！', zh: '高拳🥊就格挡🛡 · 低扫🦵就闪避💨 · 看到破绽⭐就出拳🥊！', ar: 'ضربة عالية 🥊 → صدّ 🛡 · ضربة منخفضة 🦵 → تفادَ 💨 · فرصة ⭐ → الكم 🥊!' },
    'vodai.round':              { vi: 'Hiệp',                               en: 'Round',                                ja: 'ラウンド',                          zh: '回合',                          ar: 'الجولة' },
    'vodai.hit':                { vi: 'Đấm trúng!',                         en: 'Punch landed!',                        ja: 'パンチヒット！',                    zh: '出拳命中！',                    ar: 'أصابت اللكمة!' },
    'vodai.block':              { vi: 'Đỡ được rồi!',                       en: 'Blocked!',                             ja: 'ガードせいこう！',                  zh: '挡住了！',                      ar: 'صددتها!' },
    'vodai.dodge':              { vi: 'Né đẹp quá!',                        en: 'Nice dodge!',                          ja: 'ナイスかわし！',                    zh: '躲得漂亮！',                    ar: 'مراوغة رائعة!' },
    'vodai.wrong':              { vi: 'Sai nút rồi, dính đòn!',             en: 'Wrong button — you got bopped!',      ja: 'ボタンまちがい、くらっちゃった！',  zh: '按错了，挨了一下！',            ar: 'زر خاطئ — أصابتك!' },
    'vodai.late':               { vi: 'Chậm mất rồi, dính đòn!',            en: 'Too slow — you got bopped!',           ja: 'おそかった、くらっちゃった！',      zh: '太慢了，挨了一下！',            ar: 'متأخر جدًا — أصابتك!' },
    'vodai.missopen':           { vi: 'Tuột mất cơ hội đấm!',               en: 'Missed the opening!',                  ja: 'チャンスをのがした！',              zh: '错过破绽了！',                  ar: 'فوّت الفرصة!' },
    'vodai.transform':          { vi: 'Biến hình!',                         en: 'Transform!',                           ja: 'へんしん！',                        zh: '变身！',                        ar: 'تحوّل!' },
    'vodai.nextfoe':            { vi: 'Thắng hiệp này rồi! Bạn thú kế lên đài!', en: 'Round won! The next plushie steps up!', ja: 'ラウンドしょうり！つぎのぬいぐるみとうじょう！', zh: '赢下本回合！下一位毛绒选手登场！', ar: 'فزت بالجولة! الدمية التالية تصعد!' },
    'vodai.win':                { vi: 'Vô địch võ đài thú bông!',           en: 'Plushie ring champion!',               ja: 'ぬいぐるみチャンピオン！',          zh: '毛绒擂台冠军！',                ar: 'بطل حلبة الدمى!' },
    'vodai.lose':               { vi: 'Thú bông mệt rồi, đấu lại nhé!',     en: 'Your plushie is tired — try again!',   ja: 'ぬいぐるみがつかれちゃった、もういちど！', zh: '毛绒伙伴累了，再来一次！',   ar: 'تعبت دميتك — حاول مجددًا!' },
    'vodai.next':               { vi: 'ĐẤU MÀN MỚI ▶',                      en: 'NEXT LEVEL ▶',                         ja: 'つぎのステージ ▶',                  zh: '挑战下一关 ▶',                  ar: 'المستوى التالي ▶' },
    'vodai.help.home':          { vi: 'Chọn một bạn thú bông để lên võ đài!', en: 'Pick a plushie to enter the ring!',  ja: 'ぬいぐるみをえらんでリングへ！',    zh: '选一只毛绒伙伴上擂台！',        ar: 'اختر دمية لدخول الحلبة!' },
    'vodai.help.battle':        { vi: 'Nhìn tín hiệu giữa đài: thấy găng tay là đòn cao phải bấm ĐỠ, thấy gió là vồ thấp phải bấm NÉ, thấy ngôi sao là địch sơ hở — ĐẤM ngay! Phản ứng đúng năm lần sẽ được biến hình to đùng!', en: 'Watch the signal in the ring: glove means a high hit — BLOCK; gust means a low sweep — DODGE; star means an opening — PUNCH! React right five times to transform huge!', ja: 'リングのしるしをみて：グローブはガード、かぜはかわす、ほしはパンチ！5かいせいこうでビッグへんしん！', zh: '看擂台中央信号：拳套=格挡，风=闪避，星星=出拳！答对五次就能变身巨大化！', ar: 'راقب الإشارة: القفاز يعني صدّ، والريح تعني تفادَ، والنجمة تعني الكم! خمس إجابات صحيحة وستتحول عملاقًا!' },
    'khunglong.title':          { vi: '🦕 Giải Cứu Khủng Long Con',         en: '🦕 Baby Dino Rescue',                  ja: '🦕 きょうりゅうのあかちゃんきゅうしゅつ', zh: '🦕 拯救恐龙宝宝',            ar: '🦕 إنقاذ صغار الديناصور' },
    'khunglong.start':          { vi: 'Chạm để nhảy qua đá và hố — bế các bé khủng long lạc về tổ với mẹ!', en: 'Tap to jump over rocks and pits — carry the lost baby dinos home to mama!', ja: 'タップでいわとあなをジャンプ！まいごのあかちゃんをママのもとへ！', zh: '点击跳过岩石和坑洞——把走丢的恐龙宝宝带回妈妈身边！', ar: 'انقر للقفز فوق الصخور والحفر — أعد صغار الديناصور الضائعة إلى أمها!' },
    'khunglong.play':           { vi: 'CHẠY THÔI ▶',                        en: 'RUN ▶',                                ja: 'はしる ▶',                          zh: '开跑 ▶',                        ar: 'اركض ▶' },
    'khunglong.help':           { vi: 'Bạn nhỏ tự chạy, bé chỉ cần chạm màn hình để NHẢY qua tảng đá và hố sâu! Chạy ngang bé khủng long đang kêu cứu là bế theo luôn — đưa các bé về tổ với mẹ khủng long ở cuối đường nhé!', en: 'Your runner runs by itself — just tap to JUMP over rocks and pits! Run past a crying baby dino to scoop it up — carry them all to mama\'s nest at the end!', ja: 'じどうではしるよ、タップでジャンプ！ないてるあかちゃんきょうりゅうのよこをとおるとだっこできる。ゴールのママのすまでとどけよう！', zh: '小朋友会自动奔跑，点击屏幕跳过岩石和深坑！跑过哭泣的恐龙宝宝就会抱起它——把它们都送到终点妈妈的巢里！', ar: 'عداؤك يركض تلقائيًا — انقر للقفز فوق الصخور والحفر! مر بجانب صغير ديناصور باكٍ لتحمله — أوصلهم جميعًا إلى عش الأم في النهاية!' },
    'khunglong.saved':          { vi: 'Cứu được một bé rồi!',               en: 'Rescued a baby!',                      ja: 'あかちゃんをたすけた！',            zh: '救到一只宝宝！',                ar: 'أنقذت صغيرًا!' },
    'khunglong.win':            { vi: 'Về tổ an toàn, mẹ khủng long vui quá!', en: 'Home safe — mama dino is overjoyed!', ja: 'ぶじにおうちへ、ママだいよろこび！', zh: '安全到家，恐龙妈妈太开心了！', ar: 'وصلنا بأمان — أم الديناصور سعيدة جدًا!' },
    'khunglong.lose':           { vi: 'Hết tim mất rồi!',                   en: 'Out of hearts!',                       ja: 'ハートがなくなっちゃった！',        zh: '爱心用完了！',                  ar: 'نفدت القلوب!' },
    'khunglong.next':           { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'vuonrau.surge':            { vi: 'Sóng cuối tới rồi, giữ vững vườn rau!', en: 'Final wave — hold the garden!',     ja: 'さいごのウェーブ、はたけをまもれ！', zh: '最后一波来了，守住菜园！',      ar: 'الموجة الأخيرة — اصمد في الحديقة!' },
    'consot.title':             { vi: '⛰️ Cơn Sốt Tìm Vàng',                en: '⛰️ Gold Rush Fever',                   ja: '⛰️ ゴールドラッシュ',               zh: '⛰️ 淘金热',                      ar: '⛰️ حمى الذهب' },
    'consot.start':             { vi: '60 giây đào cuồng nhiệt! Bấm hoặc KÉO qua đá cùng màu — gom nhanh cụm to để bùng CƠN SỐT VÀNG!', en: '60 seconds of frenzy! Tap or DRAG across same-color stones — clear big ones fast to spark GOLD FEVER!', ja: '60びょうのだいこうふん！タップかドラッグでおなじいろのいし、はやくあつめてゴールドフィーバー！', zh: '60秒疯狂挖矿！点击或划过同色石块——快速清大群引爆淘金热！', ar: 'ستون ثانية من الحماس! انقر أو اسحب عبر الأحجار المتشابهة — اجمع الكبيرة بسرعة لتشعل حمى الذهب!' },
    'consot.play':              { vi: 'ĐÀO THÔI ▶',                         en: 'DIG ▶',                                ja: 'ほる ▶',                            zh: '开挖 ▶',                        ar: 'احفر ▶' },
    'consot.help':              { vi: 'Sáu mươi giây đào cuồng nhiệt! Bấm vào 1 viên để gom cả cụm cùng màu, hoặc KÉO ngón tay lướt qua nhiều viên cùng màu liền kề để gom đúng đường đó — cụm càng to càng nhiều điểm, đá mới rơi xuống lấp đầy liên tục. Gom cụm to thật nhanh liên tiếp sẽ bùng CƠN SỐT VÀNG nhân đôi điểm! Đạt đủ điểm mục tiêu trước khi hết giờ nhé!', en: 'Sixty seconds of frenzy! Tap a stone to collect its whole cluster, or DRAG your finger across several touching same-color stones to collect exactly that path — bigger clusters score more, and new stones keep falling in. Chain big clusters quickly to spark GOLD FEVER for double points! Reach the target score before time runs out!', ja: '60びょうほりまくれ！1こタップでおなじいろのかたまりぜんぶ、ゆびをスライドさせるとなぞったぶんだけあつめる！おおきいほどこうとくてん、いしはどんどんふってくる。れんぞくであつめるとフィーバーで2ばい！じかんないにもくひょうたっせい！', zh: '疯狂六十秒！点一颗收集整群同色石块，或用手指划过几颗相邻同色石块只收集划过的那部分——群越大分越多，新石块不断落下。快速连清大群引爆淘金热双倍积分！限时达成目标分数！', ar: 'ستون ثانية من الجنون! انقر حجرًا لجمع مجموعته، أو اسحب إصبعك عبر عدة أحجار متشابهة متجاورة لتجمع بالضبط ذلك المسار — الأكبر يعطي أكثر، وأحجار جديدة تتساقط. سلسل المجموعات الكبيرة لتشعل حمى الذهب بنقاط مضاعفة! حقق الهدف قبل انتهاء الوقت!' },
    'consot.fever':             { vi: 'Cơn sốt vàng! Điểm nhân đôi!',       en: 'Gold fever! Double points!',           ja: 'ゴールドフィーバー！2ばい！',       zh: '淘金热！双倍积分！',            ar: 'حمى الذهب! نقاط مضاعفة!' },
    'consot.win':               { vi: 'Trúng đậm mùa vàng!',                en: 'Struck it rich!',                      ja: 'おおあたり！',                      zh: '挖到大金矿！',                  ar: 'أصبت ثروة!' },
    'consot.lose':              { vi: 'Hết giờ mất rồi!',                   en: 'Time\'s up!',                          ja: 'じかんぎれ！',                      zh: '时间到！',                      ar: 'انتهى الوقت!' },
    'consot.next':              { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'xaytt.title':              { vi: '🏘️ Xây Thị Trấn Vàng',              en: '🏘️ Gold Town Builder',                ja: '🏘️ ゴールドタウン',                zh: '🏘️ 黄金小镇',                   ar: '🏘️ بلدة الذهب' },
    'xaytt.town':               { vi: 'Thị trấn',                           en: 'Town',                                 ja: 'タウン',                            zh: '小镇',                          ar: 'البلدة' },
    'xaytt.level':              { vi: 'Cấp',                                en: 'Level',                                ja: 'レベル',                            zh: '等级',                          ar: 'مستوى' },
    'xaytt.earned':             { vi: 'Chở về được',                        en: 'Hauled home',                          ja: 'もちかえった',                      zh: '运回了',                        ar: 'جلبت' },
    'xaytt.gold':               { vi: 'vàng',                               en: 'gold',                                 ja: 'ゴールド',                          zh: '黄金',                          ar: 'ذهبًا' },
    'xaytt.complete':           { vi: 'Thị trấn hoàn thành rồi! Mở thị trấn mới to hơn!', en: 'Town complete! A bigger town awaits!', ja: 'タウンかんせい！つぎはもっとおおきなタウン！', zh: '小镇建成！更大的小镇等着你！', ar: 'اكتملت البلدة! بلدة أكبر بانتظارك!' },
    'xaytt.runhelp':            { vi: 'Kéo xe goòng qua lại hứng xu vàng, túi vàng và kim cương — né tảng đá kẻo văng mất vàng đang chở!', en: 'Drag the mine cart to catch coins, gold bags and gems — dodge rocks or you\'ll spill your gold!', ja: 'トロッコをうごかしてコインとゴールドとダイヤをキャッチ！いわにあたるとゴールドがこぼれちゃう！', zh: '拖动矿车接金币、金袋和宝石——躲开石头，不然运的金子会洒！', ar: 'اسحب العربة لالتقاط العملات وأكياس الذهب والجواهر — تفادَ الصخور وإلا انسكب ذهبك!' },
    'xaytt.help':               { vi: 'Bấm ĐI CHỞ VÀNG để lái xe goòng vào hầm mỏ hứng vàng rơi — né tảng đá nhé! Mang vàng về xây và nâng cấp sáu công trình. Xây đủ hết là mở thị trấn mới to hơn! Thị trấn của bé được lưu lại, mai chơi tiếp vẫn còn nguyên!', en: 'Press GO MINING to ride the cart and catch falling gold — dodge the rocks! Bring gold home to build and upgrade six buildings. Complete them all to unlock a bigger town! Your town is saved — come back tomorrow and it\'s still there!', ja: 'ゴールドあつめボタンでトロッコにのってきんかをキャッチ、いわはよけて！もちかえったゴールドで6つのたてものをたてよう。ぜんぶたてたらつぎのタウンへ！タウンはセーブされるよ！', zh: '按去运金开矿车接落下的黄金——躲开石头！带金子回来建造升级六座建筑。全部建成解锁更大的小镇！小镇会保存，明天接着玩还在！', ar: 'اضغط اذهب للتعدين لركوب العربة والتقاط الذهب — تفادَ الصخور! اجلب الذهب لبناء وترقية ستة مبانٍ. أكملها كلها لفتح بلدة أكبر! بلدتك محفوظة — عد غدًا وستجدها!' },
    'card.hubtienganh.title':   { vi: 'Góc Tiếng Anh',                      en: 'English Corner',                       ja: 'えいごコーナー',                    zh: '英语角',                        ar: 'ركن اللغة الإنجليزية' },
    'card.hubtienganh.desc':    { vi: 'Học từ vựng & câu tiếng Anh qua trò chơi: đánh vần, ghép câu, phát âm, thay đồ búp bê, trang trí phòng — giọng đọc en-US thật.', en: 'Learn English words & sentences through games: spelling, sentence building, pronunciation, dress-up, room decor — real en-US voice.', ja: 'えいごをゲームでまなぼう：スペリング、ぶんづくり、はつおん、きせかえ、へやのデコ。ほんもののえいごのこえ！', zh: '通过游戏学英语单词和句子：拼写、造句、发音、换装、房间装饰——真实美式发音。', ar: 'تعلّم الإنجليزية عبر الألعاب: التهجئة، بناء الجمل، النطق، تلبيس الدمى، تزيين الغرف — بصوت أمريكي حقيقي.' },
    'card.hubtienganh.chip':    { vi: '10 game tiếng Anh',                  en: '10 English games',                     ja: '10のえいごゲーム',                  zh: '10款英语游戏',                   ar: '10 ألعاب إنجليزية' },
    'xepchu.title':             { vi: '🔤 Xếp Chữ Tiếng Anh',               en: '🔤 English Spelling',                  ja: '🔤 えいごスペリング',               zh: '🔤 英语拼字',                    ar: '🔤 تهجئة الإنجليزية' },
    'xepchu.start':             { vi: 'Nghe từ tiếng Anh rồi chạm đúng thứ tự các chữ cái để ghép lại!', en: 'Listen to the English word, then tap the letters in order to spell it!', ja: 'えいごをきいて、じゅんばんにもじをタップしてつづろう！', zh: '听英语单词，然后按顺序点字母拼出来！', ar: 'استمع للكلمة الإنجليزية ثم انقر الحروف بالترتيب لتهجئتها!' },
    'xepchu.play':              { vi: 'XẾP CHỮ ▶',                          en: 'SPELL ▶',                              ja: 'つづる ▶',                          zh: '拼写 ▶',                        ar: 'تهجّ ▶' },
    'xepchu.help':               { vi: 'Nhìn hình rồi nghe từ tiếng Anh — sau đó chạm vào các ô chữ cái đúng theo thứ tự để ghép vào ô trống bên trên! Coi chừng có vài chữ cái GÂY NHIỄU không thuộc từ đó đâu nhé. Bấm nút loa để nghe lại từ bất cứ lúc nào!', en: 'Look at the picture and listen to the English word — then tap the letter tiles in order to fill the blanks above! Watch out, some DECOY letters don\'t belong to the word. Tap the speaker to hear it again anytime!', ja: 'えをみて、えいごをきこう。じゅんばんにもじをタップしてうえのマスをうめよう！ひっかけのもじもあるよ！スピーカーでいつでもきける！', zh: '看图听英语单词——然后按顺序点字母填满上面的空格！小心有些是干扰字母哦。随时点喇叭再听一次！', ar: 'انظر للصورة واستمع للكلمة — ثم انقر الحروف بالترتيب لملء الفراغات! احذر بعض الحروف خادعة. انقر مكبر الصوت للاستماع مجددًا!' },
    'xepchu.win':                { vi: 'Xếp giỏi quá, hết từ rồi!',          en: 'Great spelling, all words done!',      ja: 'じょうずにつづれた、ぜんぶおわり！',    zh: '拼得真棒，全部完成了！',        ar: 'تهجئة رائعة، انتهت كل الكلمات!' },
    'xepchu.next':               { vi: 'MÀN TIẾP ▶',                         en: 'NEXT LEVEL ▶',                         ja: 'つぎへ ▶',                          zh: '下一关 ▶',                      ar: 'المستوى التالي ▶' },
    'nghedoan.title':           { vi: '👂 Nghe & Đoán Tiếng Anh',           en: '👂 Listen & Guess English',            ja: '👂 きいてえいごをあてよう',          zh: '👂 听英语猜一猜',               ar: '👂 استمع وخمّن بالإنجليزية' },
    'nghedoan.start':           { vi: 'Nghe câu tiếng Anh rồi chạm đúng hình phù hợp trong 4 lựa chọn!', en: 'Listen to the English sentence, then tap the matching picture out of 4 choices!', ja: 'えいごのぶんをきいて、4つのえからただしいえをタップしよう！', zh: '听一句英语，然后在4张图里点出正确的那张！', ar: 'استمع للجملة الإنجليزية ثم انقر الصورة الصحيحة من بين 4 خيارات!' },
    'nghedoan.play':            { vi: 'NGHE & ĐOÁN ▶',                      en: 'LISTEN & GUESS ▶',                     ja: 'きいてあてる ▶',                    zh: '听音猜图 ▶',                    ar: 'استمع وخمّن ▶' },
    'nghedoan.help':            { vi: 'Máy sẽ đọc một câu tiếng Anh ngắn — bé nghe thật kỹ rồi chạm vào hình đúng trong 4 hình bên dưới nhé! Chọn đúng liên tiếp 3 lần sẽ được điểm thưởng đó. Có thể lọc theo chủ đề trái cây, món ăn, quán ăn, ngày lễ hoặc giải trí ở hàng nút trên cùng.', en: 'The device will read a short English sentence — listen carefully, then tap the right picture out of the 4 below! Get 3 correct in a row for a bonus. You can filter by fruit, food, dining, holidays or fun at the top.', ja: 'みじかいえいごのぶんがながれるよ。よくきいて、したの4つからただしいえをタップ！3かいれんぞくでせいかいするとボーナス！うえのボタンでテーマをえらべるよ。', zh: '设备会读一句简短的英语句子——认真听，然后在下面4张图里点出正确的那张！连续答对3次有奖励分。可以在顶部按主题筛选：水果、食物、餐饮、节日或娱乐。', ar: 'سيقرأ الجهاز جملة إنجليزية قصيرة — استمع جيدًا ثم انقر الصورة الصحيحة من بين 4 صور! أجب بشكل صحيح 3 مرات متتالية لتحصل على مكافأة. يمكنك التصفية حسب الفواكه أو الطعام أو المطاعم أو الأعياد أو الترفيه أعلى الشاشة.' },
    'nghedoan.win':             { vi: 'Giỏi quá, bé đoán đúng rất nhiều câu!', en: 'Great job, you guessed so many sentences right!', ja: 'すごい！たくさんせいかいしたね！',    zh: '真棒，猜对了好多句子！',        ar: 'أحسنت، خمّنت الكثير من الجمل بشكل صحيح!' },
    'nghedoan.tryagain':        { vi: 'Nghe kỹ hơn rồi thử lại nhé!',       en: 'Listen more carefully and try again!', ja: 'もういちど、よくきいてみよう！',      zh: '再仔细听一听，重新试试吧！',    ar: 'استمع بعناية أكبر وحاول مرة أخرى!' },
    'nghedoan.retry':           { vi: 'CHƠI LẠI ▶',                         en: 'TRY AGAIN ▶',                          ja: 'もういちど ▶',                     zh: '再试一次 ▶',                    ar: 'حاول مرة أخرى ▶' },
    'nghedoan.topic.all':       { vi: 'Tất cả',                             en: 'All',                                  ja: 'すべて',                           zh: '全部',                          ar: 'الكل' },
    'nghedoan2.title':          { vi: '🚗 Giao Thông & Địa Lý',             en: '🚗 Transport & Geography',              ja: '🚗 こうつう・ちり',                zh: '🚗 交通与地理',                  ar: '🚗 النقل والجغرافيا' },
    'nghedoan2.start':          { vi: 'Nghe từ hoặc câu tiếng Anh rồi chạm đúng hình phù hợp trong 4 lựa chọn!', en: 'Listen to the English word or sentence, then tap the matching picture out of 4 choices!', ja: 'えいごのたんごやぶんをきいて、4つのえからただしいえをタップ！', zh: '听英语单词或句子，然后在4张图里点出正确的那张！', ar: 'استمع للكلمة أو الجملة الإنجليزية ثم انقر الصورة الصحيحة من بين 4 خيارات!' },
    'nghedoan2.play':           { vi: 'NGHE & ĐOÁN ▶',                      en: 'LISTEN & GUESS ▶',                     ja: 'きいてあてる ▶',                    zh: '听音猜图 ▶',                    ar: 'استمع وخمّن ▶' },
    'nghedoan2.help':           { vi: 'Máy sẽ đọc một từ hoặc câu tiếng Anh ngắn về giao thông, môi trường hay địa lý — bé nghe thật kỹ rồi chạm vào hình đúng trong 4 hình bên dưới nhé! Chọn đúng liên tiếp 3 lần sẽ được điểm thưởng đó. Có thể lọc theo chủ đề ở hàng nút trên cùng.', en: 'The device will read a short English word or sentence about transport, environment or geography — listen carefully, then tap the right picture out of the 4 below! Get 3 correct in a row for a bonus. You can filter by topic at the top.', ja: 'こうつう・かんきょう・ちりのたんごやぶんがながれるよ。よくきいて、したの4つからただしいえをタップ！3かいれんぞくでボーナス！うえのボタンでテーマをえらべるよ。', zh: '设备会读一个关于交通、环境或地理的简短英语单词或句子——认真听，然后在下面4张图里点出正确的那张！连续答对3次有奖励分。可以在顶部按主题筛选。', ar: 'سيقرأ الجهاز كلمة أو جملة إنجليزية قصيرة عن النقل أو البيئة أو الجغرافيا — استمع جيدًا ثم انقر الصورة الصحيحة من بين 4! أجب صحيحًا 3 مرات متتالية لمكافأة. يمكنك التصفية حسب الموضوع أعلى الشاشة.' },
    'nghedoan2.win':            { vi: 'Giỏi quá, bé đoán đúng rất nhiều rồi!', en: 'Great job, you guessed so many right!', ja: 'すごい！たくさんせいかいしたね！',    zh: '真棒，猜对了好多！',            ar: 'أحسنت، خمّنت الكثير بشكل صحيح!' },
    'nghedoan3.title':          { vi: '🦁 Muôn Loài & Vũ Trụ',              en: '🦁 Animals & Space',                    ja: '🦁 どうぶつ・うちゅう',            zh: '🦁 动物与太空',                  ar: '🦁 الحيوانات والفضاء' },
    'nghedoan3.start':          { vi: 'Nghe từ hoặc câu tiếng Anh rồi chạm đúng hình phù hợp trong 4 lựa chọn!', en: 'Listen to the English word or sentence, then tap the matching picture out of 4 choices!', ja: 'えいごのたんごやぶんをきいて、4つのえからただしいえをタップ！', zh: '听英语单词或句子，然后在4张图里点出正确的那张！', ar: 'استمع للكلمة أو الجملة الإنجليزية ثم انقر الصورة الصحيحة من بين 4 خيارات!' },
    'nghedoan3.play':           { vi: 'NGHE & ĐOÁN ▶',                      en: 'LISTEN & GUESS ▶',                     ja: 'きいてあてる ▶',                    zh: '听音猜图 ▶',                    ar: 'استمع وخمّن ▶' },
    'nghedoan3.help':           { vi: 'Máy sẽ đọc một từ hoặc câu tiếng Anh ngắn về động vật, bầu trời, vũ trụ hay toán học — bé nghe thật kỹ rồi chạm vào hình đúng trong 4 hình bên dưới nhé! Chọn đúng liên tiếp 3 lần sẽ được điểm thưởng đó. Có thể lọc theo chủ đề ở hàng nút trên cùng.', en: 'The device will read a short English word or sentence about animals, sky, space or math — listen carefully, then tap the right picture out of the 4 below! Get 3 correct in a row for a bonus. You can filter by topic at the top.', ja: 'どうぶつ・そら・うちゅう・すうがくのたんごやぶんがながれるよ。よくきいて、したの4つからただしいえをタップ！3かいれんぞくでボーナス！うえのボタンでテーマをえらべるよ。', zh: '设备会读一个关于动物、天空、太空或数学的简短英语单词或句子——认真听，然后在下面4张图里点出正确的那张！连续答对3次有奖励分。可以在顶部按主题筛选。', ar: 'سيقرأ الجهاز كلمة أو جملة إنجليزية قصيرة عن الحيوانات أو السماء أو الفضاء أو الرياضيات — استمع جيدًا ثم انقر الصورة الصحيحة من بين 4! أجب صحيحًا 3 مرات متتالية لمكافأة. يمكنك التصفية حسب الموضوع أعلى الشاشة.' },
    'nghedoan4.title':          { vi: '👪 Gia Đình & Nghề Nghiệp',           en: '👪 Family & Jobs',                      ja: '👪 かぞく・しごと',                  zh: '👪 家庭与职业',                  ar: '👪 العائلة والمهن' },
    'nghedoan4.start':          { vi: 'Nghe từ hoặc câu tiếng Anh rồi chạm đúng hình phù hợp trong 4 lựa chọn!', en: 'Listen to the English word or sentence, then tap the matching picture out of 4 choices!', ja: 'えいごのたんごやぶんをきいて、4つのえからただしいえをタップ！', zh: '听英语单词或句子，然后在4张图里点出正确的那张！', ar: 'استمع للكلمة أو الجملة الإنجليزية ثم انقر الصورة الصحيحة من بين 4 خيارات!' },
    'nghedoan4.play':           { vi: 'NGHE & ĐOÁN ▶',                      en: 'LISTEN & GUESS ▶',                     ja: 'きいてあてる ▶',                    zh: '听音猜图 ▶',                    ar: 'استمع وخمّن ▶' },
    'nghedoan4.help':           { vi: 'Máy sẽ đọc một từ hoặc câu tiếng Anh ngắn về gia đình, trường học, nghề nghiệp hay thể thao — bé nghe thật kỹ rồi chạm vào hình đúng trong 4 hình bên dưới nhé! Chọn đúng liên tiếp 3 lần sẽ được điểm thưởng đó. Có thể lọc theo chủ đề ở hàng nút trên cùng.', en: 'The device will read a short English word or sentence about family, school, jobs or sports — listen carefully, then tap the right picture out of the 4 below! Get 3 correct in a row for a bonus. You can filter by topic at the top.', ja: 'かぞく・がっこう・しごと・スポーツのたんごやぶんがながれるよ。よくきいて、したの4つからただしいえをタップ！3かいれんぞくでボーナス！うえのボタンでテーマをえらべるよ。', zh: '设备会读一个关于家庭、学校、职业或运动的简短英语单词或句子——认真听，然后在下面4张图里点出正确的那张！连续答对3次有奖励分。可以在顶部按主题筛选。', ar: 'سيقرأ الجهاز كلمة أو جملة إنجليزية قصيرة عن العائلة أو المدرسة أو المهن أو الرياضة — استمع جيدًا ثم انقر الصورة الصحيحة من بين 4! أجب صحيحًا 3 مرات متتالية لمكافأة. يمكنك التصفية حسب الموضوع أعلى الشاشة.' },
    'card.hubxua.title':        { vi: 'Trò Chơi Xưa',                       en: 'Classic Folk Games',                   ja: 'むかしのあそび',                    zh: '怀旧民间游戏',                  ar: 'ألعاب شعبية قديمة' },
    'card.hubxua.desc':         { vi: '6 trò tuổi thơ trong 1 góc: oẳn tù tì – bắn bi – ném lon, bắt vịt, cờ cá ngựa, cờ gánh, ô ăn quan, nhảy lò cò số.', en: '6 childhood games in one corner: rock-paper-scissors, marbles, can toss, duck whack, ludo, ganh chess, o an quan, number hopscotch.', ja: 'じゃんけん・ビーだま・かんあて、あひるたたき、すごろく、ガィン、オーアンクアン、けんけんぱの6しゅるい。', zh: '一处玩6种童年游戏：猜拳、弹珠、扔罐子、打鸭子、飞行棋、扁担棋、播棋、跳房子。', ar: 'ست ألعاب طفولة في ركن واحد: حجر ورقة مقص، البلي، رمي العلب، البط، اللودو، شطرنج غان، أو آن كوان، الحجلة.' },
    'card.hubxua.chip':         { vi: '6 trò dân gian',                     en: '6 folk games',                         ja: '6つのあそび',                       zh: '6种民间游戏',                   ar: '6 ألعاب شعبية' },
    'card.hubdt.title':         { vi: 'Điện Tử Xưa',                        en: 'Retro Arcade',                         ja: 'レトロゲーム機',                    zh: '怀旧电玩',                      ar: 'ألعاب قديمة' },
    'card.hubdt.desc':          { vi: '6 game máy điện tử ngày bé: bắn vịt – đập gạch – đua xe, rắn săn mồi, xếp gạch, lật hình, ghép hình trượt, cờ ca-rô.', en: '6 retro arcade games: duck hunt, brick breaker, racer, snake, falling blocks, memory flip, sliding puzzle, tic-tac-toe.', ja: 'ダックハント、ブロックくずし、レース、ヘビ、おちものパズル、しんけいすいじゃく、スライドパズル、まるばつの6しゅるい。', zh: '6款怀旧电玩：打鸭子、打砖块、赛车、贪吃蛇、俄罗斯方块、翻牌记忆、滑块拼图、井字棋。', ar: 'ست ألعاب أركيد قديمة: صيد البط، كسر الطوب، السباق، الثعبان، المكعبات، الذاكرة، اللغز المنزلق، إكس-أو.' },
    'card.hubdt.chip':          { vi: 'Kiểu 9999-in-1',                     en: '9999-in-1 style',                      ja: '9999-in-1ふう',                     zh: '9999合1风格',                   ar: 'طراز 9999 في 1' },
    'card.hubhoc.title':        { vi: 'Học và Chơi',                        en: 'Learn & Play',                         ja: 'まなんであそぶ',                    zh: '边学边玩',                      ar: 'تعلّم والعب' },
    'card.hubhoc.desc':         { vi: 'Góc học tập: tô màu chữ & số, toán lớp 1, học vần tiếng Việt, tập viết chữ — máy đọc to như cô giáo.', en: 'Learning corner: color letters & numbers, grade-1 math, Vietnamese phonics, handwriting tracing — read aloud like a teacher.', ja: 'もじとすうじのぬりえ、1ねんせいさんすう、ベトナムごのおん、なぞりがき。せんせいみたいによみあげるよ。', zh: '学习角：字母数字涂色、一年级数学、越南语拼音、写字描红——像老师一样朗读。', ar: 'ركن التعلم: تلوين الحروف والأرقام، رياضيات الصف الأول، أصوات الفيتنامية، تتبع الكتابة — يقرأ بصوت عالٍ كالمعلم.' },

    /* ============================================================
       ĐIỆN TỬ XƯA
       ============================================================ */
    'card.dientu.title':        { vi: 'Điện Tử Xưa',                        en: 'Retro Arcade',                         ja: 'レトロゲーム機',                    zh: '怀旧电玩',                      ar: 'ألعاب قديمة' },
    'card.dientu.desc':         { vi: '3 game máy điện tử ngày bé: bắn vịt trời (chế độ học số chẵn), đập gạch nhặt chữ cái, đua xe lao vào cổng đáp án toán.', en: '3 retro arcade games: duck hunt (even-number mode), brick breaker with falling letters, lane racer with math answer gates.', ja: 'ダックハント、ブロック崩し、レーンレーサーの3本。学習モード付き。', zh: '打鸭子（偶数模式）、打砖块捡字母、赛车冲对答案门。', ar: 'صيد البط، كسر الطوب، سباق مع بوابات الإجابات.' },
    'dientu.title':             { vi: '🕹️ Điện Tử Xưa',                    en: '🕹️ Retro Arcade',                     ja: '🕹️ レトロゲーム',                  zh: '🕹️ 怀旧电玩',                  ar: '🕹️ ألعاب قديمة' },
    'dientu.ducks':             { vi: 'Bắn vịt trời',                       en: 'Duck hunt',                            ja: 'ダックハント',                      zh: '打鸭子',                        ar: 'صيد البط' },
    'dientu.bricks':            { vi: 'Đập gạch bóng nảy',                  en: 'Brick breaker',                        ja: 'ブロック崩し',                      zh: '打砖块',                        ar: 'كسر الطوب' },
    'dientu.racer':             { vi: 'Đua xe né chướng ngại',              en: 'Lane racer',                           ja: 'レーンレーサー',                    zh: '赛车避障',                      ar: 'سباق المسارات' },
    'dientu.ducks.all':         { vi: '🦆 Bắn hết',                         en: '🦆 Shoot all',                         ja: '🦆 ぜんぶ撃つ',                     zh: '🦆 全都打',                     ar: '🦆 اضرب الكل' },
    'dientu.ducks.even':        { vi: '🔢 Chỉ số CHẴN',                     en: '🔢 EVEN numbers only',                 ja: '🔢 偶数だけ',                       zh: '🔢 只打偶数',                   ar: '🔢 الأرقام الزوجية فقط' },
    'dientu.ducks.hit':         { vi: 'Bắn trúng',                          en: 'Hit',                                  ja: '命中',                              zh: '击中',                          ar: 'أصبت' },
    'dientu.bricks.caught':     { vi: 'Nhặt chữ',                           en: 'Letters caught',                       ja: '拾った文字',                        zh: '捡到字母',                      ar: 'حروف ملتقطة' },
    'dientu.bricks.win':        { vi: 'Phá hết gạch!',                      en: 'All bricks cleared!',                  ja: '全ブロック破壊！',                  zh: '砖块全清！',                    ar: 'كسرت كل الطوب!' },
    'dientu.racer.classic':     { vi: '🚕 Né chướng ngại',                  en: '🚕 Dodge obstacles',                   ja: '🚕 障害物よけ',                     zh: '🚕 避开障碍',                   ar: '🚕 تفادى العوائق' },
    'dientu.racer.math':        { vi: '➕ Cổng đáp án',                     en: '➕ Answer gates',                      ja: '➕ 答えのゲート',                   zh: '➕ 答案门',                     ar: '➕ بوابات الإجابة' },

    /* ============================================================
       KỸ NĂNG SỐNG & CẢM XÚC
       ============================================================ */
    'card.kynang.title':        { vi: 'Kỹ Năng Sống & Cảm Xúc',             en: 'Life Skills & Emotions',               ja: 'せいかつとこころ',                  zh: '生活技能与情绪',                ar: 'مهارات الحياة والمشاعر' },
    'card.kynang.desc':         { vi: '3 trò trong 1: nhận diện cảm xúc, sắp thứ tự thói quen sinh hoạt (đánh răng, mặc đồ...), đúng-sai an toàn giao thông & ở nhà.', en: '3 games in 1: recognize emotions, sequence daily routines (brushing teeth, getting dressed...), true/false traffic & home safety.', ja: '感情あて、生活習慣の順番並べ、交通・おうちの安全クイズの3つ。', zh: '三合一：识别情绪、排列日常习惯顺序、交通与居家安全判断。', ar: 'ثلاث ألعاب: تعرّف على المشاعر، رتّب الروتين اليومي، صواب وخطأ في السلامة.' },
    'card.kynang.chip':         { vi: 'Kỹ năng sống',                       en: 'Life skills',                          ja: '生活スキル',                        zh: '生活技能',                      ar: 'مهارات حياتية' },
    'kynang.title':             { vi: '💛 Kỹ Năng Sống',                    en: '💛 Life Skills',                       ja: '💛 せいかつスキル',                 zh: '💛 生活技能',                   ar: '💛 مهارات الحياة' },
    'kynang.tab.camxuc':        { vi: '😊 Cảm xúc',                         en: '😊 Emotions',                          ja: '😊 かんじょう',                     zh: '😊 情绪',                       ar: '😊 المشاعر' },
    'kynang.tab.tulap':         { vi: '🪥 Tự lập',                          en: '🪥 Routines',                          ja: '🪥 せいかつしゅうかん',             zh: '🪥 自理',                       ar: '🪥 الاستقلالية' },
    'kynang.tab.antoan':        { vi: '🚦 An toàn',                         en: '🚦 Safety',                            ja: '🚦 あんぜん',                       zh: '🚦 安全',                       ar: '🚦 السلامة' },
    'kynang.q.s2e':             { vi: 'Bé cảm thấy thế nào?',               en: 'How do you feel?',                     ja: 'どんな気持ちかな？',                zh: '你会有什么感受？',              ar: 'كيف تشعر؟' },
    'kynang.q.e2s':             { vi: 'Cảm xúc này hợp với tình huống nào?', en: 'Which situation fits this feeling?',  ja: 'この気持ちに合うのは？',            zh: '这种情绪对应哪种情况？',        ar: 'أي موقف يناسب هذا الشعور؟' },
    'kynang.q.order':           { vi: 'Sắp đúng thứ tự nhé!',               en: 'Put the steps in order!',              ja: 'じゅんばんに並べよう！',            zh: '按顺序排好！',                  ar: 'رتّب الخطوات!' },
    'kynang.q.safety':          { vi: 'Việc này AN TOÀN hay NGUY HIỂM?',    en: 'Is this SAFE or DANGEROUS?',           ja: 'これは あんぜん？あぶない？',       zh: '这是安全还是危险？',            ar: 'هل هذا آمن أم خطير؟' },
    'kynang.q.choices':         { vi: 'Chọn',                               en: 'Choose',                                ja: 'えらんでね',                        zh: '请选择',                        ar: 'اختر' },
    'kynang.safe':              { vi: 'An toàn',                            en: 'Safe',                                 ja: 'あんぜん',                          zh: '安全',                          ar: 'آمن' },
    'kynang.danger':            { vi: 'Nguy hiểm',                          en: 'Dangerous',                            ja: 'あぶない',                          zh: '危险',                          ar: 'خطير' },

    /* ============================================================
       KHOA HỌC KHÁM PHÁ VUI
       ============================================================ */
    'card.khoahoc.title':       { vi: 'Khoa Học Khám Phá Vui',              en: 'Fun Science Discovery',                ja: 'たのしいかがく',                    zh: '趣味科学探索',                  ar: 'اكتشاف العلوم الممتع' },
    'card.khoahoc.desc':        { vi: '3 trò trong 1: vòng đời con vật/cây & 4 mùa, pha màu diệu kỳ, đoán chìm hay nổi trong bể nước.', en: '3 games in 1: animal/plant life cycles & the 4 seasons, magic color mixing, guess sink or float in a water tank.', ja: '生き物・植物の一生と四季、色まぜ実験、水そうで浮く沈むクイズの3つ。', zh: '三合一：动植物生命周期与四季、魔法调色、水箱沉浮猜猜看。', ar: 'ثلاث ألعاب: دورة حياة الكائنات والفصول، مزج الألوان، الطفو والغرق.' },
    'card.khoahoc.chip':        { vi: 'Khoa học vui',                       en: 'Fun science',                          ja: 'たのしい科学',                      zh: '趣味科学',                      ar: 'علوم ممتعة' },
    'khoahoc.title':            { vi: '🔬 Khoa Học Vui',                    en: '🔬 Fun Science',                       ja: '🔬 たのしいかがく',                 zh: '🔬 趣味科学',                   ar: '🔬 علوم ممتعة' },
    'khoahoc.tab.vongdoi':      { vi: '🐸 Vòng đời & Mùa',                  en: '🐸 Life Cycles & Seasons',             ja: '🐸 一生と四季',                     zh: '🐸 生命周期与四季',             ar: '🐸 دورة الحياة والفصول' },
    'khoahoc.tab.phamau':       { vi: '🎨 Pha màu',                         en: '🎨 Mix colors',                        ja: '🎨 いろまぜ',                       zh: '🎨 调色',                       ar: '🎨 مزج الألوان' },
    'khoahoc.tab.chimnoi':      { vi: '🪨 Chìm nổi',                        en: '🪨 Sink or float',                     ja: '🪨 うくしずむ',                     zh: '🪨 沉浮',                       ar: '🪨 طفو أم غرق' },
    'khoahoc.q.i2s':            { vi: 'Hoạt động này hợp với mùa nào?',     en: 'Which season fits this activity?',     ja: 'この活動はどの季節かな？',          zh: '这个活动适合哪个季节？',        ar: 'أي فصل يناسب هذا النشاط؟' },
    'khoahoc.q.s2i':            { vi: 'Mùa này thường có hoạt động gì?',    en: 'What happens in this season?',         ja: 'この季節は何がある？',              zh: '这个季节通常有什么活动？',      ar: 'ماذا يحدث في هذا الفصل؟' },
    'khoahoc.q.predict':        { vi: 'Trộn 2 màu này ra màu gì?',          en: 'What color do these 2 make?',          ja: '2つの色をまぜると何色？',           zh: '这两种颜色混合会变成什么颜色？',ar: 'ما اللون الناتج من مزج هذين؟' },
    'khoahoc.q.reverse':        { vi: 'Màu này được pha từ 2 màu nào?',     en: 'Which 2 colors make this one?',        ja: 'この色は何色と何色？',              zh: '这个颜色是哪两种颜色调成的？',  ar: 'من أي لونين تكوّن هذا اللون؟' },
    'khoahoc.q.float':          { vi: 'Vật này sẽ CHÌM hay NỔI?',           en: 'Will this SINK or FLOAT?',             ja: 'これは うく？しずむ？',              zh: '这个东西会沉还是浮？',          ar: 'هل سيغرق هذا أم يطفو؟' },
    'khoahoc.floats':           { vi: 'Nổi',                                en: 'Float',                                ja: 'うく',                              zh: '浮',                            ar: 'يطفو' },
    'khoahoc.sinks':            { vi: 'Chìm',                               en: 'Sink',                                 ja: 'しずむ',                            zh: '沉',                            ar: 'يغرق' },

    /* ============================================================
       TIẾNG ANH NÂNG CAO
       ============================================================ */
    'card.tienganh.title':      { vi: 'Tiếng Anh Nâng Cao',                 en: 'Advanced English',                     ja: 'すすんだえいご',                    zh: '进阶英语',                      ar: 'الإنجليزية المتقدمة' },
    'card.tienganh.desc':       { vi: '2 trò trong 1: ghép câu tiếng Anh đơn giản (I like cats), luyện phát âm 26 từ — bé bấm ghi âm giọng mình để tự nghe so sánh.', en: '2 games in 1: build simple English sentences (I like cats), practice pronouncing 26 words — record your voice and compare.', ja: 'かんたんな英文づくり、26単語の発音練習（録音して聞き比べ）の2つ。', zh: '二合一：拼简单英语句子、26个单词发音练习（可录音对比）。', ar: 'لعبتان: بناء جمل إنجليزية بسيطة، وتدريب النطق مع تسجيل الصوت.' },
    'card.tienganh.chip':       { vi: 'Tiếng Anh',                          en: 'English',                              ja: '英語',                              zh: '英语',                          ar: 'إنجليزي' },
    'tienganh.title':           { vi: '🇬🇧 Tiếng Anh',                      en: '🇬🇧 English',                          ja: '🇬🇧 えいご',                        zh: '🇬🇧 英语',                      ar: '🇬🇧 الإنجليزية' },
    'tienganh.tab.cau':         { vi: '📝 Ghép câu',                        en: '📝 Build sentences',                   ja: '📝 文づくり',                       zh: '📝 拼句子',                     ar: '📝 كوّن جملة' },
    'tienganh.tab.phatam':      { vi: '🗣️ Phát âm',                         en: '🗣️ Pronunciation',                     ja: '🗣️ はつおん',                       zh: '🗣️ 发音',                       ar: '🗣️ النطق' },
    'tienganh.q.build':         { vi: 'Ghép câu cho đúng nhé!',             en: 'Build the sentence!',                  ja: '文をつくろう！',                    zh: '拼出正确的句子！',              ar: 'كوّن الجملة الصحيحة!' },
    'tienganh.q.listen':        { vi: 'Nghe và bắt chước nói theo nhé!',    en: 'Listen and repeat!',                   ja: 'きいてまねしよう！',                zh: '听并跟着说！',                  ar: 'استمع وكرر!' },
    'tienganh.mic.unsupported': { vi: '🎙️ Máy không hỗ trợ ghi âm — bấm 🔊 nghe mẫu và tập nói theo nhé!', en: "🎙️ Recording isn't supported — tap 🔊 to hear the word and repeat it!", ja: '🎙️ 録音できません — 🔊で発音を聞いてまねしよう！', zh: '🎙️ 不支持录音 — 点🔊听发音跟读吧！', ar: '🎙️ التسجيل غير مدعوم — اضغط 🔊 واستمع وكرر!' },
    'tienganh.mic.denied':      { vi: '🎙️ Không dùng được micro — bấm 🔊 nghe mẫu và tập nói theo nhé!', en: "🎙️ Microphone unavailable — tap 🔊 to hear the word and repeat it!", ja: '🎙️ マイクが使えません — 🔊で発音を聞いてまねしよう！', zh: '🎙️ 无法使用麦克风 — 点🔊听发音跟读吧！', ar: '🎙️ الميكروفون غير متاح — اضغط 🔊 واستمع وكرر!' },
    'tienganh.done':            { vi: 'XONG ✅',                            en: 'DONE ✅',                               ja: 'おわり ✅',                         zh: '完成 ✅',                        ar: 'تم ✅' },
    'tienganh.practiced':       { vi: 'Bé đã luyện nói',                    en: 'You practiced',                        ja: 'れんしゅうしたよ：',                zh: '你练习了',                      ar: 'لقد تدربت على' },
    'tienganh.words':           { vi: 'từ tiếng Anh',                       en: 'English words',                        ja: 'たんご',                            zh: '个英语单词',                    ar: 'كلمة إنجليزية' },

    /* ============================================================
       VĂN HÓA & ĐỊA LÝ VIỆT NAM
       ============================================================ */
    'card.vanhoa.title':        { vi: 'Văn Hóa & Địa Lý Việt Nam',          en: 'Vietnamese Culture & Geography',       ja: 'ベトナムの文化と地理',              zh: '越南文化与地理',                ar: 'ثقافة وجغرافيا فيتنام' },
    'card.vanhoa.desc':         { vi: '4 trò trong 1: bản đồ 3 miền, món ăn ba miền, trang trí cây Tết tự do, lật thẻ tìm cặp đèn lồng Trung Thu.', en: '4 games in 1: map of the 3 regions, regional foods, free Lunar New Year tree decorating, Mid-Autumn lantern memory match.', ja: '3地域の地図、郷土料理、テト飾りつけ、中秋提灯の神経衰弱の4つ。', zh: '四合一：三大区域地图、地方美食、自由装饰年树、中秋灯笼记忆配对。', ar: 'أربع ألعاب: خريطة المناطق، أطعمة إقليمية، تزيين شجرة التت، وذاكرة الفوانيس.' },
    'vanhoa.title':              { vi: '🇻🇳 Văn Hóa Việt',                  en: '🇻🇳 Vietnamese Culture',               ja: '🇻🇳 ベトナム文化',                  zh: '🇻🇳 越南文化',                  ar: '🇻🇳 الثقافة الفيتنامية' },
    'vanhoa.tab.bando':          { vi: '🗺️ Bản đồ',                         en: '🗺️ Map',                              ja: '🗺️ ちず',                          zh: '🗺️ 地图',                       ar: '🗺️ الخريطة' },
    'vanhoa.tab.monan':          { vi: '🍜 Món ăn',                          en: '🍜 Food',                              ja: '🍜 りょうり',                       zh: '🍜 美食',                       ar: '🍜 الطعام' },
    'vanhoa.tab.tet':            { vi: '🧧 Trang trí Tết',                   en: '🧧 Decorate Tet',                      ja: '🧧 テトの飾り',                     zh: '🧧 装饰年树',                   ar: '🧧 زيّن التت' },
    'vanhoa.tab.denlong':        { vi: '🏮 Đèn lồng',                        en: '🏮 Lanterns',                          ja: '🏮 ちょうちん',                     zh: '🏮 灯笼',                       ar: '🏮 الفوانيس' },
    'vanhoa.q.whichregion':      { vi: 'ở miền nào?',                        en: 'in which region?',                     ja: 'どの地域？',                        zh: '在哪个地区？',                  ar: 'في أي منطقة؟' },
    'vanhoa.q.findregion':       { vi: 'Chạm vào',                           en: 'Tap',                                  ja: 'タップして',                        zh: '点击',                          ar: 'المس' },
    'vanhoa.q.match':            { vi: 'Ghép đúng tên món ăn nhé!',          en: 'Match the food names!',                ja: '料理の名前を合わせよう！',          zh: '把食物名字配对吧！',            ar: 'طابق أسماء الأطعمة!' },
    'vanhoa.q.foodregion':       { vi: 'Món này thuộc miền nào?',            en: 'Which region is this food from?',      ja: 'この料理はどの地域？',              zh: '这道菜属于哪个地区？',          ar: 'من أي منطقة هذا الطعام؟' },
    'vanhoa.tet.title':          { vi: '🎨 Trang trí cây mai/đào — chơi tự do nhé!', en: '🎨 Decorate the blossom tree — free play!', ja: '🎨 花の木を自由にかざろう！', zh: '🎨 自由装饰年树吧！', ar: '🎨 زيّن شجرة الأزهار بحرية!' },
    'vanhoa.tet.note':           { vi: 'Chạm hình để trang trí — chạm lại vào hình đã dán để bỏ đi nhé!', en: 'Tap a sticker to decorate — tap a placed one again to remove it!', ja: 'タップして飾ろう、もう一度タップで消せるよ！', zh: '点贴纸装饰 — 再点一次已贴的可以移除！', ar: 'المس ملصقًا للتزيين — المسه مجددًا لإزالته!' },
    'vanhoa.tet.clear':          { vi: '🧹 Xóa hết',                         en: '🧹 Clear all',                         ja: '🧹 ぜんぶ消す',                     zh: '🧹 清空',                       ar: '🧹 امسح الكل' },
    'vanhoa.lantern.title':      { vi: '🏮 Lật tìm cặp lồng đèn Trung Thu!', en: '🏮 Flip to match Mid-Autumn lanterns!', ja: '🏮 中秋の提灯をめくって探そう！',   zh: '🏮 翻牌配对中秋灯笼！',         ar: '🏮 اقلب لتطابق فوانيس منتصف الخريف!' },
    'pika.menu.classic':        { vi: 'CỔ ĐIỂN ▶',                          en: 'CLASSIC ▶',                            ja: 'クラシック ▶',                      zh: '经典 ▶',                        ar: '▶ كلاسيكي' },
    'pika.menu.zen':            { vi: 'ZEN',                                en: 'ZEN',                                  ja: '禅モード',                          zh: '禅模式',                        ar: 'وضع الاسترخاء' },
    'pika.menu.daily':          { vi: 'DAILY',                              en: 'DAILY',                                ja: 'デイリー',                          zh: '每日挑战',                      ar: 'التحدي اليومي' },
    'pika.menu.duel':           { vi: '2 NGƯỜI',                            en: '2 PLAYERS',                            ja: '2人対戦',                           zh: '双人对战',                      ar: 'لاعبان' },
    'pika.menu.icons':          { vi: 'Bộ hình',                            en: 'Tile set',                             ja: '絵柄',                              zh: '图案',                          ar: 'مجموعة الصور' },
    'pika.menu.size':           { vi: 'Cỡ bàn',                             en: 'Board size',                           ja: '盤面サイズ',                        zh: '棋盘大小',                      ar: 'حجم اللوحة' },
    'pika.icons.animals':       { vi: '🐰 Động vật',                        en: '🐰 Animals',                           ja: '🐰 動物',                           zh: '🐰 动物',                       ar: '🐰 حيوانات' },
    'pika.icons.fruits':        { vi: '🍎 Trái cây',                        en: '🍎 Fruits',                            ja: '🍎 果物',                           zh: '🍎 水果',                       ar: '🍎 فواكه' },
    'pika.icons.faces':         { vi: '😀 Mặt cười',                        en: '😀 Smileys',                           ja: '😀 顔文字',                         zh: '😀 表情',                       ar: '😀 وجوه' },
    'pika.icons.pokemon':       { vi: '⚡ Pokémon',                          en: '⚡ Pokémon',                            ja: '⚡ ポケモン',                        zh: '⚡ 宝可梦',                      ar: '⚡ بوكيمون' },
    'pika.icons.mix':           { vi: '🐰⚡ Trộn',                           en: '🐰⚡ Mix',                              ja: '🐰⚡ ミックス',                      zh: '🐰⚡ 混合',                      ar: '🐰⚡ مزيج' },
    'pika.size.small':          { vi: 'Nhỏ 10×6',                           en: 'Small 10×6',                           ja: '小 10×6',                           zh: '小 10×6',                       ar: 'صغير 10×6' },
    'pika.size.medium':         { vi: 'Vừa 14×8',                           en: 'Medium 14×8',                          ja: '中 14×8',                           zh: '中 14×8',                       ar: 'متوسط 14×8' },
    'pika.size.large':          { vi: 'Lớn 16×9',                           en: 'Large 16×9',                           ja: '大 16×9',                           zh: '大 16×9',                       ar: 'كبير 16×9' },
    'pika.ach.title':           { vi: 'Thành tích',                         en: 'Achievements',                         ja: '実績',                              zh: '成就',                          ar: 'الإنجازات' },
    'pika.ach.unlocked':        { vi: 'Thành tích',                         en: 'Achievement',                          ja: '実績解除',                          zh: '成就达成',                      ar: 'إنجاز' },
    'pika.ach.first_clear':     { vi: 'Qua level đầu tiên',                 en: 'Clear your first level',               ja: '初レベルクリア',                    zh: '通过第一关',                    ar: 'اجتز أول مستوى' },
    'pika.ach.combo5':          { vi: 'Đạt combo x5',                       en: 'Reach a x5 combo',                     ja: 'コンボx5達成',                      zh: '达成 5 连击',                   ar: 'حقق سلسلة ×5' },
    'pika.ach.fast_clear':      { vi: 'Qua level khi còn hơn nửa thời gian', en: 'Clear a level with over half the time left', ja: '残り時間半分以上でクリア',    zh: '剩余时间过半时过关',            ar: 'اجتز مستوى وقد بقي أكثر من نصف الوقت' },
    'pika.ach.no_hint_level':   { vi: 'Qua level không dùng gợi ý',         en: 'Clear a level without hints',          ja: 'ヒントなしでクリア',                zh: '不用提示过关',                  ar: 'اجتز مستوى دون تلميحات' },
    'pika.ach.champion':        { vi: 'Hoàn thành cả 7 level Cổ điển',      en: 'Complete all 7 Classic levels',        ja: 'クラシック全7レベル制覇',           zh: '通关经典模式全部 7 关',         ar: 'أكمل مستويات الكلاسيكي السبعة' },
    'pika.ach.zen_master':      { vi: 'Hoàn thành cả 7 level Zen',          en: 'Complete all 7 Zen levels',            ja: '禅モード全7レベル制覇',             zh: '通关禅模式全部 7 关',           ar: 'أكمل مستويات الاسترخاء السبعة' },
    'pika.ach.daily_done':      { vi: 'Hoàn thành 1 bàn Daily',             en: 'Complete a Daily board',               ja: 'デイリーをクリア',                  zh: '完成每日挑战',                  ar: 'أكمل لوحة التحدي اليومي' },
    'pika.ach.duel_win':        { vi: 'Thắng 1 ván 2 Người',                en: 'Win a 2-player match',                 ja: '2人対戦で勝利',                     zh: '赢得双人对战',                  ar: 'افز بمباراة لاعبين' },
    'pika.end.daily':           { vi: 'Hoàn thành Daily!',                  en: 'Daily complete!',                      ja: 'デイリークリア！',                  zh: '每日挑战完成！',                ar: 'اكتمل التحدي اليومي!' },
    'pika.daily.best':          { vi: 'Kỷ lục hôm nay',                     en: "Today's best",                         ja: '本日のベスト',                      zh: '今日最佳',                      ar: 'أفضل نتيجة اليوم' },
    'pika.duel.timeout':        { vi: 'Hết lượt — đổi người! ⏱',            en: 'Turn over — switch player! ⏱',         ja: '時間切れ — 交代！⏱',               zh: '回合结束 — 换人！⏱',            ar: 'انتهى الدور — بدّل اللاعب! ⏱' },
    'pika.duel.draw':           { vi: 'Hòa!',                               en: 'Draw!',                                ja: '引き分け！',                        zh: '平局！',                        ar: 'تعادل!' },
    'pika.duel.winner':         { vi: 'thắng!',                             en: 'wins!',                                ja: 'の勝ち！',                          zh: '获胜！',                        ar: 'يفوز!' },
    'pika.btn.menu':            { vi: 'MENU',                               en: 'MENU',                                 ja: 'メニュー',                          zh: '菜单',                          ar: 'القائمة' },
    'pika.menu.theme':          { vi: 'Giao diện',                          en: 'Theme',                                ja: 'テーマ',                            zh: '主题',                          ar: 'السمة' },
    'pika.theme.dark':          { vi: '🌙 Tối',                             en: '🌙 Dark',                              ja: '🌙 ダーク',                         zh: '🌙 深色',                       ar: '🌙 داكن' },
    'pika.theme.light':         { vi: '☀️ Sáng',                            en: '☀️ Light',                             ja: '☀️ ライト',                         zh: '☀️ 浅色',                       ar: '☀️ فاتح' },
    'pika.theme.forest':        { vi: '🌲 Rừng',                            en: '🌲 Forest',                            ja: '🌲 森',                             zh: '🌲 森林',                       ar: '🌲 غابة' },
    'pika.theme.ocean':         { vi: '🌊 Đại dương',                       en: '🌊 Ocean',                             ja: '🌊 海',                             zh: '🌊 海洋',                       ar: '🌊 محيط' },
  };

  /* ============================================================
     PUBLIC API
     ============================================================ */
  function getLang(){
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.includes(stored)) return stored;
    } catch{}
    return DEFAULT_LANG;
  }

  function setLang(lang){
    if (!SUPPORTED.includes(lang)) return false;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch{}
    apply();
    // Re-apply after a microtask + a 60ms macrotask to catch any DOM that
    // rendered between writes (modals opening, dealer avatar mounting, etc.)
    Promise.resolve().then(() => apply());
    setTimeout(() => apply(), 60);
    return true;
  }

  function t(key, lang){
    const entry = STRINGS[key];
    if (!entry) return key;
    return entry[lang || getLang()] || entry[DEFAULT_LANG] || key;
  }

  function translateNode(el, lang){
    if (!el || el.nodeType !== 1) return;
    if (el.hasAttribute('data-i18n')){
      const key = el.getAttribute('data-i18n');
      const val = t(key, lang);
      if (/<\/?[a-z]/i.test(val)) el.innerHTML = val;
      else el.textContent = val;
    }
    if (el.hasAttribute('data-i18n-placeholder')){
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'), lang));
    }
    if (el.hasAttribute('data-i18n-title')){
      el.setAttribute('title', t(el.getAttribute('data-i18n-title'), lang));
    }
    if (el.hasAttribute('data-i18n-aria')){
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), lang));
    }
  }

  function apply(root){
    const lang = getLang();
    const scope = root || document;
    // Translate text content (data-i18n) — root itself + descendants
    if (scope.nodeType === 1 && scope.hasAttribute && scope.hasAttribute('data-i18n')) translateNode(scope, lang);
    scope.querySelectorAll('[data-i18n]').forEach(el => translateNode(el, lang));
    scope.querySelectorAll('[data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]').forEach(el => translateNode(el, lang));
    // Apply lang + dir on root
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', RTL_LANGS.has(lang) ? 'rtl' : 'ltr');
    // Emit event
    try { window.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang } })); } catch{}
  }

  /* ============================================================
     MUTATION OBSERVER — auto-translate dynamically inserted nodes.
     Without this, content rendered by JS AFTER initial apply() (modals,
     dealer avatar, action buttons, etc.) keeps the fallback language until
     the next setLang() call. The observer catches them on insertion.
     ============================================================ */
  let observer = null;
  function installObserver(){
    if (observer || typeof MutationObserver === 'undefined') return;
    const lang = () => getLang();
    observer = new MutationObserver((mutations) => {
      for (const m of mutations){
        for (const node of m.addedNodes){
          if (node.nodeType !== 1) continue;
          // Translate self if it has data-i18n
          translateNode(node, lang());
          // Translate any descendants
          if (node.querySelectorAll){
            node.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]')
              .forEach(el => translateNode(el, lang()));
          }
        }
      }
    });
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  window.I18N = {
    SUPPORTED, DEFAULT_LANG, RTL_LANGS, LANG_LABELS, STRINGS,
    getLang, setLang, t, apply,
  };

  // Auto-apply on DOMContentLoaded + install observer
  function bootstrap(){
    apply();
    installObserver();
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();

/* ===== Service worker: đăng ký + tự phát hiện bản mới + tự tải lại =====
   Chạy trên MỌI trang (file này được nhúng ở mọi game) nên bé đang chơi ở bất kỳ
   game con nào cũng được kiểm tra & cập nhật, không chỉ ở trang chủ.
   localStorage (hồ sơ/điểm số/cài đặt) hoàn toàn KHÔNG bị service worker đụng tới —
   nó chỉ cache file HTML/CSS/JS/ảnh, nên dữ liệu bé đã lưu luôn được giữ nguyên
   qua mỗi lần cập nhật, không cần "merge" thủ công gì thêm. */
(function(){
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  if (!(location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) return;

  // Nếu trang này đang tải mà ĐÃ có 1 service worker điều khiển sẵn (không phải lần
  // đầu cài đặt), thì sau này nếu có bản mới "chiếm quyền" (nhờ skipWaiting), tự tải
  // lại ngay để lấy code mới — bỏ qua trường hợp lần đầu để không bị tải lại vô ích.
  const hadControllerBefore = !!navigator.serviceWorker.controller;
  let reloading = false;

  function showUpdateToast(){
    try {
      const toast = document.createElement('div');
      toast.textContent = '🔄 Đang cập nhật phiên bản mới…';
      toast.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);' +
        'background:#241e2e;color:#fff;padding:10px 18px;border-radius:999px;font-size:13px;' +
        'font-weight:600;z-index:99999;box-shadow:0 4px 14px rgba(0,0,0,.3);' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;';
      document.body.appendChild(toast);
    } catch { /* không quan trọng bằng việc tải lại trang */ }
  }

  if (hadControllerBefore){
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloading) return;
      reloading = true;
      showUpdateToast();
      setTimeout(() => location.reload(), 500);
    });
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Chủ động kiểm tra bản mới ngay khi vào trang, không đợi trình duyệt tự canh theo lịch riêng.
      reg.update().catch(() => {});
      // Mỗi lần bé quay lại tab (mở app lên lại) cũng kiểm tra lại 1 lần.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
    }).catch(() => {});
  });
})();
