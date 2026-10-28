// ================================================
// 【第 1 块】找到页面元素
// ================================================
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");

// 筛选按钮
const btnAll = document.getElementById("filter-all");
const btnActive = document.getElementById("filter-active");
const btnCompleted = document.getElementById("filter-completed");

// ================================================
// 【第 2 块】数据源 & 状态
// ================================================
let todos = JSON.parse(localStorage.getItem("jasper-todos")) || [];
let currentFilter = "all"; // 默认视图

// ================================================
// 【第 3 块】保存函数
// ================================================
function save() {
    localStorage.setItem("jasper-todos", JSON.stringify(todos));
}

// ================================================
// 【第 4 块】渲染函数（只负责画页面）
// ================================================
function render() {
    // ==========================================
    // ✨ 新增 1：FLIP 第一步（First） - 记录旧位置
    // ==========================================
    const oldRects = new Map();
    const items = list.querySelectorAll("li");
    items.forEach(item => {
        // 用文字内容作为唯一标识（因为没给元素加 id）
        // 获取该元素在屏幕上的真实位置
        oldRects.set(item.textContent, item.getBoundingClientRect());
    });

    list.innerHTML = "";

    // 1. 准备要显示的数据
    let todosToRender = todos;
    if (currentFilter === "active") {
        todosToRender = todos.filter(todo => !todo.done);
    } else if (currentFilter === "completed") {
        todosToRender = todos.filter(todo => todo.done);
    }

    // 2. 遍历渲染
    todosToRender.forEach(function (todo) {
        // --- 创建 li ---
        const li = document.createElement("li");
        if (todo.done) li.classList.add("done");

        // --- 动画处理 ---
        if (todo.isNew) {
            li.classList.add("enter");
            li.addEventListener("animationend", function () {
                li.classList.remove("enter");
            });
            delete todo.isNew;
        }

        // --- 创建复选框 ---
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;
        checkbox.addEventListener("change", function () {
            const realIndex = todos.indexOf(todo);              // 找真实位置
            todos[realIndex].done = checkbox.checked;
            save();
            render();
        });

        // --- 文字 (支持双击无感编辑) ---
        const span = document.createElement("span");
        span.textContent = todo.text;

        span.addEventListener("dblclick", function () {
            // 防止重复触发
            if (span.contentEditable === "true") return;

            // 开启编辑
            span.contentEditable = "true";
            span.classList.add("editing");

            // ✨ 加一个保护锁
            span.setAttribute("data-is-editing", "true");
            
            // ✨ 用 setTimeout 延迟聚焦，防止瞬间被 blur 吃掉
            setTimeout(() => {
                span.focus();
            }, 10);

            // 定义失去焦点的保存逻辑
            const finishEdit = function () {
                if (span.contentEditable === "false") return;

                // ✨ 新增：取消保护锁
                span.removeAttribute("data-is-editing");
                
                span.contentEditable = "false";
                span.classList.remove("editing");
                
                const newText = span.textContent.trim();
                if (newText !== "") {
                    const realIndex = todos.indexOf(todo);
                    todos[realIndex].text = newText;
                    save();
                }
                render();
            };

            // 监听失去焦点
            span.addEventListener("blur", finishEdit);
            
            // 监听键盘回车
            span.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault(); 
                    span.blur();            
                }
            });
        });

        // --- 创建时间 ---
        const timeSpan = document.createElement("span");
        timeSpan.className = "time";
        if (todo.time) {
            timeSpan.textContent = todo.time;
        } else {
            timeSpan.textContent = "";
        }

        // --- 创建删除按钮 ---
        const delBtn = document.createElement("button");
        delBtn.textContent = "删除";
        delBtn.addEventListener("click", function () {
            const realIndex = todos.indexOf(todo); // 找真实位置
            todos.splice(realIndex, 1);
            save();
            render();
        });

        // --- 组装 ---
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(timeSpan);
        li.appendChild(delBtn);
        list.appendChild(li);
    });

    // ==========================================
    // ✨ 新增 2：FLIP 第三、四步（Invert & Play） - 计算差值并滑动
    // ==========================================
    const newItems = list.querySelectorAll("li");

    newItems.forEach(newItem => {
        // 拿到新位置
        const newRect = newItem.getBoundingClientRect();
        const oldRect = oldRects.get(item.textContent);
        if(oldRect) {
            // 计算 Y 轴上的位移差值（旧位置 - 新位置）
            const deltaY = oldRect.top - newRect.top;
            if(deltaY !== 0 ) {
                // 第三步（Invert）：强行把它瞬移回老位置
                item.style.transform = `translateY(${deltaY}px)`;
                item.style.transition = "none";                     // 瞬移不能有过渡动画

                // 第四步（Play）：下一帧让它滑到新位置
                requestAnimationFrame(() => {
                    item.style.transform = ""; // 清空位移，回归正常
                    item.style.transition = "transform 0.3s ease"; // 给0.3秒的平滑过渡
                });
            }
        }
    });

    // 3. 更新统计
    const stats = document.getElementById("stats");
    if (todosToRender.length === 0) {
        if (currentFilter === "all") stats.textContent = "还没有待办，先加一条吧 ✨";
        else if (currentFilter === "active") stats.textContent = "太棒了，没有未完成的待办！ 🎉";
        else stats.textContent = "还没有已完成的任务。";
    } else {
        const undoneCount = todosToRender.filter(t => !t.done).length;
        if (undoneCount === 0) stats.textContent = "🎉 当前任务全部完成！";
        else stats.textContent = "还有 " + undoneCount + " 项未完成";
    }
}

// ================================================
// 【第 5 块】添加待办
// ================================================
function addTodo() {
    const text = input.value.trim();
    const timeInput = document.getElementById("todo-time");
    const timeValue = timeInput.value;

    if (text === "") {
        alert("请输入待办事项！");
        return;
    }
    todos.push({
        text: text,
        done: false,
        isNew: true,
        time: timeValue,
    });
    input.value = "";
    timeInput.value = "";
    input.focus();

    save();
    render();
}

// ================================================
// 【第 6 块】事件绑定（所有绑定都在最外层）
// ================================================

// 添加
addBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

// 筛选
function setFilter(filterType, activeBtn) {
    currentFilter = filterType;
    btnAll.classList.remove("active");
    btnActive.classList.remove("active");
    btnCompleted.classList.remove("active");
    activeBtn.classList.add("active");
    render();
}

btnAll.addEventListener("click", () => setFilter("all", btnAll));
btnActive.addEventListener("click", () => setFilter("active", btnActive));
btnCompleted.addEventListener("click", () => setFilter("completed", btnCompleted));

// ================================================
// 【第 7 块】全局点击监听（点击空白处保存）
// ================================================
document.addEventListener("click", function (event) {
    const editingSpan = document.querySelector(".editing");
    
    // ✨ 修改：如果存在正在编辑的元素，并且它没有处于“刚双击的保护期”
    if (editingSpan && event.target !== editingSpan) {
        // 延迟 100ms 再 blur，防止把刚双击打开的输入框立刻关掉
        setTimeout(() => {
            if (editingSpan.contentEditable === "true") {
                editingSpan.blur();
            }
        }, 100);
    }
});

// ================================================
// 【第 8 块】首次渲染
// ================================================
render();