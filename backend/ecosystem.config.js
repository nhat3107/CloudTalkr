export default {
  apps: [
    {
      name: "backend-app",
      script: "npm",
      args: "run start",
      interpreter: "none",
      instances: 1,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
