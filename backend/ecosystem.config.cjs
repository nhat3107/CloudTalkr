module.exports = {
  apps: [
    {
      name: "backend-app",
      script: "npm",
      args: "run start",
      instances: 1,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
