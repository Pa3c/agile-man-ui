FROM node:alpine
WORKDIR '/agileman-frontend'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
 
FROM nginx
#from means that we want copy from specific phase - 0 means the first phase
#COPY --from=0 /agileman-frontend /usr/share/nginx/html

COPY --from=0 /agileman-frontend/dist/agileman /usr/share/nginx/html