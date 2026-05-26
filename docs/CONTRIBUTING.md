---
title: 贡献指南
tags: [贡献, 指南]
category: 项目
slug: CONTRIBUTING
emoji: 🤝
description: 如何向本知识库贡献内容
---

# 贡献指南 🤝

欢迎向本项目贡献面试文档！请遵循以下规范。

## 文档规范

### 1. 文件命名

- 使用英文小写字母和 `-` 连接
- 示例：`java-basic.md`、`spring-ioc.md`

### 2. YAML Front Matter

每篇文档头部必须包含以下信息：

```yaml
---
title: 文档标题              # 必填
tags: [标签1, 标签2]         # 必填
category: 分类/子分类         # 必填
slug: 路径/文件名            # 必填，唯一标识
emoji: 📝                    # 选填
description: 简短描述        # 选填
created: 2024-01-15          # 选填
updated: 2024-03-20          # 选填
---
```

### 3. 文件放置位置

根据内容类型放在 `docs/` 下对应的子目录。

```
docs/
├── java/        # Java 相关
├── ai/          # AI/ML 相关
├── frontend/    # 前端相关
└── database/    # 数据库相关
```

### 4. 支持的特性

- **数学公式**: `$...$` 或 `$$...$$`
- **Mermaid 图**: ````mermaid ... ````
- **时序图**: ````sequence ... ````
- **数据图表**: ````chart { "type": "pie", "data": [...] } ````
