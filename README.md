# Heracles API

Heracles HTTP Rest API to interact with Heracles Management Resources.
Http Rest API hosted on [Heroku](https://api-heracles.herokuapp.com/).
Built on [Nestjs](https://github.com/nestjs/nest) and [MongoDB](https://mongodb.com).

To test it out locally, you need a `MongoDB` instance available.
Create a `.env` file in the root directory and set the following environment variables with proper values.

```sh
DATABASE_URL=
GOOGLE_OAUTH_2_CALLBACK_URL=
GOOGLE_OAUTH_2_CLIENT_ID=
GOOGLE_OAUTH_2_CLIENT_SECRET=
GOOGLE_OAUTH_2_SCOPES=
JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=
```

## Debug locally with VSCode

- perform [local setup](#setup-on-the-machine).
- `yarn start:debug`

## Setup on the machine

- install `node`. Follow along [here](https://github.com/nvm-sh/nvm)
- install `yarn`. Follow along [here](https://classic.yarnpkg.com/en/docs/install/)
- `yarn install`
- `yarn start`

## Setup with Docker

- `docker build --rm -f "Dockerfile" -t heracles-api:latest "."`
- `docker run --name heracles-api -it --rm -p 4000:3200 -e="PORT=3200" heracles-api`
