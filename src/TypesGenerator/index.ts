import minimist from 'minimist';
import ReactTailwindTypesGenerator from './ReactTailwindTypesGenerator';
import TypeTemplatesCreator from './Adapters/TypeTemplatesCreator';

const args = minimist(process.argv.slice(2));

const outdir = args.outdir || 'src/tailwind-props';

new ReactTailwindTypesGenerator(new TypeTemplatesCreator(outdir)).run();
