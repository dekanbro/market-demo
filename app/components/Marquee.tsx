"use client"
import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export function Marquee({ children, direction = 'left', speed = 20, className = '' }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create multiple copies of children to ensure continuous scrolling
  const content = React.Children.count(children) < 4 
    ? Array(4).fill(children)
    : [children, children];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      const elements = container.getElementsByClassName('animate-marquee');
      for (const element of elements) {
        (element as HTMLElement).style.animationPlayState = 'paused';
      }
    };

    const handleMouseLeave = () => {
      const elements = container.getElementsByClassName('animate-marquee');
      for (const element of elements) {
        (element as HTMLElement).style.animationPlayState = 'running';
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <ScrollArea className={`w-full overflow-hidden ${className}`}>
      <div 
        ref={containerRef}
        className="whitespace-nowrap inline-flex gap-4"
      >
        {content.map((item, idx) => (
          <div
            key={idx}
            className="inline-flex gap-4 animate-marquee"
            style={{
              animationDirection: direction === 'left' ? 'normal' : 'reverse',
              animationDuration: `${speed}s`,
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

