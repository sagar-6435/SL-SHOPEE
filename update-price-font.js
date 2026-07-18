const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}
const files = walk('frontend/src').filter(f => f.endsWith('.jsx'));
let replacedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace font-display followed somewhat soon by ₹
    // E.g. className="text-2xl font-display font-bold text-gray-900">₹
    let modified = content.replace(/(className\s*=\s*[\`\'\"][^\`\'\"]*?)font-display([^\`\'\"]*?[\`\'\"][^>]*>[\s\n]*)(₹)/g, '$1font-sans$2$3');

    let lines = modified.split(/\r?\n/);
    lines = lines.map((line, idx) => {
        // Also check if a line simply has both ₹ and font-display (good heuristic for inline classes)
        if (line.includes('₹') && line.includes('font-display')) {
            return line.replace(/font-display/g, 'font-sans');
        }

        // Let's also check if the next line has ₹, and this line has font-display inside a className
        if (line.includes('font-display') && line.includes('className')) {
            if (idx + 1 < lines.length && lines[idx + 1].includes('₹')) {
                return line.replace(/font-display/g, 'font-sans');
            }
            if (idx + 2 < lines.length && lines[idx + 2].includes('₹')) {
                return line.replace(/font-display/g, 'font-sans');
            }
        }
        return line;
    });

    let finalContent = lines.join('\n');
    if (finalContent !== content) {
        fs.writeFileSync(file, finalContent, 'utf8');
        replacedCount++;
    }
});
console.log('Update complete. Modified files: ' + replacedCount);
