module.exports = function(opts){
    const path = require("path");
    const watch = opts.watch || process.cwd();
    opts.module = opts.module || module;
    const rh = module.require("rubahhelper");
    return {
        templateName: 'packageJSON',
        filename: path.resolve(watch,'../rubahjs/package.json'),
        template: '{{{json data}}}',
        stateToData: function(state){
            return [state.packageJson];
        },    
        dataToState: function(data){
            let shields = {
                subject: 'version',
                status: data.data.version,
                color: 'brightgreen'
            };
            return {packageJson: data, shields:{version: shields}};
        },
        write: false,
        helpers: [rh.jsonHelper]
    }
}