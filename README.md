# Monorepo Typescript Template

This is an official Docker starter Turborepo.

## What's inside?

This repository uses [Yarn workspaces](https://classic.yarnpkg.com/lang/en/) as a package manager and [Turborepo](https://turborepo.org/) as a task runner.

- Yarn Workspaces
  Workspace is a yarn feature that hoists our node modules into the root level in our monorepo while keeping symbolic links for the dependencies within the monorepo—allowing us to work on multiple codebases within a monorepo without manually linking dependencies.
- Turborepo
  Turborepo is a tool that builds a dependency graph of our packages and runs pipelines to respect the hierarchy of dependencies. Instead of worrying about running build in all of the packages an application depends on, Turborepo takes care of that for us.

It includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org) app
- `api`: an [Express](https://expressjs.com/) server
- `ui`: ui: a React component library
- `eslint-config-custom`: `eslint` configurations for client side applications (includes `eslint-config-next` and `eslint-config-prettier`)
- `eslint-config-custom-server`: `eslint` configurations for server side applications (includes `eslint-config-next` and `eslint-config-prettier`)
- `scripts`: Jest configurations
- `logger`: Isomorphic logger (a small wrapper around console.log)
- `tsconfig`: tsconfig.json;s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Docker

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create app_network

# Build prod using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build --parallel

# Start prod in detached mode
docker-compose -f docker-compose.yml up -d
```

Open http://localhost:3000.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```

### Utilities

This repository has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
