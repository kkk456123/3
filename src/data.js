import { lifestyleGallery } from './lifestyleGallery.js'
import { motionGallery, renderGallery, usamsGallery } from './projectGalleries.js'

export const profile = {
  name: '慎佳威',
  englishName: 'Harvey',
  email: '1246697513@qq.com',
  phone: '13309135495',
  zcool: 'https://www.zcool.com.cn/u/ZNTk4OTg0ODA=',
}

export const projects = [
  {
    id: 'usams', number: '01', name: 'USAMS 优胜仕', subtitle: '让产品，成为视觉的主角。',
    category: '品牌视觉', tags: 'BRAND VISUAL / 3D RENDERING', year: '2025',
    cover: 'assets/usams-cover.webp', image: 'assets/project-panels/usams/01.webp',
    images: usamsGallery,
    galleryClass: 'dialog-gallery-six',
    framedImages: true,
    description: '围绕消费电子产品，结合品牌调性、产品特性与销售诉求，探索从单品渲染到场景叙事的视觉表达。作品包含产品材质、光影、构图及品牌电商场景设计。',
    role: '产品建模 · 材质渲染 · 电商视觉',
  },
  {
    id: 'jile', number: '02', name: '机乐堂 · 日常新视角', subtitle: '以生活感，建立产品与人的连接。',
    category: '产品视觉', tags: 'PRODUCT VISUAL / E-COMMERCE', year: '2025',
    cover: 'assets/jile-cover.webp', image: 'assets/lifestyle-gallery/01.webp',
    images: lifestyleGallery,
    galleryClass: 'dialog-gallery-paired',
    framedImages: true,
    description: '通过产品建模、场景渲染与后期精修，将产品卖点转化为易于感知的视觉信息。聚焦跨境电商与亚马逊页面中的产品呈现，让功能、材质与使用情境共同讲述产品故事。',
    role: '产品建模 · 场景渲染 · 详情页视觉',
  },
  {
    id: 'ai', number: '03', name: '产品动态 · 耳机视觉', subtitle: '以动态镜头，呈现产品的质感与细节。',
    category: '产品动态', tags: 'PRODUCT MOTION / 3D ANIMATION', year: '2025',
    cover: 'assets/motion-cover.webp', image: 'assets/project-panels/motion/01.webp',
    images: motionGallery,
    galleryLabel: '分镜脚本',
    videos: [
      { src: 'assets/joyroom-earbuds.mp4', poster: 'assets/motion-cover.webp', title: 'JOYROOM Funpods FN2 · 耳机动态', autoPlay: true },
      { src: 'assets/usams-xh09.mp4', poster: 'assets/usams-xh09-poster.webp', title: 'USAMS XH09 · 星河系列耳机动态外观', autoPlay: false },
    ],
    description: '以 JOYROOM Funpods FN2 耳机与 USAMS XH09 星河系列耳机为载体，通过镜头运动、材质光影与节奏编排，呈现耳机外观、结构细节与产品质感。这里展示两段动态成片及分镜画面，记录产品从静态造型到动态视觉表达的过程。',
    role: '产品动画 · 镜头与分镜 · 材质灯光 · 渲染与合成',
  },
  {
    id: 'render', number: '04', name: '光影与材质研究', subtitle: '从细节出发，让每一帧更有质感。',
    category: '产品视觉', tags: '3D STUDIES / MATERIAL & LIGHT', year: '2024',
    cover: 'assets/scene-render-cover.webp', image: 'assets/project-panels/render/01.webp',
    images: renderGallery,
    galleryClass: 'dialog-gallery-six',
    framedImages: true,
    description: '产品渲染与空间场景的阶段性作品整理。通过对光线、反射、结构与材质的推敲，探索照片级产品画面的实现方式，以及服务商业表达的视觉语言。',
    role: '3D 建模 · 材质研究 · 灯光与精修',
  },
]

// 首屏补充作品独立于下方四张精选作品卡片。
export const previewProjects = [
  {
    id: 'pet-scenes', name: '宠物智能产品 · 生活场景',
    category: '场景视觉', tags: 'PET PRODUCT / LIFESTYLE RENDERING',
    cover: 'assets/pet-scenes/01-cover.webp',
    images: lifestyleGallery,
    framedImages: true,
    description: '将宠物智能产品融入真实的居家情境，以温暖的自然光、木质空间与猫咪互动，呈现产品与日常生活的关系。画面围绕客厅、居家角落与陪伴场景展开，从猫砂盆到饮水设备，在柔和光影中表达产品的体积、材质与生活感。',
    role: '场景构建 · 材质灯光 · 产品渲染 · 视觉合成',
    galleryClass: 'dialog-gallery-paired',
  },
]

export const experiences = [
  { period: '2025.03 — 2026.01', company: '机乐堂 JOYROOM', role: '跨境电商 · 高级渲染师', detail: 'S 级项目渲染支持 / 亚马逊详情页视觉 / 建模到精修全流程' },
  { period: '2020.10 — 2025.03', company: '优胜仕 USAMS', role: '设计部 · 渲染组组长', detail: '团队管理与项目统筹 / 产品视觉规范 / 品牌电商视觉' },
  { period: '2020.03 — 2020.10', company: '蓝禾科技', role: '京东部门 · 渲染组组长', detail: '图拉斯、锐舞、诺印等品牌 3C 产品渲染 / 跨团队协作' },
]

export const capabilities = [
  { number: '01', name: '完整项目主导能力', text: '从产品理解、创意方向，到建模、渲染与后期精修，把控每一个视觉环节。', highlights: ['产品理解与创意方向', '建模渲染全流程把控', '细节精修与品质交付'], tools: 'CONCEPT → MODELING → RENDERING', icon: 'orbit' },
  { number: '02', name: '品牌视觉体系搭建', text: '围绕品牌调性与产品特性，建立有辨识度、可延展的商业视觉表达。', highlights: ['品牌调性与视觉语言', '产品视觉与场景表达', '多触点视觉一致性'], tools: 'BRAND / PRODUCT / E-COMMERCE', icon: 'brand' },
  { number: '03', name: 'AI 设计提效', text: '将 AI 融入场景探索、情绪版与视觉迭代，缩短创意验证路径，让设计流程更高效。', highlights: ['场景生成与灵感拓展', '创意方案快速验证', '视觉迭代与流程提效'], tools: 'AI / SCENE / WORKFLOW', icon: 'spark' },
  { number: '04', name: '设计管理统筹', text: '结合渲染组管理经验，统筹项目资源、协作流程与视觉品质。', highlights: ['项目排期与资源统筹', '团队协作与流程规范', '视觉品质与交付把控'], tools: 'TEAM / WORKFLOW / QUALITY', icon: 'cube' },
  { number: '05', name: '跨团队协同', text: '理解商业需求，以清晰的视觉语言沟通，让创意高效落地。', highlights: ['商业需求与目标对齐', '跨团队沟通与协作', '创意落地与反馈迭代'], tools: 'COMMUNICATION / DELIVERY', icon: 'team' },
]

// 首屏作品切片；冷暖与明暗交错，循环首尾也避免同组场景相邻。
export const heroPreviews = [
  { label: '产品的另一面', image: 'assets/usams-cover.webp', projectId: 'usams' },
  { label: '日常的陪伴', image: 'assets/pet-scenes/01-cover.webp', projectId: 'pet-scenes' },
  { label: '声音的形状', image: 'assets/preview-scenes/05.webp', projectId: 'ai' },
  { label: '光落之处', image: 'assets/preview-scenes/07.webp', projectId: 'render' },
  { label: '温暖的角落', image: 'assets/pet-scenes/02-cover.webp', projectId: 'pet-scenes' },
  { label: '耳机动态视觉', image: 'assets/motion-cover.webp', projectId: 'ai' },
  { label: '海风与光', image: 'assets/preview-scenes/08.webp', projectId: 'render' },
  { label: '宠物与生活', image: 'assets/pet-scenes/03-cover.webp', projectId: 'pet-scenes' },
  { label: '午后的呼吸', image: 'assets/preview-scenes/09.webp', projectId: 'render' },
  { label: '陪伴的细节', image: 'assets/preview-scenes/03.webp', projectId: 'pet-scenes' },
  { label: '日常新视角', image: 'assets/jile-cover.webp', projectId: 'jile' },
  { label: '光影与空间', image: 'assets/scene-render-cover.webp', projectId: 'render' },
]

// 首屏视频按此顺序连续播放，结束后回到第一段。
export const heroVideos = ['assets/video/hero-black.mp4', 'assets/video/hero-white.mp4']
