## Patches

### Hydra Synth

Line 47 or hydra-synth.js has the following line

    global.window.test = 'hi'

This causes a runtime error because of `global` is not defined.

### Gatsby

This is to try and get the browser to stop steal focus (thus breaking the
workflow) when showing errors in WIP code that doesn't compile yet.

This patch doesn't seem to work on Safari though (not sure if it is some caching
issue or if it is Safari being Safari).
