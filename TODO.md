# TODO

## Accessibility

- [ ] banish icon fonts to the shadow realm

## Nice to have

### General design tweaks

- [ ] hover things that open a dialog or send a message to chat: change to a vivid accent colour
- [ ] currently selected value: invert light/dark
- [ ] hover over a different value: show "faded" version of above as a kind of "preview"

### Semantics

There's many classes that could be replaced by pre-existing HTML attributes, which can all be used as CSS selectors, too.

- [ ] use `aria-disabled` instead of the `disabled` class
- [ ] use `aria-orientation` instead of the `vertical` and `vertical-v2` classes

### Using CSS over DOM changes where possible

- [ ] stuff like XP boxes, where all markers up to a certain value are styled one way, and everything after is styled a different way
  - [ ] the hover equivalents of above
