import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove inline if (!formData.*) toast.error(...) return;
    content = content.replace(/if\s*\(\!formData\.[a-zA-Z0-9_]+\)\s*\{\s*toast\.error\([^\)]+\);\s*return;\s*\}/g, '');
    
    content = content.replace(/if\s*\(\!formData\.amount\s*\|\|\s*rawAmount\s*<=\s*0\)\s*\{\s*toast\.error\([^\)]+\);\s*return;\s*\}/g, '');
    content = content.replace(/if\s*\(formData\.pan\s*&&\s*\!validatePan\(formData\.pan\)\)\s*\{\s*toast\.error\([^\)]+\);\s*return;\s*\}/g, '');

    content = content.replace(/disabled=\{isVerifying\s*\|\|\s*\!formData\.donorName\s*\|\|\s*rawAmount\s*<=\s*0\}/g, '');
    
    // Disable any specific disabled conditions in forms
    content = content.replace(/disabled=\{\!formData\.name \|\| \!formData\.date\}/g, '');
    content = content.replace(/disabled=\{\!formData\.devoteeName \|\| \!formData\.date\}/g, '');

    // In validationSchemas.ts, remove .required() calls
    if (filePath.includes('validationSchemas.ts')) {
      content = content.replace(/\.required\([^\)]*\)/g, '');
    }

    if (filePath.includes('enrollmentValidations.ts')) {
      content = content.replace(/errors\.[a-zA-Z0-9_]+\s*=\s*\"[^\"]+\";/g, '');
    }
    
    if (filePath.includes('TempleEnrollmentWizard.tsx')) {
       content = content.replace(/if\s*\(\!value\.trim\(\)\)\s*errorMsg\s*=\s*\"[^\"]+\";/g, '');
       content = content.replace(/if\s*\(value\.length\s*<\s*1\)\s*errorMsg\s*=\s*\"[^\"]+\";/g, '');
    }

    if (filePath.includes('CommonDataModal.tsx')) {
       content = content.replace(/if\s*\(field\.required\s*&&\s*\!formData\[field\.key\]\)\s*\{\s*newErrors\[field\.key\]\s*=\s*.*?\;\s*\}/g, '');
    }

    // Remove 'required' prop from UI components globally so HTML5 doesn't block it
    content = content.replace(/(<SmartField[^>]*?)\brequired\b([^>]*?>)/g, '$1$2');
    content = content.replace(/(<SmartSelect[^>]*?)\brequired\b([^>]*?>)/g, '$1$2');
    content = content.replace(/(<input[^>]*?)\brequired\b([^>]*?>)/g, '$1$2');
    content = content.replace(/(<select[^>]*?)\brequired\b([^>]*?>)/g, '$1$2');
    content = content.replace(/(<textarea[^>]*?)\brequired\b([^>]*?>)/g, '$1$2');
    
    content = content.replace(/<span\s+className=\"[^\"]*text-rose-500[^\"]*\">\s*\*\s*<\/span>/g, '');
    // Some places use text-red-500
    content = content.replace(/<span\s+className=\"[^\"]*text-red-500[^\"]*\">\s*\*\s*<\/span>/g, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
