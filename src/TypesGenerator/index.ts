import minimist from 'minimist';
import ReactTailwindTypesGenerator from './ReactTailwindTypesGenerator';
import TypescriptTypeGenerator from './Adapters/Typescript';

const args = minimist(process.argv.slice(2));

const outdir = args.outdir || 'src/tailwind-props';

new ReactTailwindTypesGenerator(new TypescriptTypeGenerator(outdir)).run();
