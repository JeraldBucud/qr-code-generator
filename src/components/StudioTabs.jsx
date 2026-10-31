
import { useRef } from 'react'

export default function StudioTabs({
  activeTab,
  onChange,
}) {
  const contentRef = useRef(null)
  const designRef = useRef(null)

  function handleKeyDown(event) {
    let nextTab = null

    if (
      event.key === 'ArrowRight' ||
      event.key === 'ArrowLeft'
    ) {
      nextTab =
        activeTab === 'content'
          ? 'design'
          : 'content'
    } else if (event.key === 'Home') {
      nextTab = 'content'
    } else if (event.key === 'End') {
      nextTab = 'design'
    }

    if (nextTab) {
      event.preventDefault()
      onChange(nextTab)

      const nextRef =
        nextTab === 'content'
          ? contentRef
          : designRef

      nextRef.current?.focus()
    }
  }

  return (
    <div
      className="studio-tabs"
      role="tablist"
      aria-label="Editor sections"
    >
      <button
        ref={contentRef}
        type="button"
        className={`studio-tab ${
          activeTab === 'content' ? 'is-active' : ''
        }`}
        id="studio-tab-content"
        role="tab"
        aria-controls="studio-panel-content"
        aria-selected={activeTab === 'content'}
        tabIndex={activeTab === 'content' ? 0 : -1}
        onClick={() => onChange('content')}
        onKeyDown={handleKeyDown}
      >
        <span className="studio-tab-index">01</span>
        <span>Content</span>
      </button>

      <button
        ref={designRef}
        type="button"
        className={`studio-tab ${
          activeTab === 'design' ? 'is-active' : ''
        }`}
        id="studio-tab-design"
        role="tab"
        aria-controls="studio-panel-design"
        aria-selected={activeTab === 'design'}
        tabIndex={activeTab === 'design' ? 0 : -1}
        onClick={() => onChange('design')}
        onKeyDown={handleKeyDown}
      >
        <span className="studio-tab-index">02</span>
        <span>Design</span>
      </button>
    </div>
  )
}
