'use client';

import { Redo2, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type MouseEvent } from 'react';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { Button } from '@/shared/ui/Button';
import type { EditorMode } from '../types';
import { LeaveEditorModal } from './LeaveEditorModal';
import { ModeToggle } from './ModeToggle';

// 로고를 누르면 가는 곳. 서비스 헤더의 로고와 같다.
const HOME_PATH = '/';

interface EditorHeaderProps {
   mode: EditorMode;
   onModeChange: (mode: EditorMode) => void;
   isDirty: boolean; // 저장하지 않은 변경이 있는지. 안내 문구와 저장 버튼의 점이 함께 따른다.
}

// 실행 취소·다시 실행, 저장, 배포는 아직 모양만 있고 동작하지 않는다.
// 미리보기에서는 편집과 관련된 오른쪽 영역(저장 안내, 저장, 배포)을 숨긴다.
// 로고를 누르면 메인으로 가고, 저장하지 않은 변경사항이 있으면 먼저 나가도 되는지 묻는다.
export function EditorHeader({ mode, onModeChange, isDirty }: EditorHeaderProps) {
   const router = useRouter();
   const [leaveModalOpen, setLeaveModalOpen] = useState(false);

   const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isDirty) return;
      // 새 탭으로 여는 클릭(Ctrl/Cmd/Shift)은 지금 화면을 떠나지 않으므로 그대로 둔다.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      setLeaveModalOpen(true);
   };

   return (
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-brand-line bg-white px-6">
         <div className="flex items-center gap-4">
            <Link
               href={HOME_PATH}
               aria-label="뚝딱 메인으로 가기"
               onClick={handleLogoClick}
               className="flex cursor-pointer items-center"
            >
               <BrandLogo />
            </Link>
            <span aria-hidden className="h-8 w-px bg-brand-line" />
            <div className="flex items-center gap-1">
               <HistoryButton label="실행 취소">
                  <Undo2 aria-hidden className="size-4" />
               </HistoryButton>
               <HistoryButton label="다시 실행">
                  <Redo2 aria-hidden className="size-4" />
               </HistoryButton>
            </div>
            <ModeToggle mode={mode} onModeChange={onModeChange} />
         </div>

         {mode === 'edit' && (
            <div className="flex items-center gap-3">
               {isDirty && <span className="text-xs text-black/50">저장되지 않은 변경사항</span>}
               <div className="relative">
                  <Button variant="outline" className="h-10 px-5">
                     저장
                  </Button>
                  {isDirty && (
                     <span
                        aria-hidden
                        className="absolute -top-1 -right-1 size-2.5 rounded-full bg-brand-orange"
                     />
                  )}
               </div>
               <Button className="h-10 px-6">배포</Button>
            </div>
         )}

         {leaveModalOpen && (
            <LeaveEditorModal
               onClose={() => setLeaveModalOpen(false)}
               onLeave={() => router.push(HOME_PATH)}
               // TODO: 저장 기능이 생기면 저장이 끝난 뒤에 이동한다. 지금은 저장 없이 이동만 한다.
               onSaveAndLeave={() => router.push(HOME_PATH)}
            />
         )}
      </header>
   );
}

function HistoryButton({ label, children }: { label: string; children: React.ReactNode }) {
   return (
      <button
         type="button"
         disabled
         aria-label={label}
         className="flex size-9 items-center justify-center rounded-lg text-black/30 disabled:cursor-not-allowed"
      >
         {children}
      </button>
   );
}
