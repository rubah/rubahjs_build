module.exports = function(opts) {
    const path = require("path");
    // const beautify = opts.module.require('js-beautify').js;
    const watch = opts.watch || process.cwd();
    opts.module = opts.module || module;
    const rh = module.require("rubahhelper");
    const beautify = module.require("js-beautify");

    const comment = rh.staticMarkBlock('comment', '/**', '**/', {
        inclusive: true,
        map: rh.commentHelper.map
    });

    const id = rh.staticMarkBlock('id', '//<featureid>', '</featureid>', {
        map: x=>x
    });

    const code = rh.staticMarkBlock('code', '//example:', '//:example', {
        map: x=>x
    });

    const feature = rh.blockBuilder('feature', comment, code, id);

    return {
        templateName: 'featureCollector',
        filename: path.resolve(watch, '../rubahjs/test/feature{{{properCase key}}}Test.js'),
        template: "{{{feature data}}}",
        stateToData: function(state) {
            const res = [];
            for (const key in state.test)
                res.push(state.test[key]);
            return res;
        },
        dataToState: function(data) {
            if(process.env.DEBUG_MODE)
                console.debug(JSON.stringify(data));
            let d = data.data;
            d = d.filter(x=>{
                return !(x.type == "default")
            }).map(x=>{
                if(x.type == "code"){
                    x.data = x.data.split('require("../index")').join('require("rubahjs")');
                }
                return x;
            });
            data.data = {description: d.shift().data, id: d.shift().data, examples: []};
            while(d.length>0){
                let desc = d.shift().data;
                let desc2;
                let descx = desc.split('\n---\n');
                if(descx.length>1){
                    desc = descx.shift();
                    desc2 = descx.join('\n\n');
                }
                data.data.examples.push({
                    desc, desc2,
                    code: beautify(d.shift().data.trim())
                });
            }
            const res = {};
            res[data.key] = {};
            res[data.key].key = data.key;
            res[data.key].id = data.data.id;
            res[data.key].description = data.data.description;
            res[data.key].examples = data.data.examples;
            if(process.env.DEBUG_MODE){
                console.debug('\n\n');
                console.debug(JSON.stringify(res));
                console.debug('\n\n==========\n\n\n\n\n');
            }
            return { features: res };
        },
        write: false,
        helpers: [feature]
    }
}
