FROM node:18.14.2-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY ./ /usr/src/app
ENV PORT 3000
EXPOSE 3000
CMD [ "npm", "start" ]