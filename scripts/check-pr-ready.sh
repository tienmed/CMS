#!/usr/bin/env bash
set -euo pipefail

echo "== Remote =="
git remote -v || true
echo

echo "== Branch =="
git branch -vv || true
echo

echo "== Status =="
git status -sb || true
echo

echo "== Recent commits =="
git log --oneline --decorate -n 5 || true
echo

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "[ERROR] Chưa có remote 'origin'. Hãy chạy:"
  echo "git remote add origin https://github.com/<owner>/<repo>.git"
  exit 1
fi

echo "[OK] Có remote origin. Kiểm tra thêm quyền push và CI trên GitHub."
