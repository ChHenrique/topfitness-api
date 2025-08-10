const replaceInFile = require('replace-in-file');

const options = {
  files: 'dist/**/*.js',
  from: /from\s+['"](\.\.?\/[^'"]+?)(?<!\.js|\.cjs|\.mjs)['"]/g,
  to: "from '$1.js'"
};

(async () => {
  try {
    const results = await replaceInFile.replaceInFile(options);
    console.log(`Importações corrigidas em ${results.length} arquivos`);
  } catch (error) {
    console.error('Erro ao corrigir imports:', error);
    process.exit(1);
  }
})();
