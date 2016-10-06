vue2-ssr-bug
============

This is a repo to reproduce a bug found when trying to benchmark server-side rendering for Vue2. The main script for this Node.js project simply renders a Vue component repeatedly (in series) for _n_ number of times. If the UI component is rendered for a small number of times (say, _n_<50) then everthing works as expected. However, if the UI component is renderered a lot of times (say, _n_&gt;100) then Vue starts invoking the render callback multiple times to produce the following error:

```text
Error: Callback was already called.
    at /vue2-ssr-bug/node_modules/async/dist/async.js:844:36
    at /vue2-ssr-bug/node_modules/async/dist/async.js:3676:17
    at /vue2-ssr-bug/node_modules/async/dist/async.js:339:31
    at /vue2-ssr-bug/index.js:50:20
    at Object.renderToString (/vue2-ssr-bug/node_modules/vue-server-renderer/build.js:5431:9)
    at render (/vue2-ssr-bug/index.js:45:14)
    at /vue2-ssr-bug/node_modules/async/dist/async.js:3671:13
    at replenish (/vue2-ssr-bug/node_modules/async/dist/async.js:884:21)
    at iterateeCallback (/vue2-ssr-bug/node_modules/async/dist/async.js:869:21)
    at /vue2-ssr-bug/node_modules/async/dist/async.js:847:20
```

I created this very simple repo to reproduce the problem. Steps to reproduce:

```bash
git clone https://github.com/patrick-steele-idem/vue2-ssr-bug.git
cd vue2-ssr-bug
npm install
RENDER_COUNT=100 node .
```

You should see `Error: Callback was already called.` repeatedly printed to the output in the console (along with a lot of stack traces). If you try again with a lower render count then things will likely work without error:

```bash
RENDER_COUNT=10 node .
```

NOTES:

- The behavior appears to be related to a timing problem and this is causing the output to be non-deterministic
- The actual content of the template doesn't seem to matter. The problem is still reproducible with a smaller template, but a smaller template requires a higher render count to see the error.
