import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist/vendor',{recursive:true});
for(const file of ['three.module.js','three.core.js'])await copyFile(`node_modules/three/build/${file}`,`dist/vendor/${file}`);
await copyFile('node_modules/three/examples/jsm/environments/RoomEnvironment.js','dist/vendor/RoomEnvironment.js');await copyFile('node_modules/three/LICENSE','dist/vendor/THREE-LICENSE.txt');console.log('Three.js preparado em dist/vendor.');
