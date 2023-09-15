# shields-workflow-badges (Draft)

该仓库本意是通过一个 CLI 解决 [badges/shields/issues/8671](https://github.com/badges/shields/issues/8671) 描述的问题。

## 使用

```bash
npx shields-workflow-badges@latest
```

如果只是想针对单个 `*.md` 文件替换：

```bash
npx shields-workflow-badges@latest README.md
```

运行 `npx shields-workflow-badges@latest -h` 查看使用帮助。

## 背景

对于单个标签，修改起来或许很容易，但是有很多的时候(如下图)就很棘手。所以我想使用一个脚本去解析 `markdown` 文件，然后全量替换。

[![review](https://user-images.githubusercontent.com/32004925/216827139-59ba414c-930e-4697-bc6d-df166c2bde6c.png)](https://github.com/search?q=https%3A%2F%2Fimg.shields.io%2Fgithub%2Fworkflow%2Fstatus%2F\&type=code)

## 实现

我的实现方式是使用 [remarkjs/remark](https://remark.js.org/) 解析 `markdown` 生成 AST，然后 [自定义 plugin](https://github.com/Wxh16144/shields-workflow-badges/blob/0e3aa46d53295b4a391e06c93148ab87c1ed0653/src/replace.ts#L17-L63) 将 URL 进行相对应的转换。

## 效果

<video src="https://user-images.githubusercontent.com/32004925/216828067-524635e8-d50b-47b0-bc52-1a1394c9cdb1.mp4" data-canonical-src="https://user-images.githubusercontent.com/32004925/216828067-524635e8-d50b-47b0-bc52-1a1394c9cdb1.mp4" controls="controls" muted="muted" class="d-block rounded-bottom-2 border-top width-fit" style="max-height:640px; min-height: 200px"></video>

## 缺点

会影响 markdown 文件格式

![review](https://user-images.githubusercontent.com/32004925/216828320-8ae2bfb7-cdb1-43a9-921e-13983966f4e5.png)
