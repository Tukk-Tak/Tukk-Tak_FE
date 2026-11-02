import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
   baseDirectory: __dirname,
});

// 각 레이어가 import할 수 없는 레이어 (app → widgets → features → entities → shared)
// - 자기 레이어를 넣은 것은 "같은 레이어의 다른 슬라이스"를 import하는 것을 막기 위함
// - app은 모든 레이어를 import할 수 있으므로 규칙이 없다
// - entities끼리의 import는 팀 결정으로 허용한다 (도메인 모델이 서로를 참조할 수 있음)
const FORBIDDEN = {
   widgets: ['app', 'widgets'],
   features: ['app', 'widgets', 'features'],
   entities: ['app', 'widgets', 'features'],
   shared: ['app', 'widgets', 'features', 'entities'],
};

const layerRule = (layer) => ({
   files: [`src/${layer}/**/*.{ts,tsx}`],
   rules: {
      'no-restricted-imports': [
         'error',
         {
            patterns: FORBIDDEN[layer].map((target) => ({
               group: [`@/${target}/**`],
               message:
                  target === layer
                     ? '같은 레이어의 다른 슬라이스를 직접 import하지 마세요. 같은 슬라이스 안에서는 상대경로를 쓰세요.'
                     : `${layer} 레이어는 ${target} 레이어를 import할 수 없습니다. (app → widgets → features → entities → shared)`,
            })),
         },
      ],
   },
});

const eslintConfig = defineConfig([
   ...compat.extends('next/core-web-vitals', 'next/typescript'),
   ...Object.keys(FORBIDDEN).map(layerRule),
   globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
