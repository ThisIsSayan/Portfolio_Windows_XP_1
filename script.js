/* =====================================================================
   ★ EDIT YOUR DETAILS HERE ★  — everything on the site reads from CONFIG
   ===================================================================== */
const CONFIG = {
  name: "Jordan Lee", // ← your name
  role: "Software Engineer", // ← your title
  location: "Remote / Earth", // ← your location
  email: "you@example.com", // ← contact form sends here (mailto)
  // ← social URLs
  socials: {
    GitHub: "https://github.com/yourname",
    LinkedIn: "https://linkedin.com/in/yourname",
    Twitter: "https://twitter.com/yourname",
  },
  // ← About Me bio
  bio: "I build reliable backend systems and friendly interfaces. Eight years shipping distributed services, developer tools and AI-powered products. I like clear APIs, small pull requests, and software that still works at 3 a.m.",
  // ← "System properties" shown in About
  specs: {
    Processor: "8 yrs @ full stack",
    Memory: "Plenty of coffee",
    Education: "B.S. Computer Science",
    Languages: "English, Español",
    Status: "Open to new opportunities",
  },
  // ← Projects: folder name → list of projects (icon, name, desc, link)
  projects: {
    Microservices: [
      {
        icon: "⚙️",
        name: "order-service",
        desc: "Event-driven order pipeline handling 2M msgs/day (Go, Kafka).",
        link: "https://github.com/yourname/order-service",
      },
      {
        icon: "🌐",
        name: "api-gateway",
        desc: "Rate-limiting gateway with JWT auth (Node, Redis).",
        link: "https://github.com/yourname/api-gateway",
      },
    ],
    "AI Apps": [
      {
        icon: "🤖",
        name: "doc-chat",
        desc: "Chat with your PDFs using retrieval-augmented generation.",
        link: "https://github.com/yourname/doc-chat",
      },
      {
        icon: "🧠",
        name: "vision-tagger",
        desc: "Auto-tags photo libraries with a fine-tuned vision model.",
        link: "https://github.com/yourname/vision-tagger",
      },
    ],
    "Web Tools": [
      {
        icon: "🧰",
        name: "json-lens",
        desc: "Browser tool to explore and diff huge JSON files.",
        link: "https://github.com/yourname/json-lens",
      },
      {
        icon: "📊",
        name: "status-board",
        desc: "Self-hosted uptime dashboard (React, SQLite).",
        link: "https://github.com/yourname/status-board",
      },
    ],
  },
  // ← Skills: category → [name, level 1-5]
  skills: {
    Languages: [
      ["TypeScript", 5],
      ["Python", 5],
      ["Go", 4],
      ["SQL", 4],
    ],
    Frontend: [
      ["React", 5],
      ["CSS / Design systems", 4],
      ["Accessibility", 4],
    ],
    "Backend & Cloud": [
      ["Node.js", 5],
      ["PostgreSQL", 4],
      ["Kafka", 3],
      ["AWS / Docker / K8s", 4],
    ],
    "AI / ML": [
      ["LLM apps & RAG", 4],
      ["PyTorch", 3],
    ],
  },
  // ← Work history (newest first)
  work: [
    {
      role: "Senior Software Engineer",
      co: "Acme Corp",
      dates: "2022 – Present",
      points: [
        "Led migration of a monolith to 12 services; cut deploy time from 2h to 8min.",
        "Mentored 5 engineers and ran the on-call program.",
      ],
    },
    {
      role: "Software Engineer",
      co: "Globex Inc.",
      dates: "2019 – 2022",
      points: [
        "Built the realtime analytics dashboard used by 40k users.",
        "Reduced API p95 latency by 60%.",
      ],
    },
    {
      role: "Junior Developer",
      co: "Initech",
      dates: "2017 – 2019",
      points: [
        "Shipped customer-facing features in React and Rails.",
        "Introduced automated testing and CI.",
      ],
    },
  ],
};
/* ===================== END OF PERSONAL DETAILS ===================== */

const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const isMobile = () => innerWidth <= 768;

/* ---------- Sound (Web Audio synth fallback for the startup chime) ---------- */
let muted = false,
  ac;
function chime() {
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const notes = [
      [311, 0],
      [466, 0.28],
      [415, 0.56],
      [233, 0.9],
      [311, 1.2],
      [466, 1.5],
    ]; // Eb Bb Ab Bb(low) Eb Bb
    notes.forEach(([f, t], i) => {
      [1, 2].forEach((m, j) => {
        const o = ac.createOscillator(),
          g = ac.createGain();
        o.type = j ? "sine" : "triangle";
        o.frequency.value = f * m;
        const s = ac.currentTime + t,
          d = i == 5 ? 1.6 : 0.9;
        g.gain.setValueAtTime(0, s);
        g.gain.linearRampToValueAtTime(j ? 0.04 : 0.12, s + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0005, s + d);
        o.connect(g).connect(ac.destination);
        o.start(s);
        o.stop(s + d + 0.05);
      });
    });
  } catch (e) {}
}

/* ---------- Boot → Login → Desktop ---------- */
$("#lgName").textContent = CONFIG.name;
$("#lgRole").textContent = CONFIG.role;
$("#smName").textContent = CONFIG.name;
setTimeout(() => {
  $("#boot").classList.add("hide");
  $("#login").classList.remove("hide");
}, 3600);
$("#userBtn").onclick = () => {
  chime();
  $("#login").classList.add("hide");
  $("#desktop").classList.remove("hide");
  $("#tb").classList.remove("hide");
  if (!$$(".win").length) openApp("about");
};
function logOff() {
  $$(".win").forEach((w) => w.remove());
  $("#tasks").innerHTML = "";
  closeStart();
  ["#desktop", "#tb"].forEach((s) => $(s).classList.add("hide"));
  $("#login").classList.remove("hide");
}
$("#logoff").onclick = logOff;
$("#off").onclick = logOff;

/* ---------- Apps (each section = one window) ---------- */
const APPS = {
  about: {
    title: "System Properties – About Me",
    icon: "💻",
    label: "My Computer",
    w: 520,
    h: 460,
    html: () => `<div class="pad"><h2>${esc(CONFIG.name)}</h2><div>${esc(CONFIG.role)} · ${esc(CONFIG.location)}</div>
      <h3>General</h3><p>${esc(CONFIG.bio)}</p>
      <h3>System</h3><table class="spec">${Object.entries(CONFIG.specs)
        .map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`)
        .join("")}</table>
      <h3>Links</h3><p>${Object.entries(CONFIG.socials)
        .map(
          ([k, v]) =>
            `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)}</a>`,
        )
        .join(" &nbsp;|&nbsp; ")}</p></div>`,
  },
  projects: {
    title: "My Documents – Projects",
    icon: "📁",
    label: "My Documents",
    w: 640,
    h: 420,
    menu: "File &nbsp; Edit &nbsp; View &nbsp; Favorites &nbsp; Help",
    html: () =>
      `<div class="exp"><aside>${Object.keys(CONFIG.projects)
        .map(
          (k, i) =>
            `<div data-f="${esc(k)}" class="${i ? "" : "on"}">📁 ${esc(k)}</div>`,
        )
        .join("")}</aside><div class="files"></div></div>`,
    init(w) {
      const files = $(".files", w),
        st = $(".status", w);
      const show = (f) => {
        files.innerHTML = CONFIG.projects[f]
          .map(
            (p, i) =>
              `<div class="file" data-i="${i}"><span>${p.icon}</span>${esc(p.name)}</div>`,
          )
          .join("");
        st.textContent =
          CONFIG.projects[f].length + " object(s) — double-click to open";
      };
      let cur = Object.keys(CONFIG.projects)[0];
      show(cur);
      $$("aside div", w).forEach(
        (d) =>
          (d.onclick = () => {
            $$("aside div", w).forEach((x) => x.classList.remove("on"));
            d.classList.add("on");
            cur = d.dataset.f;
            show(cur);
          }),
      );
      files.onclick = (e) => {
        const f = e.target.closest(".file");
        if (!f) return;
        $$(".file", w).forEach((x) => x.classList.remove("sel"));
        f.classList.add("sel");
        st.textContent = CONFIG.projects[cur][f.dataset.i].desc;
      };
      files.ondblclick = (e) => {
        const f = e.target.closest(".file");
        if (f)
          window.open(
            CONFIG.projects[cur][f.dataset.i].link,
            "_blank",
            "noopener",
          );
      };
    },
  },
  skills: {
    title: "Device Manager – Skills",
    icon: "🛠️",
    label: "My Skills.exe",
    w: 420,
    h: 420,
    menu: "Action &nbsp; View &nbsp; Help",
    html: () =>
      `<div class="tree"><b>💻 ${esc(CONFIG.name.toUpperCase())}-PC</b>${Object.entries(
        CONFIG.skills,
      )
        .map(
          ([c, l]) =>
            `<details open><summary>📂 ${esc(c)}</summary><ul style="margin:0;padding-left:14px">${l.map(([n, v]) => `<li>⚙️ ${esc(n)}<span class="meter" title="${v}/5"><i style="width:${v * 20}%"></i></span></li>`).join("")}</ul></details>`,
        )
        .join("")}</div>`,
  },
  work: {
    title: "Work History.log – Notepad",
    icon: "📝",
    label: "Work History.log",
    w: 560,
    h: 420,
    menu: "File &nbsp; Edit &nbsp; Format &nbsp; View &nbsp; Help",
    html: () =>
      `<pre class="note">${CONFIG.work.map((j) => `== ${esc(j.dates)} ==\n${esc(j.role)} @ ${esc(j.co)}\n${j.points.map((p) => "  * " + esc(p)).join("\n")}`).join("\n\n")}\n\n-- end of file --</pre>`,
  },
  contact: {
    title: "New Message – Outlook Express",
    icon: "✉️",
    label: "Contact.exe",
    w: 520,
    h: 420,
    html: () => `<div class="mail"><div class="tool"><button class="btn" id="send">📤 Send</button></div>
      <label><b>To:</b><input value="${esc(CONFIG.email)}" readonly></label>
      <label><b>From:</b><input id="mFrom" type="email" placeholder="your@email.com"></label>
      <label><b>Subject:</b><input id="mSub" value="Hello from your portfolio"></label>
      <textarea id="mBody" placeholder="Write your message here…"></textarea></div>`,
    init(w) {
      $("#send", w).onclick = () => {
        const b = $("#mBody", w).value + "\n\n— " + $("#mFrom", w).value;
        location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent($("#mSub", w).value)}&body=${encodeURIComponent(b)}`;
        $(".status", w).textContent = "Opening your mail app…";
      };
    },
  },
};

/* ---------- Window manager ---------- */
let z = 10,
  wins = {};
function openApp(id) {
  closeStart();
  if (wins[id]) {
    const w = wins[id];
    w.classList.remove("hide");
    focusWin(w);
    return;
  }
  const a = APPS[id],
    n = Object.keys(wins).length,
    w = document.createElement("div");
  w.className = "win";
  w.dataset.id = id;
  w.style.cssText = `width:${Math.min(a.w, innerWidth - 20)}px;height:${Math.min(a.h, innerHeight - 60)}px;left:${90 + n * 28}px;top:${30 + n * 28}px`;
  w.innerHTML = `<div class="tb"><span>${a.icon}</span><span class="t">${esc(a.title)}</span><button class="cb mn" aria-label="Minimize">_</button><button class="cb mx" aria-label="Maximize">□</button><button class="cb x" aria-label="Close">✕</button></div>
    ${a.menu ? `<div class="menu"><span>${a.menu}</span></div>` : ""}<div class="body">${a.html()}</div><div class="status">Ready</div><div class="rs"></div>`;
  $("#desktop").appendChild(w);
  wins[id] = w;
  const t = document.createElement("button");
  t.className = "task";
  t.textContent = a.icon + " " + a.title.split(" – ")[0];
  t.onclick = () => {
    if (w.classList.contains("hide") || !w.classList.contains("act")) {
      w.classList.remove("hide");
      focusWin(w);
    } else minimize(w);
  };
  t.dataset.id = id;
  $("#tasks").appendChild(t);
  w.addEventListener("pointerdown", () => focusWin(w));
  $(".mn", w).onclick = () => minimize(w);
  $(".mx", w).onclick = () => w.classList.toggle("max");
  $(".x", w).onclick = () => {
    w.remove();
    t.remove();
    delete wins[id];
  };
  const tb = $(".tb", w);
  tb.ondblclick = (e) => {
    if (!e.target.closest(".cb")) w.classList.toggle("max");
  };
  drag(w, tb);
  resize(w, $(".rs", w));
  a.init && a.init(w);
  focusWin(w);
}
function focusWin(w) {
  $$(".win").forEach((x) => x.classList.remove("act"));
  w.classList.add("act");
  w.style.zIndex = ++z;
  $$(".task").forEach((t) =>
    t.classList.toggle("act", t.dataset.id === w.dataset.id),
  );
}
function minimize(w) {
  w.classList.add("hide");
  w.classList.remove("act");
  $$(".task").forEach(
    (t) => t.dataset.id === w.dataset.id && t.classList.remove("act"),
  );
}
function drag(w, h) {
  h.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".cb") || w.classList.contains("max") || isMobile())
      return;
    const dx = e.clientX - w.offsetLeft,
      dy = e.clientY - w.offsetTop;
    h.setPointerCapture(e.pointerId);
    const mv = (ev) => {
      w.style.left =
        Math.max(
          -w.offsetWidth + 80,
          Math.min(innerWidth - 60, ev.clientX - dx),
        ) + "px";
      w.style.top =
        Math.max(0, Math.min(innerHeight - 60, ev.clientY - dy)) + "px";
    };
    const up = () => {
      h.removeEventListener("pointermove", mv);
      h.removeEventListener("pointerup", up);
    };
    h.addEventListener("pointermove", mv);
    h.addEventListener("pointerup", up);
  });
}
function resize(w, h) {
  h.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    focusWin(w);
    h.setPointerCapture(e.pointerId);
    const sx = e.clientX,
      sy = e.clientY,
      sw = w.offsetWidth,
      sh = w.offsetHeight;
    const mv = (ev) => {
      w.style.width = Math.max(260, sw + ev.clientX - sx) + "px";
      w.style.height = Math.max(140, sh + ev.clientY - sy) + "px";
    };
    const up = () => {
      h.removeEventListener("pointermove", mv);
      h.removeEventListener("pointerup", up);
    };
    h.addEventListener("pointermove", mv);
    h.addEventListener("pointerup", up);
  });
}

/* ---------- Desktop icons (double-click on desktop, single tap on touch) ---------- */
const order = ["about", "projects", "skills", "work", "contact"];
order.forEach((id) => {
  const b = document.createElement("button");
  b.className = "ico";
  b.innerHTML = `<span>${APPS[id].icon}</span>${esc(APPS[id].label)}`;
  b.onclick = () => {
    $$(".ico").forEach((i) => i.classList.remove("sel"));
    b.classList.add("sel");
    if (isMobile()) openApp(id);
  };
  b.ondblclick = () => openApp(id);
  b.onkeydown = (e) => {
    if (e.key === "Enter") openApp(id);
  };
  $("#icons").appendChild(b);
});
$("#desktop").addEventListener("pointerdown", (e) => {
  if (e.target.id === "desktop" || e.target.id === "icons")
    $$(".ico").forEach((i) => i.classList.remove("sel"));
});

/* ---------- Start menu ---------- */
$("#smL").innerHTML = order
  .map(
    (id) =>
      `<button class="mi" data-id="${id}"><span>${APPS[id].icon}</span>${esc(APPS[id].label)}</button>`,
  )
  .join("");
$("#smR").innerHTML =
  Object.entries(CONFIG.socials)
    .map(
      ([k, v]) =>
        `<a class="mi sm" href="${esc(v)}" target="_blank" rel="noopener" style="text-decoration:none"><span>🔗</span>${esc(k)}</a>`,
    )
    .join("") +
  `<button class="mi sm" data-id="contact"><span>✉️</span>E-mail me</button>`;
$$("#sm [data-id]").forEach((b) => (b.onclick = () => openApp(b.dataset.id)));
function closeStart() {
  $("#sm").classList.add("hide");
}
$("#start").onclick = (e) => {
  e.stopPropagation();
  $("#sm").classList.toggle("hide");
};
document.addEventListener("pointerdown", (e) => {
  if (!e.target.closest("#sm,#start")) closeStart();
});

/* ---------- Tray: clock + volume ---------- */
const tick = () =>
  ($("#clock").textContent = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  }));
tick();
setInterval(tick, 15000);
$("#vol").onclick = () => {
  muted = !muted;
  $("#vol").textContent = muted ? "🔇" : "🔊";
};
