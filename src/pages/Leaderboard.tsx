import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LeaderboardProps {
  onNavigate: (page: string) => void;
}

export default function Leaderboard({ onNavigate }: LeaderboardProps) {
  const leaderboardData = [
    { rank: 1, name: 'Александр', score: 15420, avatar: 'А', color: 'from-primary to-secondary' },
    { rank: 2, name: 'Мария', score: 14890, avatar: 'М', color: 'from-secondary to-accent' },
    { rank: 3, name: 'Дмитрий', score: 13200, avatar: 'Д', color: 'from-accent to-primary' },
    { rank: 4, name: 'Елена', score: 11750, avatar: 'Е', color: 'from-primary to-accent' },
    { rank: 5, name: 'Игорь', score: 10950, avatar: 'И', color: 'from-secondary to-primary' },
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
          <h1 className="text-2xl font-bold">Рейтинг</h1>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/20"
          >
            <Icon name="Filter" size={24} />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="border-primary bg-primary/10">
            Сегодня
          </Button>
          <Button variant="outline" className="border-primary/20">
            Неделя
          </Button>
          <Button variant="outline" className="border-primary/20">
            Всё время
          </Button>
        </div>

        <div className="space-y-3">
          {leaderboardData.map((player, index) => (
            <Card
              key={index}
              className={`p-4 border-0 ${
                player.rank <= 3
                  ? `bg-gradient-to-r ${player.color} animate-glow`
                  : 'bg-card border border-primary/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    player.rank === 1
                      ? 'bg-yellow-500 text-white'
                      : player.rank === 2
                      ? 'bg-gray-300 text-gray-800'
                      : player.rank === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {player.rank}
                </div>
                <Avatar className={`w-12 h-12 ${player.rank <= 3 ? 'border-2 border-white' : ''}`}>
                  <AvatarFallback className={player.rank <= 3 ? 'bg-white/20 text-white' : ''}>
                    {player.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className={`font-semibold ${player.rank <= 3 ? 'text-white' : ''}`}>
                    {player.name}
                  </h3>
                  <p className={`text-sm ${player.rank <= 3 ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {player.score.toLocaleString()} очков
                  </p>
                </div>
                {player.rank === 1 && <Icon name="Crown" size={24} className="text-yellow-300" />}
                {player.rank === 2 && <Icon name="Medal" size={24} className="text-gray-400" />}
                {player.rank === 3 && <Icon name="Medal" size={24} className="text-amber-700" />}
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-4 bg-muted/50 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-primary text-white">
              42
            </div>
            <Avatar className="w-12 h-12">
              <AvatarFallback>Ты</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">Твоя позиция</h3>
              <p className="text-sm text-muted-foreground">
                {localStorage.getItem('blockBlastHighScore') || '0'} очков
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
