import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Lightbulb, HelpCircle } from 'lucide-react';
import { FeedbackItem as FeedbackItemType } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FeedbackItemProps {
  item: FeedbackItemType;
  onAcceptSuggestion?: (id: string) => void;
  accepted?: boolean;
}

const FeedbackItemComponent = ({ item, onAcceptSuggestion, accepted }: FeedbackItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const typeStyles = {
    issue: {
      border: 'border-l-issue',
      bg: 'bg-issue-bg',
      badge: 'bg-issue text-primary-foreground',
      label: 'Issue',
    },
    warning: {
      border: 'border-l-warning',
      bg: 'bg-warning-bg',
      badge: 'bg-warning text-warning-foreground',
      label: 'Warning',
    },
    suggestion: {
      border: 'border-l-suggestion',
      bg: 'bg-suggestion-bg',
      badge: 'bg-suggestion text-primary-foreground',
      label: 'Suggestion',
    },
  };

  const style = typeStyles[item.type];

  const handleCopy = async () => {
    if (item.suggested) {
      await navigator.clipboard.writeText(item.suggested);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`rounded-lg border-l-4 ${style.border} ${style.bg} p-4 transition-all duration-200 hover:shadow-sm`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}>
              {style.label}
            </span>
            <span className="text-xs text-muted-foreground">{item.location}</span>
            {accepted && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-suggestion text-primary-foreground">
                ✅ Applied (blue underline in document)
              </span>
            )}
          </div>
          <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-card text-muted-foreground hover:text-foreground transition-colors">
                <HelpCircle size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm"><strong>Why this suggestion?</strong></p>
              <p className="text-sm text-muted-foreground mt-1">{item.reason}</p>
            </TooltipContent>
          </Tooltip>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-md hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-3 animate-fade-in-up">
          {item.original && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Original</p>
              <p className="text-sm bg-card p-2 rounded border border-border italic text-foreground">
                "{item.original}"
              </p>
            </div>
          )}
          {item.suggested && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb size={14} className="text-suggestion" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested Fix</p>
              </div>
              <p className="text-sm bg-card p-2 rounded border border-suggestion/30 text-foreground">
                "{item.suggested}"
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-card border border-border hover:bg-muted transition-colors text-foreground"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy Fix'}
                </button>
                {item.type === 'suggestion' && onAcceptSuggestion && !accepted && (
                  <button
                    onClick={() => onAcceptSuggestion(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    <Check size={12} />
                    Apply to Document
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackItemComponent;
