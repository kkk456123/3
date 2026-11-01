import { useEffect, useRef, useState } from 'react'
import { capabilities, experiences, profile, projects } from './data'

const asset = path => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

function Arrow({ down = false }) {
  return <svg className={`arrow ${down ? 'arrow-down' : ''}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.3" /></svg>
}

function CapabilityIcon({ type }) {
  const shapes = {
    frame: <><path d="M8 20V8h12M44 20V8H32M8 32v12h12M44 32v12H32" /><circle cx="26" cy="26" r="9" /><path d="M26 12v28M12 26h28" opacity=".35" /></>,
    cube: <><path d="m26 6 18 10v21L26 47 8 37V16L26 6Zm0 0v21m18-11L26 27 8 16m18 11v20" /><path d="m8 37 18-10 18 10" opacity=".35" /></>,
    spark: <><path d="M26 5c0 15-6 21-21 21 15 0 21 6 21 21 0-15 6-21 21-21C32 26 26 20 26 5Z" /><path d="m10 10 32 32M10 42l32-32" opacity=".35" /></>,
    orbit: <><ellipse cx="26" cy="26" rx="23" ry="10" transform="rotate(-35 26 26)" /><ellipse cx="26" cy="26" rx="23" ry="10" transform="rotate(35 26 26)" /><circle cx="26" cy="26" r="4" fill="currentColor" /></>,
  }
  return <svg className="cap-icon" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeWidth=".8" aria-hidden="true">{shapes[type]}</svg>
}

function SectionLabel({ number, label, children }) {
  return <div className="section-label"><span className="section-number">{number}</span><span>{label}</span>{children && <span className="label-end">{children}</span>}</div>
}

function ProjectDialog({ project, onClose }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    if (!project) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current.showModal()
    return () => { document.body.style.overflow = previousOverflow }
  }, [project])

  if (!project) return null
  return <dialog ref={dialogRef} className="project-dialog" aria-labelledby="project-dialog-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close() }}>
    <div className="dialog-inner">
      <div className="dialog-top"><span>{project.tags}</span><button autoFocus className="dialog-close" aria-label="关闭项目" onClick={() => dialogRef.current.close()}>关闭 <span>×</span></button></div>
      <div className="dialog-intro"><p className="eyebrow">SELECTED PROJECT / {project.year}</p><h2 id="project-dialog-title">{project.name}</h2><p>{project.description}</p><div className="dialog-role"><span>项目内容</span>{project.role}</div></div>
      <img className="dialog-artwork" src={asset(project.image)} alt={`${project.name}完整作品展示`} />
      <div className="dialog-bottom"><p>让下一个好项目，从一次交流开始。</p><a href={`mailto:${profile.email}`}>联系我 <Arrow /></a></div>
    </div>
  </dialog>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('全部作品')
  const [selectedProject, setSelectedProject] = useState(null)
  const [toast, setToast] = useState('')
  const [playing, setPlaying] = useState(true)
  const [videoFailed, setVideoFailed] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const videoRef = useRef(null)
  const toastTimer = useRef(null)
  const visibleProjects = filter === '全部作品' ? projects : projects.filter(project => project.category === filter)

  useEffect(() => {
    const video = videoRef.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      if (preference.matches) { video.pause(); setPlaying(false) }
      else video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
    update()
    preference.addEventListener('change', update)
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id) }, { rootMargin: '-15% 0px -50% 0px' })
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section))
    return () => { preference.removeEventListener('change', update); observer.disconnect(); window.clearTimeout(toastTimer.current) }
  }, [])

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); setToast('邮箱已复制，期待与你交流。') }
    catch { setToast(`我的邮箱：${profile.email}`) }
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3500)
  }
  const toggleVideo = async () => {
    const video = videoRef.current
    if (!video.paused) { video.pause(); setPlaying(false) }
    else { try { await video.play(); setPlaying(true) } catch { setPlaying(false); setVideoFailed(true) } }
  }
  const closeMenu = () => setMenuOpen(false)

  return <>
    <a className="skip-link" href="#about">跳到主要内容</a>
    <header className="nav-wrap"><nav className="nav container" aria-label="主导航">
      <a className="wordmark" href="#top" aria-label="Harvey 首页">harvey<span className="wordmark-star">✳</span><span className="wordmark-dot">®</span></a>
      <div id="main-navigation" className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
        {[['top','首页','HOME'],['about','关于我','ABOUT'],['projects','精选作品','WORK'],['capabilities','我的优势','EXPERTISE']].map(([id,cn,en]) => <a key={id} href={`#${id}`} onClick={closeMenu} className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'location' : undefined}><span>{cn}</span><small>{en}</small></a>)}
      </div>
      <a className="contact-pill" href="#contact">聊聊合作 <Arrow /></a>
      <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} aria-label={menuOpen ? '关闭导航' : '打开导航'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </nav></header>

    <main>
      <section id="top" className="hero" style={{ '--hero-poster': `url("${asset('assets/hero-poster.webp')}")` }}>
        <video ref={videoRef} className={`hero-video ${videoFailed ? 'video-failed' : ''}`} autoPlay muted loop playsInline preload="metadata" poster={asset('assets/hero-poster.webp')} aria-hidden="true" onError={() => { setVideoFailed(true); setPlaying(false) }}><source src={asset('assets/hero.mp4')} type="video/mp4" /></video>
        <div className="hero-poster" aria-hidden="true" />
        <div className="hero-shade" /><div className="hero-grain" />
        <div className="hero-body container">
          <div className="hero-eyebrow"><span className="status-dot" /> INDEPENDENT THINKING. DISTINCTIVE VISUALS.</div>
          <h1>Beyond<br /><span>the <i>ordinary.</i><span className="title-star">✳</span></span></h1>
          <div className="hero-description"><span className="tiny-plus">+</span><div><h2>视觉不止于所见。</h2><p>我是慎佳威 Harvey，一名视觉 / AI / 品牌设计师。<br />在创意与商业之间，探索设计的更多可能。</p></div></div>
          <a className="hero-explore" href="#projects"><span>探索我的作品<small>EXPLORE SELECTED WORK</small></span><span className="round-arrow"><Arrow /></span></a>
        </div>
        <div className="hero-bottom container"><a href="#about" className="scroll-cue"><span className="scroll-line" />SCROLL TO DISCOVER</a><span className="hero-location">SHENZHEN, CHINA <span>22°32′N 114°03′E</span></span><button className="video-control" onClick={toggleVideo} disabled={videoFailed} aria-label={playing ? '暂停背景视频' : '播放背景视频'}><span className={playing ? 'pause-icon' : 'play-icon'} />{videoFailed ? 'STILL FRAME' : playing ? 'PAUSE FILM' : 'PLAY FILM'}</button></div>
      </section>

      <div className="discipline-strip"><div className="container"><span>VISUAL DESIGN</span><span className="strip-star">✳</span><span>3D & MOTION</span><span className="strip-star">✳</span><span>AI EXPLORATION</span><span className="strip-star">✳</span><span>BRAND THINKING</span><span className="strip-star">✳</span></div></div>

      <section id="about" className="about section-space container">
        <SectionLabel number="01" label="ABOUT ME / 关于我">DESIGN WITH PURPOSE.</SectionLabel>
        <div className="about-layout">
          <div className="portrait-area"><div className="portrait-frame"><img src={asset('assets/portrait.webp')} alt="慎佳威 Harvey 的个人肖像" loading="lazy" /><span className="portrait-cross cross-top">+</span><span className="portrait-cross cross-bottom">+</span><div className="portrait-tag"><span>慎佳威</span><small>HARVEY / DESIGNER</small></div></div><div className="portrait-caption"><span className="status-dot" /> BASED IN SHENZHEN<span>EST. 2019</span></div></div>
          <div className="about-copy"><p className="eyebrow">A LITTLE ABOUT MYSELF</p><h2>不止于视觉表现，<br />更关注设计背后的<br /><span>商业价值。</span></h2><p className="about-description">我是慎佳威，也可以叫我 Harvey。深耕产品视觉设计，曾任优胜仕、蓝禾京东渲染组组长，以及机乐堂高级渲染师。</p><p className="about-description">从产品建模、渲染、精修，到包装、电商及亚马逊页面，我习惯从真实的市场需求出发，用设计连接产品与用户。现在，也在持续探索 AI 为视觉创作带来的新可能。</p><div className="about-actions"><a className="underlined-link" href={asset(profile.resume)} download="慎佳威-Harvey-2026简历.pdf">下载我的简历 <Arrow down /></a><a className="subtle-link" href={profile.zcool} target="_blank" rel="noreferrer">站酷主页 <Arrow /></a></div><div className="about-contact"><a href={`mailto:${profile.email}`}>{profile.email}</a><span>/</span><a href={`tel:${profile.phone}`}>{profile.phone}</a></div></div>
        </div>
        <div className="stats-grid"><div className="stat"><strong>7<span>+</span></strong><p>年设计实战经验<small>YEARS OF EXPERIENCE</small></p></div><div className="stat"><strong>3<span>D</span></strong><p>产品视觉全流程<small>MODELING → RENDERING</small></p></div><div className="stat"><strong>04</strong><p>精选作品系列<small>SELECTED COLLECTIONS</small></p></div><div className="stat stat-quote"><span className="quote-mark">“</span><p>让每一张画面，<br />都有它存在的意义。</p><small>MY DESIGN APPROACH</small></div></div>
        <div className="experience-heading"><h3>走过的每一程，都是积累。</h3><span>EXPERIENCE / 2020 — 2026</span></div>
        <div className="experience-list">{experiences.map(item => <article className="experience-row" key={item.company}><span className="experience-period">{item.period}</span><h4>{item.company}</h4><div><p>{item.role}</p><small>{item.detail}</small></div><span className="experience-plus" aria-hidden="true">↗</span></article>)}</div>
        <div className="earlier-experience"><span>EARLIER</span>2019.02 — 2020.03 · 古尚古数码 / 渲染与设计师<span>学习经历 · 深圳大学 / 视觉传达设计（2024.03 起）</span></div>
      </section>

      <section id="projects" className="projects section-space">
        <div className="container"><SectionLabel number="02" label="SELECTED WORK / 精选作品">A SELECTION OF MY VISUAL WORLD.</SectionLabel><div className="section-heading"><div><p className="eyebrow">IDEAS MADE VISIBLE.</p><h2>一些作品。<br /><span>一些<i>不一样</i>的视角。</span></h2></div><p className="heading-note">用光影塑造质感，以创意回应需求。<br />这是我对产品、品牌与未来视觉的思考。</p></div>
        <div className="projects-toolbar"><div className="filters" role="group" aria-label="筛选作品">{['全部作品','品牌视觉','产品视觉','AI 实验'].map(category => <button key={category} className={filter === category ? 'selected' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{category === '全部作品' && <sup>04</sup>}</button>)}</div><span className="project-count" aria-live="polite">{String(visibleProjects.length).padStart(2,'0')} PROJECTS</span></div>
        <div className="project-grid">{visibleProjects.map((project, i) => <button className={`project-card project-${project.id} ${filter === '全部作品' && (i === 0 || i === 3) ? 'project-wide' : ''}`} key={project.id} onClick={() => setSelectedProject(project)} aria-label={`查看${project.name}完整作品`}><div className="project-image-wrap"><img src={asset(project.cover)} alt={project.name + '作品封面'} loading="lazy" /><div className="project-overlay" /><span className="project-number">{project.number} / SELECTED WORK</span><span className="project-view">VIEW PROJECT <Arrow /></span></div><div className="project-info"><div><span className="project-category">{project.tags}</span><h3>{project.name}<Arrow /></h3><p>{project.subtitle}</p></div><span className="project-year">{project.year}</span></div></button>)}</div>
        <div className="projects-end"><span>持续探索，持续创造。</span><a className="underlined-link" href={profile.zcool} target="_blank" rel="noreferrer">更多作品，尽在站酷 <Arrow /></a></div></div>
      </section>

      <section id="capabilities" className="capabilities section-space container"><SectionLabel number="03" label="MY EXPERTISE / 我的优势">IDEA × CRAFT × TECHNOLOGY</SectionLabel><div className="section-heading"><div><p className="eyebrow">THINK CLEAR. CREATE DIFFERENT.</p><h2>多一点思考。<br /><span>多一种<i>可能。</i></span></h2></div><p className="heading-note">从视觉表现到商业落地，<br />以完整的能力，回应每一次新的挑战。</p></div><div className="capability-grid">{capabilities.map(capability => <article className="capability-card" key={capability.number}><div className="cap-top"><span>{capability.number} /</span><Arrow /></div><CapabilityIcon type={capability.icon} /><span className="cap-en">{capability.en}</span><h3>{capability.name}</h3><p>{capability.text}</p><div className="cap-tools">{capability.tools}</div></article>)}</div><div className="capabilities-note"><span className="tiny-plus">+</span><p>审美是起点，解决问题才是设计的落点。</p><span>ALWAYS CURIOUS. ALWAYS CREATING.</span></div></section>

      <section id="contact" className="contact"><div className="contact-orbit" aria-hidden="true"><div /><div /><span>✳</span></div><div className="contact-inner container"><SectionLabel number="04" label="LET'S CONNECT / 联系我"><span className="status-dot" /> OPEN TO NEW POSSIBILITIES</SectionLabel><div className="contact-main"><p className="eyebrow">GREAT THINGS START WITH A CONVERSATION.</p><h2>下一个好作品，<br />从一次<i>交流</i>开始<span>。</span></h2><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a><div className="contact-options"><a href={`tel:${profile.phone}`}>{profile.phone}<small>PHONE</small></a><button onClick={copyEmail}>复制邮箱<small>COPY EMAIL ↗</small></button><a href={profile.zcool} target="_blank" rel="noreferrer">站酷 ZCOOL<small>MORE WORK ↗</small></a></div></div><footer><a className="footer-logo" href="#top">harvey<span>✳</span></a><span>© 2026 慎佳威 · HARVEY</span><span>MADE WITH INTENTION.</span><a className="back-top" href="#top">回到顶部 <Arrow /></a></footer></div></section>
    </main>
    <div className={`toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
  </>
}
