import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackgroundAudioProps {
  audioSrc?: string;
  volume?: number;
  autoPlay?: boolean;
}

export default function BackgroundAudio({ 
  audioSrc, 
  volume = 0.1, 
  autoPlay = true 
}: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    audio.volume = volume;
    audio.loop = true;
    
    const handleCanPlay = () => {
      if (autoPlay && hasInteracted) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Audio autoplay prevented:', error);
        });
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioSrc, volume, autoPlay, hasInteracted]);

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (audioRef.current && autoPlay && audioSrc) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Silently handle autoplay failure
          });
        }
      }
    };

    const events = ['click', 'keydown', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, enableAudio, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, enableAudio);
      });
    };
  }, [autoPlay, audioSrc, hasInteracted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Failed to play audio:', error);
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  // Don't render if no audio source provided
  if (!audioSrc) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        style={{ display: 'none' }}
      />
      
      {/* Audio Control Panel - Fixed position */}
      <div className="fixed bottom-4 right-4 z-50 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={togglePlayPause}
          className="bg-black/80 border-red-600/50 text-red-400 hover:bg-red-900/30 hover:text-red-300 backdrop-blur-sm"
          title={isPlaying ? 'Pause ambient sounds' : 'Play ambient sounds'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMute}
          className="bg-black/80 border-red-600/50 text-red-400 hover:bg-red-900/30 hover:text-red-300 backdrop-blur-sm"
          title={isMuted ? 'Unmute ambient sounds' : 'Mute ambient sounds'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>
    </>
  );
}