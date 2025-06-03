#!/usr/bin/env node

/**
 * 統合された依存関係更新スクリプト
 * 一括更新と個別更新の両方をサポート
 */

import { execSync } from 'child_process';
import fs from 'fs';
import process from 'process';

interface PackageInfo {
  name: string;
  current: string;
  wanted: string;
  latest: string;
  type: 'dependencies' | 'devDependencies';
  updateType: 'major' | 'minor' | 'patch';
}

function getUpdateType(current: string, latest: string): 'major' | 'minor' | 'patch' {
  const currentParts = current.replace(/[^\d.]/g, '').split('.');
  const latestParts = latest.replace(/[^\d.]/g, '').split('.');
  
  if (currentParts[0] !== latestParts[0]) return 'major';
  if (currentParts[1] !== latestParts[1]) return 'minor';
  return 'patch';
}

async function getOutdatedPackages(): Promise<PackageInfo[]> {
  try {
    const result = execSync('pnpm outdated --format json', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const outdated = JSON.parse(result);
    const packages: PackageInfo[] = [];
    
    for (const [name, info] of Object.entries(outdated)) {
      const packageInfo = info as any;
      packages.push({
        name,
        current: packageInfo.current,
        wanted: packageInfo.wanted,
        latest: packageInfo.latest,
        type: packageInfo.dependencyType || 'dependencies',
        updateType: getUpdateType(packageInfo.current, packageInfo.latest)
      });
    }
    
    return packages;
  } catch (error) {
    // pnpm outdated は更新が見つかると exit code 1 で終了するが、これは正常
    if (error instanceof Error && 'stdout' in error) {
      try {
        const outdated = JSON.parse((error as any).stdout);
        const packages: PackageInfo[] = [];
        
        for (const [name, info] of Object.entries(outdated)) {
          const packageInfo = info as any;
          packages.push({
            name,
            current: packageInfo.current,
            wanted: packageInfo.wanted,
            latest: packageInfo.latest,
            type: packageInfo.dependencyType || 'dependencies',
            updateType: getUpdateType(packageInfo.current, packageInfo.latest)
          });
        }
        
        return packages;
      } catch (parseError) {
        return [];
      }
    }
    return [];
  }
}

async function getSpecificPackageInfo(packageName: string): Promise<PackageInfo | null> {
  try {
    const result = execSync(`pnpm outdated ${packageName} --format json`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const outdated = JSON.parse(result);
    const packageInfo = outdated[packageName];
    
    if (!packageInfo) {
      return null;
    }
    
    return {
      name: packageName,
      current: packageInfo.current,
      wanted: packageInfo.wanted,
      latest: packageInfo.latest,
      type: packageInfo.dependencyType || 'dependencies',
      updateType: getUpdateType(packageInfo.current, packageInfo.latest)
    };
  } catch (error) {
    // pnpm outdated は更新が見つかると exit code 1 で終了するが、これは正常
    if (error instanceof Error && 'stdout' in error) {
      try {
        const outdated = JSON.parse((error as any).stdout);
        const packageInfo = outdated[packageName];
        
        if (packageInfo) {
          return {
            name: packageName,
            current: packageInfo.current,
            wanted: packageInfo.wanted,
            latest: packageInfo.latest,
            type: packageInfo.dependencyType || 'dependencies',
            updateType: getUpdateType(packageInfo.current, packageInfo.latest)
          };
        }
      } catch (parseError) {
        // JSON パースエラーの場合は up to date として扱う
      }
    }
    
    return null;
  }
}

function generateBulkUpdateReport(packages: PackageInfo[]): string {
  if (packages.length === 0) {
    return '✅ All dependencies are up to date!';
  }

  const majorUpdates = packages.filter(p => p.updateType === 'major');
  const minorUpdates = packages.filter(p => p.updateType === 'minor');
  const patchUpdates = packages.filter(p => p.updateType === 'patch');

  let report = `# 📦 Dependency Update Report\n\n`;
  report += `Found ${packages.length} packages to update:\n\n`;

  if (majorUpdates.length > 0) {
    report += `## 🚨 Major Updates (${majorUpdates.length})\n`;
    report += `⚠️ These updates may contain breaking changes. Please review carefully.\n\n`;
    majorUpdates.forEach(pkg => {
      report += `- **${pkg.name}**: \`${pkg.current}\` → \`${pkg.latest}\`\n`;
    });
    report += `\n`;
  }

  if (minorUpdates.length > 0) {
    report += `## ✨ Minor Updates (${minorUpdates.length})\n`;
    report += `New features and improvements (backward compatible).\n\n`;
    minorUpdates.forEach(pkg => {
      report += `- **${pkg.name}**: \`${pkg.current}\` → \`${pkg.latest}\`\n`;
    });
    report += `\n`;
  }

  if (patchUpdates.length > 0) {
    report += `## 🔧 Patch Updates (${patchUpdates.length})\n`;
    report += `Bug fixes and security patches.\n\n`;
    patchUpdates.forEach(pkg => {
      report += `- **${pkg.name}**: \`${pkg.current}\` → \`${pkg.latest}\`\n`;
    });
    report += `\n`;
  }

  report += `## 📊 Summary\n\n`;
  report += `| Update Type | Count |\n`;
  report += `|-------------|-------|\n`;
  report += `| Major | ${majorUpdates.length} |\n`;
  report += `| Minor | ${minorUpdates.length} |\n`;
  report += `| Patch | ${patchUpdates.length} |\n`;
  report += `| **Total** | **${packages.length}** |\n\n`;

  return report;
}

function generateIndividualUpdateReport(updateInfo: PackageInfo): string {
  const emoji = updateInfo.updateType === 'major' ? '🚨' : 
                updateInfo.updateType === 'minor' ? '✨' : '🔧';
  
  const report = `# ${emoji} Update ${updateInfo.name}

## 📦 Package Information
- **Name**: ${updateInfo.name}
- **Previous Version**: \`${updateInfo.current}\`
- **New Version**: \`${updateInfo.latest}\`
- **Update Type**: ${updateInfo.updateType}
- **Dependency Type**: ${updateInfo.type}

## 📋 Update Details
${updateInfo.updateType === 'major' ? 
  '⚠️ **Major version update** - This may contain breaking changes. Please review the changelog carefully.' :
  updateInfo.updateType === 'minor' ?
  '✨ **Minor version update** - New features added (backward compatible).' :
  '🔧 **Patch version update** - Bug fixes and security patches.'
}

## 📚 Resources
- [NPM Package](https://www.npmjs.com/package/${updateInfo.name})
- [GitHub Repository](https://github.com/search?q=${updateInfo.name}&type=repositories)

## 🧪 Testing
Please verify that:
- [ ] All tests pass
- [ ] Application builds successfully
- [ ] No breaking changes affect the codebase
- [ ] New features work as expected (for minor/major updates)

---
*Generated by dependency update script*`;

  return report;
}

async function updateSpecificPackage(packageName: string): Promise<PackageInfo | null> {
  console.log(`🔍 Checking update for ${packageName}...`);
  
  const updateInfo = await getSpecificPackageInfo(packageName);
  
  if (!updateInfo) {
    console.log(`✅ ${packageName} is already up to date!`);
    return null;
  }
  
  console.log(`📦 Updating ${packageName}:`);
  console.log(`   Current: ${updateInfo.current}`);
  console.log(`   Latest:  ${updateInfo.latest}`);
  console.log(`   Type:    ${updateInfo.updateType} update`);
  
  try {
    // パッケージを更新
    execSync(`pnpm update ${packageName} --latest`, { stdio: 'inherit' });
    console.log(`✅ Successfully updated ${packageName}!`);
    return updateInfo;
  } catch (error) {
    console.error(`❌ Failed to update ${packageName}:`, error);
    return null;
  }
}

async function updateAllPackages(): Promise<void> {
  console.log('📥 Updating all packages...');
  
  try {
    execSync('pnpm update --latest', { stdio: 'inherit' });
    console.log('✅ Dependencies updated successfully!');
  } catch (error) {
    console.error('❌ Failed to update dependencies:', error);
    process.exit(1);
  }
}

async function runTests(): Promise<boolean> {
  console.log('🧪 Running tests...');
  
  try {
    execSync('pnpm lint', { stdio: 'inherit' });
    console.log('✅ Linting passed!');
    
    execSync('pnpm test', { stdio: 'inherit' });
    console.log('✅ Tests passed!');
    
    return true;
  } catch (error) {
    console.error('❌ Tests failed:', error);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 Usage:');
    console.log('  npx tsx scripts/update-deps.ts <package-name>    # Update specific package');
    console.log('  npx tsx scripts/update-deps.ts --all             # Update all packages (bulk)');
    console.log('  npx tsx scripts/update-deps.ts --individual      # Update all packages individually');
    console.log('  npx tsx scripts/update-deps.ts --check           # Check for updates only');
    console.log('  npx tsx scripts/update-deps.ts --check --json    # Check for updates (JSON output)');
    console.log('');
    
    // 利用可能な更新を表示
    console.log('🔍 Checking for available updates...');
    const outdatedPackages = await getOutdatedPackages();
    if (outdatedPackages.length > 0) {
      console.log('📦 Available updates:');
      outdatedPackages.forEach(pkg => {
        const emoji = pkg.updateType === 'major' ? '🚨' : 
                     pkg.updateType === 'minor' ? '✨' : '🔧';
        console.log(`  ${emoji} ${pkg.name}: ${pkg.current} → ${pkg.latest} (${pkg.updateType})`);
      });
    } else {
      console.log('✅ All packages are up to date!');
    }
    return;
  }
  
  if (args[0] === '--check') {
    const packages = await getOutdatedPackages();
    
    if (args.includes('--json')) {
      // JSON出力（GitHub Actions用）- ログメッセージなしでクリーンなJSONを出力
      console.log(JSON.stringify(packages, null, 2));
    } else {
      // 通常のレポート表示
      console.log('🔍 Checking for outdated packages...\n');
      const report = generateBulkUpdateReport(packages);
      console.log(report);
    }
    return;
  }
  
  if (args[0] === '--all') {
    console.log('🚀 Starting bulk dependency update process...\n');
    
    const packages = await getOutdatedPackages();
    const report = generateBulkUpdateReport(packages);
    
    console.log(report);
    
    if (packages.length === 0) {
      return;
    }
    
    // レポートをファイルに保存
    fs.writeFileSync('dependency-update-report.md', report);
    console.log('📝 Report saved to dependency-update-report.md\n');
    
    await updateAllPackages();
    
    const testsPass = await runTests();
    if (!testsPass) {
      console.error('❌ Tests failed after update. Please review the changes.');
      process.exit(1);
    }
    
    console.log('\n🎉 Bulk dependency update completed successfully!');
  } else if (args[0] === '--individual') {
    console.log('🚀 Updating all outdated packages individually...\n');
    const outdatedPackages = await getOutdatedPackages();
    
    if (outdatedPackages.length === 0) {
      console.log('✅ All packages are up to date!');
      return;
    }
    
    for (const pkg of outdatedPackages) {
      console.log(`\n${'='.repeat(50)}`);
      const updateInfo = await updateSpecificPackage(pkg.name);
      
      if (updateInfo) {
        // 個別のレポートを生成
        const report = generateIndividualUpdateReport(updateInfo);
        fs.writeFileSync(`update-report-${pkg.name}.md`, report);
        console.log(`📝 Report saved to update-report-${pkg.name}.md`);
      }
    }
    
    console.log('\n🎉 All individual package updates completed!');
  } else {
    const packageName = args[0];
    console.log(`🚀 Updating ${packageName}...\n`);
    
    const updateInfo = await updateSpecificPackage(packageName);
    
    if (updateInfo) {
      // レポートを生成
      const report = generateIndividualUpdateReport(updateInfo);
      fs.writeFileSync(`update-report-${packageName}.md`, report);
      console.log(`\n📝 Report saved to update-report-${packageName}.md`);
      
      const testsPass = await runTests();
      if (!testsPass) {
        console.error('❌ Tests failed. Please review the changes.');
        process.exit(1);
      }
      
      console.log('\n🎉 Package update completed successfully!');
    }
  }
}

// ES Modules entry point check
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { getOutdatedPackages, getSpecificPackageInfo, generateBulkUpdateReport, generateIndividualUpdateReport, updateSpecificPackage };
