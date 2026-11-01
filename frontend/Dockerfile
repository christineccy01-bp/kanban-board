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
ENV NODE_ENV=production
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
