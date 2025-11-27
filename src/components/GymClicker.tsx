import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

interface Equipment {
  id: string;
  name: string;
  description: string;
  cost: number;
  owned: boolean;
  icon: string;
  bonus: number;
  type: 'click' | 'auto' | 'exp';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  reward: number;
  condition: (stats: any) => boolean;
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

  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('gymClickerEquipment');
    return saved ? JSON.parse(saved) : [
      {
        id: 'gloves',
        name: 'Перчатки',
        description: '+5 к силе клика',
        cost: 300,
        owned: false,
        icon: 'Hand',
        bonus: 5,
        type: 'click',
      },
      {
        id: 'shoes',
        name: 'Кроссовки',
        description: '+2 автоклик/сек',
        cost: 500,
        owned: false,
        icon: 'Footprints',
        bonus: 2,
        type: 'auto',
      },
      {
        id: 'belt',
        name: 'Пояс чемпиона',
        description: '+50% опыта',
        cost: 800,
        owned: false,
        icon: 'Award',
        bonus: 50,
        type: 'exp',
      },
      {
        id: 'headband',
        name: 'Повязка',
        description: '+3 к силе клика',
        cost: 400,
        owned: false,
        icon: 'Brain',
        bonus: 3,
        type: 'click',
      },
      {
        id: 'smartwatch',
        name: 'Смарт-часы',
        description: '+5 автоклик/сек',
        cost: 1200,
        owned: false,
        icon: 'Watch',
        bonus: 5,
        type: 'auto',
      },
    ];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('gymClickerAchievements');
    return saved ? JSON.parse(saved) : [
      {
        id: 'first_click',
        name: 'Первый шаг',
        description: 'Сделай первый клик',
        icon: 'MousePointerClick',
        unlocked: false,
        reward: 10,
        condition: (stats: any) => stats.totalClicks >= 1,
      },
      {
        id: 'hundred_clicks',
        name: 'Сотка',
        description: 'Сделай 100 кликов',
        icon: 'Target',
        unlocked: false,
        reward: 50,
        condition: (stats: any) => stats.totalClicks >= 100,
      },
      {
        id: 'level_5',
        name: 'Новичок',
        description: 'Достигни 5 уровня',
        icon: 'Star',
        unlocked: false,
        reward: 100,
        condition: (stats: any) => stats.level >= 5,
      },
      {
        id: 'level_10',
        name: 'Атлет',
        description: 'Достигни 10 уровня',
        icon: 'Trophy',
        unlocked: false,
        reward: 300,
        condition: (stats: any) => stats.level >= 10,
      },
      {
        id: 'rich',
        name: 'Богач',
        description: 'Накопи 1000 монет',
        icon: 'Coins',
        unlocked: false,
        reward: 200,
        condition: (stats: any) => stats.coins >= 1000,
      },
      {
        id: 'shopper',
        name: 'Шопоголик',
        description: 'Купи 3 экипировки',
        icon: 'ShoppingBag',
        unlocked: false,
        reward: 500,
        condition: (stats: any) => stats.equipmentOwned >= 3,
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
    localStorage.setItem('gymClickerEquipment', JSON.stringify(equipment));
    localStorage.setItem('gymClickerAchievements', JSON.stringify(achievements));
  }, [coins, level, experience, clickPower, autoClickRate, totalClicks, upgrades, equipment, achievements]);

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

  useEffect(() => {
    const stats = {
      totalClicks,
      level,
      coins,
      equipmentOwned: equipment.filter((e) => e.owned).length,
    };

    achievements.forEach((achievement) => {
      if (!achievement.unlocked && achievement.condition(stats)) {
        setAchievements((prev) =>
          prev.map((a) =>
            a.id === achievement.id ? { ...a, unlocked: true } : a
          )
        );
        setCoins((prev) => prev + achievement.reward);
        toast({
          title: '🏆 Достижение разблокировано!',
          description: `${achievement.name} - Награда: ${achievement.reward} монет`,
        });
      }
    });
  }, [totalClicks, level, coins, equipment]);

  const handleClick = () => {
    const multiplier = upgrades.find((u) => u.id === 'multiplier')?.level || 0;
    const equipmentBonus = equipment
      .filter((e) => e.owned && e.type === 'exp')
      .reduce((sum, e) => sum + e.bonus, 0);
    const expMultiplier = 1 + multiplier * 0.5 + equipmentBonus / 100;
    const expGain = clickPower * expMultiplier;
    
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

  const handleBuyEquipment = (equipmentId: string) => {
    const item = equipment.find((e) => e.id === equipmentId);
    if (!item || item.owned || coins < item.cost) {
      toast({
        title: '❌ Недостаточно монет',
        description: `Нужно ${item?.cost} монет`,
        variant: 'destructive',
      });
      return;
    }

    setCoins((prev) => prev - item.cost);
    setEquipment((prev) =>
      prev.map((e) => {
        if (e.id === equipmentId) {
          if (e.type === 'click') {
            setClickPower((p) => p + e.bonus);
          } else if (e.type === 'auto') {
            setAutoClickRate((r) => r + e.bonus);
          }
          return { ...e, owned: true };
        }
        return e;
      })
    );

    toast({
      title: '✅ Экипировка куплена!',
      description: item.name,
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

  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

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
            <div className="grid grid-cols-4 gap-4">
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

              <Card className="p-4 bg-slate-800/50 backdrop-blur border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Award" className="text-purple-400" size={20} />
                  <span className="text-sm text-slate-400">Награды</span>
                </div>
                <div className="text-2xl font-bold text-white">{unlockedAchievements}/{achievements.length}</div>
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
              <Tabs defaultValue="upgrades" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="upgrades">Улучшения</TabsTrigger>
                  <TabsTrigger value="equipment">Экипировка</TabsTrigger>
                  <TabsTrigger value="achievements">Награды</TabsTrigger>
                </TabsList>

                <TabsContent value="upgrades" className="space-y-3">
                  {upgrades.map((upgrade) => (
                    <Card key={upgrade.id} className="p-4 bg-slate-900/50 border-slate-700">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                          <Icon name={upgrade.icon as any} className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white truncate">{upgrade.name}</h3>
                            {upgrade.level > 0 && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                Ур. {upgrade.level}
                              </Badge>
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
                </TabsContent>

                <TabsContent value="equipment" className="space-y-3">
                  {equipment.map((item) => (
                    <Card key={item.id} className={`p-4 border-slate-700 ${item.owned ? 'bg-green-900/20' : 'bg-slate-900/50'}`}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          item.owned ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-orange-500 to-red-500'
                        }`}>
                          <Icon name={item.icon as any} className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white truncate">{item.name}</h3>
                            {item.owned && (
                              <Badge className="bg-green-500 text-xs shrink-0">Куплено</Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{item.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleBuyEquipment(item.id)}
                        disabled={item.owned || coins < item.cost}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50"
                        size="sm"
                      >
                        {item.owned ? (
                          <>
                            <Icon name="Check" className="mr-2" size={16} />
                            Куплено
                          </>
                        ) : (
                          <>
                            <Icon name="Coins" className="mr-2" size={16} />
                            {item.cost.toLocaleString()}
                          </>
                        )}
                      </Button>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="achievements" className="space-y-3">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className={`p-4 border-slate-700 ${
                      achievement.unlocked ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30' : 'bg-slate-900/50 opacity-60'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          achievement.unlocked ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-slate-700'
                        }`}>
                          <Icon name={achievement.icon as any} className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold truncate ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                              {achievement.name}
                            </h3>
                            {achievement.unlocked && (
                              <Icon name="Check" className="text-green-400 shrink-0" size={16} />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{achievement.description}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <Icon name="Gift" className="text-yellow-400" size={14} />
                            <span className="text-yellow-400 font-semibold">+{achievement.reward} монет</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
