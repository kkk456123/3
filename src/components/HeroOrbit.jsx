import { useLayoutEffect, useRef } from 'react'
import BorderGlow from './BorderGlow'
import { imageProps } from '../media'

const wrap = (value, length) => ((value % length) + length) % length

export default function HeroOrbit({ previews, onSelect, paused = false }) {
  const railRef = useRef(null)
  const controls = useRef(null)
  const primaryButtons = useRef([])

  useLayoutEffect(() => {
    const rail = railRef.current
    const slots = [...rail.querySelectorAll('.hero-orbit-slot')]
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const state = { hover: false, held: false, keyboard: false, visible: false, modal: paused, dragging: false }
    let width = 0, tile = 0, step = 0, period = 0, rise = 0, offset = 0
    let frame = 0, previous = 0, pointer = null, suppressUntil = 0
    let initialized = false

    const draw = () => {
      if (!period) return
      offset = wrap(offset, period)
      slots.forEach((slot, index) => {
        const x = wrap(index * step + offset + step, period) - step
        const visible = x + tile >= -40 && x <= width + 40
        if (!visible && slot.dataset.inView === 'false') return
        if (slot.dataset.inView !== String(visible)) slot.dataset.inView = String(visible)
        const relative = (x + tile / 2 - width / 2) / (width / 2 + tile / 2)
        const y = 24 + rise * Math.min(1.35, relative * relative)
        // Follow the shallow arch's tangent: left tiles lean up toward the
        // center, middle tiles settle flat, and right tiles lean down gently.
        const slope = 2 * rise * Math.max(-1, Math.min(1, relative)) / (width / 2 + tile / 2)
        const angle = Math.atan(slope) * 180 / Math.PI
        slot.style.transform = `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) rotate(${angle.toFixed(3)}deg)`
      })
    }
    const canPlay = () => state.visible && !document.hidden && !preference.matches && !state.hover && !state.held && !state.keyboard && !state.modal && document.documentElement.dataset.opening !== 'playing'
    const tick = now => {
      frame = 0
      if (!canPlay()) return
      const elapsed = previous ? Math.min(.05, (now - previous) / 1000) : 0
      previous = now
      offset -= (width > 800 ? 18 : 14) * elapsed
      draw()
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      const playing = canPlay()
      rail.dataset.playState = playing ? 'playing' : 'paused'
      if (!playing) {
        cancelAnimationFrame(frame)
        frame = 0
        previous = 0
      } else if (!frame) {
        previous = 0
        frame = requestAnimationFrame(tick)
      }
    }
    const measure = () => {
      const previousStep = step
      width = rail.clientWidth
      tile = slots[0].offsetWidth
      step = tile + parseFloat(getComputedStyle(rail).getPropertyValue('--rail-gap'))
      period = slots.length * step
      // A broad, shallow arch keeps the rhythm without pronounced stepping.
      rise = Math.max(10, Math.min(26, width * .014))
      rail.style.setProperty('--orbit-height', `${slots[0].offsetHeight + rise + 52}px`)
      if (!initialized) { offset = -tile * .28; initialized = true }
      else if (previousStep) offset = offset / previousStep * step
      draw()
      sync()
    }
    const enter = event => { if (event.pointerType !== 'touch') { state.hover = true; sync() } }
    const leave = event => { if (event.pointerType !== 'touch') { state.hover = false; sync() } }
    const down = event => {
      if (!event.isPrimary || event.button !== 0 || pointer) return
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, offset }
      state.held = true
      state.keyboard = false
      sync()
    }
    const move = event => {
      if (!pointer || event.pointerId !== pointer.id) return
      const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y
      if (!state.dragging && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy) * 1.1) {
        state.dragging = true
        rail.dataset.dragging = 'true'
        rail.setPointerCapture(event.pointerId)
      }
      if (state.dragging) {
        if (event.cancelable) event.preventDefault()
        offset = pointer.offset + dx
        draw()
      }
    }
    const up = event => {
      if (!pointer || event.pointerId !== pointer.id) return
      if (state.dragging) suppressUntil = performance.now() + 400
      if (rail.hasPointerCapture(pointer.id)) rail.releasePointerCapture(pointer.id)
      pointer = null
      state.held = false
      state.dragging = false
      delete rail.dataset.dragging
      if (event.pointerType !== 'touch') {
        const rect = rail.getBoundingClientRect()
        state.hover = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
      }
      sync()
    }
    const click = event => {
      if (performance.now() < suppressUntil) { event.preventDefault(); event.stopPropagation() }
    }
    const cancel = () => { if (pointer) up({ pointerId: pointer.id, pointerType: 'mouse', clientX: -1, clientY: -1 }) }
    const focus = event => {
      if (!event.target.matches('.hero-preview:focus-visible')) return
      state.keyboard = true
      const index = Number(event.target.dataset.previewIndex)
      const x = wrap(index * step + offset + step, period) - step
      if (x < 10 || x + tile > width - 10) { offset = width / 2 - tile / 2 - index * step; draw() }
      sync()
    }
    const blur = event => { if (!rail.contains(event.relatedTarget)) { state.keyboard = false; sync() } }
    const key = event => {
      const button = event.target.closest('.hero-preview')
      if (!button) return
      const index = Number(button.dataset.previewIndex) % previews.length
      let next
      if (event.key === 'ArrowRight') next = (index + 1) % previews.length
      else if (event.key === 'ArrowLeft') next = (index - 1 + previews.length) % previews.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = previews.length - 1
      else return
      event.preventDefault()
      primaryButtons.current[next]?.focus({ preventScroll: true })
    }
    const resize = new ResizeObserver(measure)
    resize.observe(rail)
    const visibility = new IntersectionObserver(([entry]) => { state.visible = entry.isIntersecting; sync() })
    visibility.observe(rail)
    const opening = new MutationObserver(sync)
    opening.observe(document.documentElement, { attributes: true, attributeFilter: ['data-opening'] })
    rail.addEventListener('pointerenter', enter)
    rail.addEventListener('pointerleave', leave)
    rail.addEventListener('pointerdown', down)
    rail.addEventListener('pointermove', move, { passive: false })
    rail.addEventListener('click', click, true)
    rail.addEventListener('focusin', focus)
    rail.addEventListener('focusout', blur)
    rail.addEventListener('keydown', key)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    window.addEventListener('blur', cancel)
    document.addEventListener('visibilitychange', sync)
    preference.addEventListener('change', sync)
    controls.current = { setModal: value => { state.modal = value; sync() } }
    measure()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      visibility.disconnect()
      opening.disconnect()
      rail.removeEventListener('pointerenter', enter)
      rail.removeEventListener('pointerleave', leave)
      rail.removeEventListener('pointerdown', down)
      rail.removeEventListener('pointermove', move)
      rail.removeEventListener('click', click, true)
      rail.removeEventListener('focusin', focus)
      rail.removeEventListener('focusout', blur)
      rail.removeEventListener('keydown', key)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      window.removeEventListener('blur', cancel)
      document.removeEventListener('visibilitychange', sync)
      preference.removeEventListener('change', sync)
      controls.current = null
    }
  }, [previews])

  useLayoutEffect(() => { controls.current?.setModal(paused) }, [paused])

  return <div className="hero-gallery" aria-label="精选作品快速预览">
    <div ref={railRef} className="hero-rail" role="group" aria-label="拖拽浏览作品，方向键切换，Enter 查看详情">
      <div className="hero-rail-track">
        {Array.from({ length: previews.length * 3 }, (_, index) => {
          const preview = previews[index % previews.length]
          const duplicate = index >= previews.length
          return <div className="hero-orbit-slot" key={index} aria-hidden={duplicate || undefined}>
            <button ref={element => { if (!duplicate) primaryButtons.current[index] = element }} className="hero-preview" type="button" data-preview-index={index} tabIndex={duplicate ? -1 : 0} onClick={() => onSelect(preview)} aria-label={'预览' + preview.label + '作品'}>
              <span className="hero-preview-media"><img {...imageProps(preview.image, undefined, true)} alt={duplicate ? '' : preview.label} draggable="false" /></span>
              <span className="preview-caption"><span><small>{String(index % previews.length + 1).padStart(2, '0')}</small>{preview.label}</span><svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg></span>
              <BorderGlow />
            </button>
          </div>
        })}
      </div>
    </div>
  </div>
}
