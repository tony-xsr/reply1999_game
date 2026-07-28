-- ============================================================================
-- SEED DATA — chỉ dữ liệu bài thi PET (Luyện Dịch + Trắc Nghiệm Ngữ Pháp) để
-- test. KHÔNG seed điểm danh/streak/hoa/lịch sử chơi game khác.
--
-- Cách dùng:
-- 1) Đã có sẵn 1 tài khoản phụ huynh thật (đăng ký ở /phu-huynh/) và ít nhất
--    1 hồ sơ bé trong tài khoản đó (tạo bé ở /phu-huynh/ hoặc /chon-be/).
-- 2) Đổi 'PHU_HUYNH_EMAIL_CUA_BAN' và 'TEN_BE_CUA_BAN' bên dưới cho đúng.
-- 3) Supabase Dashboard → SQL Editor → dán TOÀN BỘ file này → Run.
-- 4) Vào Luyện Dịch PET / Trắc Nghiệm PET của bé đó để xem — sẽ có vài bài
--    "đã làm" (test lịch sử + Trang Phụ Huynh) và vài bài "chưa làm hôm nay/
--    các ngày trước" (test hàng đợi + ôn lại bài cũ, 45 ngày gần nhất).
-- Chạy lại an toàn — script kiểm tra "day" đã tồn tại chưa trước khi tạo,
-- không tạo trùng ngày.
-- ============================================================================

do $$
declare
  v_owner  uuid;
  v_family uuid;
  v_kid    uuid;
  v_id     uuid;
  d        date;
  i        int;
begin
  -- 1) Tài khoản phụ huynh đã đăng ký sẵn.
  select id into v_owner from auth.users where email = 'PHU_HUYNH_EMAIL_CUA_BAN';
  if v_owner is null then
    raise exception 'Không tìm thấy tài khoản với email này.';
  end if;

  select id into v_family from families where owner = v_owner;
  if v_family is null then
    raise exception 'Tài khoản này chưa có gia đình — vào /phu-huynh/ đăng nhập ít nhất 1 lần trước.';
  end if;

  -- 2) Hồ sơ bé đã có sẵn trong gia đình này.
  select id into v_kid from profiles where family_id = v_family and name = 'TEN_BE_CUA_BAN';
  if v_kid is null then
    raise exception 'Không tìm thấy bé tên này trong gia đình — tạo bé đó trước ở /phu-huynh/ hoặc sửa đúng tên.';
  end if;

  -- 3) 6 bài Luyện Dịch PET, lùi dần từ hôm nay: 4 bài "đã làm" (có submission)
  --    + 2 bài gần nhất "chưa làm" (test hàng đợi buffer sẵn chờ bé làm).
  for i in 0..5 loop
    d := current_date - i;
    if not exists (select 1 from translation_passages where profile_id = v_kid and level = 'pet' and day = d) then
      v_id := gen_random_uuid();
      insert into translation_passages (id, family_id, profile_id, level, day, title, passage_en, vocab) values (
        v_id, v_family, v_kid, 'pet', d,
        'Bài Đọc PET Ngày ' || d,
        'Every morning, Anna walks her dog in the park before school. She likes to watch the birds and feel the fresh air.',
        '[{"word":"walk","vi":"đi bộ"},{"word":"park","vi":"công viên"},{"word":"fresh air","vi":"không khí trong lành"}]'::jsonb
      );
      if i >= 2 then
        insert into translation_submissions (
          id, family_id, profile_id, passage_id, submitted_text, ai_score, ai_feedback, ai_reference_vi,
          vocab_correct, vocab_total, seconds_spent, submitted_at
        ) values (
          gen_random_uuid(), v_family, v_kid, v_id,
          'Mỗi buổi sáng, Anna dắt chó đi dạo trong công viên trước khi đi học. Cô ấy thích ngắm chim và hít thở không khí trong lành.',
          88, 'Bé dịch sát nghĩa, câu văn tự nhiên!',
          'Mỗi sáng, Anna dắt chó đi dạo trong công viên trước khi đến trường. Cô bé thích ngắm chim và hít thở không khí trong lành.',
          3, 3, 200 + i * 15, now() - (i || ' days')::interval
        );
      end if;
    end if;
  end loop;

  -- 4) 6 đề Trắc Nghiệm Ngữ Pháp PET, cùng kiểu: 4 đề "đã làm" + 2 đề "chưa làm".
  for i in 0..5 loop
    d := current_date - i;
    if not exists (select 1 from grammar_quizzes where profile_id = v_kid and level = 'pet' and quiz_type = 'grammar' and day = d) then
      v_id := gen_random_uuid();
      insert into grammar_quizzes (id, family_id, profile_id, level, day, quiz_type, questions) values (
        v_id, v_family, v_kid, 'pet', d, 'grammar',
        ('[
          {"prompt":"She ___ to school every day.","options":["go","goes","going","gone"],"answer":1,
           "explanations":["Sai vì thiếu \"s/es\" cho chủ ngữ số ít","Đúng vì \"she\" số ít, động từ thêm s/es","Sai vì thiếu trợ động từ is","Sai vì đây là quá khứ phân từ"]},
          {"prompt":"They ___ playing football now.","options":["is","am","are","be"],"answer":2,
           "explanations":["Sai vì \"they\" là số nhiều","Sai vì \"am\" chỉ dùng với I","Đúng vì \"they\" dùng are","Sai vì \"be\" không chia thì"]},
          {"prompt":"I have ___ finished my homework.","options":["already","yet","still","just now"],"answer":0,
           "explanations":["Đúng, \"already\" dùng trong câu khẳng định hoàn thành","Sai vì \"yet\" dùng trong câu phủ định/nghi vấn","Sai vì \"still\" nghĩa vẫn đang tiếp diễn","Sai vì cấu trúc không tự nhiên"]}
        ]')::jsonb
      );
      if i >= 2 then
        insert into grammar_quiz_submissions (id, family_id, profile_id, quiz_id, answers, score, ai_suggestion, seconds_spent, submitted_at)
        values (
          gen_random_uuid(), v_family, v_kid, v_id,
          '[{"selected":1,"correct":true},{"selected":2,"correct":true},{"selected":1,"correct":false}]'::jsonb,
          2, 'Bé nắm chắc thì hiện tại, cần ôn thêm trạng từ chỉ thời gian hoàn thành (already/yet).',
          90 + i * 5, now() - (i || ' days')::interval
        );
      end if;
    end if;
  end loop;

  raise notice 'Xong! Đã seed bài dịch + trắc nghiệm PET cho bé % trong gia đình %.', v_kid, v_family;
end $$;
