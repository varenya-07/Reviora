import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, AlertCircle, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react';
import Logo from '@/components/Logo';
import ScoreSpinner from '@/components/ScoreSpinner';
import FileUpload from '@/components/FileUpload';
import FeedbackItemComponent from '@/components/FeedbackItemComponent';
import ModifiedDocument from '@/components/ModifiedDocument';
import { mockAnalysisResult } from '@/lib/mockData';
import { AnalysisResult, FeedbackItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Category = 'structure' | 'citations' | 'grammar' | 'style';

const categoryConfig: Record<Category, { label: string; icon: React.ElementType; emoji: string }> = {
  structure: { label: 'Structure', icon: BookOpen, emoji: '📐' },
  citations: { label: 'Citations', icon: BookOpen, emoji: '📚' },
  grammar: { label: 'Grammar', icon: BookOpen, emoji: '✏️' },
  style: { label: 'Style', icon: BookOpen, emoji: '🎨' },
};

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('structure');
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());
  const [revertedChanges, setRevertedChanges] = useState<Set<string>>(new Set());
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.loadDemo) {
      handleDemo();
    }
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({ ...mockAnalysisResult, fileName: file?.name || 'Uploaded_Thesis.pdf' });
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleDemo = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(mockAnalysisResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleAcceptSuggestion = (id: string) => {
    setAcceptedSuggestions((prev) => new Set([...prev, id]));
  };

  const handleToggleChange = (id: string) => {
    setRevertedChanges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNewFile = () => {
    setFile(null);
    setResult(null);
    setAcceptedSuggestions(new Set());
    setRevertedChanges(new Set());
    setActiveCategory('structure');
  };

  const getCounts = (items: FeedbackItem[]) => ({
    issues: items.filter((i) => i.type === 'issue').length,
    warnings: items.filter((i) => i.type === 'warning').length,
    suggestions: items.filter((i) => i.type === 'suggestion').length,
    total: items.length,
  });

  const scrollToFeedback = (cat: Category) => {
    setActiveCategory(cat);
    feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Build effective accepted set (accepted suggestions minus reverted)
  const effectiveAccepted = new Set(
    [...acceptedSuggestions].filter((id) => !revertedChanges.has(id))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <Logo size="sm" />
          </div>
          {result && (
            <button
              onClick={handleNewFile}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              <Plus size={16} />
              Analyze Another File
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!result && !isAnalyzing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                Analyze Your Thesis
              </h1>
              <p className="text-muted-foreground">
                Upload your thesis document and get detailed AI-powered feedback
              </p>
            </div>
            <div className="max-w-xl mx-auto">
              <FileUpload
                file={file}
                onFileSelect={setFile}
                onFileClear={() => setFile(null)}
                onAnalyze={handleAnalyze}
                onDemo={handleDemo}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              Analyzing Your Thesis...
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Our AI agent is reviewing structural flow, citation consistency, grammar, and style. This may take a moment.
            </p>
          </motion.div>
        )}

        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Document Title & Summary */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-card">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">{result.fileName}</h2>
                  <p className="text-xs text-muted-foreground">Analyzed just now</p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">📝 AI Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {/* Overall Score + Category Scores */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-6">Feedback Scorecard</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="text-center">
                  <ScoreSpinner score={result.overallScore} label="Overall Score" size={130} />
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {(Object.keys(categoryConfig) as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => scrollToFeedback(cat)}
                      className="flex flex-col items-center hover:opacity-80 transition-opacity"
                    >
                      <ScoreSpinner
                        score={result.scores[cat]}
                        label={`${categoryConfig[cat].emoji} ${categoryConfig[cat].label}`}
                        size={90}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden" ref={feedbackRef}>
              <div className="flex border-b border-border overflow-x-auto">
                {(Object.keys(categoryConfig) as Category[]).map((cat) => {
                  const counts = getCounts(result.feedback[cat]);
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-1 min-w-[140px] px-4 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                        isActive
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span className="block font-display">
                        {categoryConfig[cat].emoji} {categoryConfig[cat].label}
                      </span>
                      <div className="flex items-center justify-center gap-2 mt-1.5">
                        {counts.issues > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full bg-issue/10 text-issue">
                                <AlertCircle size={10} /> {counts.issues}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{counts.issues} issues found</TooltipContent>
                          </Tooltip>
                        )}
                        {counts.warnings > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full bg-warning/10 text-warning">
                                <AlertTriangle size={10} /> {counts.warnings}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{counts.warnings} warnings</TooltipContent>
                          </Tooltip>
                        )}
                        {counts.suggestions > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full bg-suggestion/10 text-suggestion">
                                <Lightbulb size={10} /> {counts.suggestions}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{counts.suggestions} suggestions</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Items */}
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-semibold text-foreground">
                    {categoryConfig[activeCategory].emoji} {categoryConfig[activeCategory].label} Feedback
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {result.feedback[activeCategory].length} items
                  </span>
                </div>
                {result.feedback[activeCategory].map((item) => (
                  <FeedbackItemComponent
                    key={item.id}
                    item={item}
                    onAcceptSuggestion={handleAcceptSuggestion}
                    accepted={acceptedSuggestions.has(item.id)}
                  />
                ))}
              </div>
            </div>

            {/* Modified Document */}
            <ModifiedDocument
              result={result}
              acceptedSuggestions={effectiveAccepted}
              onToggleChange={handleToggleChange}
            />

            {/* Add More Files */}
            <div className="text-center py-6">
              <button
                onClick={handleNewFile}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity shadow-glow"
              >
                <Plus size={20} />
                Analyze Another File
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Analysis;
