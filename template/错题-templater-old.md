<%*
// 1. 获取基础信息
let subject = await tp.system.prompt ("科目");
let source = await tp.system.prompt ("来源");
let questionNumber = await tp.system.prompt ("题号");
let content = await tp.system.prompt ("错题详情");

// 2. 获取标签输入（多个标签请用英文逗号 , 分隔）
let tagsInput = await tp.system.prompt ("输入标签（多个标签请用英文逗号 , 分隔）");

// 3. 处理标签字符串：按逗号分割，去除首尾空格，并过滤掉空值
let tagArray = tagsInput 
    ? tagsInput.split (","). map (t => t.trim ()). filter (t => t !== "") 
    : [];

// 4. 自动重命名文件
let fileName = `${subject}-${source}-${questionNumber}`;
await tp.file.rename (fileName);
_%>
---
科目: <% subject %>
来源: <% source %>
题号: <% questionNumber %>
创建时间: <% tp.date.now("YYYY-MM-DD") %>
打卡: 
掌握: false
tags: [<% tagArray.join(", ") %>]
---
## 错题详情
<% content %>
