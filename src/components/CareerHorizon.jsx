import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import './CareerHorizon.css'

const stars = Array.from({ length: 145 }, (_, index) => ({
  x: (index * 719 + 37) % 1500,
  y: (index * 137 + index * index * 3) % 570,
  radius: index % 9 === 0 ? 1 : .55,
  opacity: .12 + (index % 5) * .055,
}))

const horizon = 'M-80 180 Q750 -20 1580 180'
const horizonY = x => {
  const t = (x + 80) / 1660
  return 180 - 400 * t * (1 - t)
}

const flareLayers = [
  { width: 175, height: 48, filter: 'halo', opacity: .7 },
  { width: 78, height: 18, filter: 'core', opacity: .9 },
]

// A tapered lens follows the actual horizon, including its changing slope.
const flarePath = (center, width, height) => {
  const edge = direction => Array.from({ length: 49 }, (_, index) => {
    const t = index / 48
    const x = center + (t * 2 - 1) * width
    const slope = 400 * (2 * (x + 80) / 1660 - 1) / 1660
    const offset = direction * height * Math.sin(Math.PI * t) ** 2
    const normal = Math.hypot(1, slope)
    return `${x - center - slope * offset / normal},${horizonY(x) - horizonY(center) + offset / normal}`
  })
  return `M${edge(-1).join(' L')} L${edge(1).reverse().join(' L')} Z`
}

export default function CareerHorizon({ experiences }) {
  const id = useId().replace(/:/g, '')
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState(null)
  const [focused, setFocused] = useState(null)
  const [centers, setCenters] = useState([])
  const scene = useRef(null)
  const buttons = useRef([])
  const sunLayers = useRef([])
  const flarePaths = useRef([])
  const flareGradients = useRef([])
  const currentX = useRef(250)
  const positioned = useRef(false)
  const active = hovered ?? focused ?? selected
  const x = centers[active] ?? (active + .5) * 1500 / experiences.length

  useEffect(() => {
    if (!centers.length) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const draw = nextX => {
      currentX.current = nextX
      // Use the same quadratic curve as the visible horizon on every frame.
      // Interpolating the two endpoint coordinates would cut across its arc.
      const transform = `translate(${nextX}px, ${horizonY(nextX)}px)`
      sunLayers.current.forEach(layer => { if (layer) layer.style.transform = transform })
      const slope = 400 * (2 * (nextX + 80) / 1660 - 1) / 1660
      const angle = Math.atan(slope) * 180 / Math.PI
      flareLayers.forEach(({ width, height }, index) => {
        flarePaths.current[index]?.setAttribute('d', flarePath(nextX, width, height))
        flareGradients.current[index]?.setAttribute('gradientTransform', `rotate(${angle}) scale(${width} ${height})`)
      })
    }
    const settle = () => {
      if (!motion.matches) return
      cancelAnimationFrame(frame)
      draw(x)
    }
    if (!positioned.current || motion.matches || Math.abs(x - currentX.current) < .01) {
      positioned.current = true
      draw(x)
    } else {
      const from = currentX.current
      const start = performance.now()
      const animate = now => {
        const progress = Math.min(1, (now - start) / 850)
        const eased = 1 - (1 - progress) ** 3
        draw(from + (x - from) * eased)
        if (progress < 1) frame = requestAnimationFrame(animate)
      }
      frame = requestAnimationFrame(animate)
    }
    motion.addEventListener('change', settle)
    return () => {
      cancelAnimationFrame(frame)
      motion.removeEventListener('change', settle)
    }
  }, [x, centers.length])

  useLayoutEffect(() => {
    const measure = () => {
      const bounds = scene.current.getBoundingClientRect()
      setCenters(buttons.current.map(button => {
        const rect = button.getBoundingClientRect()
        return (rect.left + rect.width / 2 - bounds.left) / bounds.width * 1500
      }))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(scene.current)
    measure()
    return () => observer.disconnect()
  }, [experiences])

  const handleKeyDown = (event, index) => {
    let next
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % experiences.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + experiences.length) % experiences.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = experiences.length - 1
    else return
    event.preventDefault()
    setHovered(null)
    setSelected(next)
    buttons.current[next]?.focus()
  }

  return <section ref={scene} id="career" className="career-scene" aria-labelledby="career-title" data-active-index={active}>
    <svg className="career-stars" viewBox="0 0 1500 680" preserveAspectRatio="none" aria-hidden="true">
      {stars.map((star, index) => <circle key={index} cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} fill={index % 3 === 0 ? '#a4b9df' : '#d8c4a8'} />)}
    </svg>
    <div className="career-scene-heading">
      <div><p className="eyebrow">CAREER PATH</p><h3 id="career-title">工作经历，<br />步履不停。</h3></div>
      <p className="career-scene-intro">从产品渲染到品牌视觉，<br />在商业项目中持续打磨设计与协作。</p>
    </div>
    <div className="career-options" role="group" aria-label="工作经历，悬停或选择以查看高亮">
      {experiences.map((item, index) => <button
        key={item.company}
        ref={element => { buttons.current[index] = element }}
        type="button"
        className={'career-option' + (index === active ? ' is-active' : '')}
        aria-pressed={index === selected}
        onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(index) }}
        onPointerLeave={() => setHovered(null)}
        onFocus={() => setFocused(index)}
        onBlur={() => setFocused(null)}
        onClick={() => setSelected(index)}
        onKeyDown={event => handleKeyDown(event, index)}
      >
        <span className="career-option-period">{item.period}</span>
        <span className="career-option-company">{item.company}</span>
        <span className="career-option-role">{item.role}</span>
        <span className="career-option-description">{item.detail}</span>
      </button>)}
    </div>
    <svg className="career-planet" viewBox="0 0 1500 300" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id={id + '-falloff'}>
          <stop stopColor="white" />
          <stop offset=".3" stopColor="white" stopOpacity=".85" />
          <stop offset=".65" stopColor="white" stopOpacity=".35" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id={id + '-bloom'} filterUnits="userSpaceOnUse" x="-200" y="-250" width="1900" height="700"><feGaussianBlur stdDeviation="25" /></filter>
        <filter id={id + '-halo'} filterUnits="userSpaceOnUse" x="-200" y="-250" width="1900" height="700"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id={id + '-core'} filterUnits="userSpaceOnUse" x="-200" y="-250" width="1900" height="700"><feGaussianBlur stdDeviation="2" /></filter>
        {flareLayers.map((layer, index) => <radialGradient key={index} ref={element => { flareGradients.current[index] = element }} id={id + '-flare-' + index} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform={`scale(${layer.width} ${layer.height})`}>
          <stop stopColor={index === 0 ? '#d4ff9a' : '#eeffd6'} stopOpacity=".95" />
          <stop offset=".25" stopColor="#d4ff9a" stopOpacity=".75" />
          <stop offset=".6" stopColor="#c5ff97" stopOpacity=".3" />
          <stop offset="1" stopColor="#c5ff97" stopOpacity="0" />
        </radialGradient>)}
        {['bloom', 'halo', 'core'].map((layer, index) => <mask key={layer} id={id + '-' + layer + '-mask'} maskUnits="userSpaceOnUse" x="-100" y="-220" width="1700" height="600">
          <g ref={element => { sunLayers.current[index] = element }} className="career-sun-position">
            <ellipse rx={[390, 290, 190][index]} ry="170" fill={'url(#' + id + '-falloff)'} />
          </g>
        </mask>)}
      </defs>
      <path className="career-horizon-rim" d={horizon} fill="none" stroke="#b4dc82" strokeOpacity=".32" strokeWidth="1" />
      <g mask={'url(#' + id + '-bloom-mask)'}>
        <path className="career-glow-band" d={horizon} fill="none" stroke="#c5ff97" strokeWidth="65" opacity=".23" filter={'url(#' + id + '-bloom)'} />
      </g>
      <g ref={element => { sunLayers.current[3] = element }} className="career-sun-position career-sun-flare">
        {flareLayers.map((layer, index) => <path key={index} ref={element => { flarePaths.current[index] = element }} d={flarePath(currentX.current, layer.width, layer.height)} fill={'url(#' + id + '-flare-' + index + ')'} opacity={layer.opacity} filter={'url(#' + id + '-' + layer.filter + ')'} />)}
      </g>
      <g mask={'url(#' + id + '-halo-mask)'}>
        <path className="career-glow-band" d={horizon} fill="none" stroke="#d4ff9a" strokeWidth="19" opacity=".65" filter={'url(#' + id + '-halo)'} />
      </g>
      <g mask={'url(#' + id + '-core-mask)'}>
        <path className="career-glow-band" d={horizon} fill="none" stroke="#e5ffc1" strokeWidth="5" opacity=".85" filter={'url(#' + id + '-core)'} />
        <path className="career-glow-band" d={horizon} fill="none" stroke="#eeffd6" strokeWidth="1.8" opacity=".95" />
      </g>
    </svg>
  </section>
}
