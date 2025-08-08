#!/bin/bash
set -euo pipefail
# set -e   → berhenti kalau ada perintah yang error
# set -u   → berhenti kalau ada variabel yang belum didefinisikan
# set -o pipefail → kalau ada error di dalam pipe, langsung berhenti

echo "Upgrading packages and installing dependencies..."
sleep 2
sudo apt update && sudo apt upgrade -y || { echo "❌ Gagal update/upgrade paket."; exit 1; }

sudo apt install -y btop unzip ca-certificates || { echo "❌ Gagal install dependencies."; exit 1; }

echo "Installing Bun..."
sleep 2
curl -fsSL https://bun.sh/install | bash || { echo "❌ Gagal download/install Bun."; exit 1; }

echo "Done!"
# Pastikan .bashrc ada sebelum di-source
if [[ -f "$HOME/.bashrc" ]]; then
    source "$HOME/.bashrc"
else
    echo "⚠️  .bashrc tidak ditemukan, skip source."
fi

bun --version || { echo "❌ Bun tidak terdeteksi."; exit 1; }
