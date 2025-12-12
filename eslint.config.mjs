import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // 1. var 사용 금지 (const, let만 사용)
      "no-var": "error",
      
      // 2. console.log가 남아있으면 경고 (배포 전 확인용)
      "no-console": "warn",
      
      // 3. 사용하지 않는 변수가 있으면 경고 (에러는 너무 빡빡해서 warn 추천)
      "no-unused-vars": "warn",
      
      // 4. react-hook 의존성 배열 경고 (무한루프 방지용 필수)
      "react-hooks/exhaustive-deps": "warn"
    },
  },
];

export default eslintConfig;