import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GameStatsProps {
  score: number;
  combo: number;
  highScore: number;
}

export default function GameStats({ score, combo, highScore }: GameStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="p-4 bg-gradient-to-br from-primary to-secondary border-0 animate-glow">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="Trophy" size={20} className="text-white" />
          <span className="text-sm text-white/80">Очки</span>
        </div>
        <div className="text-3xl font-bold text-white">{score.toLocaleString()}</div>
      </Card>

      <Card className={`p-4 border-0 transition-all duration-300 ${combo > 0 ? 'bg-gradient-to-br from-accent to-secondary animate-combo-pulse' : 'bg-card'}`}>
        <div className="flex items-center gap-2 mb-1">
          <Icon name="Zap" size={20} className={combo > 0 ? 'text-white' : 'text-muted-foreground'} />
          <span className={`text-sm ${combo > 0 ? 'text-white/80' : 'text-muted-foreground'}`}>Комбо</span>
        </div>
        <div className={`text-3xl font-bold ${combo > 0 ? 'text-white' : 'text-foreground'}`}>
          {combo > 0 ? `x${combo}` : '—'}
        </div>
      </Card>

      <Card className="p-4 bg-card border border-primary/20">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="Star" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">Рекорд</span>
        </div>
        <div className="text-3xl font-bold text-foreground">{highScore.toLocaleString()}</div>
      </Card>
    </div>
  );
}
