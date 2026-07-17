// Chim Non Vượt Ống: chạm để chim vỗ cánh bay lên, thả thì rơi theo trọng lực,
// bay qua khe giữa các cặp ống để ghi điểm. Cơ chế "1 chạm" thuộc thể loại cực phổ biến.
// Khe rộng hơn cho bé, hẹp dần theo điểm; mỗi 5 ống có 1 chữ cái trong khe để vừa chơi
// vừa học. Toàn bộ file này thuần logic (không đụng canvas/DOM), test được độc lập.

export const FIELD_W = 480;
export const FIELD_H = 640;
export const GROUND_H = 70;
export const BIRD_X = 140;
export const BIRD_R = 16;
export const GRAVITY = 0.32; // gia tốc rơi mỗi khung hình 60fps
export const FLAP_V = -6.6; // vận tốc vụt lên khi vỗ cánh
export const PIPE_W = 70;
export const PIPE_SPACING = 250; // khoảng cách ngang giữa 2 cặp ống
export const PIPE_SPEED = 2.5;
export const GAP_START = 215; // khe đầu game rất rộng cho bé
export const GAP_MIN = 145;
export const GAP_SHRINK = 2; // mỗi ống qua được, khe hẹp thêm 2px
export const LETTER_EVERY = 5; // mỗi 5 ống có 1 chữ cái trong khe
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function makeGame(rng = Math.random) {
  const game = {
    bird: { y: FIELD_H * 0.42, vy: 0 },
    pipes: [],
    score: 0,
    pipesMade: 0,
    started: false, // chưa chạm lần nào thì chim lơ lửng chờ
    over: false,
  };
  spawnPipe(game, FIELD_W + 80, rng);
  return game;
}

/** Khe hiện tại: hẹp dần theo điểm, có sàn tối thiểu. */
export function gapFor(score) {
  return Math.max(GAP_MIN, GAP_START - score * GAP_SHRINK);
}

function spawnPipe(game, x, rng) {
  const gapH = gapFor(game.score);
  const margin = 60;
  const gapY = margin + gapH / 2 + rng() * (FIELD_H - GROUND_H - margin * 2 - gapH);
  game.pipesMade++;
  game.pipes.push({
    x,
    gapY,
    gapH,
    passed: false,
    letter: game.pipesMade % LETTER_EVERY === 0
      ? LETTERS[(Math.floor(game.pipesMade / LETTER_EVERY) - 1) % LETTERS.length]
      : null,
  });
}

/** Chạm màn hình: chim vỗ cánh. Lần chạm đầu tiên khởi động ván chơi. */
export function flap(game) {
  if (game.over) return false;
  game.started = true;
  game.bird.vy = FLAP_V;
  return true;
}

function hitsPipe(bird, pipe) {
  const left = pipe.x;
  const right = pipe.x + PIPE_W;
  if (BIRD_X + BIRD_R < left || BIRD_X - BIRD_R > right) return false;
  const gapTop = pipe.gapY - pipe.gapH / 2;
  const gapBottom = pipe.gapY + pipe.gapH / 2;
  return bird.y - BIRD_R < gapTop || bird.y + BIRD_R > gapBottom;
}

/**
 * Một bước mô phỏng. Trả về sự kiện cho giao diện:
 * { passed: vừa qua 1 ống?, letter: chữ cái vừa bay qua (nếu có), died: vừa thua? }
 */
export function stepGame(game, dtMs, rng = Math.random) {
  const events = { passed: false, letter: null, died: false };
  if (game.over || !game.started) return events;
  const dt = dtMs / 16.67;

  game.bird.vy += GRAVITY * dt;
  game.bird.y += game.bird.vy * dt;
  if (game.bird.y < BIRD_R) { // trần: chặn lại chứ không chết
    game.bird.y = BIRD_R;
    game.bird.vy = 0;
  }

  for (const p of game.pipes) p.x -= PIPE_SPEED * dt;
  const last = game.pipes[game.pipes.length - 1];
  if (last && last.x < FIELD_W - PIPE_SPACING) {
    spawnPipe(game, last.x + PIPE_SPACING, rng);
  }
  game.pipes = game.pipes.filter((p) => p.x + PIPE_W > -20);

  for (const p of game.pipes) {
    if (!p.passed && p.x + PIPE_W < BIRD_X - BIRD_R) {
      p.passed = true;
      game.score++;
      events.passed = true;
      if (p.letter) events.letter = p.letter;
    }
    if (hitsPipe(game.bird, p)) {
      game.over = true;
      events.died = true;
      return events;
    }
  }

  if (game.bird.y + BIRD_R >= FIELD_H - GROUND_H) {
    game.bird.y = FIELD_H - GROUND_H - BIRD_R;
    game.over = true;
    events.died = true;
  }
  return events;
}
