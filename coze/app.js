const WORKER_URL = "https://sweet-hat-3d51.1123715535.workers.dev/";
const PROJECT_ID = "7617105966936768566";

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
  scenarioId: "coze_agent_scenario_id",
};

const state = {
  assistantNode: null,
  isStreaming: false,
  sessionId: "",
};

const elements = {
  messageInput: document.getElementById("messageInput"),
  statusBar: document.getElementById("statusBar"),
  chatLog: document.getElementById("chatLog"),
  chatForm: document.getElementById("chatForm"),
  sendButton: document.getElementById("sendButton"),
  clearChatButton: document.getElementById("clearChatButton"),
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
  const savedScenarioId = localStorage.getItem(storageKeys.scenarioId) ?? SCENARIOS[0].id;
  elements.scenarioSelect.value = savedScenarioId;
  localStorage.setItem(storageKeys.sessionId, state.sessionId);
}

function bindEvents() {
  elements.chatForm.addEventListener("submit", handleSubmit);
  elements.clearChatButton.addEventListener("click", clearChat);
  elements.scenarioSelect.addEventListener("change", handleScenarioChange);
  elements.applyScenarioButton.addEventListener("click", applySelectedScenario);
}

function clearChat() {
  elements.chatLog.innerHTML = "";
  state.assistantNode = null;
  appendMessage("system", "对话已清空。");
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

  const message = elements.messageInput.value.trim();

  if (!message) {
    setStatus("请填写消息内容", "error");
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
        content: {
          query: {
            prompt: [
              {
                type: "text",
                content: {
                  text: message,
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
