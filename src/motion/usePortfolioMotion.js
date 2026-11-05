import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './motion.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export default function usePortfolioMotion() {
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add({ reduce: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 801px)', mobile: '(max-width: 800px)' }, context => {
      const { reduce, desktop } = context.conditions
      const html = document.documentElement
      if (reduce) {
        html.dataset.opening = 'complete'
        html.dataset.motion = 'reduced'
        return () => { delete html.dataset.opening; delete html.dataset.motion }
      }

      html.dataset.motion = 'active'
      const select = gsap.utils.toArray
      const snapshots = new Map(select('.motion-word, .heading-arrow, .module-heading > p, .profile-portrait, .project-card, .capability-card, .career-option, .contact-card, .project-media, .profile-portrait > img, .profile-content > *, .career-scene-heading h3, .career-scene-intro, .career-planet, .contact-title-line, .contact-statement > p, .contact-brand, .project-image-plane, .opening-curtain, .opening-seam, .hero-rail-track, .hero-film, .nav-wrap, .hero-eyebrow, .hero-name, .hero-glyph, .hero-title, .hero-sparkles, .hero-description, .hero-gallery').map(element => [element, element.getAttribute('style')]))
      const lift = desktop ? 112 : 64
      const cards = select('.profile-portrait, .project-card, .capability-card, .career-option, .contact-card')
      const headings = new Map()
      const entries = new Map()
      const images = new Map()
      let alive = true

      cards.forEach(card => card.classList.add('motion-card'))
      // Individual translate/scale compose with existing hover transforms.
      gsap.set(cards, { '--entry-y': `${lift}px`, '--entry-scale': .96, '--entry-opacity': 0 })
      gsap.set('.project-media, .profile-portrait > img', { clipPath: 'inset(0% 0% 100% 0%)' })

      select('.module-heading').forEach(heading => {
        const words = heading.querySelectorAll('.motion-word')
        const arrow = heading.querySelector('.heading-arrow')
        const subtitle = heading.querySelector('p')
        const timeline = gsap.timeline({ scrollTrigger: { trigger: heading, start: 'top 88%', once: true } })
        timeline.from(words, { yPercent: 135, x: desktop ? -78 : -30, scaleX: .74, rotation: 5, transformOrigin: 'left bottom', duration: 1.65, stagger: .12, ease: 'expo.out', clearProps: 'transform' })
          .from(arrow, { x: -32, rotation: -100, scale: .3, duration: 1.25, ease: 'power3.out', clearProps: 'transform' }, .25)
          .from(subtitle, { y: 28, clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'power3.out', clearProps: 'transform,clipPath' }, .45)
        headings.set(heading.closest('section'), timeline)
      })

      context.add('revealCards', batch => {
        batch.forEach((card, index) => {
          const delay = .28 + index * .17
          card.style.willChange = 'translate, scale, opacity'
          const tween = gsap.to(card, {
            '--entry-y': '0px', '--entry-scale': 1, '--entry-opacity': 1,
            duration: 1.55, delay, ease: 'power4.out',
            onComplete: () => { card.style.removeProperty('will-change') },
          })
          entries.set(card, tween)
          const image = card.querySelector('.project-media, :scope.profile-portrait > img')
          if (image) {
            const reveal = gsap.to(image, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, delay: delay + .12, ease: 'power4.inOut', clearProps: 'clipPath' })
            images.set(card, reveal)
          }
        })
      })
      ScrollTrigger.batch(cards, {
        start: 'top 94%', interval: .12, batchMax: desktop ? 3 : 2, once: true,
        onEnter: context.revealCards,
      })

      gsap.from('.profile-content > *', {
        x: desktop ? 64 : 30, y: 30, clipPath: 'inset(0 0 100% 0)',
        duration: 1.25, stagger: .1, ease: 'power3.out', clearProps: 'transform,clipPath',
        scrollTrigger: { trigger: '.profile-grid', start: 'top 78%', once: true },
      })
      const career = gsap.timeline({ scrollTrigger: { trigger: '.career-scene-heading', start: 'top 86%', once: true } })
      career.from('.career-scene-heading h3', { y: 90, scaleX: .86, clipPath: 'inset(0 0 100% 0)', duration: 1.5, ease: 'expo.out', transformOrigin: 'left bottom', clearProps: 'transform,clipPath' })
        .from('.career-scene-intro', { x: 45, clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power3.out', clearProps: 'transform,clipPath' }, .3)
        .from('.career-planet', { y: 64, scaleY: .8, opacity: 0, duration: 1.8, ease: 'power3.out', clearProps: 'transform,opacity' }, .4)

      const contact = gsap.timeline({ scrollTrigger: { trigger: '.contact-layout', start: 'top 84%', once: true } })
      contact.from('.contact-title-line', { yPercent: 125, x: desktop ? -70 : -24, scaleX: .84, rotation: 3, transformOrigin: 'left bottom', duration: 1.7, stagger: .18, ease: 'expo.out', clearProps: 'transform' })
        .from('.contact-statement > p, .contact-brand', { y: 32, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', clearProps: 'transform,opacity' }, .55)

      // Only four inner image planes scrub with the scroll. Hover still scales
      // the image separately, and reduced motion/mobile omit parallax entirely.
      if (desktop) select('.project-image-plane').forEach(plane => {
        gsap.fromTo(plane, { yPercent: -3.5 }, {
          yPercent: 3.5, ease: 'none',
          scrollTrigger: { trigger: plane.closest('.project-grid'), start: 'top bottom', end: 'bottom top', scrub: .85 },
        })
      })

      let opening
      const deepLink = location.hash && location.hash !== '#top'
      if (!deepLink && window.scrollY < window.innerHeight * .35) {
        html.dataset.opening = 'playing'
        gsap.set('.opening-curtain, .opening-seam', { display: 'block' })
        opening = gsap.timeline({
          defaults: { ease: 'power4.inOut' },
          onComplete: () => {
            html.dataset.opening = 'complete'
            gsap.set('.opening-curtain, .opening-seam', { display: 'none' })
            window.removeEventListener('scroll', onScroll)
          },
        })
        opening.fromTo('.opening-seam', { scaleX: 0, opacity: .8 }, { scaleX: 1, duration: .8 }, 0)
          .to('.opening-curtain-top', { yPercent: -101, duration: 1.65 }, .25)
          .to('.opening-curtain-bottom', { yPercent: 101, duration: 1.65 }, .25)
          .to('.opening-seam', { opacity: 0, duration: .45 }, .65)
          .from('.hero-film', { scale: 1.18, clipPath: 'inset(36% 8% 36% 8%)', duration: 2.6, ease: 'power3.out', clearProps: 'transform,clipPath' }, .22)
          .from('.nav-wrap', { yPercent: -150, opacity: 0, duration: 1.3, ease: 'expo.out', clearProps: 'transform,opacity' }, .65)
          .from('.hero-eyebrow', { y: 28, clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'power3.out', clearProps: 'transform,clipPath' }, .75)
          .from('.hero-name', { x: -90, scaleX: .72, skewX: 6, transformOrigin: 'left center', duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, .7)
          .from('.hero-glyph', { yPercent: 125, scaleY: 1.4, rotation: 6, transformOrigin: 'left bottom', duration: 1.6, stagger: .065, ease: 'expo.out', clearProps: 'transform' }, .7)
          .from('.hero-title', { x: 100, yPercent: 125, scaleX: 1.17, skewX: -7, transformOrigin: 'left bottom', duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, 1.02)
          .from('.hero-sparkles', { rotation: -105, scale: 0, duration: 1.5, ease: 'power3.out', clearProps: 'transform' }, 1.35)
          .from('.hero-description', { y: 40, clipPath: 'inset(0 0 100% 0)', duration: 1.25, ease: 'power3.out', clearProps: 'transform,clipPath' }, 1.55)
          .from('.hero-gallery', { yPercent: 125, scale: 1.08, duration: 1.5, ease: 'expo.out', clearProps: 'transform' }, 1.85)
      } else html.dataset.opening = 'complete'

      // Never hold scrolling or keyboard focus behind a cinematic sequence.
      const finishOpening = () => { if (opening && opening.progress() < 1) opening.progress(1) }
      const onScroll = () => { if (window.scrollY > window.innerHeight * .2) finishOpening() }
      const onFocus = event => {
        finishOpening()
        const card = event.target.closest('.motion-card')
        if (card) {
          entries.get(card)?.progress(1)
          images.get(card)?.progress(1)
          gsap.set(card, { '--entry-y': '0px', '--entry-scale': 1, '--entry-opacity': 1 })
          const image = card.querySelector('.project-media, :scope.profile-portrait > img')
          if (image) image.style.removeProperty('clip-path')
        }
        headings.get(event.target.closest('.module-section'))?.progress(1)
        if (event.target.closest('#contact')) contact.progress(1)
      }
      if (opening) window.addEventListener('scroll', onScroll, { passive: true })
      document.addEventListener('focusin', onFocus)
      // Font metrics settle independently of the opening; no fake loading wait.
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh() })

      return () => {
        alive = false
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('focusin', onFocus)
        cards.forEach(card => card.classList.remove('motion-card'))
        // Restore the DOM as well as GSAP's tween state. This also handles
        // immediate-render .from() tweens interrupted during an opening.
        snapshots.forEach((style, element) => {
          if (style === null) element.removeAttribute('style')
          else element.setAttribute('style', style)
        })
        delete html.dataset.motion
        delete html.dataset.opening
      }
    })
    return () => media.revert()
  }, [])
}
