const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const { threadId } = require('worker_threads');
const {getArgs} = require('./args');

class MyBuilder {

    args = getArgs(); // { repo, cname }
    
    //build
    constructor() {
        this.configSettings();
    }

    lowerCaseConfigProp(prop) {
        if(this.config && typeof this.config[prop] === 'string') {
            this.config[prop] = this.config[prop].toLowerCase();
        }
    }

    configSettings() {
        //read settings
        const args = getArgs();
        console.log(args);
        const distPath = path.resolve(__dirname, '../dist');
        this.config = Object.assign({
            dist: './dist',
            distPath: distPath,
            baseHref: `file://${distPath}/`,
            genereateCNAME: true,
        }, args);

        this.lowerCaseConfigProp('cname');
        this.lowerCaseConfigProp('repo');

        //set baseurl
        if(this.config.cname) {    
            this.config.baseHref = `https://${this.config.cname}/`;
        } else if(this.config.repo) {
            const _repo  = this.config.repo.split('/');
            // temp
            if(_repo.length>1) {
                this.config.baseHref = `https://${_repo[0]}.github.io/${_repo[1]}/`;
            }
            /* // 
            if(_repo.length>1 && _repo[0].toLowerCase() !== 'webex-design') {
                this.config.baseHref = `https://${_repo[0]}.github.io/${_repo[1]}/`;
            } else {
                this.config.baseHref = `https://ai.webex.design/`;
            }
            */
        }
    }

    async ngBuild() {
        return new Promise((resolve, reject)=>{
            console.log(this.config.dist);
            exec(`ng build ai --output-path '${this.config.dist}' --configuration=production --base-href '${this.config.baseHref}'`, (err, stdout, stderr) => {
                const fileIndex = path.join(this.config.distPath,'index.html');
                const file404 = path.join(this.config.distPath,'404.html');
                if(fs.existsSync(fileIndex)){
                    fs.copyFileSync(fileIndex, file404);
                }
                //generate cname
                /*
                if(this.config.baseHref === `https://ai.webex.design/`) {
                    fs.writeFileSync(path.join(this.config.distPath, 'CNAME'), 'webex.design');
                }
                */
                resolve(1);
            });
        });
    }

    async build() {
        await this.ngBuild();
    }

}

new MyBuilder().build();