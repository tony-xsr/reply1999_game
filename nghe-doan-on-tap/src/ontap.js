// Nghe & Đoán: Ôn Tập Tổng Hợp — trộn câu hỏi từ CẢ 9 game Nghe & Đoán (không
// thêm từ mới, tăng giá trị ôn luyện: bé gặp lại từ cũ trong ngữ cảnh trộn lẫn
// đa chủ đề nên nhớ lâu hơn). Bộ lọc theo TỪNG GAME GỐC (9 lựa chọn + Tất cả).
//
// Khác biệt kỹ thuật so với 9 game gốc:
// - id được gắn tiền tố g1-..g9- để không đụng nhau giữa các game;
// - đường dẫn ảnh thật/SVG được đổi về tuyệt đối (/ten-game/images/...) vì
//   trang ôn tập nằm ở thư mục khác;
// - emoji CÓ THỂ trùng giữa các game gốc (mỗi game chỉ đảm bảo duy nhất nội
//   bộ), nên pickRound phải KHỬ TRÙNG emoji khi chọn mồi nhử — không bao giờ
//   để 2 hình giống nhau xuất hiện trong cùng 1 vòng 4 lựa chọn.
// File thuần logic, không đụng DOM, test độc lập.

import { WORD_BANK as B1 } from '../../nghe-doan-tieng-anh/src/nghedoan.js';
import { WORD_BANK as B2 } from '../../nghe-doan-giao-thong/src/giaothong.js';
import { WORD_BANK as B3 } from '../../nghe-doan-dong-vat-vu-tru/src/dongvat.js';
import { WORD_BANK as B4 } from '../../nghe-doan-gia-dinh-nghe-nghiep/src/giadinh.js';
import { WORD_BANK as B5 } from '../../nghe-doan-do-dung-hang-ngay/src/dodung.js';
import { WORD_BANK as B6 } from '../../nghe-doan-thoi-tiet-cam-xuc/src/thoitietcamxuc.js';
import { WORD_BANK as B7 } from '../../nghe-doan-quoc-gia-nghe-nghiep/src/quocgianghenghiep.js';
import { WORD_BANK as B8 } from '../../nghe-doan-hoat-dong-do-choi/src/hoatdongdochoi.js';
import { WORD_BANK as B9 } from '../../nghe-doan-nha-bep-cong-nghe/src/nhabepcongnghe.js';
import { missedWords } from './misses.js';

export const TOPICS = [
  { id: 'weak', label: 'Ôn chỗ yếu', icon: '🎯' },
  { id: 'g1', label: 'Món ăn & Ngày lễ', icon: '🍎' },
  { id: 'g2', label: 'Giao thông & Địa lý', icon: '🚗' },
  { id: 'g3', label: 'Muôn loài & Vũ trụ', icon: '🦁' },
  { id: 'g4', label: 'Gia đình & Thể thao', icon: '👪' },
  { id: 'g5', label: 'Đồ dùng & Cơ thể', icon: '👕' },
  { id: 'g6', label: 'Thời tiết & Cảm xúc', icon: '🌦️' },
  { id: 'g7', label: 'Quốc gia & Số đếm', icon: '🌍' },
  { id: 'g8', label: 'Hoạt động & Đồ chơi', icon: '🧸' },
  { id: 'g9', label: 'Nhà bếp & Công nghệ', icon: '🍳' },
];

const SOURCES = [
  ['g1', 'nghe-doan-tieng-anh', B1],
  ['g2', 'nghe-doan-giao-thong', B2],
  ['g3', 'nghe-doan-dong-vat-vu-tru', B3],
  ['g4', 'nghe-doan-gia-dinh-nghe-nghiep', B4],
  ['g5', 'nghe-doan-do-dung-hang-ngay', B5],
  ['g6', 'nghe-doan-thoi-tiet-cam-xuc', B6],
  ['g7', 'nghe-doan-quoc-gia-nghe-nghiep', B7],
  ['g8', 'nghe-doan-hoat-dong-do-choi', B8],
  ['g9', 'nghe-doan-nha-bep-cong-nghe', B9],
];

export const WORD_BANK = SOURCES.flatMap(([key, dir, bank]) => bank.map((w) => ({
  ...w,
  id: `${key}-${w.id}`,
  topic: key,
  img: w.img ? `/${dir}/${w.img}` : undefined,
})));

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Toàn bộ ngân hàng gộp, lọc theo 1 game gốc, hoặc 'weak' = chỉ những từ bé
 * hay chọn sai (đọc từ sổ theo dõi chung của cả 10 game). 'all' = tất cả.
 */
export function wordsForTopic(topicId) {
  if (topicId === 'weak') {
    const weak = new Set(missedWords());
    return WORD_BANK.filter((w) => weak.has(w.word));
  }
  return topicId === 'all' ? WORD_BANK : WORD_BANK.filter((w) => w.topic === topicId);
}

/**
 * Màn cao hơn: nhiều câu hỏi hơn mỗi vòng, và tỉ lệ vòng-CÂU (thay vì
 * vòng-TỪ ĐƠN) tăng dần — nhưng luôn ưu tiên TỪ ĐƠN nhiều hơn để bé không bị
 * "ngợp" vì câu dài xuất hiện quá dày, kể cả ở màn cao.
 */
export function tuningFor(levelIndex) {
  return {
    rounds: Math.min(10, 6 + Math.floor(levelIndex / 2)),
    choices: 4,
    sentenceChance: Math.min(0.45, 0.2 + levelIndex * 0.05),
  };
}

/** Tốc độ đọc phù hợp: câu dài đọc CHẬM hơn hẳn so với từ đơn ngắn. */
export function rateFor(mode) {
  return mode === 'sentence' ? 0.64 : 0.78;
}

/** Nội dung để đọc to (TTS) cho 1 vòng, theo đúng `mode` của vòng đó. */
export function promptFor(round) {
  return round.mode === 'sentence' ? round.target.sentence : round.target.word;
}

/**
 * Chọn 1 câu hỏi: mục tiêu + (choices-1) mồi nhử — KHỬ TRÙNG emoji giữa các
 * lựa chọn (emoji có thể lặp giữa 9 game gốc), không trùng id, thứ tự xáo trộn.
 */
export function pickRound(pool, usedIds, choices, rng) {
  const avail = pool.filter((w) => !usedIds.has(w.id));
  const source = avail.length ? avail : pool;
  const target = source[Math.floor(rng() * source.length)];
  const seenEmoji = new Set([target.emoji]);
  const distractors = [];
  for (const w of shuffle(pool, rng)) {
    if (distractors.length >= choices - 1) break;
    if (w.id === target.id || seenEmoji.has(w.emoji)) continue;
    seenEmoji.add(w.emoji);
    distractors.push(w);
  }
  const options = shuffle([target, ...distractors], rng);
  return { target, options };
}

/** Khởi tạo 1 lượt chơi cho 1 game gốc, 'weak' hoặc 'all' ở màn levelIndex. */
export function makeGame(topicId, levelIndex, rng = Math.random) {
  let pool = wordsForTopic(topicId);
  const tune = tuningFor(levelIndex);
  if (pool.length < tune.choices) {
    // Sổ "từ yếu" còn quá ít (hoặc rỗng): bù thêm từ ngẫu nhiên toàn kho để
    // vẫn đủ 4 lựa chọn mỗi vòng — từ yếu (nếu có) vẫn được ưu tiên làm mục tiêu.
    const ids = new Set(pool.map((w) => w.id));
    const fillers = shuffle(WORD_BANK.filter((w) => !ids.has(w.id)), rng)
      .slice(0, tune.choices * 2 - pool.length);
    pool = [...pool, ...fillers];
  }
  const usedIds = new Set();
  const rounds = [];
  for (let i = 0; i < tune.rounds; i++) {
    const r = pickRound(pool, usedIds, tune.choices, rng);
    r.mode = rng() < tune.sentenceChance ? 'sentence' : 'word';
    usedIds.add(r.target.id);
    rounds.push(r);
  }
  return {
    topic: topicId,
    level: levelIndex,
    rounds,
    roundIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    over: false,
    won: false,
  };
}

export function currentRound(game) {
  return game.rounds[game.roundIndex];
}

/**
 * Bé chạm 1 lựa chọn `wordId`. Trả về sự kiện mô tả kết quả — không throw,
 * không làm gì nếu ván đã kết thúc hoặc không còn câu hỏi.
 *
 * Luật CHỌN LẠI: sai lần ĐẦU trong 1 câu → ev.retry = true, câu KHÔNG qua —
 * app đọc gợi ý (từ + nghĩa tiếng Việt) rồi cho bé chọn lại đúng 1 lần. Đúng
 * sau gợi ý vẫn được điểm (ít hơn, không tính chuỗi). Sai lần 2 mới lộ đáp án,
 * đọc giải thích đầy đủ rồi qua câu mới.
 */
export function chooseOption(game, wordId) {
  const ev = { correct: false, retry: false, gain: 0, streakBonus: 0, roundDone: false, gameDone: false, won: false };
  if (game.over) return ev;
  const round = currentRound(game);
  if (!round) return ev;

  if (wordId === round.target.id) {
    ev.correct = true;
    game.correctCount++;
    if (round.retried) {
      // Đúng sau khi được gợi ý: vẫn có điểm nhưng ít hơn, không tính chuỗi.
      game.score += 5;
      ev.gain = 5;
    } else {
      game.streak++;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      let gain = 10;
      if (game.streak > 0 && game.streak % 3 === 0) {
        gain += 10;
        ev.streakBonus = 10;
      }
      game.score += gain;
      ev.gain = gain;
    }
  } else if (!round.retried) {
    // Sai lần ĐẦU: đánh dấu để cho bé chọn lại, chuỗi về 0, câu KHÔNG qua.
    round.retried = true;
    game.streak = 0;
    ev.retry = true;
    return ev;
  }
  // (Sai lần 2: chuỗi đã về 0 từ lần sai đầu — chỉ việc lộ đáp án và qua câu.)

  ev.roundDone = true;
  game.roundIndex++;
  if (game.roundIndex >= game.rounds.length) {
    game.over = true;
    game.won = game.correctCount >= Math.ceil(game.rounds.length * 0.6);
    ev.gameDone = true;
    ev.won = game.won;
  }
  return ev;
}
