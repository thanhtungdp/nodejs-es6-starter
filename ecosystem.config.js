module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'scm_log_api',
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
      host: '125.212.251.174', // ip
      ref: 'origin/release', // branch được config để chạy production
      repo: 'git@gitlab.com:vietan-chatthairan/swm-log-api.git', // git
      path: '/data/swm/swm-log-api',
      'post-deploy': 'yarn install && yarn build && pm2 reload ecosystem.config.js --env production'
    }
  }
}
