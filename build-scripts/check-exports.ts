const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

async function processFiles(packagesDir: string) {
    // 获取 packages 目录下的所有包
    // const packagesDir = path.join(rootDir, 'packages');
    const packages = await fs.readdir(packagesDir);

    for (const pkg of packages) {
        const packageDir = path.join(packagesDir, pkg);
        const packageJsonPath = path.join(packageDir, 'package.json');


        try {
            // 读取 package.json
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
            const packageName = packageJson.name; // 获取包名

            if (packageJson.private) {
                continue
            }


            if (!packageJson.publishConfig.exports
                || !packageJson.publishConfig.exports["."]
                || !packageJson.publishConfig.exports["."].require
            ) {
                console.log(`${packageName} has no exports["."]`)
            }

            if (!packageJson.exports["./lib/*"]
                || !packageJson.publishConfig.exports?.["./lib/*"]
                || !packageJson.publishConfig.exports?.["./lib/*"].require
            ) {
                console.log(`${packageName} has no exports["./lib/*"]`)
            }


            // 查找所有符合条件的 .ts 文件
            const localeFiles = glob.sync('src/locale/**/*.ts', {
                cwd: packageDir
            });

            if (localeFiles.length > 0) {
                if (!packageJson.exports["./locale/*"]) {
                    console.log(`${packageName} has locale files but no exports["./locale/*"]`)
                }
            }


            // 查找所有符合条件的 .ts 文件
            const facadeFiles = glob.sync('src/facade/**/*.ts', {
                cwd: packageDir
            });


            if (facadeFiles.length > 0) {
                if (!packageJson.exports["./facade"]) {
                    console.log(`${packageName} has facade files but no exports["./facade"]`)
                } else {
                    if (!packageJson.publishConfig.exports
                        || !packageJson.publishConfig.exports["./facade"]
                        || !packageJson.publishConfig.exports["./facade"].require) {
                        console.log(`${packageName} has facade files but no publishConfig.exports["./facade"].require`)
                    }
                }
            }


        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`Skipping ${pkg} - no package.json found`);
                continue;
            }
            console.error(`Error processing ${pkg}:`, error);
        }
    }
}

// 运行脚本
processFiles(path.join('D:\\univer\\univer\\', 'packages')).catch(console.error);
processFiles(path.join('D:\\univer\\univer\\', 'packages-experimental')).catch(console.error);
processFiles(path.join('D:\\univer\\univer-pro\\', 'packages')).catch(console.error);
processFiles(path.join('D:\\univer\\univer-pro\\', 'packages-experimental')).catch(console.error);