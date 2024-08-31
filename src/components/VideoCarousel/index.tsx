import React, { useEffect, useRef, useState } from 'react';
import { hightlightsSlides } from '../../constants';
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../../utils';
import { useGSAP } from '@gsap/react';

const VideoCarousel = () => {
  const videoRef = useRef<(HTMLVideoElement | null | GSAPTimeline)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null | GSAPTimeline)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null | GSAPTimeline)[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLodedData] = useState<never[] | any[]>([]);

  const { isEnd, isLastVideo, isPlaying, startPlay, videoId } = video;

  useGSAP(() => {
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut',
    });

    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none',
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  const handleLoadedMetadata = (i, e) => setLodedData((prev) => [...prev, e]);

  const getControlBtnImg = () => {
    if (isLastVideo) {
      return replayImg;
    }

    return !isPlaying ? playImg : pauseImg;
  };

  const getControlBtnAlt = () => {
    if (isLastVideo) {
      return 'replay';
    }

    return !isPlaying ? 'play' : 'pause';
  };

  const handleProcess = (type: string, i?: number) => {
    switch (type) {
      case 'video-end':
        setVideo((pre) => ({
          ...pre,
          isEnd: true,
          // @ts-ignore
          videoId: i + 1,
        }));
        break;

      case 'video-last':
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case 'video-reset':
        setVideo((pre) => ({
          ...pre,
          isLastVideo: false,
          videoId: 0,
        }));
        break;

      case 'pause':
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case 'play':
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  useEffect(() => {
    const reference = videoRef.current[videoId] as GSAPTimeline;

    if (loadedData.length > 3) {
      if (!isPlaying) {
        reference.pause();
      } else {
        startPlay && reference.play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width: window.innerWidth < 1200 ? '10vw' : '4vw',
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white',
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], { width: '12px' });
            gsap.to(span[videoId], { backgroundColor: '#afafaf' });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId]?.currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      isPlaying ? gsap.ticker.add(animUpdate) : gsap.ticker.remove(animUpdate);
    }
  }, [videoId, startPlay]);

  return (
    <>
      <div className='flex items-center'>
        {hightlightsSlides.map((slide, idx) => (
          <div key={slide.id} id='slider' className='sm:pr-20 pr-10'>
            <div className='video-carousel_container'>
              <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                <video
                  muted
                  id='video'
                  playsInline={true}
                  preload='auto'
                  className={`${
                    slide.id === 2 && 'translate-x-44'
                  }, pointer-events-none`}
                  ref={(el) => (videoRef.current[idx] = el)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onEnded={() =>
                    idx !== 3
                      ? handleProcess('video-end', idx)
                      : handleProcess('video-last')
                  }
                  onLoadedMetadata={(e) => handleLoadedMetadata(idx, e)}
                >
                  <source src={slide.video} type='video/mp4' />
                </video>
              </div>
              <div className='absolute top-20 left-[5%] z-10'>
                {slide.textLists.map((text) => (
                  <p key={text} className='md:text-2xl text-xl font-medium'>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='relarive flex-center mt-10'>
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
          {videoRef.current.map((_, idx) => (
            <span
              key={idx}
              ref={(el) => (videoDivRef.current[idx] = el)}
              className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
            >
              <span
                className='absolute h-full w-full rounded-full'
                ref={(el) => (videoSpanRef.current[idx] = el)}
              />
            </span>
          ))}
        </div>
        <button className='control-btn'>
          <img
            src={getControlBtnImg()}
            alt={getControlBtnAlt()}
            onClick={
              isLastVideo
                ? () => handleProcess('video-reset')
                : !isPlaying
                ? () => handleProcess('play')
                : () => handleProcess('pause')
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
