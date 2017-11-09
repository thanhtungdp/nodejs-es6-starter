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
      host: '45.76.190.175 ', // ip
      ref: 'origin/release', // branch được config để chạy production
      repo: 'git@gitlab.com:thanhtungdp/auth-api.git', // git
      path: '/data/pm2/vietan_auth_api',
      'post-deploy': 'yarn install && yarn build && pm2 reload ecosystem.config.js --env production'
    }
  }
}
