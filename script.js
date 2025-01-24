import { HSK1, HSK2, HSK3, HSK4 } from './WordData.js';

const wordContainer = document.getElementById('word-container');
const buttons = document.querySelectorAll('.Header__List a')

// 各級のデータをマップ
const levelData = {
  HSK1: HSK1,
  HSK2: HSK2,
  HSK3: HSK3,
  HSK4: HSK4
};

// 単語リストを描画する関数
function renderWords(level) {
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
        <div class="left">
          <p class="no">${index + 1}</p>
        </div>
        <div class="center">
          <p class="pinyin">${data.pinyin}</p>
          <p class="word" data-audio="${data.wordAudio}">${data.word}</p>
        </div>
        <div class="right">
          <p class="meaning">${data.meaning}</p>
          <hr />
          <p class="example-pinyin">${data.examplePinyin}</p>
          <p class="example-chinese" data-audio="${data.exampleAudio}">${data.exampleChinese}</p>
          <p class="example-meaning">${data.exampleMeaning}</p>
        </div>
      </div>
    `;

    wordContainer.appendChild(wordSection);
  });
}

// ボタンにクリックイベントを設定
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault(); // デフォルトのリンク動作を無効化
    const level = button.getAttribute('data-level');
    renderWords(level);
  });
});

// 初期表示（例: HSK1級）
renderWords('HSK4');

// 音声再生イベントを追加
document.addEventListener('click', (event) => {
  const target = event.target;

  // クリックした要素の data-audio 属性を取得
  const audioFile = target.getAttribute('data-audio');
  
  if (audioFile) {
    // Audio オブジェクトを作成して音声を再生
    const audio = new Audio(audioFile);
    audio.play().catch((error) => {
      console.error('音声再生エラー:', error);
    });
  }
});


// ボタンにクリックイベントを設定
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault(); // デフォルトのリンク動作を無効化

    // 他のボタンから active クラスを削除
    buttons.forEach(btn => btn.classList.remove('active'));

    // クリックされたボタンに active クラスを追加
    button.classList.add('active');

    // レベルに応じて単語を表示
    const level = button.getAttribute('data-level');
    renderWords(level); // 単語リスト描画関数を呼び出す
  });
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