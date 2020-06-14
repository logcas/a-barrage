export function createElement(tagName: string) {
  return document.createElement(tagName)
}

export function createBarrage(text: string, color: string, fontSize: string, left: string) {
  const danmu = createElement('div')
  setStyle(danmu, {
    position: 'absolute',
    color,
    fontSize,
    transform: `translateX(${left}px)`
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
