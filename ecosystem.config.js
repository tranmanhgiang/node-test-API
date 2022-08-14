module.exports = {
    apps: [
        {
            name: 'node-api',
            script: 'dist/src/index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: process.env.PM2_MAX_MEMORY_RESTART || '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
            output: '/dev/null',
            error: '/dev/null',
        },
    ],
};
