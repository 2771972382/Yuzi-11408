根据我们之前的对话，你从一个开源项目起步，想要建立自己的考研笔记仓库，并同步到 Gitee 和 GitHub。下面为你总结一套 **针对考研笔记场景的 Git 实用用法**，涵盖初始化、日常同步、双远程备份、常见问题解决。

---

## 一、初始化（首次使用）

### 1. 克隆别人的项目作为起点
```bash
git clone <原项目地址>   # 下载到本地
cd 项目文件夹
```

### 2. 改为自己的仓库（断开关联）
```bash
git remote remove origin               # 删除原远程
git remote add origin <你的Gitee地址>   # 绑定你的Gitee仓库
```

### 3. 初始化一个全新的本地仓库（如果没有现成项目）
```bash
cd 你的笔记文件夹
git init                               # 初始化
git remote add origin <你的Gitee地址>
```

---

## 二、日常同步到 Gitee（主远程）

### 使用 Obsidian Git 插件（推荐）
- 安装插件后，配置好 Git 路径和私人令牌。
- 每次编辑完笔记，点击 **Commit-and-sync** 按钮 → 自动完成 `add` + `commit` + `push`。
- 插件也可以设置定时自动同步（如每 30 分钟）。

### 使用命令行（手动）
```bash
git add .                              # 暂存所有变更
git commit -m "更新考研笔记"            # 提交到本地
git push origin master                 # 推送到 Gitee
```

---

## 三、额外备份到 GitHub（第二远程）

### 1. 添加 GitHub 远程
```bash
git remote add github <你的GitHub地址>   # 添加别名 github
git remote -v                           # 查看所有远程
```

### 2. 手动推送到 GitHub
```bash
git push github master                  # 推送到 GitHub 的 master 分支
```
- 如果 GitHub 是空仓库，直接推送即可。
- 如果 GitHub 有内容但本地落后，先 `git pull github master --rebase` 再推送。

---

## 四、保持同步：拉取远程更新

### 场景：GitHub 上有新提交（例如从另一台电脑推送），本地没有改动
```bash
git pull github master --rebase         # 拉取并变基，保持线性历史
```
- 如果不想变基，可以用 `git pull github master`（会产生合并提交）。

### 场景：Gitee 和 GitHub 同时作为来源
一般只需从一个远程拉取，推荐以 Gitee 为主：
```bash
git pull origin master                  # 从 Gitee 拉取
```

---

## 五、常见问题与解决

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| `fatal: not a git repository` | 当前目录没有 `.git` 文件夹 | `git init` 或 `git clone` |
| `nothing to commit, working tree clean` | 没有新改动需要提交 | 先修改文件再 `git add` |
| `Authentication failed` | 密码错误或未使用令牌 | 使用 Gitee/GitHub 的 **私人令牌** 代替密码 |
| `failed to push: rejected` | 远程有本地没有的提交 | 先 `git pull --rebase` 再 `git push` |
| 分支名不一致（本地 master，远程 main） | 默认分支名不同 | `git push github master:main` 或重命名本地分支 |
| 镜像同步比直接 push 慢很多 | 镜像需要先拉取再推送，有排队 | 放弃镜像，直接用 `git push github` |

---

## 六、一些实用技巧

### 1. 查看当前状态
```bash
git status          # 查看哪些文件变了、是否已暂存
git remote -v       # 查看远程仓库地址
git branch          # 查看当前分支
```

### 2. 设置 Git 全局信息（第一次使用）
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### 3. 生成私人令牌（代替密码）
- **Gitee**：设置 → 私人令牌 → 生成（勾选 `projects` 权限）
- **GitHub**：Settings → Developer settings → Personal access tokens → 生成（勾选 `repo` 权限）

### 4. 修改已写错的提交信息
```bash
git commit --amend -m "新的信息"
```

### 5. 撤销暂存（`git add` 后想取消）
```bash
git reset HEAD <文件名>   # 取消暂存，但保留文件改动
```

---

## 七、推荐的完整工作流（考研笔记）

1. **每天写笔记** → Obsidian 自动保存到本地。
2. **同步到 Gitee**：点击 Obsidian Git 的 “Commit-and-sync” 按钮（或等待自动定时同步）。
3. **备份到 GitHub**：每隔几天打开终端，执行 `git push github master`。
4. **换设备学习**：在新电脑上 `git clone <你的Gitee地址>`，然后用 Obsidian 打开即可。

这套流程简单可靠，既利用了 Gitee 的国内高速，又把 GitHub 当作免费异地备份。如果以后想完全自动化双推，可以再研究 GitHub Actions 或 Gitee 镜像，但目前手动 `git push github` 已经足够。