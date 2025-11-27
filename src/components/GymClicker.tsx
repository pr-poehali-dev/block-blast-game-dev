import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  icon: string;
  effect: number;
}

export default function GymClicker() {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('gymClickerCoins');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('gymClickerLevel');
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [experience, setExperience] = useState(() => {
    const saved = localStorage.getItem('gymClickerExp');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [clickPower, setClickPower] = useState(() => {
    const saved = localStorage.getItem('gymClickerClickPower');
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [autoClickRate, setAutoClickRate] = useState(() => {
    const saved = localStorage.getItem('gymClickerAutoClick');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [clickAnimation, setClickAnimation] = useState(false);
  const [totalClicks, setTotalClicks] = useState(() => {
    const saved = localStorage.getItem('gymClickerTotalClicks');
    return saved ? parseInt(saved, 10) : 0;
  });

  const { toast } = useToast();

  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    const saved = localStorage.getItem('gymClickerUpgrades');
    return saved ? JSON.parse(saved) : [
      {
        id: 'power',
        name: 'Сила клика',
        description: 'Увеличивает монеты за клик',
        cost: 10,
        level: 0,
        icon: 'Zap',
        effect: 1,
      },
      {
        id: 'auto',
        name: 'Автотренер',
        description: 'Автоматические монеты в секунду',
        cost: 50,
        level: 0,
        icon: 'Cpu',
        effect: 1,
      },
      {
        id: 'multiplier',
        name: 'Протеин',
        description: 'Множитель опыта x1.5',
        cost: 100,
        level: 0,
        icon: 'TrendingUp',
        effect: 1.5,
      },
      {
        id: 'gym',
        name: 'VIP зал',
        description: '+10 монет за клик',
        cost: 200,
        level: 0,
        icon: 'Dumbbell',
        effect: 10,
      },
    ];
  });

  const expToNextLevel = level * 100;

  useEffect(() => {
    localStorage.setItem('gymClickerCoins', coins.toString());
    localStorage.setItem('gymClickerLevel', level.toString());
    localStorage.setItem('gymClickerExp', experience.toString());
    localStorage.setItem('gymClickerClickPower', clickPower.toString());
    localStorage.setItem('gymClickerAutoClick', autoClickRate.toString());
    localStorage.setItem('gymClickerTotalClicks', totalClicks.toString());
    localStorage.setItem('gymClickerUpgrades', JSON.stringify(upgrades));
  }, [coins, level, experience, clickPower, autoClickRate, totalClicks, upgrades]);

  useEffect(() => {
    if (autoClickRate > 0) {
      const interval = setInterval(() => {
        setCoins((prev) => prev + autoClickRate);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoClickRate]);

  useEffect(() => {
    if (experience >= expToNextLevel) {
      setLevel((prev) => prev + 1);
      setExperience(0);
      toast({
        title: '🎉 Новый уровень!',
        description: `Ты достиг уровня ${level + 1}!`,
      });
    }
  }, [experience, expToNextLevel, level]);

  const handleClick = () => {
    const multiplier = upgrades.find((u) => u.id === 'multiplier')?.level || 0;
    const expGain = clickPower * (1 + multiplier * 0.5);
    
    setCoins((prev) => prev + clickPower);
    setExperience((prev) => prev + expGain);
    setTotalClicks((prev) => prev + 1);
    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 200);
  };

  const handleUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find((u) => u.id === upgradeId);
    if (!upgrade || coins < upgrade.cost) {
      toast({
        title: '❌ Недостаточно монет',
        description: `Нужно ${upgrade?.cost} монет`,
        variant: 'destructive',
      });
      return;
    }

    setCoins((prev) => prev - upgrade.cost);
    
    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id === upgradeId) {
          const newLevel = u.level + 1;
          const newCost = Math.floor(u.cost * 1.5);
          
          if (u.id === 'power') {
            setClickPower((p) => p + u.effect);
          } else if (u.id === 'auto') {
            setAutoClickRate((r) => r + u.effect);
          } else if (u.id === 'gym') {
            setClickPower((p) => p + u.effect);
          }
          
          return { ...u, level: newLevel, cost: newCost };
        }
        return u;
      })
    );

    toast({
      title: '✅ Улучшение куплено!',
      description: upgrade.name,
    });
  };

  const getMuscleSize = () => {
    const baseSize = 60;
    const growth = Math.min(level * 5, 100);
    return baseSize + growth;
  };

  const getBodyColor = () => {
    if (level < 5) return 'from-blue-400 to-blue-500';
    if (level < 10) return 'from-purple-400 to-purple-500';
    if (level < 20) return 'from-orange-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Gym Clicker
          </h1>
          <p className="text-slate-400">Кликай и качайся! 💪</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-slate-800/50 backdrop-blur border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Coins" className="text-yellow-400" size={20} />
                  <span className="text-sm text-slate-400">Монеты</span>
                </div>
                <div className="text-2xl font-bold text-white">{coins.toLocaleString()}</div>
              </Card>

              <Card className="p-4 bg-slate-800/50 backdrop-blur border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="TrendingUp" className="text-blue-400" size={20} />
                  <span className="text-sm text-slate-400">Уровень</span>
                </div>
                <div className="text-2xl font-bold text-white">{level}</div>
              </Card>

              <Card className="p-4 bg-slate-800/50 backdrop-blur border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Zap" className="text-orange-400" size={20} />
                  <span className="text-sm text-slate-400">Сила</span>
                </div>
                <div className="text-2xl font-bold text-white">{clickPower}</div>
              </Card>
            </div>

            <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Прогресс до уровня {level + 1}</span>
                <span className="text-sm text-slate-400">
                  {experience} / {expToNextLevel}
                </span>
              </div>
              <Progress value={(experience / expToNextLevel) * 100} className="h-3" />
            </Card>

            <Card className="p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border-slate-700">
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={handleClick}
                  className={`transition-all duration-200 cursor-pointer hover:scale-105 ${
                    clickAnimation ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-32 h-40 bg-gradient-to-b ${getBodyColor()} rounded-t-full relative transition-all duration-300`}
                      style={{ width: `${getMuscleSize()}px` }}
                    >
                      <div className="absolute top-2 left-1/4 w-3 h-3 bg-white rounded-full" />
                      <div className="absolute top-2 right-1/4 w-3 h-3 bg-white rounded-full" />
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/20 rounded-full" />
                      
                      <div className="absolute -left-8 top-12 w-12 h-16 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full" />
                      <div className="absolute -right-8 top-12 w-12 h-16 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full" />
                    </div>
                    
                    <div className="w-24 h-32 bg-gradient-to-b from-blue-500 to-blue-600 rounded-b-lg mx-auto">
                      <div className="absolute -left-6 top-32 w-10 h-20 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg" />
                      <div className="absolute -right-6 top-32 w-10 h-20 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg" />
                    </div>

                    {clickAnimation && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-yellow-400 animate-float">
                        +{clickPower}
                      </div>
                    )}
                  </div>
                </button>
                <div className="mt-6 text-center">
                  <p className="text-slate-400 text-sm mb-2">Кликни на персонажа!</p>
                  <p className="text-slate-500 text-xs">Всего кликов: {totalClicks.toLocaleString()}</p>
                  {autoClickRate > 0 && (
                    <p className="text-green-400 text-sm mt-2">
                      🤖 Авто: +{autoClickRate}/сек
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-slate-800/50 backdrop-blur border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="ShoppingCart" className="text-purple-400" />
                Улучшения
              </h2>
              <div className="space-y-3">
                {upgrades.map((upgrade) => (
                  <Card key={upgrade.id} className="p-4 bg-slate-900/50 border-slate-700">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Icon name={upgrade.icon as any} className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{upgrade.name}</h3>
                          {upgrade.level > 0 && (
                            <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                              Ур. {upgrade.level}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{upgrade.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUpgrade(upgrade.id)}
                      disabled={coins < upgrade.cost}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                      size="sm"
                    >
                      <Icon name="Coins" className="mr-2" size={16} />
                      {upgrade.cost.toLocaleString()}
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-slate-800/50 backdrop-blur border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Icon name="BarChart3" className="text-orange-400" />
                Статистика
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Всего кликов:</span>
                  <span className="text-white font-semibold">{totalClicks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Монет заработано:</span>
                  <span className="text-white font-semibold">{coins.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Сила клика:</span>
                  <span className="text-white font-semibold">{clickPower}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Автоклик/сек:</span>
                  <span className="text-white font-semibold">{autoClickRate}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
