# Hướng dẫn xử lý lỗi không tạo được Pull Request (GitHub)

## 1) Kiểm tra nhanh (bắt buộc)
```bash
git remote -v
git branch -vv
git status
git log --oneline --decorate -n 5
```

Nếu `git remote -v` không có `origin`, bạn **không thể push** nên cũng không thể mở PR.

---

## 2) Thiết lập remote đúng repo
```bash
git remote add origin https://github.com/<owner>/<repo>.git
# hoặc nếu đã có origin nhưng sai URL
git remote set-url origin https://github.com/<owner>/<repo>.git
```

Xác minh lại:
```bash
git remote -v
```

---

## 3) Push branch và đặt upstream
```bash
git push -u origin <ten-branch>
```

Nếu thành công, GitHub sẽ hiển thị link tạo PR.

---

## 4) Lỗi thường gặp & cách xử lý

### A. `Permission denied` / `403`
- Bạn chưa có quyền push vào repo.
- Cách xử lý:
  - Dùng fork của bạn, rồi PR từ fork -> upstream.
  - Hoặc nhờ owner cấp quyền write.
  - Nếu dùng HTTPS + token: kiểm tra PAT còn hạn và có scope `repo`.

### B. `No commits between ...`
- Branch chưa có commit khác so với base branch.
- Cách xử lý:
```bash
git add .
git commit -m "your message"
git push
```

### C. `This branch is out-of-date`
- Branch bị lệch so với base.
- Cách xử lý:
```bash
git fetch origin
git rebase origin/main
# hoặc merge origin/main
git push --force-with-lease   # nếu đã rebase
```

### D. `Detached HEAD`
- Bạn đang không đứng trên branch thật.
- Cách xử lý:
```bash
git switch -c fix/<ten-task>
# commit lại rồi push
```

### E. CI fail nên không merge được
- Mở tab Checks để xem job fail.
- Chạy local trước khi push:
```bash
npm run build --prefix mcp-server
```

---

## 5) Workflow chuẩn cho các lần sau
1. Tạo branch mới từ `main`.
2. Code + chạy build/test local.
3. Commit rõ ràng.
4. `git push -u origin <branch>`.
5. Mở PR, kiểm tra diff nhỏ gọn và checks pass.

