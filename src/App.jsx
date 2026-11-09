import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import CareerHorizon from './components/CareerHorizon'
import BorderGlow from './components/BorderGlow'
import HeroOrbit from './components/HeroOrbit'
import ProjectVideo from './components/ProjectVideo'
import Crosshair from './components/Crosshair'
import usePortfolioMotion from './motion/usePortfolioMotion'
import { capabilities, experiences, heroPreviews, heroVideos, previewProjects, profile, projects } from './data'
import { asset, imageProps } from './media'

const Grainient = lazy(() => import('./components/Grainient'))

function PortfolioCrosshair({ enabled = true }) {
  return <Crosshair enabled={enabled} color="#d4ff47" thickness={0.75} opacity={0.48} gap={9} fade={0.85} smoothing={0.35} showCoordinates targetEffect="lock" targetSelector="a, button:not(.project-video-surface), input[type=range], .profile-portrait, .capability-card" clickPulse hideCursor={false} />
}

function Arrow({ down = false }) {
  return <svg className={'arrow' + (down ? ' arrow-down' : '')} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg>
}

function Brand({ className = '' }) {
  return <span className={'brand ' + className}><span className="brand-symbol" aria-hidden="true">✦</span>Harvey</span>
}

function HoverText({ text }) {
  return <span className="hover-text" aria-hidden="true">{text.split(/(\s+)/).map((word, index) => /\s/.test(word)
    ? word
    : <span className="hover-word" key={index}>{Array.from(word).map((letter, letterIndex) => <span className="hover-letter" key={letterIndex}>{letter}</span>)}</span>)}</span>
}

function SectionTitle({ title, subtitle }) {
  return <div className="module-heading"><h2 aria-label={title}><span className="module-title-text" aria-hidden="true">{title.split(' ').map((word, index) => <span className="motion-word-mask" key={index}><span className="motion-word"><HoverText text={word} /></span></span>)}</span><span className="heading-arrow"><Arrow down /></span></h2><p>{subtitle}</p></div>
}

function CapabilityArt({ type, id }) {
  const gradient = 'art-gradient-' + id
  return <svg className={'cap-art art-' + type} viewBox="0 0 220 190" aria-hidden="true">
    <defs><linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--cap-art-0, #d5ff67)" /><stop offset=".55" stopColor="var(--cap-art-1, #88a83c)" /><stop offset=".75" stopColor="var(--cap-art-2, #aea0eb)" /><stop offset="1" stopColor="var(--cap-art-3, #7866c2)" /></linearGradient></defs>
    <g fill={'url(#' + gradient + ')'}>
      {type === 'orbit' && <><ellipse cx="116" cy="120" rx="82" ry="34" transform="rotate(-30 116 120)" /><ellipse cx="116" cy="104" rx="60" ry="24" transform="rotate(-30 116 104)" fill="var(--cap-art-5, #0b1517)" /><path d="m110 37 14 33 36 9-32 16-9 35-15-32-35-9 32-16Z" fill="var(--cap-art-4, #c7bddf)" /></>}
      {type === 'brand' && <><rect x="42" y="66" width="138" height="64" rx="32" transform="rotate(-15 110 98)" /><path d="m110 50 12 33 33 12-33 12-12 33-12-33-33-12 33-12Z" fill="var(--cap-art-13, #f5ffe1)" /></>}
      {type === 'spark' && <><path d="M42 125a70 70 0 1 0 111-72l-22 31a32 32 0 1 1-51 33Z" /><circle cx="154" cy="60" r="31" /><circle cx="154" cy="60" r="15" fill="var(--cap-art-12, #172326)" /><path d="m73 54 13 27 29 9-27 14-9 29-14-27-29-9 27-14Z" fill="var(--cap-art-11, #d8ccef)" /></>}
      {type === 'cube' && <><path d="m43 102 72-39 71 40-72 40Z" /><path d="m43 102 71 41v40l-71-41Z" fill="var(--cap-art-6, #a492df)" /><path d="m114 143 72-40v39l-72 41Z" fill="var(--cap-art-7, #70913b)" /><path d="m77 65 56-31 53 30-54 31Z" /><path d="m77 65 55 30v39l-55-30Z" fill="var(--cap-art-8, #b4a6e4)" /><circle cx="176" cy="39" r="17" fill="var(--cap-art-9, #c9baf4)" /></>}
      {type === 'team' && <><circle cx="116" cy="76" r="45" /><circle cx="116" cy="76" r="23" fill="var(--cap-art-14, #152322)" /><path d="M45 157c3-47 34-66 71-66s68 19 71 66c-37 31-105 31-142 0Z" /><path d="M45 157c34-9 46-35 46-61-28 8-44 29-46 61Z" fill="var(--cap-art-10, #b2a4df)" /></>}
    </g>
  </svg>
}

function ProjectDialog({ project, onClose }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    if (!project) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current.showModal()
    const dialog = dialogRef.current
    return () => {
      dialog.querySelectorAll('video').forEach(video => video.pause())
      document.body.style.overflow = previousOverflow
    }
  }, [project])
  if (!project) return null
  const renderArtwork = (image, index) => {
    const columns = image.span === 2 && project.galleryClass === 'dialog-gallery-six' ? 3 : image.span === 3 || image.span === 1 ? 2 : 1
    const sizes = `(max-width: 800px) calc(100vw - 60px), (max-width: 1210px) calc((100vw - 112px) / ${columns}), ${Math.round((1098 - (columns - 1) * 12) / columns)}px`
    const artwork = <img key={image.src} className="dialog-artwork" {...imageProps(image.src, sizes)} alt={project.name + '完整作品展示 · ' + (index + 1)} loading={index === 0 ? 'eager' : 'lazy'} />
    return project.framedImages
      ? <figure className="dialog-image-card" style={{ '--image-span': image.span || 2 }} key={image.src}>{artwork}</figure>
      : artwork
  }
  let artworkIndex = 0
  return <dialog ref={dialogRef} className="project-dialog" aria-labelledby="project-dialog-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close() }}>
    <PortfolioCrosshair />
    <div className="dialog-inner">
      <div className="dialog-top"><span>{project.tags}</span><button autoFocus className="dialog-close" aria-label="关闭项目" onClick={() => dialogRef.current.close()}>关闭 <span>×</span></button></div>
      <div className="dialog-intro"><p className="eyebrow">SELECTED PROJECT{project.year ? ` / ${project.year}` : ''}</p><h2 id="project-dialog-title">{project.name}</h2><p>{project.description}</p><div className="dialog-role"><span>项目内容</span>{project.role}</div></div>
      {project.videos && <div className="project-videos">{project.videos.map(video => <ProjectVideo key={video.src} video={video} />)}</div>}
      {project.galleryLabel && <h3 className="dialog-gallery-label">{project.galleryLabel}</h3>}
      {project.images ? <div className={'dialog-artworks' + (project.galleryClass ? ' ' + project.galleryClass : '')}>{project.images.map((image, index) => {
        if (image.columns) return <div className="dialog-image-columns" key={'columns-' + index}>{image.columns.map((column, columnIndex) => <div className="dialog-image-column" key={columnIndex}>{column.map(panel => renderArtwork(panel, artworkIndex++))}</div>)}</div>
        return renderArtwork(image, artworkIndex++)
      })}</div> : <img className="dialog-artwork" src={asset(project.image)} alt={project.name + '完整作品展示'} />}
      <div className="dialog-bottom"><p>让下一个好项目，从一次交流开始。</p><a className="text-link" href={'mailto:' + profile.email}>联系我 <Arrow /></a></div>
    </div>
  </dialog>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [videoIndex, setVideoIndex] = useState(0)
  const [videoFailed, setVideoFailed] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const [scrolled, setScrolled] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [heroVisible, setHeroVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [heroSourceEnabled, setHeroSourceEnabled] = useState(false)
  const [backgroundReady, setBackgroundReady] = useState(false)
  const videoRef = useRef(null)
  usePortfolioMotion()

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    let scrollFrame = 0
    const readScroll = () => { scrollFrame = 0; setScrolled(window.scrollY > window.innerHeight * .65) }
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(readScroll) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id)
    }, { rootMargin: '-20% 0px -45% 0px' })
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section))
    const heroObserver = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0 })
    heroObserver.observe(videoRef.current.closest('section'))
    const visibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      preference.removeEventListener('change', update)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(scrollFrame)
      observer.disconnect()
      heroObserver.disconnect()
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!heroSourceEnabled || selectedProject || reducedMotion || !heroVisible || !pageVisible) video.pause()
    else video.play().catch(() => {})
  }, [videoIndex, selectedProject, reducedMotion, heroVisible, pageVisible, heroSourceEnabled])

  useEffect(() => {
    if (heroSourceEnabled || reducedMotion || !heroVisible || navigator.connection?.saveData) return
    // Let the heading, poster and opening render before video network/decode work.
    const enable = () => setHeroSourceEnabled(true)
    const idle = 'requestIdleCallback' in window
    const handle = idle ? window.requestIdleCallback(enable, { timeout: 800 }) : setTimeout(enable, 250)
    return () => { if (idle) window.cancelIdleCallback(handle); else clearTimeout(handle) }
  }, [heroSourceEnabled, reducedMotion, heroVisible])

  useEffect(() => { if (scrolled && !reducedMotion) setBackgroundReady(true) }, [scrolled, reducedMotion])

  const openPreview = preview => setSelectedProject([...projects, ...previewProjects].find(project => project.id === preview.projectId))

  return <>
    <PortfolioCrosshair enabled={!selectedProject} />
    <a className="skip-link" href="#about">跳到主要内容</a>
    <header className={'nav-wrap' + (scrolled ? ' is-scrolled' : '')}><nav className="nav" aria-label="主导航">
      <a className="wordmark" href="#top" aria-label="Harvey 首页" onClick={() => setMenuOpen(false)}><Brand /></a>
      <div id="main-navigation" className={'nav-links' + (menuOpen ? ' is-open' : '')}>
        {[['about', '工作经历'], ['projects', '视觉作品'], ['capabilities', '个人优势']].map(([id, cn]) => <a key={id} href={'#' + id} onClick={() => setMenuOpen(false)} className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'location' : undefined}>{cn}</a>)}
      </div>
      <div className="nav-actions"><a className="contact-pill" href="#contact" onClick={() => setMenuOpen(false)}>联系我 <Arrow /></a><button className={'menu-toggle' + (menuOpen ? ' is-open' : '')} aria-label={menuOpen ? '关闭导航' : '打开导航'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button></div>
    </nav></header>

    <main className="portfolio-main">
      <div className="page-background" aria-hidden="true">
        {backgroundReady && !reducedMotion && <Suspense fallback={null}><Grainient active={scrolled && !selectedProject} colors={['#000000', '#103554', '#000000']} angle={40} flow={0.8} silk={1} grainAmount={0.08} type="radial" scale={0.75} speed={1.35} variation={15} dpr={1} maxFps={30} maxPixels={1500000} intro={false} interactive stir={0.5} clickSwirl={false} /></Suspense>}
      </div>
      <section id="top" className="hero" style={{ '--hero-poster': 'url("' + asset('assets/hero-poster.webp') + '")' }}>
        <div className="hero-film"><video ref={videoRef} className={'hero-video' + (videoFailed ? ' video-failed' : '')} muted playsInline preload="metadata" poster={asset('assets/hero-poster.webp')} aria-hidden="true" src={heroSourceEnabled ? asset(heroVideos[videoIndex]) : undefined} onEnded={() => { setVideoFailed(false); setVideoIndex(index => (index + 1) % heroVideos.length) }} onError={() => setVideoFailed(true)} />
        <div className="hero-poster" aria-hidden="true" /></div><div className="hero-shade" aria-hidden="true" /><div className="hero-shade hero-shade-extra" aria-hidden="true" /><div className="hero-grain" aria-hidden="true" />
        <div className="opening-curtain opening-curtain-top" aria-hidden="true" /><div className="opening-curtain opening-curtain-bottom" aria-hidden="true" /><div className="opening-seam" aria-hidden="true" />
        <div className="hero-body container">
          <p className="hero-eyebrow"><span className="status-dot" />VISUAL / AI / BRAND DESIGNER</p>
          <h1 aria-label="Harvey Portfolio"><span className="hero-line-mask"><span className="hero-name" aria-hidden="true">{'HARVEY'.split('').map((letter, index) => <span className="hero-glyph" key={index}>{letter}</span>)}<span className="hero-sparkles">✦<small>✦</small></span></span></span><span className="hero-line-mask"><span className="hero-title" aria-hidden="true">{'PORTFOLIO'.split('').map((letter, index) => <span className="hero-title-glyph" key={index}>{letter}</span>)}</span></span></h1>
          <p className="hero-description">用视觉表达，让品牌被看见。<br />以 3D 与 AI，探索设计的更多可能。</p>
        </div>
        <HeroOrbit previews={heroPreviews} onSelect={openPreview} paused={Boolean(selectedProject)} />
      </section>

      <section id="about" className="about module-section"><div className="container">
        <SectionTitle title="WORK EXPERIENCE" subtitle="个人经历" />
        <div className="profile-grid">
          <div className="profile-portrait" tabIndex={0} aria-label="慎佳威 Harvey 与猫咪的彩色插画"><img {...imageProps('assets/responsive/114-1086.webp', '(max-width: 800px) calc(100vw - 44px), 550px')} alt="蓝色背景下的 Harvey 与橘猫彩色手绘插画，左上角写着 Me & My Cat" loading="lazy" /><span className="portrait-tag">7 YEARS / VISUAL · 3D · AI</span><div className="portrait-label"><span>慎佳威</span><small>HARVEY / DESIGNER</small></div><BorderGlow /></div>
          <div className="profile-content"><p className="eyebrow lime">ABOUT ME</p><h3 aria-label="Hi, I am Harvey!"><HoverText text="Hi, I am Harvey!" /></h3><p className="profile-intro">我是慎佳威，一名视觉 / AI / 品牌设计师。专注产品视觉与三维渲染，以设计连接品牌、产品与用户，也持续探索 AI 为商业视觉带来的新可能。</p>
            <div className="profile-details"><div><small>职业方向</small><strong>Visual / 3D / AI Designer</strong></div><div><small>所在城市</small><strong>深圳 · SHENZHEN</strong></div><div><small>手机</small><a href={'tel:' + profile.phone}>{profile.phone}</a></div><div><small>邮箱</small><a href={'mailto:' + profile.email}>{profile.email}</a></div></div>
            <div className="profile-stats"><div><strong>7<span>+</span></strong><small>年设计实战经验</small></div><div><strong>3D</strong><small>产品视觉全流程</small></div><div><strong>05</strong><small>项核心能力</small></div></div>
            <div className="profile-bottom"><div><small className="eyebrow lime">EXPLORING NOW</small><div className="skill-tags"><span>AI 场景探索</span><span>光影与材质</span><span>产品视觉表达</span></div></div></div>
          </div>
        </div>
        <CareerHorizon experiences={experiences} />
        <div className="career-earlier"><p>2019.02 — 2020.03 · 古尚古数码 / 渲染与设计师</p><p>深圳大学 · 视觉传达设计（2024.03 起）</p></div>
      </div><span className="section-watermark" aria-hidden="true">HARVEY</span></section>

      <section id="projects" className="projects module-section"><div className="container">
        <div className="works-heading"><SectionTitle title="SELECTED WORKS" subtitle="视觉作品" /><a className="text-link zcool-link" href={profile.zcool} target="_blank" rel="noreferrer">站酷 · 更多作品 <Arrow /></a></div>
        <div className="project-grid">{projects.map(project => <button className={'project-card project-' + project.id} key={project.id} onClick={() => setSelectedProject(project)} aria-label={'查看' + project.name + '完整作品'}><span className="project-media"><span className="project-image-plane"><img {...imageProps(project.cover, project.id === 'usams' ? '(max-width: 800px) calc(100vw - 44px), 1000px' : '(max-width: 800px) calc(100vw - 44px), 500px')} alt={project.name + '作品封面'} loading="lazy" /></span></span><div className="project-overlay" /><div className="project-info"><span className="project-category">{project.category}</span><h3>{project.name}</h3><p>{project.role}</p></div><span className="project-card-arrow"><Arrow /></span><BorderGlow /></button>)}</div>
      </div></section>

      <section id="capabilities" className="capabilities module-section"><div className="container">
        <SectionTitle title="CORE STRENGTHS" subtitle="个人优势" />
        <div className="capability-grid">{capabilities.map((capability, index) => <article className={'capability-card' + (index === 1 ? ' capability-brand' : '')} tabIndex={0} key={capability.number}><div className="cap-top"><span>{capability.number}</span><small>{index < 2 ? 'CORE' : 'SYSTEM'}</small></div><h3>{capability.name}<span>·</span></h3><p>{capability.text}</p><div className="cap-art-clip"><CapabilityArt type={capability.icon} id={capability.number} /></div><div className="cap-highlights-clip"><div className="cap-highlights">{capability.highlights.map((text, highlightIndex) => <span key={text} style={{ '--highlight-index': highlightIndex }}>{text}</span>)}</div></div><span className="cap-tools">{capability.tools}</span><BorderGlow /></article>)}</div>
      </div></section>

      <section id="contact" className="contact">
        <div className="contact-layout container">
          <div className="contact-statement"><p>联系方式</p><h2 aria-label="以视觉赋能产品价值"><span className="contact-title-mask"><span className="contact-title-line"><HoverText text="以视觉" /></span></span><span className="contact-title-mask"><span className="contact-title-line"><HoverText text="赋能产品价值" /> <Arrow down /></span></span></h2><a className="contact-brand" href="#top" aria-label="Harvey 回到顶部"><Brand /><Arrow /></a><p className="contact-note">让下一个好作品，从一次交流开始。</p></div>
          <div className="contact-card">
            <p className="eyebrow lime">CONTACT</p>
            <a className="contact-line" href={'tel:' + profile.phone}><small>手机</small><span>{profile.phone}</span><Arrow /></a>
            <a className="contact-line" href={'mailto:' + profile.email}><small>邮箱</small><span>{profile.email}</span><Arrow /></a>
            <a className="contact-line" href={profile.zcool} target="_blank" rel="noreferrer"><small>作品</small><span>站酷 ZCOOL</span><Arrow /></a>
            <figure className="contact-qr">
              <img src={asset('assets/wechat-qr.png')} alt="Harvey 的微信二维码，使用微信扫一扫添加好友" width="1056" height="1056" loading="lazy" />
              <figcaption>微信扫一扫，添加好友</figcaption>
            </figure>
            <BorderGlow />
          </div>
        </div>
        <footer className="container"><span>© 2026 慎佳威 · HARVEY</span><span>DESIGNED WITH PURPOSE.</span><a className="back-to-top" href="#top"><span>回到顶部</span><span className="back-to-top-icon"><Arrow /></span></a></footer>
      </section>
    </main>
    <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
  </>
}
