
// ===================  功能A：新建待办（可标记完成）  =============================

// 第一步：找到页面上要操作的 3 个元素（输入框、添加按钮、；列表容器）
// ============================================
// document.getElementById("xxx") 就是"按 id 找元素"
// 找到后存到变量里，后面反复用

const input = document.getElementById("todo-input");   // 输入框
const addBtn = document.getElementById("add-btn");      // 添加按钮
const list = document.getElementById("todo-list");      // 列表容器 <ul>

// 第二步：给"添加"按钮绑定点击事件
// ============================================
// addEventListener("click", 函数) 的意思是：
// "当这个元素被点击时，执行这个函数"

addBtn.addEventListener("click", function () {
    // --- 2.1 读取输入框的文字 ---
    // .value 就是输入框里当前的内容
    // .trim() 去掉首尾空格（防止用户只打了空格）
    const text = input.value.trim();

    // --- 2.2 如果是空的，就提示并结束 ---
    if (text === "") {
        alert("请输入待办事项！");
        return;                 // 结束函数，不再往下执行
    }

    // --- 2.3 创建一个 <li> 元素 ---
    const li = document.createElement("li");

    // --- 2.4 把文字放进去 ---
    // 用 span 包起来，方便以后单独控制文字样式
    // textContent 是"纯文本"，比 innerHTML 更安全
    const span = document.createElement("span");
    span.textContent = text;

    // --- 2.5 创建删除按钮 ---
    const delBtn = document.createElement("button");
    delBtn.textContent = "删除";

    // --- 2.6 给删除按钮绑定事件 ---
    delBtn.addEventListener("click", function () {
        li.remove();            // 把这个 li 从页面上删掉
    });

    // --- 2.7 把 span 和删除按钮塞进 li ---
    li.appendChild(span);
    li.appendChild(delBtn);

    // --- 给待办（文字部分）绑定点击事件：切换"完成"状态 ---
    span.addEventListener("click", function () {
    // classList.toggle("done") 的意思是：
    // 如果 li 上没有 done 类 → 加上
    // 如果 li 上已有 done 类 → 去掉
    li.classList.toggle("done");
    });
    // --- 2.8 把 li 塞进列表 <ul> ---
    list.appendChild(li);

    // --- 2.9 清空输入框，方便用户输入下一条 ---
    input.value = "";

    // --- 2.10 让输入框重新获得焦点（鼠标光标回到输入框）---
    input.focus();

});

// 第二步分支：给“按回车 -- Enter”绑定事件
// 让用户按回车也能添加待办事项
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addBtn.click();     // 触发添加按钮的点击事件
    }
});
