'use strict';

const HISTORY_KEY = 'ai_video_history';
const API_KEY_KEY = 'runway_api_key';

// ── DOM refs ───────────────────────────────────────────────────────────────
const apiKeyInput   = document.getElementById('api-key-input');
const promptInput   = document.getElementById('prompt-input');
const negativeInput = document.getElementById('negative-input');
const durationSel   = document.getElementById('duration-select');
const ratioSel      = document.getElementById('ratio-select');
const generateBtn   = document.getElementById('generate-btn');
const btnIcon       = document.getElementById('btn-icon');
const btnLabel      = document.getElementById('btn-label');
const statusBox     = document.getElementById('status-box');
const progressWrap  = document.getElementById('progress-wrap');
const progressBar   = document.getElementById('progress-bar');
const resultArea    = document.getElementById('result-area');
const resultVideo   = document.getElementById('result-video');
const downloadLink  = document.getElementById('download-link');
const historyCard   = document.getElementById('history-card');
const historyList   = document.getElementById('history-list');

// ── Persist API key in localStorage ────────────────────────────────────────
apiKeyInput.value = localStorage.getItem(API_KEY_KEY) || '';
apiKeyInput.addEventListener('input', () => {
  localStorage.setItem(API_KEY_KEY, apiKeyInput.value.trim());
});

// ── History ─────────────────────────────────────────────────────────────────
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

function saveHistory(h) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

function renderHistory() {
  const history = loadHistory();
  if (!history.length) { historyCard.style.display = 'none'; return; }
  historyCard.style.display = 'block';
  historyList.innerHTML = '';
  [...history].reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <span class="hi-prompt">${item.prompt}</span>
      <span class="hi-status ${item.status}">${item.status}</span>
    `;
    if (item.url) {
      div.addEventListener('click', () => showResult(item.url));
    }
    historyList.appendChild(div);
  });
}

renderHistory();

// ── Status helpers ──────────────────────────────────────────────────────────
function setStatus(msg, type) {
  statusBox.textContent = msg;
  statusBox.className = `status-box ${type} show`;
}

function clearStatus() {
  statusBox.className = 'status-box';
}

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  if (isLoading) {
    btnIcon.innerHTML = '<span class="spinner"></span>';
    btnLabel.textContent = 'Generating…';
    progressWrap.style.display = 'block';
    progressBar.style.width = '5%';
  } else {
    btnIcon.textContent = '▶';
    btnLabel.textContent = 'Generate Video';
    progressWrap.style.display = 'none';
    progressBar.style.width = '0%';
  }
}

// ── Show result video ────────────────────────────────────────────────────────
function showResult(url) {
  resultVideo.src = url;
  downloadLink.href = url;
  resultArea.classList.add('show');
  resultArea.scrollIntoView({ behavior: 'smooth' });
}

// ── Poll task until complete ─────────────────────────────────────────────────
async function pollTask(taskId, apiKey) {
  const maxWait = 10 * 60 * 1000; // 10 minutes
  const interval = 5000;
  const started = Date.now();
  let progress = 10;

  while (Date.now() - started < maxWait) {
    await new Promise(r => setTimeout(r, interval));

    const res = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Runway-Version': '2024-11-06',
      },
    });

    if (!res.ok) throw new Error(`Poll failed: ${res.status}`);
    const data = await res.json();

    progress = Math.min(progress + 8, 90);
    progressBar.style.width = progress + '%';

    if (data.status === 'SUCCEEDED') {
      progressBar.style.width = '100%';
      return data.output?.[0];
    }

    if (data.status === 'FAILED') {
      throw new Error(data.failure || 'Generation failed');
    }
  }

  throw new Error('Timed out waiting for video');
}

// ── Generate ─────────────────────────────────────────────────────────────────
generateBtn.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!apiKey) {
    setStatus('Enter your Runway API key in the sidebar first.', 'error');
    apiKeyInput.focus();
    return;
  }

  if (!prompt) {
    setStatus('Enter a prompt describing the video you want.', 'error');
    promptInput.focus();
    return;
  }

  const [width, height] = ratioSel.value.split(':').map(Number);

  setLoading(true);
  clearStatus();
  resultArea.classList.remove('show');
  setStatus('Submitting to Runway Gen-3 Alpha…', 'info');

  const history = loadHistory();
  const historyEntry = { prompt, status: 'pending', url: null, createdAt: Date.now() };
  history.push(historyEntry);
  saveHistory(history);
  renderHistory();

  try {
    // Create task
    const createRes = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Runway-Version': '2024-11-06',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gen3a_turbo',
        promptText: prompt,
        promptImage: null,
        negativePrompt: negativeInput.value.trim() || undefined,
        duration: Number(durationSel.value),
        ratio: ratioSel.value,
        watermark: false,
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      throw new Error(err.message || `API error ${createRes.status}`);
    }

    const { id: taskId } = await createRes.json();
    setStatus(`Task created (${taskId}). Waiting for video…`, 'info');

    const videoUrl = await pollTask(taskId, apiKey);

    historyEntry.status = 'succeeded';
    historyEntry.url = videoUrl;
    saveHistory(history);
    renderHistory();

    setStatus('Video ready!', 'success');
    showResult(videoUrl);
  } catch (err) {
    historyEntry.status = 'failed';
    saveHistory(history);
    renderHistory();
    setStatus(`Error: ${err.message}`, 'error');
  } finally {
    setLoading(false);
  }
});
