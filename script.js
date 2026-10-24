// ================================================
// 【第 1 块】找到页面元素
// ================================================
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");


// ================================================
// 【第 2 块】数据源：从 localStorage 读取
// ================================================
// localStorage 只能存"字符串"，所以要 JSON.parse 转回数组
// 如果没存过 → getItem 返回 null → 用 || [] 兜底成空数组
let todos = JSON.parse(localStorage.getItem("jasper-todos")) || [];


// ================================================
// 【第 3 块】保存函数：把数组存进 localStorage
// ================================================
function save() {
    // 数组 → 字符串 再存
    localStorage.setItem("jasper-todos", JSON.stringify(todos));
}


// ================================================
// 【第 4 块】渲染函数：根据 todos 数组，把整个列表重画一遍
// ================================================
function render() {
    // 4.1 先清空现有列表（因为要重画）
    list.innerHTML = "";

    // 4.2 遍历数组，为每条数据创建一个 li
    todos.forEach(function (todo, index) {
        // todo 格式：{ text: "学习", done: false }  index 是它在数组里的下标（0, 1, 2...）
        // ---- 创建 li ----
        const li = document.createElement("li");
        if (todo.done) {
            li.classList.add("done");   // 已完成 → 加 done 类
        }

        // ✨ 只有"新加入"的待办才播进入动画
        if (todo.isNew) {
            li.classList.add("enter");

            // 动画播完后，移除这个 class（一次性的）
            li.addEventListener("animationend", function () {
                li.classList.remove("enter");
            });

            // 顺手把数据里的 isNew 清掉，避免以后刷新再播动画
            delete todo.isNew;
        }

        // ---- 创建复选框 ----
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;   // 数据里的状态 → 勾选框状态

        // 勾选切换
        checkbox.addEventListener("change", function () {
            todos[index].done = checkbox.checked;   // 更新数据
            save();                                 // 存
            render();                               // 重画
        });

        // ---- 创建文字 span ----
        const span = document.createElement("span");
        span.textContent = todo.text;

        // ✨ 新增：创建时间 span
        const timeSpan = document.createElement("span");
        timeSpan.className  = "time";            // 显示时间
        if (todo.time) {
            timeSpan.textContent = todo.time;   // 替换 T 为空格，显示更友好
        } else {
            timeSpan.textContent = "";   // 如果没有时间，就不显示
        }

        // ---- 创建删除按钮 ----
        const delBtn = document.createElement("button");
        delBtn.textContent = "删除";
        delBtn.addEventListener("click", function () {
            todos.splice(index, 1);   // 从数组里删掉第 index 个
            save();
            render();
        });

        // ---- 组装 ----
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(timeSpan);   
        li.appendChild(delBtn);
        list.appendChild(li);

    });

    // ==========================================
    // ✨ 新增：更新底部统计
    // ==========================================
    const stats = document.getElementById("stats");

    if (todos.length === 0) {
        // 【情况 1】空列表 —— 优先判断！
        stats.textContent = "还没有待办，先加一条吧 ✨";
    } else {
        // 【情况 2】有数据 —— 再细分
        const undoneCount = todos.filter(function (t) { return t.done === false; }).length;        // .length 拿到筛完的个数

        if (undoneCount === 0) {
            stats.textContent = "全部完成 🎉";
        } else {
            // stats.textContent = "总计" + undoneCount + "条，未完成" + undoneCount + "条";
            stats.textContent = "还有 " + undoneCount + " 项未完成";
        }
    }

}

// ================================================
// 【第 5 块】添加待办的函数
// ================================================
function addTodo() {
    //console.log("🔥 监控：addTodo 被触发了！"); 
    const text = input.value.trim();

    const timeInput = document.getElementById("todo-time");
    const timeValue = timeInput.value;           // 获取时间选择器的值

    if (text === "") {
        alert("请输入待办事项！");
        return;
    }

    // 往数组里"推"一条新数据
    todos.push({
        text: text,     // 内容
        done: false,    // 默认未完成
        isNew: true,
        time: timeValue,
    });

    input.value = "";   // 清空输入框
    timeInput.value = ""; // 清空时间选择器
    input.focus();      // 光标回到输入框

    save();     // 存
    render();   // 重画
}


// ================================================
// 【第 6 块】绑定事件
// ================================================
addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

// ================================================
// 【第 7 块】首次打开页面：把存的数据画出来
// ================================================
render();