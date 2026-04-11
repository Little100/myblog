---
title: 一些免费大模型api提供商
description: 推荐一些免费的大模型api提供商
date: 2026-04-11
lastEdited: 2026-04-11
author: Little100
readMinutes: 4
tags: ["推荐", "公益", "免费", "Ai"]
icon: "https://img.little100.cn/i/2026/04/11/10f3zfb-3.svg"
---
如题, 最近ai发展迅速, 但是有很多人实际上没有体验过api调用大模型, 或者囊中羞涩, 又或者是为了简单的翻译不愿意花冤枉钱, |{[(那么往下看就对了)]}|注意: 本文中的免费指的是永久免费, 不过一切以官方为主, 本人不负任何责任|

> 首先, 你需要了解各大厂家的调用方式比如openai格式, gemini格式, anthropic协议等等, 本文不会提供任何教程, 请自行询问ai, |{[(文中会出现类似RPM,RPD,TPM等词汇, 已经标注在批注当中)]}|解释: RPM 全称 Requests Per Minute, 指的是每分钟能请求的次数

RPD 全称 Requests Per Day, 指的是每天能请求的次数

TPM 全称 Tokens Per Minute, 指的是每分钟能使用的token数量|

# 1. |{[(谷歌Ai studio)]}|谷歌可以说是真的大善人了, 注册账号可以直接去[gemini网页端](https://gemini.google.com/)去体验, 并且给free tier的用户可以用[antigravity](https://antigravity.google/), 额度没有标注, 不过据说是"慷慨的配额"|

 - |{[(首先你需要进入[aistudio](https://aistudio.google.com/), 登陆你的谷歌账号)]}|在大陆你必须要有魔法才可以访问谷歌, 但是本文不会介绍任何魔法工具, 请自行寻路他人|,然后进入到[projects](https://aistudio.google.com/projects)内点击创建新项目, 随便命名, 然后点击创建项目, 紧接着进入[apikey页面](https://aistudio.google.com/api-keys), 点击创建api密钥, 创建密钥, 一切完成之后复制你的api密钥, 然后就可以去使用了, 注意使用gemini格式调用, 每日限额可以[点击查看](https://aistudio.google.com/rate-limit), 当然下面也会给出截至当前可用免费模型, 
 
<question collapsible:close title:速率限制(部分模型)>
| 模型名称                                     | 类别       | RPM / RPD      | TPM    |
| ---------------------------------------- | -------- | -------------- | ------ |
| Gemini Embedding 1                       | Embedding     | **100** / 1K   | 30K    |
| Gemini Embedding 2                       | Embedding     | **100** / 1K   | 30K    |
| Gemma 3 1B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 2B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 4B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 12B                              | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 27B                              | LLM     | **30** / 14.4K | 15K    |
| Gemini 3.1 Flash Lite                    | LLM   | **15** / 500   | 250K   |
| Gemma 4 26B                              | LLM     | **15** / 1.5K  | 无限制    |
| Gemma 4 31B                              | LLM     | **15** / 1.5K  | 无限制    |
| Gemini 2.5 Flash Lite                    | LLM   | **10** / 20    | 250K   |
| Gemini 2.5 Flash                         | LLM   | **5** / 20     | 250K   |
| Gemini 3 Flash                           | LLM   | **5** / 20     | 250K   |
</question>

~~如果你觉得不够用, 可以创建多个项目, 每一个项目都可以创建一个api密钥, 不过封号概不负责~~

# 2. 美团的LongCat

 - 美团自己的龙猫模型, 目前提供了免费的每日额度, 没有实际说是永久免费还是啥
<question collapsible:close title:官网原话>
### 每日免费额度
 - 每个账号每天自动获得 500,000 Tokens 免费额度，可用于LongCat-Flash-Chat、LongCat-Flash-Thinking、LongCat-Flash-Thinking-2601、LongCat-Flash-Omni-2603 和 LongCat-Flash-Chat-2602-Exp；
 - LongCat-Flash-Lite 模型，每个账号每天自动获得 50,000,000 Tokens 免费额度
 - 免费额度将于每日凌晨（北京时间）自动刷新
 - 前一天未使用完的额度将清零，不会累积到下一天
### 免费额度提升方式
 - 申请额度提升前，请确保您已[创建 API Key](https://longcat.chat/platform/api_keys)。
 - 前往[用量信息](https://longcat.chat/platform/usage) 页面申请提升免费Tokens配额，审核通过后免费额度将提升至 5,000,000 Tokens/天。（注：此提额申请仅适用于LongCat-Flash-Chat、 LongCat-Flash-Thinking、LongCat-Flash-Thinking-2601、LongCat-Flash-Omni-2603及LongCat-Flash-Chat-2602-Exp模型，LongCat-Flash-Lite 模型不参与提额）
 - 如需更多额度，请通过e-mail联系longcat-team@meituan.com 。请在邮件中提供您账号下的任意一个 API Key，以便我们快速为您处理。
</question>

 - 我自己没有实际用过除了LongCat-Flash-Lite以外的模型, 所以不对其他模型进行评价, 这里我主要说明如何配置沉浸式翻译, 我个人认为这个模型比glm4flash要强一点, 并且每天5千万的token也几乎是用不完(翻译方面)
   - 首先你需要下载[沉浸式翻译](https://immersivetranslate.com/)这个插件, 然后打开[配置页面](extension://amkbmndfnliijdhojkpoglbnaaahippg/options.html#services), 点击右上角的添加自定义翻译服务, 点击自定义或者openai, 然后启用拟新增的服务, 在右侧中填入你自己的[apikey](https://longcat.chat/platform/api_keys), 模型这里首先勾选"输入自定义模型名称", 然后输入LongCat-Flash-Lite, 找到"自定义 API 接口地址"这里, 输入"https://api.openai.com/v1/chat/completions", 下面的每秒最大请求数等我也不知道应该填写多少, 但是我的填写是每秒最大次数200, 最大文本长度16384, 请求最大段落4, 开启富文本翻译是没有问题的, 紧接着点击设为默认就可以享受了

# 3. 智普

智普的话, 是国内比较有名的了, 哦不对我介绍这个干什么, 总之来自智普的flash后缀的模型均免费
首先你需要|{[([注册一个账号](https://bigmodel.cn/))]}|然后会送你好像是3千万token, 可以调用其他更强的模型, 我记得有效期应该是三个月|, 不过我这里仅介绍纯免费的模型, 创建完毕之后, 进入[apikey](https://bigmodel.cn/apikey/platform)创建一个新的key, 紧接着就可以调用了, 这里可以前往[速率限制](https://bigmodel.cn/usercenter/proj-mgmt/rate-limits)查看速率限制, 当然我这里也总和了一份(官网没有给更多类似RPM,RDP,TPM等限制信息, 应该是没有这些限制仅并发限制)
<question collapsible:close title:速率限制>

> 参数说明: Z1, thinking是思考模型, 带V的是视觉模型, 纯数字的是纯文本模型, glm4flash的200并发是有限制的 官网原话"为了确保GLM-4-Flash在免费调用期间的服务稳定性，当请求的上下文超过8K时，系统将限制并发为标准速率的1%。"

| 模型名称                    | 并发限制 |
| ----------------------- | ---- |
| GLM-4-Flash             | 200  |
| GLM-Z1-Flash            | 30   |
| GLM-4V-Flash            | 10   |
| GLM-4.1V-Thinking-Flash | 5    |
| GLM-4.5-Flash           | 2    |
| GLM-4.7-Flash           | 1    |
| GLM-4.6V-Flash          | 1    |

</question>

# 当然, 肯定会有更多其他的模型提供商是免费的, 不过我目前想不到有哪些是比较稳定的, 如果知道可以从评论中留言, 我会及时添加, 如果没有添加可以发送我邮件 2662308929@qq.com.