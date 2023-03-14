## Patches

### Hydra Synth

Line 47 or hydra-synth.js has the following line

    global.window.test = 'hi'

This causes a runtime error because of `global` is not defined.

### Gatsby

This is to try and get browser to steal focus (and break the workflow) when
writing WIP code that doesn't compile.

This patch doesn't seem to work on Safari though (not sure if it is some caching
issue).
