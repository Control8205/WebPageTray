const { join } = require('path');
const { copyFile } = require('fs/promises');

exports.default = async (context) => {
  try {
    console.log('Allowing unencrypted access for:', join(context.packager.info.projectDir,'obfuscated','public','lib'));
    console.log('appOutDir:',__dirname);
    
    console.log('copying native dependencies');

    const release = join(__dirname, 'node_modules', 'asarmor', 'build', 'Release');

    // copy main.node from asarmor to our dist/build/release folder; this will become the entrypoint later on.
    await copyFile(
      join(release, 'main.node'),
      join(
        context.packager.info.projectDir,
        'obfuscated',
        'main.node'
      )
    );

    // // copy renderer.node to our dist/build/release folder; the render process will be bootstrapped from the main process later on.
    // await copyFile(
    //   join(release, 'renderer.node'),
    //   join(
    //     context.packager.info.projectDir,
    //     'release',
    //     'app',
    //     'dist',
    //     'renderer',
    //     'renderer.node'
    //   )
    // );
  } catch (err) {
    console.error(err);
  }
};