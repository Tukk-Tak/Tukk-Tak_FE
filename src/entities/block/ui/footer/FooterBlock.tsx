import type { ReactNode } from 'react';
import {
   getCopyrightText,
   getSocialLinks,
   textOrUndefined,
   type SocialLink,
} from '../../model/footer';
import type { FooterSection } from '../../types';

// simple: 상호명과 정보를 가운데 정렬 한두 줄로 압축한다. (email, businessInfo 값은 보존하고 표시하지 않는다)
// info: 상호명/연락처/추가 정보를 3열로 나눈다. 블록 폭이 좁으면 1열로 쌓이고, 값이 없는 열은 숨긴다.
// 두 variant 모두 값이 비어 있는 줄은 보이지 않는다.
export function FooterBlock({ section }: { section: FooterSection }) {
   return section.variant === 'info' ? (
      <InfoFooter content={section.content} />
   ) : (
      <SimpleFooter content={section.content} />
   );
}

function SimpleFooter({ content }: { content: FooterSection['content'] }) {
   const details = [
      textOrUndefined(content.address),
      textOrUndefined(content.phone),
      textOrUndefined(content.hours),
   ].filter((value) => value !== undefined);
   const socials = getSocialLinks(content.social);

   return (
      <footer className="flex flex-col items-center gap-4 text-center">
         <p className="text-lg font-bold text-site-text">{content.brandName}</p>
         {(details.length > 0 || socials.length > 0) && (
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-site-text-muted">
               {details.map((value) => (
                  <span key={value}>{value}</span>
               ))}
               <SocialLinks links={socials} />
            </div>
         )}
         <Divider />
         <Copyright content={content} />
      </footer>
   );
}

function InfoFooter({ content }: { content: FooterSection['content'] }) {
   const address = textOrUndefined(content.address);
   const phone = textOrUndefined(content.phone);
   const hours = textOrUndefined(content.hours);
   const email = textOrUndefined(content.email);
   const representative = textOrUndefined(content.businessInfo?.representative);
   const registrationNumber = textOrUndefined(content.businessInfo?.registrationNumber);
   const socials = getSocialLinks(content.social);

   const hasContact = Boolean(phone || hours);
   const hasMore = Boolean(socials.length > 0 || email || representative || registrationNumber);

   return (
      <footer className="flex flex-col gap-8">
         <div className="grid gap-8 @2xl:auto-cols-fr @2xl:grid-flow-col">
            <Column>
               <p className="text-lg font-bold text-site-text">{content.brandName}</p>
               {address && <Line>{address}</Line>}
            </Column>
            {hasContact && (
               <Column label="연락처">
                  {phone && <Line>{phone}</Line>}
                  {hours && <Line>{hours}</Line>}
               </Column>
            )}
            {hasMore && (
               <Column label="정보">
                  {socials.length > 0 && (
                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-site-text-muted">
                        <SocialLinks links={socials} />
                     </div>
                  )}
                  {email && <Line>{email}</Line>}
                  {representative && <Line label="대표자">{representative}</Line>}
                  {registrationNumber && <Line label="사업자등록번호">{registrationNumber}</Line>}
               </Column>
            )}
         </div>
         <Divider />
         <Copyright content={content} />
      </footer>
   );
}

function Column({ label, children }: { label?: string; children: ReactNode }) {
   return (
      <div className="flex flex-col gap-2">
         {label && <p className="text-sm font-bold text-site-text">{label}</p>}
         {children}
      </div>
   );
}

// 줄바꿈은 입력한 그대로 보여 준다. (영업시간처럼 여러 줄로 적는 경우)
function Line({ label, children }: { label?: string; children: ReactNode }) {
   return (
      <p className="text-sm whitespace-pre-line text-site-text-muted">
         {label && <span className="mr-2 text-site-text">{label}</span>}
         {children}
      </p>
   );
}

function SocialLinks({ links }: { links: SocialLink[] }) {
   return links.map(({ label, href }) => (
      <a
         key={href}
         href={href}
         target="_blank"
         rel="noopener noreferrer"
         className="hover:text-site-text"
      >
         {label}
      </a>
   ));
}

function Divider() {
   return <div aria-hidden className="h-px w-full bg-site-border" />;
}

function Copyright({ content }: { content: FooterSection['content'] }) {
   return <small className="text-xs text-site-text-muted">{getCopyrightText(content)}</small>;
}
