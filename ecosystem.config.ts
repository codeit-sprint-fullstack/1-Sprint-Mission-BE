const config = {
  apps: [
    {
      name: "ibaomarket",
      script: "./dist/server.js",
      instances: 1,
      autorestart: true,
      watch: process.env.NODE_ENV === "development", // 개발 환경에서만 watch 활성화
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development", // 개발 환경
      },
      env_production: {
        NODE_ENV: "production", // 배포 환경
      },
    },
  ],
};

export default config;

