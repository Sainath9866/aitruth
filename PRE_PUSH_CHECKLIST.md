# ✅ Pre-Push Checklist

Before pushing to GitHub, ensure you follow these steps:

## 🔒 Security Check

- [ ] **Remove sensitive data from `.env`**
  - Verify `backend/.env` is in `.gitignore` ✓
  - Never commit actual API keys
  - Only commit `backend/.env.example` with placeholder values

- [ ] **Verify `.gitignore` is working**
  ```bash
  git status
  # Should NOT show: *.db, .env, node_modules/, __pycache__/
  ```

- [ ] **Check for hardcoded secrets**
  ```bash
  # Search for potential secrets
  grep -r "sk-" --exclude-dir={node_modules,venv,.git} .
  grep -r "api_key" --exclude-dir={node_modules,venv,.git} .
  ```

## 📁 File Verification

- [ ] **Essential files present:**
  - README.md ✓
  - LICENSE ✓
  - .gitignore ✓
  - backend/.env.example ✓
  - backend/requirements.txt ✓
  - frontend/package.json ✓

- [ ] **Database excluded:**
  - `backend/truth_meter.db` should NOT be committed
  - Will be auto-created on first run

## 🧹 Cleanup

- [ ] **Remove unnecessary files:**
  ```bash
  # Remove temp/backup files
  find . -name "*.backup" -o -name "*.tmp" -o -name "*~" | xargs rm -f
  
  # Remove __pycache__
  find . -type d -name "__pycache__" -exec rm -rf {} +
  ```

- [ ] **Frontend build artifacts:**
  - Ensure `frontend/.next/` is in .gitignore ✓
  - Ensure `frontend/node_modules/` is in .gitignore ✓

## 🧪 Testing

- [ ] **Backend runs:**
  ```bash
  cd backend
  source venv/bin/activate
  uvicorn app.main:app --reload --port 8001
  # Test: http://localhost:8001/docs
  ```

- [ ] **Frontend runs:**
  ```bash
  cd frontend
  npm run dev
  # Test: http://localhost:3002
  ```

- [ ] **Sample questions populate:**
  ```bash
  cd backend
  python populate_questions.py
  # Should complete without errors
  ```

## 📝 Documentation

- [ ] **README.md is up-to-date**
  - Installation steps verified
  - Port numbers correct (8001 for backend, 3002 for frontend)
  - API provider links working

- [ ] **Update README if you changed:**
  - Dependencies
  - Port numbers
  - File structure
  - Environment variables

## 🚀 Git Commands

```bash
# 1. Initialize repo (if not already done)
git init

# 2. Add all files
git add .

# 3. Check what will be committed
git status

# 4. Verify no secrets are being committed
git diff --staged

# 5. Commit
git commit -m "Initial commit: AI Truth Meter evaluation system"

# 6. Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/ai-truth-meter.git

# 7. Push to GitHub
git branch -M main
git push -u origin main
```

## ⚠️ CRITICAL: Never Commit

- ❌ `backend/.env` (contains real API keys)
- ❌ `backend/truth_meter.db` (database file)
- ❌ `backend/venv/` (Python virtual environment)
- ❌ `frontend/node_modules/` (Node packages)
- ❌ `frontend/.next/` (Build artifacts)
- ❌ Any `*.pth` or `*.pkl` model files (unless small)

## ✅ Final Verification

Run this command to see what will be committed:
```bash
git ls-files
```

This should show:
- ✅ Source code (*.py, *.tsx, *.ts, *.json)
- ✅ Configuration files (.env.example, requirements.txt, package.json)
- ✅ Documentation (README.md, LICENSE, etc.)
- ❌ NO secrets, databases, or build artifacts

---

**Ready to push?** Make sure all checkboxes are complete!
