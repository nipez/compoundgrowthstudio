# Build static Astro site and serve with nginx on Railway.
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Bake the form collector URL into the static client bundle at build time.
# CRM_LEADS_ENDPOINT is still accepted so existing deploys keep working.
ARG FORM_ENDPOINT
ARG CRM_LEADS_ENDPOINT
ENV FORM_ENDPOINT=$FORM_ENDPOINT
ENV CRM_LEADS_ENDPOINT=$CRM_LEADS_ENDPOINT

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Official nginx image runs envsubst on /etc/nginx/templates/*.template
ENV PORT=8080
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
