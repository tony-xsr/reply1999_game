// Võ Đài Thú Nhí: 2 thú bông đấu võ trên sàn đài — đối thủ "ra tín hiệu" đòn sắp tới,
// bé phải bấm ĐÚNG nút phản ứng kịp lúc: đòn cao → ĐỠ 🛡, đòn thấp → NÉ 💨, sơ hở → ĐẤM 🥊.
// Phản ứng đúng tích NỘ KHÍ, đầy nộ thì BIẾN HÌNH to đùng đánh đau gấp đôi. Không máu me —
// thú bông trúng đòn chỉ văng lộn nhào như đồ chơi. Đây là game tự thiết kế lấy cái lõi
// "đọc đòn – phản đòn theo nhịp" của thể loại đối kháng, không dùng nhân vật/asset của
// bất kỳ game thương mại nào. File thuần logic, test được độc lập.

export const START_HP = 40;
export const RAGE_MAX = 5;
export const TRANSFORM_HEAL = 10;
export const CUE_GAP_MS = 700; // nghỉ giữa 2 tín hiệu

// Tín hiệu đòn của đối thủ → nút phản ứng đúng
export const CUES = {
  high: { correct: 'do' }, // đòn đấm cao → ĐỠ
  low: { correct: 'ne' }, // đòn vồ thấp → NÉ
  open: { correct: 'dam' }, // sơ hở → ĐẤM vào!
};
export const CUE_TYPES = Object.keys(CUES);

/** Các bạn thú bông (tên + dạng biến hình đều tự đặt). */
export const FIGHTERS = {
  gau: { name: 'Gấu Bông', bigName: 'Gấu To Đùng' },
  tho: { name: 'Thỏ Bông', bigName: 'Thỏ Thần Tốc' },
  ho: { name: 'Hổ Vằn Bông', bigName: 'Hổ Gầm Vang' },
  rong: { name: 'Rồng Vải', bigName: 'Rồng Lửa Xanh' },
};
export const FIGHTER_IDS = Object.keys(FIGHTERS);

/** Cửa sổ phản ứng ngắn dần theo màn và theo số hiệp đã đấu. */
export function windowFor(levelIndex, roundIndex) {
  return Math.max(900, 2000 - levelIndex * 150 - roundIndex * 100);
}

export function makeMatch(playerId, foeId, levelIndex, roundIndex, startHp) {
  return {
    playerId,
    foeId,
    level: levelIndex,
    round: roundIndex,
    playerHp: startHp == null ? START_HP : Math.min(START_HP, startHp),
    foeHp: START_HP,
    rage: 0,
    transformed: false,
    cue: null, // { type, t, windowMs }
    gapMs: 900, // chờ 1 nhịp rồi mới ra tín hiệu đầu
    over: false,
    won: false,
  };
}

function newCue(match, rng) {
  const type = CUE_TYPES[Math.floor(rng() * CUE_TYPES.length)];
  match.cue = { type, t: 0, windowMs: windowFor(match.level, match.round) };
}

function endIfKo(match) {
  if (match.foeHp <= 0) {
    match.over = true;
    match.won = true;
  } else if (match.playerHp <= 0) {
    match.over = true;
    match.won = false;
  }
}

function gainRage(match, ev) {
  if (match.transformed) return;
  match.rage++;
  if (match.rage >= RAGE_MAX) {
    match.transformed = true;
    match.playerHp = Math.min(START_HP, match.playerHp + TRANSFORM_HEAL);
    ev.transformed = true;
  }
}

/**
 * Trôi thời gian. Trả về sự kiện: { cueStart, late, foeHit: đòn địch trúng mình? }
 * — để lỡ tín hiệu: đòn cao/thấp thì bị dính đòn, sơ hở thì chỉ tuột mất cơ hội.
 */
export function tick(match, dtMs, rng = Math.random) {
  const ev = { cueStart: false, late: false, foeHit: false, dmg: 0 };
  if (match.over) return ev;
  if (match.cue) {
    match.cue.t += dtMs;
    if (match.cue.t > match.cue.windowMs) {
      ev.late = true;
      if (match.cue.type !== 'open') {
        const dmg = 5 + Math.floor(rng() * 4);
        match.playerHp = Math.max(0, match.playerHp - dmg);
        match.rage = Math.max(0, match.rage - 1);
        ev.foeHit = true;
        ev.dmg = dmg;
      }
      match.cue = null;
      match.gapMs = CUE_GAP_MS;
      endIfKo(match);
    }
  } else {
    match.gapMs -= dtMs;
    if (match.gapMs <= 0) {
      newCue(match, rng);
      ev.cueStart = true;
    }
  }
  return ev;
}

/**
 * Bé bấm 1 trong 3 nút ('dam' | 'do' | 'ne'). Trả về sự kiện:
 * { result: 'hit'|'block'|'dodge'|'wrong'|null, dmg, transformed, ko }
 */
export function act(match, action, rng = Math.random) {
  const ev = { result: null, dmg: 0, transformed: false, ko: false };
  if (match.over || !match.cue) return ev;
  const cueType = match.cue.type;
  match.cue = null;
  match.gapMs = CUE_GAP_MS;

  if (CUES[cueType].correct === action) {
    if (cueType === 'open') {
      // đấm trúng sơ hở!
      const base = 7 + Math.floor(rng() * 6);
      ev.dmg = match.transformed ? base * 2 : base;
      match.foeHp = Math.max(0, match.foeHp - ev.dmg);
      ev.result = 'hit';
    } else {
      ev.result = cueType === 'high' ? 'block' : 'dodge';
    }
    gainRage(match, ev);
  } else {
    // phản ứng sai → dính đòn (đấm hụt lúc địch ra đòn cũng đau)
    const dmg = 5 + Math.floor(rng() * 4);
    match.playerHp = Math.max(0, match.playerHp - dmg);
    match.rage = Math.max(0, match.rage - 1);
    ev.result = 'wrong';
    ev.dmg = dmg;
  }
  endIfKo(match);
  ev.ko = match.over;
  return ev;
}

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Chuỗi trận: đấu lần lượt các bạn thú khác, thắng được hồi 40% bông rồi đấu tiếp. */
export function makeCampaign(playerId, levelIndex, rng = Math.random) {
  const foes = shuffle(FIGHTER_IDS.filter((id) => id !== playerId), rng)
    .slice(0, Math.min(3, 2 + Math.floor(levelIndex / 2)));
  return {
    level: levelIndex,
    playerId,
    foes,
    roundIndex: 0,
    match: makeMatch(playerId, foes[0], levelIndex, 0),
    over: false,
    won: false,
  };
}

/** Gọi sau khi 1 trận xong: thua → chuỗi thua; thắng hết → chuỗi thắng; còn → trận kế (hồi 40%). */
export function advanceCampaign(campaign) {
  if (!campaign.match.over || campaign.over) return null;
  if (!campaign.match.won) {
    campaign.over = true;
    campaign.won = false;
    return null;
  }
  campaign.roundIndex++;
  if (campaign.roundIndex >= campaign.foes.length) {
    campaign.over = true;
    campaign.won = true;
    return null;
  }
  const healed = Math.min(START_HP, campaign.match.playerHp + Math.round(START_HP * 0.4));
  campaign.match = makeMatch(
    campaign.playerId, campaign.foes[campaign.roundIndex],
    campaign.level, campaign.roundIndex, healed,
  );
  return campaign.match;
}
