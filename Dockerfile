FROM node:14.17.0-alpine as development

WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:14.17.0-alpine as production

WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN npm install --only=production
COPY --from=0 /app/build ./build
EXPOSE 9090
CMD npm start
