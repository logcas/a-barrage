export function createElement(tagName: string) {
  return document.createElement(tagName)
}

export function createBarrage(text: string, color: string, fontSize: string, left: string) {
  const danmu = createElement('div')
  setStyle(danmu, {
    position: 'absolute',
    color,
    fontSize,
    transform: `translateX(${left}px)`,
    textShadow: '#000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0',
    pointerEvents: 'auto',
    padding: '3px 20px',
    borderRadius: '20px',
    backgroundColor: 'transparent'
  })
  danmu.textContent = text
  return danmu
}

export function appendChild(parent: HTMLElement, child: HTMLElement) {
  return parent.appendChild(child)
}

export function setStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  for (const key in style) {
    el.style[key] = style[key]!
  }
}

export function setHoverStyle(el: HTMLElement) {
  el.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  el.style.cursor = 'pointer'
}

export function setBlurStyle(el: HTMLElement) {
  el.style.backgroundColor = 'transparent'
  el.style.cursor = 'auto'
}
