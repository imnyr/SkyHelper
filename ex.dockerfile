FROM node:lts
WORKDIR /root/skyhelper

COPY ["package.json", "package-lock.json*"]

# SECRETS
ENV NODE_ENV=
ENV TOKEN=
ENV MONGO_CONNECTION=
ENV TOPGG_TOKEN=
ENV DBL_TOKEN=
ENV AUTH_TOKEN=
# WEBHOOKS [OPTIONAL]
ENV GUILD=
ENV SUGGESTION=
ENV ERROR_LOGS=
ENV READY_LOGS=
ENV COMMANDS_USED=
ENV CONTACT_US=
ENV BUG_REPORTS=

RUN npm ci
COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]