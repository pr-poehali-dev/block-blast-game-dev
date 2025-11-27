import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const highScore = localStorage.getItem('blockBlastHighScore') || '0';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-float">
          <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Block Blast
          </h1>
          <p className="text-muted-foreground">Головоломка с комбо</p>
        </div>

        <Card className="p-8 mb-6 bg-gradient-to-br from-card to-card/50 border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Icon name="Star" size={24} className="text-primary" />
              <span className="text-sm text-muted-foreground">Твой рекорд</span>
            </div>
            <div className="text-3xl font-bold">{parseInt(highScore).toLocaleString()}</div>
          </div>

          <Button
            onClick={() => onNavigate('game')}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            <Icon name="Play" size={24} className="mr-2" />
            Играть
          </Button>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => onNavigate('profile')}
            className="flex-col h-20 border-primary/20 hover:bg-primary/10"
          >
            <Icon name="User" size={24} className="mb-1" />
            <span className="text-xs">Профиль</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('leaderboard')}
            className="flex-col h-20 border-primary/20 hover:bg-primary/10"
          >
            <Icon name="Trophy" size={24} className="mb-1" />
            <span className="text-xs">Рейтинг</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('achievements')}
            className="flex-col h-20 border-primary/20 hover:bg-primary/10"
          >
            <Icon name="Award" size={24} className="mb-1" />
            <span className="text-xs">Награды</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
