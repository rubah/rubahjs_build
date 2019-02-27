module.exports = function(opts){
    const path = require("path");
    const watch = opts.watch || process.cwd();
    opts.module = opts.module || module;
    const rh = module.require("rubahhelper");
    return {
        templateName: 'coverage',
        filename: path.resolve(watch,'../rubahjs/coverage/coverage-summary.json'),
        template: '{{{json data}}}',
        stateToData: function(state){
            return [state.packageJson];
        },    
        dataToState: function(data){
            let cov = data.data.total;
            let pct = Math.round(cov.branches.pct);
            let p = Math.max(0,(pct-33)*100/67);
            function hexify(n){
                let hex = Math.round(n*255/100);
                let hexString = hex.toString(16);
                if(hexString.length < 2)hexString = '0'+hexString;
                return hexString;
            };
            let shields = {
                subject: 'coverage',
                status: pct+'%25',
                color: hexify(100-p)+hexify(p)+'00'
            };
            return {coverage: data.data.total, shields: {coverage: shields}};
        },
        write: false,
        helpers: [rh.jsonHelper]
    }
}