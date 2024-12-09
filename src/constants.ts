export const GRADUATION_REQUIREMENTS = {
  기교: 15,
  심교: 12,
  전필: 21,
  전선: 29,
  일선: 0,
  다지: 14,
  다필선: 40,
  부필선: 24,
  교생실습: 10,
} as const;

export const MAJOR_TYPES = [
  { id: "single", label: "단일전공" },
  { id: "double", label: "다전공" },
  { id: "minor", label: "부전공" },
];

export const TOTAL_REQUIRED_CREDITS = 140;
export const TEACHING_ADDITIONAL_CREDITS = 10;
