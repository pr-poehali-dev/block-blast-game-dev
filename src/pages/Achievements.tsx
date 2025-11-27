import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface AchievementsProps {
  onNavigate: (page: string) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function Achievements({ onNavigate }: AchievementsProps) {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Первые шаги',
      description: 'Набери 1000 очков',
      icon: 'Flag',
      progress: 1000,
      total: 1000,
      unlocked: true,
      rarity: 'common',
    },
    {
      id: '2',
      title: 'Мастер комбо',
      description: 'Собери комбо x10',
      icon: 'Zap',
      progress: 8,
      total: 10,
      unlocked: false,
      rarity: 'rare',
    },
    {
      id: '3',
      title: 'Марафонец',
      description: 'Сыграй 50 игр',
      icon: 'Gamepad2',
      progress: 23,
      total: 50,
      unlocked: false,
      rarity: 'epic',
    },
    {
      id: '4',
      title: 'Легенда',
      description: 'Набери 10000 очков за игру',
      icon: 'Crown',
      progress: 0,
      total: 1,
      unlocked: false,
      rarity: 'legendary',
    },
    {
      id: '5',
      title: 'Быстрые пальцы',
      description: 'Сделай 100 ходов за минуту',
      icon: 'Timer',
      progress: 67,
      total: 100,
      unlocked: false,
      rarity: 'rare',
    },
    {
      id: '6',
      title: 'Коллекционер',
      description: 'Разблокируй все достижения',
      icon: 'Trophy',
      progress: 1,
      total: 10,
      unlocked: false,
      rarity: 'legendary',
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-500 to-gray-600';
      case 'rare':
        return 'from-blue-500 to-blue-600';
      case 'epic':
        return 'from-purple-500 to-purple-600';
      case 'legendary':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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
          <h1 className="text-2xl font-bold">Достижения</h1>
          <div className="w-10" />
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-r from-primary to-secondary border-0 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold">{unlockedCount}/{achievements.length}</h2>
              <p className="text-white/80">Разблокировано</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Award" size={32} />
            </div>
          </div>
          <Progress value={(unlockedCount / achievements.length) * 100} className="h-2" />
        </Card>

        <div className="space-y-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-4 border-0 transition-all ${
                achievement.unlocked
                  ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} animate-glow`
                  : 'bg-card border border-primary/20 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    achievement.unlocked ? 'bg-white/20' : 'bg-muted'
                  }`}
                >
                  <Icon
                    name={achievement.icon as any}
                    size={24}
                    className={achievement.unlocked ? 'text-white' : 'text-muted-foreground'}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${achievement.unlocked ? 'text-white' : ''}`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && <Icon name="Check" size={16} className="text-white" />}
                  </div>
                  <p
                    className={`text-sm mb-2 ${
                      achievement.unlocked ? 'text-white/80' : 'text-muted-foreground'
                    }`}
                  >
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="text-muted-foreground">
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <Progress
                        value={(achievement.progress / achievement.total) * 100}
                        className="h-1"
                      />
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
