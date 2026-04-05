# AstroGames

AstroGames 是一个基于 Flask 的中文天文小游戏项目。

这个项目希望用几个轻量、直观的网页小游戏，把天文入门知识做得更容易上手，也更有趣一些。

## 运行方式

建议先创建虚拟环境并安装依赖：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

启动项目：

```bash
python3 app.py
```

默认访问地址：

```text
http://127.0.0.1:5000
```

## 使用说明

1. 打开主页后，从主菜单进入想玩的小游戏。
2. 每个游戏都可以直接在浏览器里完成，不需要额外安装前端依赖。
3. 如果页面资源加载稍慢，等待几秒即可。

## 项目说明

- 后端使用 Flask
- 部分星图绘制使用 Matplotlib
- 页面交互主要使用原生 HTML / CSS / JavaScript

如果你想继续扩展这个项目，可以直接在 `games/`、`templates/` 和 `static/` 下增加新的小游戏模块。
