import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const highScore = localStorage.getItem('blockBlastHighScore') || '0';
  const gamesPlayed = localStorage.getItem('blockBlastGamesPlayed') || '0';

  const stats = [
    { icon: 'Trophy', label: 'Рекорд', value: parseInt(highScore).toLocaleString() },
    { icon: 'Gamepad2', label: 'Игр сыграно', value: gamesPlayed },
    { icon: 'Target', label: 'Точность', value: '87%' },
    { icon: 'Zap', label: 'Макс комбо', value: 'x12' },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('home')}
            className="hover:bg-primary/20"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h1 className="text-2xl font-bold">Профиль</h1>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/20"
          >
            <Icon name="Settings" size={24} />
          </Button>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-br from-primary to-secondary border-0 text-white">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarFallback className="bg-white/20 text-2xl">И</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">Игрок</h2>
              <p className="text-white/80">Уровень 15</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>До уровня 16</span>
              <span>750 / 1000 XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-3/4 rounded-full" />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 bg-card border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={stat.icon as any} size={20} className="text-primary" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-card border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            Последние игры
          </h3>
          <div className="space-y-3">
            {[
              { score: 4500, combo: 8, date: 'Сегодня' },
              { score: 3200, combo: 5, date: 'Вчера' },
              { score: 5100, combo: 12, date: '2 дня назад' },
            ].map((game, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <div className="font-semibold">{game.score.toLocaleString()} очков</div>
                  <div className="text-sm text-muted-foreground">Комбо x{game.combo}</div>
                </div>
                <div className="text-sm text-muted-foreground">{game.date}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
