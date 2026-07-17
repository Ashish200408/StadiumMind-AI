const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, 'src', 'features');
const features = fs.readdirSync(featuresDir).filter(f => fs.statSync(path.join(featuresDir, f)).isDirectory());

const results = {
  intervals: [],
  stores: [],
  renderLoops: [],
  placeholders: [],
  subscriptions: []
};

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

for (const feature of features) {
  const featurePath = path.join(featuresDir, feature);
  const files = walk(featurePath);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(featuresDir, file);
    
    // Check intervals
    if (content.includes('setInterval')) {
      results.intervals.push(relativePath);
    }
    
    // Check stores and subscriptions
    if (content.match(/use\w+Store/)) {
      results.stores.push(relativePath);
    }
    if (content.includes('useStore(') || content.match(/use\w+Store\(/)) {
      results.subscriptions.push(relativePath);
    }
    
    // Check render loops (useEffect with no deps or state update in interval)
    if (content.includes('useEffect') && content.includes('setInterval')) {
      results.renderLoops.push(relativePath);
    }
    
    // Check placeholders
    if (content.toLowerCase().includes('placeholder') || content.includes('Mock') || content.includes('TODO: implement')) {
      results.placeholders.push(relativePath);
    }
  }
}

console.log(JSON.stringify(results, null, 2));
