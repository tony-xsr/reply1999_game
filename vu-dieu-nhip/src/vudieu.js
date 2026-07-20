// Vũ Điệu Theo Nhịp: mỗi câu nhạc hiện 3–5 mũi tên to — bé bấm đúng thứ tự, rồi CHỐT NHỊP
// bằng vòng tròn co lại (bấm đúng lúc vòng chạm viền). Cơ chế "mũi tên theo nhịp" thuộc
// thể loại phổ biến từ cuối thập niên 90; nhạc tự sinh bằng WebAudio, nhân vật tự vẽ —
// không dùng nhạc/asset có bản quyền. Toàn bộ file này thuần logic, test được độc lập.

export const DIRS = ['left', 'up', 'right', 'down'];
export const START_HEARTS = 3;
export const BEAT_MS = 1600; // vòng nhịp co từ to → chạm viền trong 1.6 giây
export const BEAT_PERFECT = 1600; // thời điểm "chuẩn" = lúc vòng chạm viền
export const PERFECT_WINDOW = 140; // ±ms quanh điểm chuẩn → TUYỆT VỜI
export const GOOD_WINDOW = 320; // ±ms → TỐT
export const BEAT_OVER = 2000; // quá mốc này chưa bấm → trượt nhịp

/** Màn cao hơn: nhiều câu hơn, chuỗi dài hơn, thời gian bấm mũi tên ngắn hơn. */
export function tuningFor(levelIndex) {
  return {
    rounds: Math.min(10, 5 + levelIndex),
    arrowsPerRound: Math.min(5, 3 + Math.floor(levelIndex / 2)),
    arrowTimeMs: Math.max(4200, 7500 - levelIndex * 500),
  };
}

export function makeGame(levelIndex, rng = Math.random) {
  const tune = tuningFor(levelIndex);
  const rounds = [];
  for (let i = 0; i < tune.rounds; i++) {
    const arrows = [];
    for (let k = 0; k < tune.arrowsPerRound; k++) {
      let d = DIRS[Math.floor(rng() * DIRS.length)];
      // tránh 3 mũi tên giống nhau liền — chuỗi nhìn "có vũ đạo" hơn
      if (arrows.length >= 2 && arrows[arrows.length - 1] === d && arrows[arrows.length - 2] === d) {
        d = DIRS[(DIRS.indexOf(d) + 1 + Math.floor(rng() * 3)) % DIRS.length];
      }
      arrows.push(d);
    }
    rounds.push({ arrows });
  }
  return {
    level: levelIndex,
    rounds,
    roundIndex: 0,
    phase: 'arrows', // 'arrows' → 'beat' → (câu kế) ...
    arrowIndex: 0,
    arrowTimeLeft: tune.arrowTimeMs,
    arrowTimeMs: tune.arrowTimeMs,
    beatT: 0,
    hearts: START_HEARTS,
    score: 0,
    combo: 0,
    maxCombo: 0,
    over: false,
    won: false,
  };
}

export function currentArrows(game) {
  return game.rounds[game.roundIndex].arrows;
}

function loseHeart(game) {
  game.hearts--;
  game.combo = 0;
  if (game.hearts <= 0) {
    game.over = true;
    game.won = false;
  }
}

function nextRound(game) {
  game.roundIndex++;
  if (game.roundIndex >= game.rounds.length) {
    game.over = true;
    game.won = true;
    game.score += game.hearts * 30;
    return;
  }
  game.phase = 'arrows';
  game.arrowIndex = 0;
  game.arrowTimeLeft = game.arrowTimeMs;
  game.beatT = 0;
}

/**
 * Bé bấm 1 mũi tên trong pha chuỗi. Trả về: { ok, done: xong chuỗi vào pha nhịp? }
 */
export function tapArrow(game, dir) {
  const ev = { ok: false, done: false };
  if (game.over || game.phase !== 'arrows') return ev;
  const expected = currentArrows(game)[game.arrowIndex];
  if (dir !== expected) {
    game.combo = 0; // bấm sai: mất combo (không mất tim — chỉ thua thời gian)
    return ev;
  }
  ev.ok = true;
  game.arrowIndex++;
  game.score += 5;
  if (game.arrowIndex >= currentArrows(game).length) {
    game.phase = 'beat';
    game.beatT = 0;
    ev.done = true;
  }
  return ev;
}

/**
 * Bé chốt nhịp (bấm vòng tròn). Trả về: { grade: 'perfect'|'good'|'miss' }
 */
export function tapBeat(game) {
  const ev = { grade: null };
  if (game.over || game.phase !== 'beat') return ev;
  const diff = Math.abs(game.beatT - BEAT_PERFECT);
  if (diff <= PERFECT_WINDOW) {
    ev.grade = 'perfect';
    game.combo++;
    game.score += 30 + game.combo * 5;
  } else if (diff <= GOOD_WINDOW) {
    ev.grade = 'good';
    game.combo++;
    game.score += 15;
  } else {
    ev.grade = 'miss';
    loseHeart(game);
  }
  game.maxCombo = Math.max(game.maxCombo, game.combo);
  if (!game.over) nextRound(game);
  return ev;
}

/**
 * Trôi thời gian. Trả về: { arrowTimeout, beatTimeout } — hết giờ pha nào mất tim pha đó.
 */
export function tickTime(game, dtMs) {
  const ev = { arrowTimeout: false, beatTimeout: false };
  if (game.over) return ev;
  if (game.phase === 'arrows') {
    game.arrowTimeLeft -= dtMs;
    if (game.arrowTimeLeft <= 0) {
      ev.arrowTimeout = true;
      loseHeart(game);
      if (!game.over) nextRound(game);
    }
  } else if (game.phase === 'beat') {
    game.beatT += dtMs;
    if (game.beatT > BEAT_OVER) {
      ev.beatTimeout = true;
      loseHeart(game);
      if (!game.over) nextRound(game);
    }
  }
  return ev;
}
