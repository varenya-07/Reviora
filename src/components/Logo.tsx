import { FileText, CheckCircle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Logo = ({ size = 'md', variant = 'dark' }: LogoProps) => {
  const sizeMap = {
    sm: { icon: 20, text: 'text-xl' },
    md: { icon: 28, text: 'text-2xl' },
    lg: { icon: 40, text: 'text-4xl' },
  };

  const s = sizeMap[size];
  const colorClass = variant === 'light' ? 'text-primary-foreground' : 'text-primary';

  return (
    <div className={`flex items-center gap-2 ${colorClass}`}>
      <div className="relative">
        <FileText size={s.icon} strokeWidth={1.8} />
        <CheckCircle
          size={s.icon * 0.45}
          strokeWidth={2.5}
          className="absolute -bottom-0.5 -right-1 text-accent"
          fill="hsl(var(--accent))"
          stroke="hsl(var(--card))"
        />
      </div>
      <span className={`${s.text} font-display font-bold tracking-tight`}>
        REVIORA
      </span>
    </div>
  );
};

export default Logo;
