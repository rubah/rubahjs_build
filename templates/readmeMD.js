module.exports = function(opts){
    const path = require("path");
    const watch = opts.watch || process.cwd();
    opts.module = opts.module || module;
    const template = 
`![logo](http://static.averism.com/rubahjs_banner.png)

{{#each shields}}
![{{{subject}}}](https://img.shields.io/badge/{{{subject}}}-{{{status}}}-{{{color}}}.svg)
{{/each}}
---
{{{description.package}}}

{{{description.extra}}}
## Installation
\`\`\` npm install --save {{{title}}}\`\`\`

## Features
{{#each features}}

- [{{{sentenceCase key}}}](documentation/feature/{{{camelCase key}}}.md)

{{/each}}

`;
    return {
        templateName: 'readmeMD',
        filename: path.resolve(watch,'../rubahjs/README.md'),
        template: template,
        stateToData: function(state){
            const pd = state.packageJson.data || {};
            const doc = state.doc || {description: {}};
            let features = [];
            if(state.features){
                features = Object.values(state.features)
            }
            features.sort((a,b)=>a.id-b.id);
            let shields = Object.values(state.shields)
            const res = [{
                title: pd.name,
                version: pd.version,
                description: {
                    package: pd.description,
                    extra: doc.description.data
                },
                features, shields
            }];
            return res;
        },    
        dataToState: function(data){
            return {};
        },
        priority: Number.MAX_VALUE,
        read: false
    }
}