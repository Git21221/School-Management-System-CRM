import readline from 'readline';

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function ask(question: string): Promise<string> {
  const rl = createInterface();
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function askRequired(label: string): Promise<string> {
  while (true) {
    const value = await ask(`${label}: `);
    if (value) {
      return value;
    }
    console.log('  This field is required.');
  }
}

export async function askPassword(label: string, minLength = 8): Promise<string> {
  while (true) {
    const value = await ask(`${label} (min ${minLength} chars): `);
    if (value.length >= minLength) {
      return value;
    }
    console.log(`  Password must be at least ${minLength} characters.`);
  }
}

export async function askYesNo(label: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  const answer = (await ask(`${label} [${hint}]: `)).toLowerCase();
  if (!answer) {
    return defaultYes;
  }
  return answer.startsWith('y');
}
