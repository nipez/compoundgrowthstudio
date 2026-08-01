# Build static Astro site and serve with nginx on Railway.
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Bake public Supabase keys into the static client bundle at build time.
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
ENV PUBLIC_SUPABASE_URL=$SUPABASE_URL
ENV PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Official nginx image runs envsubst on /etc/nginx/templates/*.template
ENV PORT=8080
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
