/**
 * This file is for build Angular Apps in Netlify(https://www.netlify.com/)
 * You can set your environment to this file.
 *
 * This file build for 4 method.
 *   1. create robot.txt.
 *   2. create _redirects for redirect to www
 *   3. create _headers for ServerPush
 *   4. change styles inline
 *
 * If you use this file, you put this file in package.json's directory.
 * And in Netlify's deploy setting, add Build command `node netlify.build.js`
 */

/***************************************************************************************************
 * Please change your environment.
 */

/** Ionic Framework v4 is `www/` */
const publicDir = 'dist/default/';

/** not add `www` */
const appDomain = 'rdlabo.jp';

/** create accessable file */
const debug = true;

/**
 *  If you need not execute method, please set
 */
const execute = {
  createRobot: true, /** create robot.txt */
  createRedirects: true, /** create _redirects for redirect to www */
  createJavaScriptFileServerPush: true, /** create _headers for ServerPush  */
  changeInlineStyleSheet: true  /** change styles inline */
};


/***************************************************************************************************
 * Under this line is execute method.
 */

const fs = require('fs');
class method {
  constructor(publicDir, appDomain, debug) {
    this.publicDir = publicDir;
    this.appDomain = appDomain;
    this.debug = debug;
  }

  createRobot(){
    const robot = 'User-Agent: *\nAllow: /\nHost: ' + this.appDomain;
    fs.writeFileSync(this.publicDir + 'robot.txt', robot);
  }

  createRedirects(){
    const robot = 'https://' + this.appDomain + '/*  https://www.' + this.appDomain + '/:splat  301';
    fs.writeFileSync(this.publicDir + '_redirects', robot);
    if (this.debug) fs.writeFileSync(this.publicDir + 'redirects.txt', robot);
  }

  createJavaScriptFileServerPush(fileArray){
    let pushFile = '/*\n';
    fileArray.forEach(file => {
      pushFile += '  Link: <' + this.__getFileName(file) + '>; rel=preload; as=script\n';
    });
    fs.writeFileSync(this.publicDir + '_headers', pushFile);
    if (this.debug) fs.writeFileSync(this.publicDir + 'headers.txt', pushFile);
  }

  changeInlineStyleSheet(){
    const stylesheet = fs.readFileSync(this.publicDir + this.__getFileName('styles')).toString();
    const indexFile = fs.readFileSync(this.publicDir + 'index.html').toString();
    const changeString = indexFile.replace(/\n\<link rel=(\"|\')stylesheet(\"|\')[^>]*>/g, '<style>' + stylesheet + '</style>');
    fs.writeFileSync(this.publicDir + 'index.html', changeString);
  }

  __getFileName(search){
    const files = fs.readdirSync(publicDir);
    const fileList = files.filter((file) => {
      return (file.match(new RegExp(search)) !== null)
    });

    return fileList[0];
  }
}

const build = new method(publicDir, appDomain, debug);
if (execute.createRobot) build.createRobot();
if (execute.createRedirects) build.createRedirects();
if (execute.createJavaScriptFileServerPush) build.createJavaScriptFileServerPush(['main', 'polyfills', 'runtime']);
if (execute.changeInlineStyleSheet) build.changeInlineStyleSheet();