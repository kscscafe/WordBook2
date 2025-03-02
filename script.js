import { HSK1, HSK2, HSK3, HSK4 } from './WordData.js';

const wordContainer = document.getElementById('word-container');
const buttons = document.querySelectorAll('.Header__List a')
const speedToggle = document.getElementById('speed-toggle'); // 追加
const toggleInputBox = document.getElementById('toggle-input-box'); // 追加
const toneToggle = document.getElementById('tone-toggle'); // 声調ボタン

// 各級のデータをマップ
const levelData = {
  HSK1: HSK1,
  HSK2: HSK2,
  HSK3: HSK3,
  HSK4: HSK4
};

// 入力ボックスの表示状態（初期は非表示）
let isInputVisible = false;
let isSpeedNormal = true; // 0.9倍速の切り替え
let currentLevel = 'HSK4';

// 単語リストを描画する関数
function renderWords(level) {
  currentLevel = level;
  if (!levelData[level]) return;
  // コンテナをクリア
  wordContainer.innerHTML = '';

  // 該当レベルの単語を取得
  const words = levelData[level];

  // 単語をHTMLに挿入
  words.forEach((data, index) => {
    const wordSection = document.createElement('div');
    wordSection.classList.add('word-section');

    wordSection.innerHTML = `
      <div class="grid">
        <div class="center">
          <p class="no">${index + 1}</p>
          <p class="pinyin">${data.pinyin}</p>
          <p class="word" data-audio="${data.wordAudio}">${data.word}</p>
        </div>
        <div class="right">
          <div class="meaning-container">
           <span class="label-translation">訳</span>
           <p class="meaning">${data.meaning}</p>
           <span class="part-label">${data.part}</span>
          </div>
          <hr />
          <div class="example-container">
           <span class="label-example">例文</span>
            <div class="example-text">
              <p class="example-pinyin">${data.examplePinyin}</p>
              <p class="example-chinese" data-audio="${data.exampleAudio}" 
                 data-seicho="${data.seicho || ''}">${data.exampleChinese}</p>
              <p class="example-meaning">${data.exampleMeaning}</p>
            </div>
          </div>
        </div>
      </div>

      <input type="text" class="word-input" placeholder="ここに入力" style="display: none;">
    `;

    wordContainer.appendChild(wordSection);
  });
}

// ボタンにクリックイベントを設定
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    // event.preventDefault(); // デフォルトのリンク動作を無効化

    // 他のボタンから active クラスを削除
    buttons.forEach(btn => btn.classList.remove('active'));

    // クリックされたボタンに active クラスを追加
    button.classList.add('active');

    const level = button.getAttribute('data-level');
    renderWords(level);
  });
});

// 初期表示（例: HSK1級）
renderWords(currentLevel);

speedToggle.textContent = "1.0x"

// 音声再生イベントを追加
document.addEventListener('click', (event) => {
  let target = event.target;

  // もし <span> をクリックした場合、親の example-chinese を取得
  if (target.tagName === 'SPAN' && target.parentElement.classList.contains('example-chinese')) {
    target = target.parentElement;
  }

  // クリックした要素の data-audio 属性を取得
  const audioFile = target.getAttribute('data-audio');
  
  if (audioFile) {
    // Audio オブジェクトを作成して音声を再生
    const audio = new Audio(audioFile);
    audio.playbackRate = isSpeedNormal ? 1.0 :0.75; // 現在の速度設定を適用
    audio.play().catch((error) => {
      console.error('音声再生エラー:', error);
    });
  }
});

// 入力ボックスの表示/非表示を切り替える関数（単語データをリセットしない）
toggleInputBox.addEventListener('click', () => {
  isInputVisible = !isInputVisible;
  document.querySelectorAll('.word-input').forEach(input => {
    input.style.display = isInputVisible ? 'block' : 'none';
  });
});

// 0.9倍速ボタンの機能（単語データをリセットしない）
speedToggle.addEventListener('click', () => {
  isSpeedNormal = !isSpeedNormal;
  speedToggle.textContent = isSpeedNormal ? "1.0x" : "0.75x";
});

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.Header');
  const wordContainer = document.getElementById('word-container');

  // ヘッダーの高さを取得
  function adjustWordContainerMargin() {
    const headerHeight = header.offsetHeight; // ヘッダーの高さを取得
    wordContainer.style.marginTop = `${headerHeight}px`; // 余白を設定
  }

  // 初期設定として高さを反映
  adjustWordContainerMargin();

  // ウィンドウサイズ変更時にも高さを再調整
  window.addEventListener('resize', adjustWordContainerMargin);
});


let isToneEnabled = false; // 声調ON/OFFのフラグ

// 声調の色を適用する関数
function applyToneColors() {
  document.querySelectorAll('.example-chinese').forEach((element, index) => {
    const seicho = element.getAttribute('data-seicho'); // seichoの値を取得
    const audio = element.getAttribute('data-audio'); // 音声データを取得
    if (!seicho) return;

    const chars = element.innerText.split(''); // 文字を分解

    // HTMLを更新（各文字に適切なクラスを適用）
    element.innerHTML = chars.map((char, i) => {
      const tone = seicho[i] || '0'; // seichoの該当位置の数字を取得（なければ0）
      let toneClass = 'tone-1'; // デフォルト（背景なし）

      if (tone === '2') toneClass = 'tone-2';
      else if (tone === '3') toneClass = 'tone-3';
      else if (tone === '4') toneClass = 'tone-4';
      else if (tone === '5') toneClass = 'tone-5';

      return `<span class="${toneClass}" data-audio="${audio}">${char}</span>`;  // data-audio を <span> にセット
    }).join('');
  });
}

// 声調ON/OFF切り替え
toneToggle.addEventListener('click', () => {
  isToneEnabled = !isToneEnabled;
  if (isToneEnabled) {
    applyToneColors(); // 声調の色を適用
  } else {
    // 声調の色を解除（元の文字に戻す）
    document.querySelectorAll('.example-chinese').forEach((element) => {
      element.innerHTML = element.getAttribute('data-original-text');
      element.setAttribute('data-audio', element.getAttribute('data-original-audio')); // data-audio を元に戻す
    });
  }
});

// 初期化：example-chinese の元のテキストを保存
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.example-chinese').forEach((element) => {
    element.setAttribute('data-original-text', element.innerHTML);
    element.setAttribute('data-original-audio', element.getAttribute('data-audio')); // 元の data-audio を保存
  });
});