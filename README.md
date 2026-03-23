# AstroGames

一个基于 Flask 的简单网页小游戏：

- 随机选择一个星座天区
- 绘制该区域的占位星图
- 隐藏一颗有中文名的亮星
- 让玩家从选项中猜出缺失的恒星

## 运行

```bash
python3 app.py
```

默认访问地址：

```text
http://127.0.0.1:5000
```

## 当前数据说明

这版恒星数据库是占位数据，已经迁移到外部 JSON 文件，包含少量亮星和若干无名背景星，字段结构已预留，后续可以继续补充：

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
