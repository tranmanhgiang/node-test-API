const { execSync } = require('child_process');

function detectEnvironment() {
    let environment = 'development';
    if (process.argv[3]) {
        // eslint-disable-next-line prefer-destructuring
        environment = process.argv[3];
    }
    return environment;
}

function detectCommand() {
    const allowCommands = ['build', 'migration', 'seed', 'start'];
    const command = process.argv[2];

    if (command && allowCommands.find((c) => `--${c}` === command)) {
        return command.slice(2);
    }
}

function execute() {
    let script = '';
    const environment = detectEnvironment();
    const command = detectCommand();
    if (command) {
        switch (command) {
            case 'build':
                script = `tsc`;
                break;
            case 'migration':
                script = `npm run build:migrations && sequelize db:migrate`;
                break;
            case 'seed':
                script = `npm run build:migrations && NODE_ENV=${environment} sequelize db:seed:all`;
                break;
            case 'start':
                script = `pm2 start ecosystem.config.js --only jivescribe-api-${environment} --env production`;
                break;
            default:
                break;
        }
        execSync(script, { stdio: 'inherit' });
    } else {
        // eslint-disable-next-line no-console
        console.log('\x1b[33m%s\x1b[0m', '\n Command not found \n');
    }
}

execute();
