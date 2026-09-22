import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 240
const framePath = (i) => `/frames/f_${String(i).padStart(4, '0')}.jpg`

export default function Hero({ onNavScrolledChange }) {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef(new Array(TOTAL_FRAMES))
  const loadedRef = useRef(new Array(TOTAL_FRAMES).fill(false))
  const currentDrawnRef = useRef(-1)
  const naturalSizeRef = useRef({ w: 800, h: 450 })
  const tickingRef = useRef(false)

  const [showScrollHint, setShowScrollHint] = useState(true)
  const [callout, setCallout] = useState(null) // 'track' | 'gst' | 'paid' | null

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      currentDrawnRef.current = -1
    }

    function drawFrame(index) {
      let i = index
      while (i > 0 && !loadedRef.current[i]) i--
      if (!loadedRef.current[i]) return
      if (i === currentDrawnRef.current) return
      currentDrawnRef.current = i

      const img = imagesRef.current[i]
      const cw = window.innerWidth
      const ch = window.innerHeight
      const iw = naturalSizeRef.current.w
      const ih = naturalSizeRef.current.h
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (cw - dw) / 2
      // bias crop toward the top of the source frame so the invoice header
      // clears the fixed navbar instead of sitting directly under it
      const dy = (ch - dh) * 0.28

      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    function preloadFrames() {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const im = new Image()
        im.onload = () => {
          loadedRef.current[i] = true
          if (i === 0) {
            naturalSizeRef.current = { w: im.naturalWidth || 800, h: im.naturalHeight || 450 }
            drawFrame(getFrameIndex())
          }
        }
        im.src = framePath(i)
        imagesRef.current[i] = im
      }
    }

    function getProgress() {
      const wrapper = wrapperRef.current
      if (!wrapper) return 0
      const rect = wrapper.getBoundingClientRect()
      const scrollableDist = wrapper.offsetHeight - window.innerHeight
      if (scrollableDist <= 0) return 0
      let p = -rect.top / scrollableDist
      if (p < 0) p = 0
      if (p > 1) p = 1
      return p
    }

    function getFrameIndex() {
      return Math.round(getProgress() * (TOTAL_FRAMES - 1))
    }

    function updateCallout(p) {
      if (p >= 0.1 && p < 0.36) setCallout('track')
      else if (p >= 0.36 && p < 0.6) setCallout('gst')
      else if (p >= 0.8 && p < 1.0) setCallout('paid')
      else setCallout(null)
    }

    function onScrollOrResize() {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const p = getProgress()
          drawFrame(Math.round(p * (TOTAL_FRAMES - 1)))
          updateCallout(p)
          setShowScrollHint(p <= 0.03)
          if (onNavScrolledChange) {
            const wrapper = wrapperRef.current
            const releasePoint = wrapper.offsetTop + wrapper.offsetHeight - window.innerHeight
            onNavScrolledChange(window.scrollY > releasePoint - 4)
          }
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    resizeCanvas()
    preloadFrames()
    setTimeout(() => drawFrame(getFrameIndex()), 60)

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', () => {
      resizeCanvas()
      onScrollOrResize()
    })

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="hero-wrapper" ref={wrapperRef}>
      <div className="hero-sticky">
        <canvas ref={canvasRef} id="scrub-canvas" aria-hidden="true" />
        <div className="hero-scrim" />
        <div className="hero-content-scrim" />

        <span className={`callout callout-track ${callout === 'track' ? 'show' : ''}`}>
          <span className="led" />Automatic time tracking
        </span>
        <span className={`callout callout-gst ${callout === 'gst' ? 'show' : ''}`}>
          <span className="led" />Clear per project earnings
        </span>
        <span className={`callout callout-paid ${callout === 'paid' ? 'show' : ''}`}>
          <span className="led" />Sent and tracked
        </span>

        <div className="hero-content">
          <h1>Track time. Bill clients.<br />Get paid.</h1>
          <p className="hero-sub">Built for Indian freelancers to manage every client, project and hour in one place.</p>
          <a className="hero-cta" href="/signup">Start Free</a>
        </div>

        <div className={`scroll-hint ${showScrollHint ? '' : 'hide'}`}>
          <span>Scroll to see how it works</span>
          <span className="chevron">↓</span>
        </div>
      </div>
    </div>
  )
}
