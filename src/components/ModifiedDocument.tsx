import { useState } from 'react';
import { Download, Eye, RotateCcw, Undo2 } from 'lucide-react';
import { AnalysisResult, FeedbackItem } from '@/lib/types';

interface ModifiedDocumentProps {
  result: AnalysisResult;
  acceptedSuggestions: Set<string>;
  onToggleChange: (id: string) => void;
}

const ModifiedDocument = ({ result, acceptedSuggestions, onToggleChange }: ModifiedDocumentProps) => {
  const [showPreview, setShowPreview] = useState(true);
  const [revertedIds, setRevertedIds] = useState<Set<string>>(new Set());

  const allFeedback = [
    ...result.feedback.structure,
    ...result.feedback.citations,
    ...result.feedback.grammar,
    ...result.feedback.style,
  ];

  const appliedChanges = allFeedback.filter((f) => {
    if (revertedIds.has(f.id)) return false;
    if (f.type === 'issue' || f.type === 'warning') return true;
    if (f.type === 'suggestion') return acceptedSuggestions.has(f.id);
    return false;
  }).filter(f => f.original && f.suggested);

  const getUnderlineClass = (type: string) => {
    switch (type) {
      case 'issue': return 'issue-underline';
      case 'warning': return 'warning-underline';
      case 'suggestion': return 'suggestion-underline';
      default: return '';
    }
  };

  const getHighlightedDocument = () => {
    let text = result.documentText;
    const replacements: { original: string; replacement: string; type: string; id: string }[] = [];

    appliedChanges.forEach((f) => {
      if (f.original && f.suggested && text.includes(f.original)) {
        replacements.push({ original: f.original, replacement: f.suggested, type: f.type, id: f.id });
      }
    });

    replacements.sort((a, b) => b.original.length - a.original.length);

    const segments: { text: string; change?: typeof replacements[0]; isOriginal?: boolean }[] = [];

    const positioned = replacements.map((r) => {
      const idx = text.indexOf(r.original);
      return { ...r, index: idx };
    }).filter(r => r.index !== -1).sort((a, b) => a.index - b.index);

    let cursor = 0;
    for (const rep of positioned) {
      if (rep.index < cursor) continue;
      if (rep.index > cursor) {
        segments.push({ text: text.slice(cursor, rep.index) });
      }
      segments.push({ text: rep.replacement, change: rep });
      cursor = rep.index + rep.original.length;
    }
    if (cursor < text.length) {
      segments.push({ text: text.slice(cursor) });
    }

    return segments;
  };

  const segments = getHighlightedDocument();

  const handleRevert = (id: string) => {
    setRevertedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    onToggleChange(id);
  };

  const handleDownload = () => {
    let finalText = segments.map(s => s.text).join('');
    const blob = new Blob([finalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `REVIORA_Modified_${result.fileName.replace(/\.[^.]+$/, '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-display font-semibold text-foreground">Modified Document</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {appliedChanges.length} changes applied • Issues & warnings auto-applied, suggestions applied by your choice
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted transition-colors text-foreground"
          >
            <Eye size={14} />
            {showPreview ? 'Hide' : 'Preview'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="p-6 max-h-[600px] overflow-y-auto">
          <div className="mb-4 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-issue inline-block rounded" /> Issue fix
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-warning inline-block rounded" /> Warning fix
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-suggestion inline-block rounded" /> Suggestion
            </span>
          </div>
          <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap font-serif leading-relaxed text-sm">
            {segments.map((seg, i) =>
              seg.change ? (
                <span key={i} className="group relative inline">
                  <span className={`${getUnderlineClass(seg.change.type)} cursor-pointer`}>
                    {seg.text}
                  </span>
                  <button
                    onClick={() => handleRevert(seg.change!.id)}
                    className="ml-1 inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Revert to original"
                  >
                    <Undo2 size={12} className="text-muted-foreground hover:text-foreground" />
                  </button>
                  {/* Tooltip showing original */}
                  <span className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10 bg-card border border-border rounded-lg p-2 shadow-elevated max-w-xs">
                    <span className="text-xs text-muted-foreground block mb-1">Original:</span>
                    <span className="text-xs text-foreground italic">"{seg.change.original}"</span>
                    <span className="text-xs text-muted-foreground block mt-1">Fix:</span>
                    <span className="text-xs text-foreground">"{seg.change.replacement}"</span>
                  </span>
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifiedDocument;
