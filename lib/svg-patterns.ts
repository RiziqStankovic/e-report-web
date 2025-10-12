// SVG patterns for background decorations

export const SVG_PATTERNS = {
  // Dot pattern
  DOTS: "data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e0e7ff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
  
  // Grid pattern
  GRID: "data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e0e7ff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M%200%200%20L%2060%200%20L%2060%2060%20L%200%2060%20Z%20M%2060%2060%20L%200%2060%20L%200%200%20L%2060%200%20Z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
  
  // Wave pattern
  WAVE: "data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e0e7ff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M%200%2030%20Q%2015%2010%2030%2030%20T%2060%2030%20V%2060%20H%200%20Z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
  
  // Hexagon pattern
  HEXAGON: "data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e0e7ff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M%2030%200%20L%2045%2015%20L%2045%2045%20L%2030%2060%20L%2015%2045%20L%2015%2015%20Z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
  
  // Circle pattern
  CIRCLES: "data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e0e7ff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%2210%22/%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%225%22/%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%225%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
} as const

// Helper function to get SVG pattern
export const getSvgPattern = (pattern: keyof typeof SVG_PATTERNS): string => {
  return SVG_PATTERNS[pattern]
}

// Helper function to create custom SVG pattern
export const createSvgPattern = (svg: string): string => {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Predefined pattern components
export const PATTERN_STYLES = {
  dots: {
    backgroundImage: `url(${SVG_PATTERNS.DOTS})`,
    backgroundSize: '60px 60px',
    backgroundRepeat: 'repeat'
  },
  grid: {
    backgroundImage: `url(${SVG_PATTERNS.GRID})`,
    backgroundSize: '60px 60px',
    backgroundRepeat: 'repeat'
  },
  wave: {
    backgroundImage: `url(${SVG_PATTERNS.WAVE})`,
    backgroundSize: '60px 60px',
    backgroundRepeat: 'repeat'
  },
  hexagon: {
    backgroundImage: `url(${SVG_PATTERNS.HEXAGON})`,
    backgroundSize: '60px 60px',
    backgroundRepeat: 'repeat'
  },
  circles: {
    backgroundImage: `url(${SVG_PATTERNS.CIRCLES})`,
    backgroundSize: '60px 60px',
    backgroundRepeat: 'repeat'
  }
} as const

// Type definitions
export type SvgPattern = keyof typeof SVG_PATTERNS
export type PatternStyle = keyof typeof PATTERN_STYLES
