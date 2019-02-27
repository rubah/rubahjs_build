module.exports = function(opts){
    const path = require("path");
    const watch = opts.watch || process.cwd();
    opts.module = opts.module || module;
    const template = 
`# {{{sentenceCase key}}}
---

{{{description}}}

{{#if examples}}
{{#each examples}}

{{{desc}}}

\`\`\`js
{{{code}}}
\`\`\`

{{{desc2}}}

{{/each}}
{{/if}}

`;
    return {
        templateName: 'featureMD',
        filename: path.resolve(watch,'../rubahjs/documentation/feature/{{{camelCase key}}}.md'),
        template: template,
        stateToData: function(state){
            let features;
            if(state.features){
                features = Object.values(state.features)
            }
            features.sort((a,b)=>a.id-b.id);
            return features;
        },    
        dataToState: function(data){
            return {};
        },
        priority: Number.MAX_VALUE,
        read: false
    }
}