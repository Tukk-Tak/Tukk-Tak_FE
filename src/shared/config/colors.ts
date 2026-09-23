/**
 * 뚝딱(Tukk-Tak) 디자인 시스템 — 컬러 토큰
 * 메인 컬러: 주황/갈색 계열 (도깨비 방망이 컨셉)
 */
export const colors = {
  primary: {
    50: "#FFF4EB",
    100: "#FFE3CC",
    300: "#FFB066",
    500: "#FF8A1E", // main orange
    700: "#C7601A",
    900: "#5A3418", // deep brown
  },
  neutral: {
    0: "#FFFFFF",
    100: "#F7F5F2",
    300: "#D9D2C9",
    500: "#8C8078",
    700: "#4A4038",
    900: "#211C17",
  },
} as const;

export type ColorToken = typeof colors;
