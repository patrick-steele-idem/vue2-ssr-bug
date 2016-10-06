process.env.VUE_ENV = 'server';

var Vue = require('vue');
var renderer = require('vue-server-renderer').createRenderer();
var series = require('async').series;

var renderCount = process.env.RENDER_COUNT ? parseInt(process.env.RENDER_COUNT, 10) : 100;

var App = Vue.component('my-app', {
    template: `
        <div class="simple-1" style="background-color: blue; border: 1px solid black">
            <div class="colors">
            <span class="hello">
                Hello {{name}}! <strong>You have {{messageCount}} messages!</strong>
            </span>

            <ul v-if="colors.length">
                <li v-for="color in colors" class="color">
                    {{color}}
                </li>
            </ul>
                <div v-else>
                    No colors!
                </div>
            </div>
            <button type="button" v-bind:class="primary ? 'primary' : 'secondary'">
                Click me!
            </button>
        </div>`
});

var data = {
    "name": "George Washington",
    "messageCount": 999,
    "colors": ["red", "green", "blue", "yellow", "orange", "pink", "black", "white", "beige", "brown", "cyan", "magenta"],
    "primary": true,
    "buttonLabel": "Welcome to the wonderful world of templating engines!"
};

function render(callback) {
    var vm = new App({
        data: data
    });

    renderer.renderToString(vm, function(err, html) {
        console.log('----');
        if (err) {
            console.error(err.message);
            console.error(err.stack);
            return callback(err);
        }
        console.log(html);
        callback();
    });
}

var tasks = [];
for (var i=0; i<renderCount; i++) {
    tasks.push(render);
}

series(tasks, function(err) {
    if (err) {
        console.error('FAILURE:', err);
        process.exit(1);
    }
    console.log('DONE!');
});
