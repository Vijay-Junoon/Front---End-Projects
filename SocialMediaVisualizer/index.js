// const { act } = require("react");

function clearHighlights() {
  document
    .querySelectorAll(".node.highlight")
    .forEach((n) => n.classList.remove("highlight"));
}

function highlightNode(id) {
  const node = nodeElements[id];
  if (!node) return;

  node.classList.add("highlight");
}

async function animatePath(path) {
  for (const id of path) {
    clearHighlights(id);
    highlightNode(id);
    await delay(400);
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ================= GRAPH LOGIC =================
class Graph {
  constructor() {
    this.graph = {
      Alpha: ["Beta", "Charlie", "Delta", "Foxtrot"],
      Beta: ["Alpha", "Foxtrot"],
      Charlie: ["Alpha", "Delta"],
      Delta: ["Alpha", "Charlie", "Echo"],
      Echo: ["Delta", "Foxtrot"],
      Foxtrot: ["Alpha", "Beta", "Echo"],
    };
  }

  addVertex(v) {
    if (!this.graph[v]) {
      this.graph[v] = [];
    }
  }

  addEdge(v1, v2) {
    if (this.graph[v1] && this.graph[v2]) {
      if (!this.graph[v1].includes(v2)) this.graph[v1].push(v2);
      if (!this.graph[v2].includes(v1)) this.graph[v2].push(v1);
    }
  }

  removeEdge(v1, v2) {
    if (this.graph[v1] && this.graph[v2]) {
      this.graph[v1] = this.graph[v1].filter((v) => v !== v2);
      this.graph[v2] = this.graph[v2].filter((v) => v !== v1);
    }
  }

  display() {
    let n;
    for (n in this.graph) {
      console.log(n + ":" + this.graph[n]);
    }
  }

  _reconstructPath(parent, source, destination) {
    const path = [];
    let current = destination;

    while (current !== undefined) {
      path.push(current);
      current = parent[current];
    }

    return path.reverse();
  }

  async bfsAnimate(source, destination) {
    const visited = new Set();
    const queue = [source];

    visited.add(source);

    while (queue.length) {
      const current = queue.shift();

      highlightNode(current); // UI
      await delay(400);

      if (current === destination) return;

      for (const neighbor of this.graph[current]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }

  bfsShortestPath(source, destination) {
    if (!this.graph[source] || !this.graph[destination]) {
      console.warn("Invalid BFS nodes", source, destination);
      return null;
    }

    const queue = [source];
    const visited = new Set([source]);
    const parent = {};

    while (queue.length > 0) {
      const current = queue.shift();

      if (current === destination) {
        return this._reconstructPath(parent, source, destination);
      }

      for (const neighbor of this.graph[current]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent[neighbor] = current;
          queue.push(neighbor);
        }
      }
    }

    return null;
  }
}

// ================= UI HELPERS =================
function getNodeCenter(el) {
  const rect = el.getBoundingClientRect();
  const containerRect = document
    .querySelector(".graphBar")
    .getBoundingClientRect();
  return {
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top + rect.height / 2,
  };
}

function drawEdge(fromEl, toEl) {
  const from = getNodeCenter(fromEl);
  const to = getNodeCenter(toEl);

  const svg = document.getElementById("edges");

  // Invisible hover line (interaction)
  const hoverLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  hoverLine.setAttribute("x1", from.x);
  hoverLine.setAttribute("y1", from.y);
  hoverLine.setAttribute("x2", to.x);
  hoverLine.setAttribute("y2", to.y);
  hoverLine.setAttribute("stroke", "transparent");
  hoverLine.setAttribute("stroke-width", "12");
  hoverLine.style.pointerEvents = "stroke";

  hoverLine.style.cursor = "pointer";

  // Visible line
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", from.x);
  line.setAttribute("y1", from.y);
  line.setAttribute("x2", to.x);
  line.setAttribute("y2", to.y);
  line.setAttribute("stroke", "#64748b");
  line.setAttribute("stroke-width", "2");

  // Hover behavior
  hoverLine.addEventListener("mouseenter", () => {
    line.setAttribute("stroke", "#38bdf8");
  });

  hoverLine.addEventListener("mouseleave", () => {
    line.setAttribute("stroke", "#64748b");
  });

  svg.appendChild(hoverLine);
  svg.appendChild(line);
}

// ================= RENDER EDGES =================
function renderEdges(graph) {
  const svg = document.getElementById("edges");
  svg.innerHTML = "";

  for (const from in graph) {
    graph[from].forEach((to) => {
      // avoid duplicate edges
      if (from < to) {
        const fromEl = nodeElements[from];
        const toEl = nodeElements[to];
        if (fromEl && toEl) {
          drawEdge(fromEl, toEl);
        }
      }
    });
  }
}

// ================= INIT =================
const myGraph = new Graph();
const submitButton = document.querySelector(".submit");
const promptScreen = document.querySelector(".promptScreen");
const actionEvents = document.querySelectorAll(".action");
const followUserButton = document.querySelector(".followBtn");
const findBtn = document.querySelector(".findBtn");

// ================= CREATE NODE =================
function createNode(userName) {
  const userNode = document.querySelector(".nodeUser");
  const userText = document.querySelector(".userText");
  userNode.classList.remove("hidden");
  userText.textContent = userName;
  userNode.setAttribute("data-id", userName);
}

function mapNodes() {
  nodeElements = {};
  document.querySelectorAll(".node").forEach((node) => {
    nodeElements[node.dataset.id] = node;
  });
}

// ================= CREATE USER =================
function createUser() {
  const userName = document.querySelector(".userNameValue").value;
  promptScreen.classList.add("hidden");
  createNode(userName);
  myGraph.addVertex(userName);
}
// ================= CHANGE/UPDATE PROFILES =================
function updateProfile(node) {
  const userTag = document.querySelector(".userTag");
  const username = document.querySelector(".username");
  const currentUser = node.querySelector(".name").textContent;
  if (userTag.querySelector(".userImg")) {
    userTag.querySelector(".userImg").remove();
  }
  const nodeImg = node.querySelector(".userImg").cloneNode(true);
  // nodeImg.classList.remove("");
  nodeImg.querySelector(".img").style.width = "40px";
  nodeImg.querySelector(".img").style.height = "40px";

  nodeImg.style.height = "40px";
  username.dataset.id = currentUser;
  username.textContent = currentUser;
  userTag.prepend(nodeImg);
}

mapNodes();

function followUser() {
  const userName = document.querySelector(".username").dataset.id;
  const nodeUser = document.querySelector(".nodeUser").dataset.id;
  console.log(userName, nodeUser);
  myGraph.addEdge(userName, nodeUser);
  mapNodes();
  renderEdges(myGraph.graph);
}

function findUser() {
  const nodeUser = document.querySelector(".nodeUser").dataset.id;
  const userName = document.querySelector(".username").dataset.id;

  const path = myGraph.bfsShortestPath(nodeUser, userName);
  animatePath(path);
}

// initial render
renderEdges(myGraph.graph);

// redraw on resize
window.addEventListener("resize", () => renderEdges(myGraph.graph));
submitButton.addEventListener("click", () => {
  createUser();
});

for (let i = 0; i < actionEvents.length; i++) {
  actionEvents[i].addEventListener("click", () => {
    updateProfile(actionEvents[i]);
  });
}

followUserButton.addEventListener("click", () => {
  followUser();
});
findBtn.addEventListener("click", () => {
  findUser();
});
