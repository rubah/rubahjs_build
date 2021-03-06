const rubahjs = require("../rubahjs/index");
const fs = require("fs");
const fileSource = require("../rubahjs/fileSource");
const rubah = rubahjs.new();
const recursive = require("recursive-readdir");
try{
    fileSource.exclude('../rubahjs/node_modules');
    fileSource.exclude('../rubahjs/.git');
    fileSource.exclude('../rubahjs/.nyc_output');
    // fileSource.exclude('../rubahjs/templates');
}catch(e){
    
}
rubah.source.register(fileSource);

if(fs.existsSync('error.log'))
    fs.unlinkSync('error.log');

recursive('./templates',function(err,files){
    if(err)throw new Error(err);
    for(const file of files){
        if(file.endsWith('.js'))
            rubah.register(require('./'+file.substr(0,file.length-3))({
                module: module
                
            }));
    }
    rubah.scan('../rubahjs',(x)=>{
        if(process.env.DEBUG_MODE)
            console.log(JSON.stringify(x));
        rubah.materialize();
    });
})