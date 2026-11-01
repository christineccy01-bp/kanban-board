FROM node:24-alpine
COPY --from=ghcr.io/pnpm/pnpm:12-alpine /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done

WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY . .

EXPOSE 4242
# Run node directly (not `pnpm start`) so it is PID 1 and receives SIGTERM;
# DATABASE_URL comes from the environment instead of a .env file
CMD ["node", "--use-system-ca", "server.ts"]