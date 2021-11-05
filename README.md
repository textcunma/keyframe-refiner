# 原画位置合わせ

スキャンされた原画のタップ穴を基準に原画の位置合わせを自動で行います。
![explanation](assets/explanation.jpg)

## 使用方法
0. [原画位置合わせ (https://keyframe-refiner.js.org)](https://keyframe-refiner.js.org)　にアクセス

1. 原画を開く
    - **画面左サイドバーにある「+」ボタンを押すか、ファイルをドラッグ＆ドロップ**
    - **位置合わせしたい原画を全て選択**
2. 基準画像選択
    - **画面右サイドバーにある「表示中の画像を基準に設定」ボタンを押す**
    - 1 枚目の画像を基準にしたい場合はそのままボタンを押す
    - もし基準画像を変更したい場合には左サイドバーに表示されているサムネイルを押すと変更可能
3. 対象領域設定
    - **左クリックで円検出する対象領域を指定**
4. 基準位置設定（円の中心位置が基準位置）
    - **右サイドバーにある「自動算出」ボタンを押す**
    - もし自動算出された位置が不適当である場合、手動で変更も可能
    - **基準位置が適当であれば、「基準位置を設定」ボタンを押す**
5. OpenCV 処理
    - **「CV 処理開始」ボタンを押す**
    - **CV 処理終了後に「ダウンロード」ボタンを押す**


## アルゴリズム
1. 全ての原画のサイズを余白追加によって統一
2. 特定範囲でハフ変換によって円検出
3. 1 枚目の原画の円位置を基準にして全ての原画を合わせる

## 注意事項
適切な対象領域の設定をしなければ自動位置合わせが上手くいかない場合があります。以下の 2 点に注意して下さい。
- タップ穴中心の「黒点」がぎりぎりに含まれるような対象領域に設定しない
- 対象領域に文字や線が混入させない

## ライセンス
[MIT](LICENSE)
