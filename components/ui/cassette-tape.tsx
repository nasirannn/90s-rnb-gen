'use client'

import { useState, useEffect } from 'react'

interface CassetteTapeProps {
  sideLetter?: string
  duration?: string
  title?: string
  className?: string
  isPlaying?: boolean
}

export const CassetteTape = ({ 
  sideLetter = 'A', 
  duration = '5min',
  title = '',
  className = '',
  isPlaying = false
}: CassetteTapeProps) => {
  const [svgContent, setSvgContent] = useState('')

  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch('/cassette-tape.svg')
        let svgText = await response.text()
        
        // 替换变量
        svgText = svgText.replace('{{SIDE_LETTER}}', sideLetter)
        svgText = svgText.replace('{{DURATION}}', duration)
        
        // 根据播放状态控制 reel 动画
        if (!isPlaying) {
          // 如果暂停，给 reel 添加 paused 类
          svgText = svgText.replace('class="reel-left"', 'class="reel-left paused"')
          svgText = svgText.replace('class="reel-right"', 'class="reel-right paused"')
        }
        
        // 替换SVG模板中的变量
        svgText = svgText.replace('{{SIDE_LETTER}}', sideLetter)
        svgText = svgText.replace('{{DURATION}}', duration)
        svgText = svgText.replace('{{TITLE}}', title)
        
        // 添加样式确保SVG填满容器
        svgText = svgText.replace(
          '<svg width="447" height="304"',
          '<svg width="447" height="304" style="width: 100%; height: 100%;"'
        )
        
        setSvgContent(svgText)
      } catch (error) {
        console.error('Failed to load SVG:', error)
      }
    }

    loadSVG()
  }, [sideLetter, duration, isPlaying, title])

  if (!svgContent) {
    return (
      <div className={`w-32 h-32 bg-muted/50 rounded-lg flex items-center justify-center ${className}`}>
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div 
      className={`w-32 h-32 flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
