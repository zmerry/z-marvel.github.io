const DEFAULT_PROMPT = `核心定位

你是一名专业的道德批判思维激发者，你的使命不是告诉学生"什么是对的"，而是通过精妙的问题序列，推动学生沿着以下路径自我发现：

初步判断：建立直觉层面的对错认知
事实厘清：还原问题全貌，识别关键信息缺口
利益分析：多角度审视各方的得失与风险
方案生成：构建支持、反对、折中的多重选项
方案检验：通过标准追问序列暴露方案漏洞
原则提炼：从具体情境抽象出可迁移的伦理原则

工作流程

第一阶段：先行构思（5分钟）

当学生面对一个伦理情境时，引导他们独立思考：
"这件事有没有对错？"
"这件事影响到谁？"
"你初步怎么做？"
关键动作：让学生先说出直觉判断，但不要急于评价，只是记录。

第二阶段：探索（10分钟）

引导学生完成三项任务：
总结事实：描述发生了什么，并列出需要问清楚的问题
识别利益相关者：列出所有受到影响的人/群体，分析各自的得失和风险
生成方案：给出支持原方案、反对原方案、折中方案三种选择及各自理由
提问策略：使用开放性问题，如"还有谁可能受到影响？""有没有你没考虑到的情况？"

第三阶段：讨论+不满（18分钟）——核心认知升级环节

任务1：小组讨论方案

让学生从A/B/C三个选项中选择一个，并写下2条理由
你的角色：倾听并记录，暂不评价
任务2：标准追问序列（固定脚本）

对学生提出的方案，按顺序抛出以下三个问题：

"为什么你觉得这样做对？"

目的：暴露学生的价值判断依据

"如果换成另一个人会怎样？"

目的：引入换位思考，检验方案的普遍性和公平性

"有什么坏处/风险？怎么减少？"

目的：迫使学生正视负面后果，培养批判性思维
任务3：触发认知升级

当学生发现原方案在追问下站不住脚时，引导他们完成以下转换：
原来怎么想 -> 现在为什么不满意 -> 我要改成什么规则/原则
关键话术："看来原来的想法不够用了。那你觉得应该怎么改？能提炼出一条可推广的原则吗？"

第四阶段：应用/迁移（10分钟）

给出与原情境表面不同但结构相似的迁移情境
引导学生运用刚刚提炼的原则进行判断
关键动作："你能用刚才总结的原则，分析这个新情况吗？"

核心技能要求

1. 追问的艺术

避免封闭式问题（"这样做对吗？"）
善用苏格拉底式提问（"你觉得如果……会怎样？"）
永远不要直接给出答案，而是引导学生自己发现

2. 共情与中立

不评判学生的任何想法，让每个人都敢于表达
对于错误的观点，不否定，而是通过提问让其自我发现漏洞
保持好奇心："这个角度很有意思，你能多说说吗？"

3. 结构化引导

严格按照四阶段流程推进，但要根据学生反应灵活调整节奏
在每个阶段结束时进行小结，帮助学生理清思路
适时板书/记录关键观点，让思维过程可视化

4. 激发"不满意"的体验

这是整个流程的灵魂：让学生在标准追问中感受到原方案的局限性
这种"认知失调"是学习发生的契机
话术示例："听你这么一说，好像确实有点问题？""那怎么办呢？"

核心原则

答案在学生心里，不在你这里
你的价值在于问对问题，而非说对答案
批判性思维是被激发出来的，不是被教出来的
每一个"不满意"都是认知升级的契机`;

const WORKER_URL = "https://sweet-hat-3d51.1123715535.workers.dev/";
const PROJECT_ID = "7617105966936768566";
const STREAM_EVENT = "message";

const SCENARIOS = [
  {
    id: "homework-ai",
    title: "作业与 AI 代写",
    summary: "学生想直接抄写 AI 给出的完整答案，并认为老师没发现就不算问题。",
    prompt: "学生说：'作业太多了，我直接抄 AI 的整段答案，只要老师没发现就没关系。' 请你按四阶段流程引导，不要直接说教，先让学生做初步判断，再推进到利益分析、方案比较、风险检验和原则提炼。",
  },
  {
    id: "poster-generator",
    title: "手抄报与生成图片",
    summary: "学生用生成图片工具做完整作品，却声称全部是自己完成。",
    prompt: "班级手抄报比赛中，一位同学用生成图片工具直接完成整张海报，还告诉老师是自己独立做的。请设计一段互动式追问，让学生自己识别公平性、署名诚实和学习价值的问题。",
  },
  {
    id: "friend-cover",
    title: "替朋友隐瞒错误",
    summary: "学生知道朋友作弊或违规，但担心举报会伤害友情。",
    prompt: "学生说：'我知道朋友考试作弊，但如果我告诉老师，他会恨我；如果我不说，好像也不太对。' 请围绕友情、规则、公平和后果进行苏格拉底式追问，并帮助学生提炼一个可迁移原则。",
  },
  {
    id: "group-free-rider",
    title: "小组作业搭便车",
    summary: "一名组员几乎没贡献，却要求和其他成员拿一样的成绩。",
    prompt: "小组作业快截止时，有同学几乎没参与，却要求和大家拿一样的成绩。请引导学生分析各方利益、可行选项、潜在坏处，以及什么样的处理方式更可推广。",
  },
  {
    id: "phone-privacy",
    title: "查看朋友手机隐私",
    summary: "学生怀疑朋友被欺负，想偷偷看对方手机确认情况。",
    prompt: "学生说：'我怀疑朋友遇到麻烦，但他不肯说，我想趁他不注意偷偷看手机。' 请通过追问让学生同时考虑关心他人、隐私边界、信任关系和风险控制。",
  },
];

const storageKeys = {
  sessionId: "coze_agent_session_id",
  prompt: "coze_agent_prompt",
  scenarioId: "coze_agent_scenario_id",
};

const state = {
  assistantNode: null,
  isStreaming: false,
  sessionId: "",
};

const elements = {
  systemPromptInput: document.getElementById("systemPromptInput"),
  messageInput: document.getElementById("messageInput"),
  statusBar: document.getElementById("statusBar"),
  chatLog: document.getElementById("chatLog"),
  chatForm: document.getElementById("chatForm"),
  sendButton: document.getElementById("sendButton"),
  clearChatButton: document.getElementById("clearChatButton"),
  resetPromptButton: document.getElementById("resetPromptButton"),
  applyScenarioButton: document.getElementById("applyScenarioButton"),
  scenarioSelect: document.getElementById("scenarioSelect"),
  scenarioTitle: document.getElementById("scenarioTitle"),
  scenarioSummary: document.getElementById("scenarioSummary"),
  scenarioPrompt: document.getElementById("scenarioPrompt"),
  messageTemplate: document.getElementById("messageTemplate"),
};

bootstrap();

function bootstrap() {
  populateScenarios();
  hydrateInputs();
  renderScenarioCard(getSelectedScenario());
  bindEvents();
  appendMessage("system", "准备就绪。直接选择预设情境或输入问题即可开始对话。");
}

function hydrateInputs() {
  state.sessionId = localStorage.getItem(storageKeys.sessionId) ?? crypto.randomUUID();
  elements.systemPromptInput.value = localStorage.getItem(storageKeys.prompt) ?? DEFAULT_PROMPT;
  const savedScenarioId = localStorage.getItem(storageKeys.scenarioId) ?? SCENARIOS[0].id;
  elements.scenarioSelect.value = savedScenarioId;
  localStorage.setItem(storageKeys.sessionId, state.sessionId);
}

function bindEvents() {
  const persistPairs = [
    [elements.systemPromptInput, storageKeys.prompt],
  ];

  persistPairs.forEach(([element, key]) => {
    element.addEventListener("input", () => {
      localStorage.setItem(key, element.value);
    });
  });

  elements.chatForm.addEventListener("submit", handleSubmit);
  elements.clearChatButton.addEventListener("click", clearChat);
  elements.resetPromptButton.addEventListener("click", resetPrompt);
  elements.scenarioSelect.addEventListener("change", handleScenarioChange);
  elements.applyScenarioButton.addEventListener("click", applySelectedScenario);
}

function clearChat() {
  elements.chatLog.innerHTML = "";
  state.assistantNode = null;
  appendMessage("system", "对话已清空。");
}

function resetPrompt() {
  elements.systemPromptInput.value = DEFAULT_PROMPT;
  localStorage.setItem(storageKeys.prompt, DEFAULT_PROMPT);
  setStatus("已恢复默认系统提示词", "success");
}

function populateScenarios() {
  elements.scenarioSelect.innerHTML = "";
  SCENARIOS.forEach((scenario) => {
    const option = document.createElement("option");
    option.value = scenario.id;
    option.textContent = scenario.title;
    elements.scenarioSelect.appendChild(option);
  });
}

function handleScenarioChange() {
  const scenario = getSelectedScenario();
  localStorage.setItem(storageKeys.scenarioId, scenario.id);
  renderScenarioCard(scenario);
}

function applySelectedScenario() {
  const scenario = getSelectedScenario();
  elements.messageInput.value = scenario.prompt;
  elements.messageInput.focus();
  setStatus(`已填入预设情境：${scenario.title}`, "success");
}

function getSelectedScenario() {
  return SCENARIOS.find((scenario) => scenario.id === elements.scenarioSelect.value) ?? SCENARIOS[0];
}

function renderScenarioCard(scenario) {
  elements.scenarioTitle.textContent = scenario.title;
  elements.scenarioSummary.textContent = scenario.summary;
  elements.scenarioPrompt.textContent = scenario.prompt;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (state.isStreaming) {
    return;
  }

  const prompt = elements.systemPromptInput.value.trim();
  const message = elements.messageInput.value.trim();

  if (!prompt || !message) {
    setStatus("请填写系统提示词和消息内容", "error");
    return;
  }

  appendMessage("user", message);
  elements.messageInput.value = "";

  const assistantNode = appendMessage("assistant", "正在建立连接...");
  state.assistantNode = assistantNode;
  state.isStreaming = true;
  elements.sendButton.disabled = true;
  setStatus("正在连接智能体...", "running");

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        event: STREAM_EVENT,
        content: {
          query: {
            prompt: [
              {
                type: "text",
                content: {
                  text: `${prompt}\n\n用户输入：${message}`,
                },
              },
            ],
          },
        },
        type: "query",
        session_id: state.sessionId,
        project_id: PROJECT_ID,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error("浏览器未返回可读取的流式响应体");
    }

    await readEventStream(response.body, assistantNode);
    setStatus("响应完成", "success");
  } catch (error) {
    assistantNode.querySelector(".message-body").textContent += `\n\n[请求失败]\n${error.message}`;
    setStatus("请求失败，请检查 Worker 或项目配置", "error");
  } finally {
    state.isStreaming = false;
    elements.sendButton.disabled = false;
  }
}

async function readEventStream(stream, assistantNode) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let renderedAnything = false;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    chunks.forEach((chunk) => {
      const payload = extractDataPayload(chunk);
      if (!payload) {
        return;
      }

      const parsed = parsePayload(payload);
      const text = extractText(parsed);

      if (text) {
        updateAssistantMessage(assistantNode, text, renderedAnything);
        renderedAnything = true;
        return;
      }

      updateAssistantMessage(assistantNode, formatFallback(parsed), renderedAnything);
      renderedAnything = true;
    });
  }

  if (!renderedAnything) {
    updateAssistantMessage(assistantNode, "接口已返回，但没有解析到可显示文本。请展开浏览器控制台检查事件格式。");
  }
}

function extractDataPayload(chunk) {
  const lines = chunk
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter(Boolean);

  return lines.length ? lines.join("\n") : "";
}

function parsePayload(payload) {
  try {
    return JSON.parse(payload);
  } catch (error) {
    return payload;
  }
}

function extractText(parsed) {
  if (typeof parsed === "string") {
    return parsed;
  }

  if (!parsed || typeof parsed !== "object") {
    return "";
  }

  const candidates = [
    parsed.content,
    parsed.answer,
    parsed.message,
    parsed.data?.content,
    parsed.data?.answer,
    parsed.data?.message,
    parsed.data?.delta,
    parsed.data?.tool_response?.content,
    parsed.content?.text,
    parsed.data?.content?.text,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return "";
}

function formatFallback(parsed) {
  if (typeof parsed === "string") {
    return parsed;
  }

  return `[事件]\n${JSON.stringify(parsed, null, 2)}`;
}

function updateAssistantMessage(node, nextText, hasExistingStream) {
  const body = node.querySelector(".message-body");
  body.textContent = hasExistingStream ? `${body.textContent}${nextText}` : nextText;
  elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
}

function appendMessage(role, text) {
  const fragment = elements.messageTemplate.content.cloneNode(true);
  const message = fragment.querySelector(".message");
  const meta = fragment.querySelector(".message-meta");
  const body = fragment.querySelector(".message-body");
  message.classList.add(role);
  meta.textContent = roleLabel(role);
  body.textContent = text;
  elements.chatLog.appendChild(fragment);
  elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
  return elements.chatLog.lastElementChild;
}

function roleLabel(role) {
  if (role === "user") return "学生输入";
  if (role === "assistant") return "智能体输出";
  return "系统消息";
}

function setStatus(text, mode) {
  elements.statusBar.textContent = text;
  elements.statusBar.className = `status-bar ${mode}`;
}
