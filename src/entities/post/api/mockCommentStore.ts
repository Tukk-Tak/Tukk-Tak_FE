import { readMockSession } from '@/entities/user/api/mockSession';
import type { CommentStatus, CommentView } from '../commentTypes';
import { MOCK_POSTS } from './mockPosts';

// TODO: 백엔드가 생기면 이 파일은 삭제한다. 댓글 데이터와, 실제로는 서버가 하는 일(누가 볼 수 있는지, 답글·삭제를 할 수 있는지 계산)을 흉내 낸다.
// 화면 코드는 여기서 계산한 결과(CommentView)만 읽는다. 열람 범위 계산을 화면 쪽으로 옮기지 않는다.
// 데이터는 이 탭의 메모리에만 있어서 새로고침하면 처음 상태로 돌아간다.

export interface CommentRecord {
   id: string;
   postId: string;
   parentId: string | null;
   author: string;
   content: string;
   isPrivate: boolean;
   deleted: boolean;
   mention: string | null;
   createdAt: number;
}

const store = new Map<string, CommentRecord[]>();
let sequence = 0;

function nextId(postId: string): string {
   sequence += 1;
   return `${postId}~${sequence}`;
}

export function postAuthorOf(postId: string): string {
   return MOCK_POSTS.find((post) => post.id === postId)?.authorNickname ?? '';
}

// 지금 보는 사람. 로그인하지 않았으면 null이다. (mock은 로그인 정보의 닉네임으로 흉내 낸다.)
export function currentViewer(): string | null {
   return readMockSession()?.nickname ?? null;
}

const FILLER_AUTHORS = ['동네빵집', '소소한식탁', '모닝브루', '플라워룸', '취향상점', '다정한하루'];
const FILLER_TEXTS = [
   '사진만 봐도 분위기가 좋아 보여요.',
   '메뉴 구성이 마음에 들어요. 꼭 가볼게요!',
   '응원합니다. 오래오래 장사하세요.',
   '저도 비슷한 고민을 했었는데 도움이 됐어요.',
   '다음 소식도 기다릴게요.',
   '정성이 느껴지는 글이네요.',
];

function seed(postId: string): CommentRecord[] {
   const now = Date.now();
   const ago = (seconds: number) => now - seconds * 1000;
   const postAuthor = postAuthorOf(postId);
   const records: CommentRecord[] = [];

   const add = (
      parentId: string | null,
      author: string,
      content: string,
      createdAt: number,
      options: { isPrivate?: boolean; deleted?: boolean; mention?: string | null } = {},
   ) => {
      const record: CommentRecord = {
         id: nextId(postId),
         postId,
         parentId,
         author,
         content,
         isPrivate: options.isPrivate ?? false,
         deleted: options.deleted ?? false,
         mention: options.mention ?? null,
         createdAt,
      };
      records.push(record);
      return record;
   };

   // 시안과 같은 상황을 볼 수 있게 만든 스레드들 (최신 댓글부터)
   // 1) 답글이 많은 스레드: 비공개 답글, 게시물 작성자의 답글(멘션 포함)이 섞여 있다.
   const thread = add(null, '사장님D', '위치가 딱 저희 동네네요!', ago(180));
   add(thread.id, '동네빵집', '저도 근처라 조만간 들러볼게요.', ago(170));
   add(thread.id, '오픈축하해요', '가까운 곳이라 주말에 방문해볼게요!', ago(150));
   add(thread.id, '카페오룻', '주차는 가게 앞에 할 수 있나요?', ago(130), { isPrivate: true });
   add(thread.id, '떡볶이좋아', '사진만 봐도 분위기가 정말 따뜻해 보여요.', ago(110));
   add(thread.id, '우리동네사장', '오픈 준비하시느라 고생 많으셨어요.', ago(90));
   add(thread.id, postAuthor, '따뜻한 말씀 감사해요. 편하게 놀러 오세요!', ago(70), {
      mention: '동네빵집',
   });
   add(thread.id, '동네빵집', '네! 꼭 들를게요.', ago(50), { mention: postAuthor });
   add(thread.id, '사장님D', '다들 반가워요 :)', ago(30));

   // 2) 비공개 댓글: 게시물 작성자와 쓴 사람만 볼 수 있다.
   add(null, '카페오룻', '자세한 위치를 메시지로 여쭤봐도 될까요?', ago(720), { isPrivate: true });
   // 3) 다른 사람의 비공개 댓글: 게시물 작성자가 아니면 "비공개 댓글이에요." 한 줄만 보인다.
   add(null, '꽃집친구', '혹시 단체 예약도 가능한가요?', ago(780), { isPrivate: true });
   // 4) 삭제된 댓글 + 남은 답글
   const deleted = add(null, '골목친구', '지워진 댓글이에요.', ago(840), { deleted: true });
   add(deleted.id, '이웃사장', '저도 소식 기다리고 있었어요.', ago(800));
   // 5) 일반 댓글들
   add(null, '동네빵집', '저도 가보고 싶어요!', ago(1080));
   add(null, '소소한식탁', '분위기가 따뜻해 보여요.', ago(1320));

   // 아래 페이지를 위한 오래된 댓글들 (일부는 답글이 있다.)
   for (let index = 0; index < 18; index += 1) {
      const author = FILLER_AUTHORS[index % FILLER_AUTHORS.length];
      const text = FILLER_TEXTS[index % FILLER_TEXTS.length];
      const root = add(null, author, text, ago(1800 + index * 900));
      if (index % 4 === 0) {
         add(
            root.id,
            FILLER_AUTHORS[(index + 2) % FILLER_AUTHORS.length],
            '저도 그렇게 생각해요.',
            ago(1700 + index * 900),
         );
      }
   }

   return records;
}

export function getRecords(postId: string): CommentRecord[] {
   let records = store.get(postId);
   if (!records) {
      records = seed(postId);
      store.set(postId, records);
   }
   return records;
}

export function findRecord(id: string): CommentRecord | null {
   const separator = id.lastIndexOf('~');
   if (separator < 0) return null;
   return getRecords(id.slice(0, separator)).find((record) => record.id === id) ?? null;
}

export function createRecord(
   postId: string,
   fields: Pick<CommentRecord, 'parentId' | 'author' | 'content' | 'isPrivate' | 'mention'>,
): CommentRecord {
   const record: CommentRecord = {
      id: nextId(postId),
      postId,
      deleted: false,
      createdAt: Date.now(),
      ...fields,
   };
   getRecords(postId).push(record);
   return record;
}

// 그 댓글을 볼 수 있는 사람: 공개 댓글은 누구나, 비공개 댓글은 게시물 작성자 + 쓴 사람 + (대댓글이면) 스레드 최상위 댓글 작성자
export function canView(
   record: CommentRecord,
   root: CommentRecord | null,
   viewer: string | null,
   postAuthor: string,
): boolean {
   if (!record.isPrivate) return true;
   if (!viewer) return false;
   return (
      viewer === postAuthor || viewer === record.author || (root !== null && viewer === root.author)
   );
}

export function findRoot(record: CommentRecord): CommentRecord | null {
   if (record.parentId === null) return null;
   return getRecords(record.postId).find((item) => item.id === record.parentId) ?? null;
}

// 서버가 하는 일: 보는 사람(viewer)에 맞춰 숨길 것은 숨기고, 할 수 있는 동작(canReply, canDelete)을 계산해 내려준다.
export function toView(record: CommentRecord, viewer: string | null): CommentView {
   const postAuthor = postAuthorOf(record.postId);
   const root = findRoot(record);
   const visible = !record.deleted && canView(record, root, viewer, postAuthor);
   const status: CommentStatus = record.deleted
      ? 'deleted'
      : visible
        ? 'visible'
        : 'private_hidden';

   const isRoot = record.parentId === null;
   const replyCount =
      isRoot && status !== 'private_hidden'
         ? getRecords(record.postId).filter((item) => item.parentId === record.id).length
         : 0;

   // 이 작성자가 내(viewer) 비공개 답글을 볼 수 있는지: 게시물 작성자, 스레드 최상위 댓글 작성자, 나
   const threadOwner = root?.author ?? record.author;
   const authorCanViewPrivateReply =
      visible &&
      (record.author === postAuthor || record.author === threadOwner || record.author === viewer);

   return {
      id: record.id,
      postId: record.postId,
      parentId: record.parentId,
      status,
      authorNickname: visible ? record.author : null,
      content: visible ? record.content : null,
      isPrivate: visible ? record.isPrivate : false,
      isPostAuthor: visible && record.author === postAuthor,
      mentionNickname: visible ? record.mention : null,
      createdAt: new Date(record.createdAt).toISOString(),
      replyCount,
      canReply: viewer !== null && visible,
      canDelete: viewer !== null && viewer === record.author && !record.deleted,
      authorCanViewPrivateReply,
   };
}
