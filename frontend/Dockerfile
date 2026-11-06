FROM node:24-alpine
COPY --from=ghcr.io/pnpm/pnpm:12-alpine /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done

WORKDIR /app
# Install devDependencies too: `next build` needs typescript and tailwind
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

# NEXT_PUBLIC_ vars are inlined at build time, so they must be set before `next build`
ARG NEXT_PUBLIC_API_URL=http://localhost:4242
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_COGNITO_AUTHORITY
ARG NEXT_PUBLIC_COGNITO_CLIENT_ID
ARG NEXT_PUBLIC_COGNITO_DOMAIN
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_COGNITO_AUTHORITY=$NEXT_PUBLIC_COGNITO_AUTHORITY
ENV NEXT_PUBLIC_COGNITO_CLIENT_ID=$NEXT_PUBLIC_COGNITO_CLIENT_ID
ENV NEXT_PUBLIC_COGNITO_DOMAIN=$NEXT_PUBLIC_COGNITO_DOMAIN
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NODE_ENV=production
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
