import path from 'path';
import minimist from 'minimist';
import chalk from 'chalk';
import ReactTailwindTypesGenerator from './ReactTailwindTypesGenerator';
import TypeTemplatesCreator from './Adapters/TypeTemplatesCreator';

let start = process.hrtime();

const args = minimist(process.argv.slice(2));

// find outdir
const outdir = args.outdir || 'src';
const verbose = args.verbose || false;

// run styling object interface generator
async function run() {
  console.log(
    chalk.blue(
      `Generating TailwindStylingObject interface info "${path.resolve(
        outdir
      )}"....`
    )
  );
  await new ReactTailwindTypesGenerator(
    new TypeTemplatesCreator(outdir),
    verbose
  ).run();
  console.log(
    chalk.green(`✅ TailwindStylingObject interface was generated successfully`)
  );
}
run().then(() => {
  let end = process.hrtime(start);

  console.info('Execution time (hr): %ds %dms', end[0], end[1] / 1000000);
});
