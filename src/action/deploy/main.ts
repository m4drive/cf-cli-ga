import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as artifact from '@actions/artifact';
import * as fs from 'fs';
import {promisify} from 'util';
import zlib from 'zlib';
import os from 'os';
const yauzl = require('yauzl');
import path from 'path';
const stream = require('readable-stream');
const pipeline = promisify(stream.pipeline);

const CF_CHECK_CMD = 'cf --version';
const CF_CHECK_MULTIAPPS_PLUGIN_CMD = 'cf deploy --help';
const DMOL_FOLDER_PATH = './dmol_logs';
const CF_INSTALLATION_PATH ='./cf8'

async function run(): Promise<void> {
  try {
    core.info('Starting job');
    const mtaPath: string = core.getInput('mtaPath');
    const flags: string = core.getInput('flags');
    const cfInstallationPathLinux: string = core.getInput('cfInstallationPathLinux');
    const cfInstallationPathWindows: string = core.getInput('cfInstallationPathWindows');
    const cfInstallationPathMac: string = core.getInput('cfInstallationPathMac');
    const apiUrl: string = core.getInput('apiUrl');
    const organization: string = core.getInput('organization');
    const space: string = core.getInput('space');
    const user: string = core.getInput('user');
    const password: string = core.getInput('password');
    var cfCliPath='cf';
    //check if CF installed
    try {
      await exec.exec(CF_CHECK_CMD);
      core.info('CF CLI detected!');
    } catch {
      core.info('CF CLI not detected starting installation!');
      cfCliPath = `${CF_INSTALLATION_PATH}/cf8`;
      switch (os.type()){
        case 'Darwin':
          await downloadAndUntar(cfInstallationPathMac,CF_INSTALLATION_PATH);
          break;
        case 'Windows_NT':
          await downloadAndUnzip(cfInstallationPathWindows,CF_INSTALLATION_PATH);
          cfCliPath+='.exe';
          break;
        case 'Linux':
        default:
          await downloadAndUntar(cfInstallationPathLinux,CF_INSTALLATION_PATH);
          break;
      }
      fs.chmodSync(cfCliPath,777);
    }
    //check if multiapps plugin installed
    try {
      await exec.exec(CF_CHECK_MULTIAPPS_PLUGIN_CMD,[],{silent: true});
    } catch (error){
      core.info('CF CLI installing multiapps plugin!');
      await exec.exec(`${cfCliPath} install-plugin multiapps -f`);
    }
    //perform login
    core.info('CF CLI login into account!');
    core.info('Hiding secrets.');
    await core.setSecret(user);
    await core.setSecret(password);
    await exec.exec(`${cfCliPath} login -a ${apiUrl} -u "${user}" -p "${password}" -o "${organization}" -s "${space}`/*,[],{silent: true}*/);
    // perform deploy 
    core.info('CF CLI starting deployment!');
    var deplotmentId: string = '';
    var options: Object = {
      listeners: {
        stdline: (data: string) => {
          if (deplotmentId.length==0) deplotmentId = getDeploymentIdFromOutput(data);
        }
      }
    };
    try {
      await exec.exec(`${cfCliPath} deploy "${mtaPath}" ${flags}`,[], options);
      core.setOutput('deploymentId',deplotmentId);
    } catch (error) {
      core.setOutput('deploymentId',deplotmentId);
      if (!fs.existsSync(DMOL_FOLDER_PATH)) fs.mkdirSync(DMOL_FOLDER_PATH);
      await exec.exec(`${cfCliPath} dmol -i ${deplotmentId} -d ${DMOL_FOLDER_PATH}`);
      let mtaopDir: string = `${DMOL_FOLDER_PATH}/mta-op-${deplotmentId}`;
      let files: string[] = fs.readdirSync(mtaopDir).map(file=>`${mtaopDir}/${file}`);
      await artifact.create().uploadArtifact('dmol output',files,DMOL_FOLDER_PATH);
      if (fs.existsSync(mtaopDir)) fs.rmdirSync(mtaopDir);
      if (error instanceof Error) core.setFailed(error.message);
    };
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();

async function downloadFile(fileUrl:string,filePath:string){
  return new Promise((resolve,reject)=>
  {
    const https = require('https');
    const url = require('url');
    var file = fs.createWriteStream(filePath);
    https.get(fileUrl, (response: any) => {
      if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
          if (url.parse(response.headers.location).hostname) {
            https.get(response.headers.location, (data: any) => {
                data.pipe(file);
            });
          } else {
            https.get(url.resolve(url.parse(url).hostname, response.headers.location), (data: any) => {
                data.pipe(file);
            });
          }
      } else {
          response.pipe(file);
      }
    }).on('error', (error: Error) => {
      console.error(error);
      reject();
    });
    file.on('finish', () => {
      resolve(null);
    });
  });
}
async function unzip(zipPath: string, unzipToDir: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      // Create folder if not exists
      if (!fs.existsSync(unzipToDir)) fs.mkdirSync(unzipToDir);

      // Same as example we open the zip.
      yauzl.open(zipPath, { lazyEntries: true }, (err:any, zipFile:any) => {
          if (err) {
              zipFile.close();
              reject(err);
              return;
          }
          zipFile.readEntry();
          zipFile.on('entry', (entry:any) => {
            try {
              // Directories
              if (/\/$/.test(entry.fileName)) {
                  // Create the directory then read the next entry.
                  if (!fs.existsSync(path.join(unzipToDir, entry.fileName))) fs.mkdirSync(path.join(unzipToDir, entry.fileName));
                  zipFile.readEntry();
              }
              // Files
              else {
                // Write the file to disk.
                zipFile.openReadStream(entry, (readErr: any, readStream: any) => {
                  if (readErr) {
                      zipFile.close();
                      reject(readErr);
                      return;
                  }

                  const file = fs.createWriteStream(path.join(unzipToDir, entry.fileName));
                  readStream.pipe(file);
                  file.on('finish', () => {
                      // @ts-ignore: Typing for close() is wrong.
                      file.close(() => {
                          zipFile.readEntry();
                      });
                      file.on('error', (err) => {
                          zipFile.close();
                          reject(err);
                      });
                  });
                });
              }
            }
            catch (e: any) {
                zipFile.close();
                reject(e);
            }
          });
          zipFile.on('end', (err:any) => {
              resolve();
          });
          zipFile.on('error', (err:any) => {
              zipFile.close();
              reject(err);
          });
      });
    }
    catch (e) {
        reject(e);
    }
  });
}
async function untargz(filePath:string,folderPath:string) {
  return new Promise(async (resolve,reject)=>
  {
    // Create folder if not exists
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    const tar = require('tar');
    const inp = fs.createReadStream(filePath);
    const gzip = zlib.createGunzip();
    const out = tar.extract({
      cwd: folderPath
    });
    await pipeline(inp, gzip, out);
    resolve(null);
  });
}
async function downloadAndUntar(archiveUrl:string,folderPath: string) {
  return new Promise(async (resolve,reject)=>
  {
    let tmpFilePath:string;
    tmpFilePath = Date.now().toString();
    await downloadFile(archiveUrl,tmpFilePath);
    await untargz(tmpFilePath,folderPath);
    fs.unlinkSync(tmpFilePath);
    resolve(null);
  });
}
async function downloadAndUnzip(archiveUrl:string,folderPath: string) {
  return new Promise(async (resolve,reject)=>
  {
    let tmpFilePath:string;
    tmpFilePath = Date.now().toString();
    await downloadFile(archiveUrl,tmpFilePath);
    await unzip(tmpFilePath,folderPath);
    fs.unlinkSync(tmpFilePath);
    resolve(null);
  });
}
function getDeploymentIdFromOutput(str:string){
  const regex: RegExp = /Use\s+"cf\s+dmol\s+-i\s+([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})"\s+to\s+download\s+the\s+logs\s+of\s+the\s+process\./;
  if (str.match(regex)){
    let regexResults = regex.exec(str);
    if (regexResults!=null && regexResults.length>1){
      return regexResults[1];
    }
  }
  return '';
}
