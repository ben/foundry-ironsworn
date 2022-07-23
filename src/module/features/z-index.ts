export function patchZIndex() {
  const original = Token.prototype.refresh
  Token.prototype.refresh = function (...args) {
    const ret = original.call(this, ...args)
    if (
      this.actor?.type === 'location' &&
      this.actor?.data.data.subtype === 'planet'
    ) {
      this.zIndex -= 100
    }
    return ret
  }
}
