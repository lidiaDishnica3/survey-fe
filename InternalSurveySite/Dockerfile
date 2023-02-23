FROM tiangolo/node-frontend:10 as build-stage


WORKDIR /app
EXPOSE 443
EXPOSE 80
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG configuration=production
RUN npm run build -- --output-path=./dist/out --configuration $configuration

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx-custom-default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/nginx-custom.conf /etc/nginx/nginx.conf
