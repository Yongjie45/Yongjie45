
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

function addTodo() {
    // --- 2.1 读取输入框的文字 ---
    // .value 就是输入框里当前的内容
    // .trim() 去掉首尾空格（防止用户只打了空格）
    const text = input.value.trim();

    // --- 2.2 空内容提示 ---
    if (text === "") {
        alert("请输入待办事项！");
        return;                 // 结束函数，不再往下执行
    }

    // --- 2.3 创建 li ---
    const li = document.createElement("li");

    // --- 2.4 创建复选框 ---
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // --- 2.5 给复选框绑定 change 事件：切换 li 的 done 类 ---
    // 注意用 change 而不是 click —— checkbox 的"值变了"用 change 更规范
    checkbox.addEventListener("change", function () {
        // checkbox.checked 是 true/false
        // classList.toggle("done", true)  → 加上 done
        // classList.toggle("done", false) → 去掉 done
        // 第二个参数是"强制指定"，比 switch 写法更简洁
        li.classList.toggle("done", checkbox.checked);
    });

    // --- 2.6 创建文字 span ---
    // 用 span 包起来，方便以后单独控制文字样式
    // textContent 是"纯文本"，比 innerHTML 更安全
    const span = document.createElement("span");
    span.textContent = text;

    // --- 2.7 创建删除按钮 ---
    const delBtn = document.createElement("button");
    delBtn.textContent = "删除";
    delBtn.addEventListener("click", function () {
        li.remove();            // 从页面上删掉
    });

    // --- 2.8 给删除按钮绑定事件 ---
    delBtn.addEventListener("click", function () {
        li.remove();            // 把这个 li 从页面上删掉
    });

    // --- 2.9 组装：checkbox + span + delBtn 塞进 li ---
    li.appendChild(checkbox); 
    li.appendChild(span);
    li.appendChild(delBtn);

    // --- 2.10 把 li 塞进列表 <ul> ---
    list.appendChild(li);

    // --- 2.11 清空输入框，方便用户输入下一条 ---
    input.value = "";
    input.focus();
};

// 第二步分支：给“按回车 -- Enter”绑定事件
// 让用户按回车也能添加待办事项
addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});