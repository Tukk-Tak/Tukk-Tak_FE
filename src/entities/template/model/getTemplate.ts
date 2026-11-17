import type { Template } from '../types';
import { TEMPLATES } from './templates';

// id로 템플릿을 찾는다. 모르는 id이면 undefined이다.
export function getTemplate(id: string | undefined): Template | undefined {
   return TEMPLATES.find((template) => template.id === id);
}
