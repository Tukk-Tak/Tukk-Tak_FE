import type { Template } from '../types';
import { BLANK_TEMPLATE } from './blank';
import { COZY_TEMPLATE } from './cozy';
import { MENU_TEMPLATE } from './menu';
import { PHOTO_TEMPLATE } from './photo';

// 템플릿 선택 화면에 보이는 순서. 빈 템플릿은 항상 마지막이다.
export const TEMPLATES: Template[] = [COZY_TEMPLATE, MENU_TEMPLATE, PHOTO_TEMPLATE, BLANK_TEMPLATE];
