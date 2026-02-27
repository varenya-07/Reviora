import { useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  onAnalyze: () => void;
  onDemo: () => void;
  isAnalyzing: boolean;
}

const FileUpload = ({ file, onFileSelect, onFileClear, onAnalyze, onDemo, isAnalyzing }: FileUploadProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && isValidFile(droppedFile)) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && isValidFile(selected)) {
      onFileSelect(selected);
    }
  };

  const isValidFile = (f: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    return validTypes.includes(f.type) || f.name.endsWith('.txt') || f.name.endsWith('.docx') || f.name.endsWith('.pdf');
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-card"
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          className="hidden"
          id="thesis-upload"
        />
        <label htmlFor="thesis-upload" className="cursor-pointer">
          <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">
            Upload Your Thesis
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            Drag & drop your file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, DOCX, TXT
          </p>
        </label>
      </div>

      {file && (
        <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
          <FileText size={20} className="text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={onFileClear}
            className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAnalyze}
          disabled={!file || isAnalyzing}
          className="flex-1 px-6 py-3 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing...
            </span>
          ) : (
            'Analyze Thesis'
          )}
        </button>
        <button
          onClick={onDemo}
          disabled={isAnalyzing}
          className="px-6 py-3 rounded-lg font-semibold text-sm border border-border bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          Try with Sample Thesis
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
