import { useEffect, useRef } from 'react'
import './BorderGlow.css'

// Adapted from the supplied React Bits BorderGlow: keep the original card
// structure and apply its directional cone and mesh gradient as an overlay.
export default function BorderGlow({
  edgeSensitivity = 58,
  glowColor = '40 80 80',
  glowRadius = 45,
  glowIntensity = 2.2,
  coneSpread = 25,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = .5,
}) {
  const effect = useRef(null)
  useEffect(() => {
    const layer = effect.current
    const card = layer.parentElement
    let keyboardFocus = false
    let frame = 0
    let point = null
    const paint = () => {
      frame = 0
      if (!point) return
      const rect = card.getBoundingClientRect()
      const dx = point.x - rect.left - rect.width / 2
      const dy = point.y - rect.top - rect.height / 2
      const edge = Math.min(1, Math.max(Math.abs(dx) / (rect.width / 2), Math.abs(dy) / (rect.height / 2))) * 100
      const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
      const threshold = Math.min(95, Math.max(0, edgeSensitivity))
      layer.style.setProperty('--edge-opacity', String(Math.max(0, Math.min(1, (edge - threshold) / (100 - threshold)))))
      const colorThreshold = Math.min(99, threshold + 20)
      layer.style.setProperty('--color-opacity', String(Math.max(0, Math.min(1, (edge - colorThreshold) / (100 - colorThreshold)))))
      layer.style.setProperty('--cursor-angle', angle + 'deg')
    }
    const update = event => {
      if (event.pointerType === 'touch') return
      point = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      point = null
      layer.style.setProperty('--edge-opacity', keyboardFocus ? '1' : '0')
      layer.style.setProperty('--color-opacity', keyboardFocus ? '1' : '0')
    }
    const focus = () => {
      keyboardFocus = card.matches(':focus-visible') || Boolean(card.querySelector(':focus-visible'))
      if (keyboardFocus) {
        layer.style.setProperty('--cursor-angle', '45deg')
        layer.style.setProperty('--edge-opacity', '1')
        layer.style.setProperty('--color-opacity', '1')
      }
    }
    const blur = event => {
      if (card.contains(event.relatedTarget)) return
      keyboardFocus = false
      reset()
    }
    card.addEventListener('pointermove', update, { passive: true })
    card.addEventListener('pointerleave', reset)
    card.addEventListener('focusin', focus)
    card.addEventListener('focusout', blur)
    return () => {
      cancelAnimationFrame(frame)
      card.removeEventListener('pointermove', update)
      card.removeEventListener('pointerleave', reset)
      card.removeEventListener('focusin', focus)
      card.removeEventListener('focusout', blur)
    }
  }, [edgeSensitivity])
  const hsl = glowColor.match(/[\d.]+/g) ?? ['40', '80', '80']
  const style = {
    '--glow-padding': `${glowRadius}px`,
    '--cone-spread': `${coneSpread}%`,
    '--fill-opacity': fillOpacity,
    '--gradient-base': colors[0],
  }
  const positions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
  const colorMap = [0, 1, 2, 0, 1, 2, 1]
  positions.forEach((position, index) => {
    style[`--gradient-${index}`] = `radial-gradient(at ${position}, ${colors[Math.min(colorMap[index], colors.length - 1)]} 0px, transparent 50%)`
  })
  ;[100, 60, 50, 40, 30, 20, 10].forEach(opacity => {
    style[`--glow-${opacity}`] = `hsl(${hsl[0]}deg ${hsl[1]}% ${hsl[2]}% / ${Math.min(100, opacity * glowIntensity)}%)`
  })
  return <span ref={effect} className="border-glow-effect" style={style} aria-hidden="true"><span className="border-glow-ring" /><span className="border-glow-fill" /><span className="edge-light" /></span>
}
