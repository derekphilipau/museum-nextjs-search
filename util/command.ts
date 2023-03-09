import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

export async function abort() {
  console.log('Aborting');
  return rl.close();
}

export async function questionsDone() {
  return rl.close();
}
