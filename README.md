# 宝宝科普小动画：电和水从哪里来

两个给 4 岁左右宝宝看的科普动画，全部用 JavaScript 生成（画面、配音、字幕、背景音乐）。

| 视频 | 时长 | 文件 |
| --- | --- | --- |
| 家里的电是从哪里来的？ | 约 2 分 9 秒 | `output/electricity.mp4`（字幕：`output/electricity.srt`） |
| 家里的水是从哪里来的？ | 约 2 分 16 秒 | `output/water.mp4`（字幕：`output/water.srt`） |

字幕已烧录在画面里；`.srt` 是同样内容的外挂字幕，方便在播放器里另行使用。

## 配音和字幕如何保持一致

- 旁白脚本在 `src/scripts/*.js`，每一句话就是一条字幕。配音按句合成，合成时用的就是这句字幕的原文。
- 语音合成（微软 Edge 神经网络语音 `zh-CN-XiaoyiNeural`）会同时返回每个词的开始和结束时间。字幕只在这句话播放时出现，并像卡拉 OK 一样逐字变色，跟着声音走。
- 构建时会逐字校验：如果字幕里有哪个字没有对应的发音时间（或者反过来），构建会直接报错，所以不会出现“字幕和配音对不上”的视频。
- 画面里的动作也绑定在具体的词上，例如说到“啪！”时灯正好亮起，说到“赶跑”时细菌正好跑掉。

## 重新生成

需要 Node.js 18+、`ffmpeg`，以及能访问微软语音服务的网络。

```bash
npm install
npm run build              # 生成两个视频
npm run build:electricity  # 只生成“电”
npm run build:water        # 只生成“水”
npm run stills             # 每句话截一张图到 build/stills/，方便检查画面
```

改旁白只需要编辑 `src/scripts/` 里的句子，重新构建即可。语音会缓存在 `build/tts-cache/`。

## 目录

- `src/scripts/`：两个视频的旁白（分场景、分句）
- `src/draw/`：Canvas 动画场景和字幕绘制
- `src/tts.js`：语音合成与逐字对齐校验
- `src/audio.js`：按采样点精确拼接配音、生成背景音乐
- `src/build.js`：时间轴、逐帧渲染、调用 ffmpeg 输出 MP4 和 SRT
- `assets/fonts/`：站酷快乐体（SIL OFL 开源授权）
