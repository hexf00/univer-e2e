const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

async function processFiles(packagesDir: string) {
    // 获取 packages 目录下的所有包
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

            // 跳过core包，应为这是提供给其他包使用的
            if(packageName === '@univerjs/core'){
                continue
            }

            // 查找所有符合条件的 .ts 文件
            const files = glob.sync( 'src/facade/**/*.ts',{
                cwd: packageDir
            });

            for (const _file of files) {
                if(_file.endsWith('spec.ts')){
                    continue
                }
                const file = path.join(packageDir, _file)
                // 读取文件内容
                let content = await fs.readFile(file, 'utf8');
                
                // 查找并替换 from '../...' 模式
                const regex = /from '\.\..*?'/g;
                const matches = content.match(regex);

                if (matches) {
                    console.log(`Processing ${file}...`);
                    
                    // 替换相对路径为包名
                    content = content.replace(regex, `from '${packageName}'`);
                    
                    // 写回文件
                    await fs.writeFile(file, content, 'utf8');
                    
                    console.log(`✅ Updated imports in ${file}`);
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