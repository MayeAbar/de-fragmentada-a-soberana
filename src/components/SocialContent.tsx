import { useState } from 'react';
import { Copy, Check, Video, Camera } from 'lucide-react';

type Tab = 'tiktok' | 'instagram';

interface SocialContentProps {
  tiktokScript: string | null;
  instagramText: string | null;
}

export default function SocialContent({ tiktokScript, instagramText }: SocialContentProps) {
  const [tab, setTab] = useState<Tab>('tiktok');
  const [copied, setCopied] = useState(false);

  const content = tab === 'tiktok' ? tiktokScript : instagramText;
  const hasContent = content && content.trim().length > 0;

  function handleCopy() {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-6 rounded-2xl border border-gold/30 overflow-hidden">
      <div className="flex border-b border-gold/20 bg-gold/5">
        <button
          onClick={() => setTab('tiktok')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[12px] font-medium tracking-wide transition-colors ${
            tab === 'tiktok' ? 'text-gold bg-gold/10' : 'text-[#8A8079] hover:text-[#5C544D]'
          }`}
        >
          <Video className="w-3.5 h-3.5" strokeWidth={1.5} />
          TikTok / Reels
        </button>
        <button
          onClick={() => setTab('instagram')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[12px] font-medium tracking-wide transition-colors ${
            tab === 'instagram' ? 'text-gold bg-gold/10' : 'text-[#8A8079] hover:text-[#5C544D]'
          }`}
        >
          <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
          Instagram / Facebook
        </button>
      </div>

      <div className="p-5 lg:p-6 bg-[#EFECE6]/50 relative">
        {hasContent ? (
          <>
            <p className="text-sm text-[#3D3833] leading-[1.7] font-light whitespace-pre-wrap pr-10">
              {content}
            </p>
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-nude grid place-items-center text-[#8A8079] hover:text-gold hover:border-gold/50 transition-colors"
              aria-label="Copiar"
            >
              {copied ? (
                <Check className="w-4 h-4 text-gold" strokeWidth={1.5} />
              ) : (
                <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
              )}
            </button>
            {copied && (
              <p className="mt-3 text-[11px] text-gold font-medium animate-fade-in">
                Copiado al portapapeles
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-[#8A8079] italic font-light">
            {tab === 'tiktok'
              ? 'No hay guion de TikTok para esta entrada.'
              : 'No hay texto de Instagram para esta entrada.'}
          </p>
        )}
      </div>
    </div>
  );
}
