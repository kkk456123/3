import { useEffect, useRef, useState } from 'react'

const asset = path => import.meta.env.BASE_URL + path.replace(/^\/+/, '')
const timestamp = value => {
  const seconds = Math.floor(Number.isFinite(value) ? value : 0)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function PlayerIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {type === 'play' && <path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none" />}
    {type === 'pause' && <><path d="M8 5v14M16 5v14" strokeWidth="4" /></>}
    {(type === 'sound' || type === 'muted') && <><path d="M11 5 6 9H3v6h3l5 4Z" />{type === 'sound' ? <><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /></> : <path d="m16 9 6 6m0-6-6 6" />}</>}
    {type === 'fullscreen' && <path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6" />}
  </svg>
}

export default function ProjectVideo({ video }) {
  const player = useRef(null)
  const frame = useRef(null)
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const play = () => {
    setFailed(false)
    player.current.play().catch(() => { setStarted(false) })
  }
  const togglePlayback = () => { if (player.current.paused) play(); else player.current.pause() }
  const toggleSound = () => {
    const element = player.current
    const silent = element.muted || element.volume === 0
    if (silent && element.volume === 0) element.volume = 1
    element.muted = !silent
  }
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (frame.current.requestFullscreen) await frame.current.requestFullscreen()
      else player.current.webkitEnterFullscreen?.()
    } catch { /* The inline controls remain available when fullscreen is unavailable. */ }
  }
  useEffect(() => {
    const element = player.current
    if (video.autoPlay) {
      element.muted = false
      element.volume = 1
      element.play().catch(() => { setStarted(false) })
    }
    return () => { element.pause() }
  }, [video])

  return <figure className="project-video-block">
    <figcaption><span>{video.title}</span><small>{video.autoPlay ? '01 / JOYROOM' : '02 / USAMS'}</small></figcaption>
    <div ref={frame} className="project-video-frame" onContextMenu={event => event.preventDefault()}>
      <video ref={player} className="project-video" src={asset(video.src)} poster={asset(video.poster)} controls={false} controlsList="nodownload noremoteplayback" disablePictureInPicture disableRemotePlayback x-webkit-airplay="deny" x5-video-player-type="h5-page" autoPlay={video.autoPlay} playsInline preload={video.autoPlay ? 'auto' : 'none'} aria-label={video.title}
        onPlay={event => {
          setStarted(true)
          setPlaying(true)
          event.currentTarget.closest('dialog')?.querySelectorAll('video').forEach(other => { if (other !== event.currentTarget) other.pause() })
        }}
        onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
        onDurationChange={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
        onVolumeChange={event => { setMuted(event.currentTarget.muted); setVolume(event.currentTarget.volume) }}
        onError={() => { setFailed(true); setStarted(false); setPlaying(false) }} />
      {!started && <button type="button" className="project-video-start" onClick={play} aria-label={'播放' + video.title}>
        <span className="project-video-play-icon" aria-hidden="true">▶</span><span>{failed ? '重新播放' : '播放影片'}</span>
      </button>}
      {started && <>
        <button type="button" className="project-video-surface" onClick={togglePlayback} aria-label={playing ? '暂停影片' : '继续播放影片'} />
        <div className="project-video-controls" role="group" aria-label={video.title + '播放控制'}>
          <input className="project-video-seek" type="range" min="0" max={duration || 1} step="0.1" value={Math.min(time, duration || 1)} disabled={!duration} aria-label="播放进度" aria-valuetext={`${timestamp(time)} / ${timestamp(duration)}`} style={{ '--progress': `${duration ? time / duration * 100 : 0}%` }} onInput={event => { const next = Number(event.target.value); player.current.currentTime = next; setTime(next) }} />
          <div className="project-video-toolbar">
            <button type="button" className="project-video-control" onClick={togglePlayback} aria-label={playing ? '暂停' : '播放'} title={playing ? '暂停' : '播放'}><PlayerIcon type={playing ? 'pause' : 'play'} /></button>
            <span className="project-video-time">{timestamp(time)} <span>/ {timestamp(duration)}</span></span>
            <div className="project-video-volume">
              <button type="button" className="project-video-control" onClick={toggleSound} aria-label={muted || !volume ? '开启声音' : '静音'} title={muted || !volume ? '开启声音' : '静音'}><PlayerIcon type={muted || !volume ? 'muted' : 'sound'} /></button>
              <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} aria-label="音量" onInput={event => { player.current.volume = Number(event.target.value); player.current.muted = Number(event.target.value) === 0 }} />
            </div>
            <button type="button" className="project-video-control" onClick={fullscreen} aria-label="切换全屏" title="全屏"><PlayerIcon type="fullscreen" /></button>
          </div>
        </div>
      </>}
    </div>
  </figure>
}

