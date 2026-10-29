#!/usr/bin/env bash
# Builds the fixture apps against this package, packed as it would be
# published: ./test/fixtures.sh [nuxt4 nuxt3 nuxt2]
#
# HIBIRA_VUE_TGZ=path/to/hibira-io-vue-x.y.z.tgz installs that @hibira-io/vue
# instead of the one on npm. To try a fixture in a browser, start a server
# (pusher-server, or any Pusher-compatible one) on 127.0.0.1:8080 with client
# events on, then in the fixture:
#   nuxt 3/4: PORT=3000 NUXT_PUBLIC_HIBIRA_KEY=... NUXT_HIBIRA_APP_ID=... NUXT_HIBIRA_SECRET=... npm start
#   nuxt 2:   HIBIRA_KEY=... HIBIRA_APP_ID=... HIBIRA_SECRET=... NODE_OPTIONS=--openssl-legacy-provider npm start
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
pack="$root/.pack"
rm -rf "$pack" && mkdir -p "$pack"
tgz="$pack/$(cd "$root" && npm pack --silent --pack-destination "$pack")"

for fx in "${@:-nuxt4 nuxt3 nuxt2}"; do
  for name in $fx; do
    echo "::group::$name"
    cd "$root/test/fixtures/$name"
    extra=("$tgz")
    if [ -n "${HIBIRA_VUE_TGZ:-}" ]; then extra+=("$HIBIRA_VUE_TGZ"); fi
    npm install --no-package-lock --no-audit --no-fund "${extra[@]}"
    if [ "$name" = nuxt2 ]; then NODE_OPTIONS=--openssl-legacy-provider npm run build; else npm run build; fi
    echo "::endgroup::"
  done
done
