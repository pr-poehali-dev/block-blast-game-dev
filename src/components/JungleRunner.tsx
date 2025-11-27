import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Obstacle {
  id: number;
  x: number;
  type: 'log' | 'rock' | 'plant';
}

export default function JungleRunner() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('jungleRunnerHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [turtleX, setTurtleX] = useState(-200);

  const gameLoopRef = useRef<number>();
  const obstacleIdRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) return;

    const loop = () => {
      setScore((prev) => prev + 1);
      
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, x: obs.x - 8 }))
          .filter((obs) => obs.x > -100)
      );

      setTurtleX((prev) => Math.min(prev + 2, 50));

      if (Math.random() < 0.02) {
        const types: ('log' | 'rock' | 'plant')[] = ['log', 'rock', 'plant'];
        setObstacles((prev) => [
          ...prev,
          {
            id: obstacleIdRef.current++,
            x: 800,
            type: types[Math.floor(Math.random() * types.length)],
          },
        ]);
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    obstacles.forEach((obs) => {
      if (obs.x > 80 && obs.x < 180 && playerY < 80) {
        handleGameOver();
      }
    });

    if (turtleX > 30) {
      handleGameOver();
    }
  }, [obstacles, turtleX, playerY, isPlaying]);

  useEffect(() => {
    if (!isJumping) return;

    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
      jumpHeight += 10;
      if (jumpHeight <= 150) {
        setPlayerY(jumpHeight);
      } else {
        clearInterval(jumpInterval);
        const fallInterval = setInterval(() => {
          setPlayerY((prev) => {
            const newY = prev - 10;
            if (newY <= 0) {
              clearInterval(fallInterval);
              setIsJumping(false);
              return 0;
            }
            return newY;
          });
        }, 20);
      }
    }, 20);
  }, [isJumping]);

  const handleJump = () => {
    if (!isJumping && isPlaying && !isGameOver) {
      setIsJumping(true);
    }
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('jungleRunnerHighScore', score.toString());
    }
  };

  const handleStart = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setPlayerY(0);
    setIsJumping(false);
    setObstacles([]);
    setTurtleX(-200);
    obstacleIdRef.current = 0;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isJumping, isPlaying, isGameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <Card className="px-6 py-3 bg-emerald-800/50 border-emerald-700">
            <div className="text-sm text-emerald-300">Очки</div>
            <div className="text-3xl font-bold text-white">{Math.floor(score / 10)}</div>
          </Card>
          <Card className="px-6 py-3 bg-emerald-800/50 border-emerald-700">
            <div className="text-sm text-emerald-300">Рекорд</div>
            <div className="text-3xl font-bold text-white">{Math.floor(highScore / 10)}</div>
          </Card>
        </div>

        <Card
          className="relative h-[400px] bg-gradient-to-b from-emerald-700 to-emerald-800 border-emerald-600 overflow-hidden cursor-pointer"
          onClick={handleJump}
        >
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-amber-900/30" />

          <div
            className="absolute bottom-20 w-12 h-16 bg-blue-500 rounded-lg transition-all duration-100"
            style={{ left: '120px', transform: `translateY(-${playerY}px)` }}
          >
            <div className="absolute top-1 left-1 w-10 h-3 bg-blue-400 rounded" />
            <div className="absolute bottom-1 left-1 w-4 h-6 bg-blue-600 rounded" />
            <div className="absolute bottom-1 right-1 w-4 h-6 bg-blue-600 rounded" />
          </div>

          {obstacles.map((obs) => (
            <div
              key={obs.id}
              className="absolute bottom-20 transition-none"
              style={{ left: `${obs.x}px` }}
            >
              {obs.type === 'log' && (
                <div className="w-16 h-12 bg-amber-800 rounded-lg border-2 border-amber-900" />
              )}
              {obs.type === 'rock' && (
                <div className="w-12 h-14 bg-gray-600 rounded-full border-2 border-gray-700" />
              )}
              {obs.type === 'plant' && (
                <div className="w-10 h-16 bg-emerald-600 rounded-t-full border-2 border-emerald-700" />
              )}
            </div>
          ))}

          <div
            className="absolute bottom-20 w-16 h-12 bg-green-700 rounded-full transition-all duration-100"
            style={{ left: `${turtleX}px` }}
          >
            <div className="absolute top-1 right-2 w-8 h-6 bg-green-600 rounded-full" />
            <div className="absolute top-2 right-4 w-2 h-2 bg-yellow-400 rounded-full" />
          </div>

          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Jungle Runner</h2>
                <p className="text-emerald-300 mb-6">Беги от черепахи! Прыгай через препятствия</p>
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Icon name="Play" className="mr-2" />
                  Начать игру
                </Button>
                <p className="text-sm text-emerald-400 mt-4">Нажми ПРОБЕЛ или кликни для прыжка</p>
              </div>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-2">Game Over!</h2>
                <p className="text-emerald-300 mb-4">
                  Твой счёт: <span className="font-bold">{Math.floor(score / 10)}</span>
                </p>
                {score > highScore && (
                  <p className="text-yellow-400 mb-4 font-semibold">🎉 Новый рекорд!</p>
                )}
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Icon name="RotateCcw" className="mr-2" />
                  Попробовать снова
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-4 text-center">
          <p className="text-emerald-400 text-sm">
            💡 Совет: Рассчитывай прыжки заранее, черепаха не дремлет!
          </p>
        </div>
      </div>
    </div>
  );
}
