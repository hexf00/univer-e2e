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

            if(packageJson.private){
                continue
            }
        

            // 查找所有符合条件的 .ts 文件
            const files = glob.sync( 'src/**/*.ts',{
                cwd: packageDir
            });

            for (const _file of files) {
                if(_file.endsWith('spec.ts')){
                    continue
                }
                if(_file.endsWith('test.ts')){
                    continue
                }


                // facade 逻辑不同
                if(_file.startsWith(`src${path.sep}facade`)){
                    continue
                }
                
                const file = path.join(packageDir, _file)
                // 读取文件内容
                let content = await fs.readFile(file, 'utf8');
                
                // 读取自引用
                const regex = new RegExp(`from '${packageName}'`, 'g');
                const matches = content.match(regex);

                if (matches) {
                    console.log(`${file} has self-reference`)
                    // console.log(`Processing ${file}...`);
                    
                    // 替换相对路径为包名
                    // content = content.replace(regex, `from '${packageName}'`);
                    
                    // 写回文件
                    // await fs.writeFile(file, content, 'utf8');
                    
                    // console.log(`✅ Updated imports in ${file}`);
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