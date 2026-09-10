#!/usr/bin/env bash
# Idempotent Cloud Agent install for the wika-fundaments documentation repo.
# This repo ships no application code, so setup only provisions the tooling
# needed to author and QA Markdown documentation. It must stay fast and safe to
# run repeatedly (build-snapshot creation and per-boot reruns).
set -euo pipefail

MARKDOWNLINT_CLI2_VERSION="0.23.2"

log() { printf '[cloud-agent-install] %s\n' "$*"; }

require() {
  local bin="$1"
  if ! command -v "$bin" >/dev/null 2>&1; then
    log "ERROR: required tool '$bin' is not available in the base image."
    exit 1
  fi
}

log "Verifying base toolchain..."
require git
require node
require npm
log "node $(node -v) / npm $(npm -v) / git $(git --version | awk '{print $3}')"

# Capture the full --version output first so the producer never sees a closed
# pipe (markdownlint-cli2 keeps writing after the version line, which would
# otherwise raise EPIPE when piped into head).
version_output="$(markdownlint-cli2 --version 2>/dev/null || true)"
installed_version="$(printf '%s\n' "${version_output}" | awk 'NR==1 {print $2}' | tr -d 'v')"
if [ "${installed_version}" = "${MARKDOWNLINT_CLI2_VERSION}" ]; then
  log "markdownlint-cli2 ${MARKDOWNLINT_CLI2_VERSION} already installed; skipping."
else
  log "Installing markdownlint-cli2@${MARKDOWNLINT_CLI2_VERSION}..."
  npm_bin="$(command -v npm)"
  if sudo -n true >/dev/null 2>&1; then
    # Preferred: install into /usr/local so the CLI is on PATH for every shell.
    sudo -n env "PATH=${PATH}" "${npm_bin}" install -g --prefix /usr/local \
      "markdownlint-cli2@${MARKDOWNLINT_CLI2_VERSION}"
  else
    # Fallback: user-writable global prefix, exported for the current process
    # and persisted to the shell profile for later sessions.
    prefix="${HOME}/.npm-global"
    mkdir -p "${prefix}/bin"
    "${npm_bin}" install -g --prefix "${prefix}" \
      "markdownlint-cli2@${MARKDOWNLINT_CLI2_VERSION}"
    export PATH="${prefix}/bin:${PATH}"
    line="export PATH=\"${prefix}/bin:\$PATH\""
    for rc in "${HOME}/.bashrc" "${HOME}/.profile"; do
      touch "${rc}"
      grep -qxF "${line}" "${rc}" || printf '%s\n' "${line}" >>"${rc}"
    done
  fi
fi

ready_output="$(markdownlint-cli2 --version 2>/dev/null || true)"
log "Documentation tooling ready: $(printf '%s\n' "${ready_output}" | awk 'NR==1')"
