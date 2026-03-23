# AstroGames

AstroGames 是一个基于 Flask 的天文小游戏合集项目。

项目目标是把辨认星座、理解天象和天文常识，逐步做成一组轻量、可扩展、可持续增加内容的网页小游戏。

目前已经实现：

- AstroGames 主菜单
- 小游戏 01：《消失的恒星》

其中《消失的恒星》的核心玩法是：

- 随机选择一个星座天区
- 绘制该区域的星图
- 隐藏一颗有中文名的亮星
- 让玩家从选项中猜出缺失的恒星

后续可以继续在这个项目中扩展新的天文小游戏模块。

## 运行

```bash
python3 app.py
```

默认访问地址：

```text
http://127.0.0.1:5000
```

## 项目结构

```text
app.py                         Flask 入口与主菜单
games/                         各小游戏模块
templates/home.html            AstroGames 主界面
templates/games/               各小游戏模板
data/star_catalog.json         当前星图数据
data/star_knowledge.json       恒星说明数据
```

## 当前数据说明

当前项目使用的是一版可运行的占位恒星数据，已经迁移到外部 JSON 文件，包含少量亮星和若干无名背景星，字段结构已预留，后续可以继续补充，供不同小游戏复用：

- 编号 `id`
- 星表编号 `catalog_id`
- 星等 `mag`
- 中文名 `name_cn`
- 英文名 `name_en`
- 颜色 `color`
- 所属星座 `constellation`
- 赤经/赤纬 `ra` / `dec`

数据文件位置：

```text
data/star_catalog.json
```
