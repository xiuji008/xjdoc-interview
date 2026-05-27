export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const links = [
    {
      label: 'CSDN',
      url: 'https://xiuji.blog.csdn.net/',
      logo: 'logos/csdn-ico.ico',
      desc: 'CSDN 技术博客',
    },
    {
      label: '掘金',
      url: 'https://juejin.cn/user/2641475936724142',
      logo: 'logos/juejin-logo.png',
      desc: '掘金技术专栏',
    },
    {
      label: '知乎',
      url: 'https://www.zhihu.com/people/xiuji_lew',
      logo: 'logos/zhihu-logo.png',
      desc: '知乎个人主页',
    },
    {
      label: '个人博客',
      url: 'https://xiuji008.github.io/',
      logo: 'logos/blog-xj.svg',
      desc: '技术博客',
    },
    {
      label: '面试知识库',
      url: 'https://xiuji008.github.io/xjdoc-interview/',
      logo: 'logos/blog-xj.svg',
      desc: '面试知识库（持续更新中）',
    },
    {
      label: 'GitHub 项目',
      url: 'https://github.com/xiuji008/xjdoc-interview',
      logo: null,
      desc: '项目源码仓库',
    },
  ]

  return (
    <div className="about-overlay" onClick={onClose}>
      <div className="about-modal" onClick={(e) => e.stopPropagation()}>
        <div className="about-modal-header">
          <span>👨‍💻 关于作者</span>
          <button className="about-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="about-modal-body">
          <div className="about-avatar-section">
            <img className="about-avatar" src="logos/blog-xj.svg" alt="Author" />
            <h2 className="about-nickname">修己xj</h2>
            <p className="about-bio">全栈开发者 · 终身学习者 · 知识分享者</p>
          </div>
          <div className="about-divider" />
          <div className="about-links">
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="about-link-card"
              >
                <span className="about-link-icon">
                  {link.logo ? (
                    <img className="about-logo-img" src={link.logo} alt={link.label} />
                  ) : (
                    <svg viewBox="0 0 16 16" fill="currentColor" width="20" height="20">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                  )}
                </span>
                <div className="about-link-info">
                  <span className="about-link-label">{link.label}</span>
                  <span className="about-link-desc">{link.desc}</span>
                </div>
                <span className="about-link-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
        <div className="about-modal-footer">
          Made with ❤️ by xiuji
        </div>
      </div>
    </div>
  )
}
