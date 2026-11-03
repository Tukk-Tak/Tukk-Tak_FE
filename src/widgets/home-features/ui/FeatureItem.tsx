interface FeatureItemProps {
   title: string;
   description: string;
}

export function FeatureItem({ title, description }: FeatureItemProps) {
   return (
      <div>
         <h3 className="text-brand-orange text-sm font-bold">{title}</h3>
         <p className="mt-1.5 text-sm text-black/50">{description}</p>
      </div>
   );
}
