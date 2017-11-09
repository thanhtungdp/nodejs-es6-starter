module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'vietan_auth_api',
      script: './bootstrap.js',
      env: {
        NODE_ENV: 'development',
        NODE_PATH: './src'
      },
      env_production: {
        NODE_ENV: 'production',
        NODE_PATH: './src'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'root', // user
      host: '128.199.127.230', // ip
      ref: 'origin/release', // branch được config để chạy production
      repo: 'git@gitlab.com:tungtung-dev/react-quiz-nextjs.git', // git
      path: '/data/pm2/vietan_auth_api',
      'post-deploy': 'yarn install && yarn build && pm2 reload ecosystem.config.js --env production'
    }
  }
}
