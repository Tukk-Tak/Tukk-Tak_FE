'use client';

import { useAiDraftForm } from '../model/AiDraftFormContext';
import { MOOD_NOTE_MAX } from '../model/options';
import { Textarea } from '@/shared/ui/Textarea';
import { MoodColors } from './MoodColors';
import { MoodKeywords } from './MoodKeywords';
import { ReferenceImageField } from './ReferenceImageField';

// 2단계 컨셉·분위기. 왼쪽에 분위기 키워드와 보완 설명, 오른쪽에 색과 참고 이미지를 둔다.
// 분위기 키워드와 색은 필수(각각 1개 이상), 보완 설명과 참고 이미지는 선택이다.
export function MoodStep() {
   const { values, update } = useAiDraftForm();

   return (
      <div className="grid gap-10 md:grid-cols-2 md:gap-0">
         <div className="space-y-8 md:pr-10">
            <MoodKeywords />

            <div>
               <div className="mb-2.5 flex items-center justify-between text-sm">
                  <label htmlFor="ai-mood-note" className="font-bold text-brand-brown">
                     보완 설명
                  </label>
                  <span className="text-[#A6A09B]">(선택)</span>
               </div>
               <div className="relative">
                  <Textarea
                     tone="brown"
                     id="ai-mood-note"
                     name="moodNote"
                     rows={5}
                     placeholder="원하는 분위기를 조금 더 자세히 알려 주세요."
                     maxLength={MOOD_NOTE_MAX}
                     value={values.moodNote}
                     className="pb-9"
                     onChange={(event) => update({ moodNote: event.target.value })}
                  />
                  <span className="pointer-events-none absolute right-4 bottom-3 text-xs text-[#A6A09B]">
                     {values.moodNote.length}/{MOOD_NOTE_MAX}
                  </span>
               </div>
            </div>
         </div>

         <div className="space-y-8 md:border-l md:border-brand-line md:pl-10">
            <MoodColors />
            <ReferenceImageField />
         </div>
      </div>
   );
}
