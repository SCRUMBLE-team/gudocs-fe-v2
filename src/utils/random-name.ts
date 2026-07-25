/**
 * 블리자드식 랜덤 닉네임. 형용사 + 수식어 + 동물 세 조각을 이어 붙인다.
 * 예) "바쁜금빛황소", "느긋한새벽수달"
 *
 * 각 조각을 짧게 유지해 조합 길이가 10자를 넘지 않게 한다.
 */
const ADJECTIVES = [
  "바쁜",
  "용감한",
  "느긋한",
  "수줍은",
  "엉뚱한",
  "성실한",
  "당당한",
  "다정한",
  "명랑한",
  "차분한",
  "재빠른",
  "슬기로운",
  "졸린",
  "배부른",
  "야무진",
] as const;

const MODIFIERS = [
  "금빛",
  "은빛",
  "새벽",
  "구름",
  "무지개",
  "북극",
  "별빛",
  "숲속",
  "바다",
  "노을",
  "달빛",
  "안개",
  "초록",
  "보라",
  "눈꽃",
] as const;

const ANIMALS = [
  "황소",
  "여우",
  "수달",
  "너구리",
  "고래",
  "부엉이",
  "펭귄",
  "다람쥐",
  "호랑이",
  "고양이",
  "돌고래",
  "사슴",
  "두더지",
  "라쿤",
  "알파카",
] as const;

// 같은 이름이 연속으로 나오지 않게 다시 뽑는 최대 횟수.
// 조합 수가 3천 개가 넘어 실제로 재시도까지 가는 일은 거의 없다.
const MAX_RETRY = 5;

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function combine(): string {
  return `${pick(ADJECTIVES)}${pick(MODIFIERS)}${pick(ANIMALS)}`;
}

/**
 * 랜덤 닉네임을 만든다.
 *
 * exclude를 주면 그 값과 다른 이름이 나올 때까지 다시 뽑는다 —
 * "다시 뽑기"를 눌렀는데 같은 이름이 나오면 버튼이 고장난 것처럼 보인다.
 */
export function generateRandomName(exclude?: string): string {
  let name = combine();

  for (let retry = 0; retry < MAX_RETRY && name === exclude; retry += 1) {
    name = combine();
  }

  return name;
}
