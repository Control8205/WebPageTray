const { join } = require('path');
const asarmor = require('asarmor');
const { encrypt } = require('asarmor');

exports.default = async ({ appOutDir, packager }) => {
  try {
    const asarPath = join(packager.getResourcesDir(appOutDir), 'app.asar');

    console.log(`  \x1B[34m•\x1B[0m asarmor encrypting contents of ${asarPath}`);
    await encrypt({
      src: asarPath,
      dst: asarPath,
    });

    // Apply patches
    console.log(`  \x1B[34m•\x1B[0m asarmor applying patches to ${asarPath}`);
    const archive = await asarmor.open(asarPath);
    archive.patch(); // Apply default patches
    await archive.write(asarPath);

    console.log('ASAR file protected successfully!');
  } catch (err) {
    console.error('Error protecting ASAR file:', err);
  }
};
