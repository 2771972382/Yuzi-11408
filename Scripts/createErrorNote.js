module.exports = async (params) => {
    const { quickAddApi, app } = params;

    const folderName = "错题";

    try {
        const activeLeaf = app.workspace.activeLeaf;
        let selectedText = "";
        if (activeLeaf && activeLeaf.view.editor) {
            const editor = activeLeaf.view.editor;
            selectedText = editor.getSelection();
            if (!selectedText.trim()) {
                new Notice("未选中任何内容，将创建空白正文笔记");
            }
        } else {
            new Notice("未找到活动编辑器，无法获取选中文本");
        }

        // ========== 1. 科目（下拉选择）==========
        const subjectOptions = ["高数", "线代", "概率论", "英语", "DS", "CO", "OS", "CN"];
        const subject = await quickAddApi.suggester(
            subjectOptions.map(s => `📚 ${s}`),  // 显示带图标的选项
            subjectOptions,
            "请选择科目"
        );
        if (!subject) return;

        // ========== 2. 来源（下拉选择）==========
        const sourceOptions = ["30讲", "1000", "880", "王道", "真题真刷87-08"];
        const source = await quickAddApi.suggester(
            sourceOptions.map(s => `📖 ${s}`),
            sourceOptions,
            "请选择来源"
        );
        if (!source) return;

        // ========== 3. 章节（手动输入，带建议）==========
        // 如果你想要章节也用下拉，可以取消下面注释的章节选项列表
        // const chapterOptions = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
        // const chapter = await quickAddApi.suggester(
        //     chapterOptions.map(c => `第${c}章`),
        //     chapterOptions,
        //     "请选择章节"
        // );
        const chapter = await quickAddApi.inputPrompt("章节（例如：一、二、三）");
        if (!chapter) return;

        const questionNumber = await quickAddApi.inputPrompt("题号");
        const tagsInput = await quickAddApi.inputPrompt("输入其他标签（可选，多个标签请用英文逗号 , 分隔）");

        // ========== 4. 重要度（保留原样）==========
        const importanceOptions = [
            { label: "⭐ 一星", value: "⭐" },
            { label: "⭐⭐ 二星", value: "⭐⭐" },
            { label: "⭐⭐⭐ 三星", value: "⭐⭐⭐" }
        ];
        const selectedImportance = await quickAddApi.suggester(
            importanceOptions.map(opt => opt.label),
            importanceOptions.map(opt => opt.value),
            "请选择重要度"
        );
        if (!selectedImportance) return;

        // ========== 5. 标签处理 ==========
        const baseTags = [subject, source].filter(Boolean);
        const manualTags = tagsInput
            ? tagsInput.trim().split(',').map(t => t.trim()).filter(t => t !== "")
            : [];
        const uniqueTags = [...new Set([...baseTags, ...manualTags])];

        // ========== 6. 文件名 ==========
        const safeQuestionNumber = questionNumber || "暂无题号";
        const fileName = `${subject}_${chapter}_${source}_${safeQuestionNumber}`;

        // ========== 7. 创建文件夹和笔记 ==========
        const folderPath = folderName;
        if (!app.vault.getAbstractFileByPath(folderPath)) {
            await app.vault.createFolder(folderPath);
        }

        const yamlContent = `---
创建时间: ${moment().format("YYYY/MM/DD")}
科目: "${subject}"
来源: "${source}"
章节: "${chapter}"
题号: "${safeQuestionNumber}"
重要度: "${selectedImportance}"
打卡: 
掌握: false
tags:
${uniqueTags.map(tag => `  - ${tag}`).join('\n')}
---

`;

        const bodyContent = selectedText ? `${selectedText}\n` : "（未选中任何内容）\n";
        const noteContent = yamlContent + bodyContent;

        const fullPath = `${folderPath}/${fileName}.md`;
        const file = app.vault.getAbstractFileByPath(fullPath);

        if (file) {
            await app.vault.modify(file, noteContent);
        } else {
            await app.vault.create(fullPath, noteContent);
        }

        // ========== 8. 在原文档中插入链接 ==========
        if (activeLeaf && activeLeaf.view.editor) {
            const editor = activeLeaf.view.editor;
            const linkText = `[[${fullPath}|${fileName}]]`;
            const cursorTo = editor.getCursor('to');
            editor.replaceRange("（" + linkText + "）", cursorTo);
        }

        new Notice(`✅ 错题笔记已创建：${fileName}`);

    } catch (error) {
        new Notice(`QuickAdd 执行出错: ${error.message}`);
        console.error(error);
    }
};