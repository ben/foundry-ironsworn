function fixZIndex(wrapped, ...args) {
  wrapped(...args)
  if (
    this.actor?.type === 'location' &&
    this.actor?.data.data.subtype === 'planet'
  ) {
    this.zIndex -= 100
  }
}

export function registerZIndexHook() {
  global.libWrapper.register(
    'foundry-ironsworn',
    'Token.prototype.refresh',
    fixZIndex,
    'WRAPPER'
  )
}
