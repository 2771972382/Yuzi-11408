Templater 的核心语法围绕 `<% ... %>` 命令标签展开，通过在标签内调用 `tp` 对象下的各种函数，可以为你的笔记动态生成丰富多彩的内容。

### 🧱 基础语法与核心对象 `tp`

所有 Templater 的命令都需要写在特定的标签内。内联命令直接输出，而执行 JavaScript 代码块则能实现更复杂的逻辑。

| 语法 | 说明 |
| :--- | :--- |
| `<% tp.function() %>` | **内联命令**：这是最常用的形式。运行其中的函数，并将返回值直接插入到模板中。 |
| `<%* tR += "..." %>` | **JavaScript 执行**：编写多行 JavaScript 代码。通常用于需要条件判断、循环等复杂逻辑的场景，最后通过 `tR` 变量来拼接最终的输出内容。 |

`tp` 对象是 Templater 的核心，就像一把瑞士军刀，将不同功能的模块整合在一起。你所有的函数调用都会以 `tp.模块.函数()` 的形式进行，例如 `tp.date.now()`。

### 🗓️ 日期与时间 (`tp.date`)

`tp.date` 模块是处理时间的核心。日期格式遵循 **Moment.js** 标准。

| 函数                                 | 说明                                                                                      |
| :--------------------------------- | :-------------------------------------------------------------------------------------- |
| `tp.date.now(format, offset)`      | 获取当前时间。可指定格式和偏移量。例如：`tp.date.now("YYYY-MM-DD", +7)` 表示一周后的日期。                           |
| `tp.date.tomorrow(format)`         | 获取明天的日期。                                                                                |
| `tp.date.yesterday(format)`        | 获取昨天的日期。                                                                                |
| `tp.date.weekday(format, weekday)` | 获取最近一周的指定星期几的日期。                                                                        |
| **通用偏移量**                          | 偏移量 `offset` 参数非常灵活，支持 `+/-数字`（天数），也支持 ISO 8601 标准的字符串，如 `"P-1M"` 表示一个月前，`"P1Y"` 表示一年后。 |



### 📁 文件与笔记操作 (`tp.file`)

这个模块的强大之处在于，它可以帮你动态地创建、管理当前或新的笔记，实现自动化流程。

| 函数                                       | 说明                                  |
| :--------------------------------------- | :---------------------------------- |
| `tp.file.title`                          | **获取变量**：直接作为变量使用，返回当前文件的标题（不含扩展名）。 |
| `tp.file.exists(filepath)`               | 检查指定路径的文件是否存在。                      |
| `tp.file.create_new(template, filename)` | 创建一个全新的笔记。可以指定模板内容（或文件路径）和目标文件名。    |
| `tp.file.move(new_path)`                 | 移动或重命名当前文件。                         |
| `tp.file.rename(new_name)`               | **重命名**：方便地对当前文件进行重命名。              |

### 📄 前置元数据 (Frontmatter) 操作

Templater 也支持直接读取和修改笔记的 Frontmatter 信息。

| 函数 | 说明 |
| :--- | :--- |
| `tp.frontmatter.<key>` | **获取变量**：直接作为变量使用，返回 Frontmatter 中指定 key 的值。例如 `tp.frontmatter.date`。 |
| `tp.file.creation_date(format)`| 获取文件的创建日期。|
| `tp.file.last_modified_date(format)`| 获取文件的最后修改日期。|

以上两个函数也适用于获取元数据信息。

### 🖥️ 系统与交互 (`tp.system`)

`tp.system` 模块让你的模板能够与用户进行交互，弹出对话框来接收输入，从而生成更具个性化的内容。

| 函数 | 说明 |
| :--- | :--- |
| `tp.system.prompt(prompt_text)` | **文本输入框**：弹出对话框让用户输入文本。|
| `tp.system.suggester(["选项A", "选项B"], ["value_a", "value_b"])` | **建议选择器**：提供一个下拉菜单供用户选择。返回对应的值。 |
| `tp.system.clipboard()` | 读取剪贴板中的内容。 |

### 🌐 网页与资源 (`tp.web`)

`tp.web` 模块允许你直接从网络上获取数据，让你的笔记永远保持新鲜。

| 函数 | 说明 |
| :--- | :--- |
| `tp.web.daily_quote()` | 获取当天的“每日一句”名言。 |
| `tp.web.random_picture(size, query)` | 从 Unsplash 等图库获取一张随机图片。|

### ✨ 高级玩法：用户自定义函数

Templater 的高级之处，在于允许你通过 JavaScript 编写自己的函数，存放在指定文件夹（如 `Scripts/`）。然后在模板中，就能像调用内置函数一样，通过 `tp.user.yourFunction()` 来使用了。

例如，你可以创建一个脚本来格式化文本，或是在笔记中嵌入一个随机的小确幸语录。

### 📝 使用场景与实例

现在，我们把上面的知识点串起来，看看能实现哪些实用功能：

#### 场景一：创建带日期的日记模板

这个模板自动生成日记标题，并创建上一篇和下一篇日记的快速链接。

```
---
type: daily
date: <% tp.date.now("YYYY-MM-DD") %>
---
<< [[<% tp.date.now("YYYY-MM-DD", -1) %>]] | [[<% tp.date.now("YYYY-MM-DD", +1) %>]] >>
# <% tp.date.now("YYYY年MM月DD日") dddd %>

## 今天做了什么
- 

## 学到了什么
- 
```

**效果预览**：标题会自动显示“2023年10月27日 星期五”，并生成指向前后日记的链接。

#### 场景二：用 JavaScript 实现复杂逻辑

这个例子将一个普通列表动态转换为带颜色的 Callout。

```
## 会议记录
<%*
// 定义一个函数来处理列表
function processListItems(listText) {
    const items = listText.split("\n").filter(item => item.trim());
    if (items.length === 0) return "";
    return "> [!note] 待办事项\n" + items.map(item => `> - ${item}`).join("\n");
}

// 假设列表内容通过系统输入框获取
let todoList = await tp.system.prompt("请输入待办事项（每项一行）");
let result = processListItems(todoList);
tR += result;
%>
```

**效果预览**：在提示框中输入列表后，模板会将它们格式化为 Obsidian 的 Callout 语法块。

### 💎 总结

简单来说，你可以把 Templater 的常用语法理解为三步：
1.  **选择**：你想操作什么？是**日期**、**文件**，还是需要**用户输入**、**网络资源**？
2.  **调用**：通过对应的模块，如 `tp.date`、`tp.file`、`tp.system` 来调用函数。
3.  **组合**：遇到复杂需求时，大胆使用 `<%* ... %>` 包裹 JavaScript 代码，实现动态内容。

希望这份指南能帮你更好地使用 Templater，让它成为你 Obsidian 工作流中得力的自动化助手。