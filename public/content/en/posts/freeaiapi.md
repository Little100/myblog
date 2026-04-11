---
title: Some Free Large Language Model API Providers
description: Recommendations for free large language model API providers
date: 2026-04-11
lastEdited: 2026-04-11
author: Little100
readMinutes: 4
tags: ["Recommendation", "Public Welfare", "Free", "AI"]
icon: "https://img.little100.cn/i/2026/04/11/10f3zfb-3.svg"
---

As mentioned in the title, AI is developing rapidly these days, but many people have never actually experienced calling a large language model via API, or lack the funds, or are unwilling to spend money just for simple translation tasks. |{[(So read on for more details)]}|Note: The "free" mentioned in this article refers to permanently free services. However, always refer to official sources, and I take no responsibility for any issues.|

> First, you need to understand the calling methods of various manufacturers, such as OpenAI format, Gemini format, Anthropic protocol, etc. This article will not provide any tutorials - please ask an AI for help. |{[(You will encounter terms like RPM, RPD, TPM in this article, which are annotated in the comments)]}|Explanation: RPM stands for Requests Per Minute, referring to the number of requests you can make per minute.

RPD stands for Requests Per Day, referring to the number of requests you can make per day.

TPM stands for Tokens Per Minute, referring to the number of tokens you can use per minute.|

# 1. |{[(Google AI Studio)]}|Google is truly philanthropic. You can register an account and directly experience the [Gemini web interface](https://gemini.google.com/), and free tier users can use [antigravity](https://antigravity.google/). The quota is not specified, but it's said to be a "generous quota".|

 - |{[(First you need to go to [AI Studio](https://aistudio.google.com/), log in with your Google account)]}|In mainland China you must have a VPN to access Google, but this article does not cover any VPN tools, please find your own way|, then enter [projects](https://aistudio.google.com/projects) and click to create a new project, name it anything, then click create project. Next, go to the [API key page](https://aistudio.google.com/api-keys), click to create an API key, and create it. After everything is done, copy your API key and you're ready to use it. Note that you should use the Gemini format for calling. You can [check the daily quota here](https://aistudio.google.com/rate-limit). Of course, below I've also listed the currently available free models.
 
<question collapsible:close title:Rate Limits (Some Models)>
| Model Name                                     | Category       | RPM / RPD      | TPM    |
| ---------------------------------------- | -------- | -------------- | ------ |
| Gemini Embedding 1                       | Embedding     | **100** / 1K   | 30K    |
| Gemini Embedding 2                       | Embedding     | **100** / 1K   | 30K    |
| Gemma 3 1B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 2B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 4B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 12B                              | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 27B                              | LLM     | **30** / 14.4K | 15K    |
| Gemini 3.1 Flash Lite                    | LLM   | **15** / 500   | 250K   |
| Gemma 4 26B                              | LLM     | **15** / 1.5K  | Unlimited    |
| Gemma 4 31B                              | LLM     | **15** / 1.5K  | Unlimited    |
| Gemini 2.5 Flash Lite                    | LLM   | **10** / 20    | 250K   |
| Gemini 2.5 Flash                         | LLM   | **5** / 20     | 250K   |
| Gemini 3 Flash                           | LLM   | **5** / 20     | 250K   |
</question>

~~If you feel it's not enough, you can create multiple projects, each can have an API key, but I'm not responsible for account bans~~

# 2. Meituan's LongCat

 - Meituan's own LongCat model, currently providing free daily quotas, though it's not explicitly stated whether it's permanently free or something else.
<question collapsible:close title:Official Statement>
### Daily Free Quota
 - Each account automatically receives 500,000 Tokens free quota per day, applicable to LongCat-Flash-Chat, LongCat-Flash-Thinking, LongCat-Flash-Thinking-2601, LongCat-Flash-Omni-2603, and LongCat-Flash-Chat-2602-Exp;
 - LongCat-Flash-Lite model, each account automatically receives 50,000,000 Tokens free quota per day
 - The free quota will be automatically refreshed every day at midnight (Beijing Time)
 - Unused quota from the previous day will be reset to zero and will not accumulate to the next day
### How to Increase Free Quota
 - Before applying for quota increase, please ensure you have [created an API Key](https://longcat.chat/platform/api_keys).
 - Go to the [Usage Information](https://longcat.chat/platform/usage) page to apply for increased free Tokens quota. After approval, your free quota will be increased to 5,000,000 Tokens/day. (Note: This quota increase request only applies to LongCat-Flash-Chat, LongCat-Flash-Thinking, LongCat-Flash-Thinking-2601, LongCat-Flash-Omni-2603, and LongCat-Flash-Chat-2602-Exp models. LongCat-Flash-Lite does not participate in quota increases)
 - For more quota, please contact longcat-team@meituan.com by email. Please provide any API Key under your account so we can process it quickly.
</question>

 - I haven't actually used models other than LongCat-Flash-Lite, so I won't comment on other models. Here I mainly explain how to configure Immersive Translate. I personally think this model is slightly stronger than GLM-4-Flash, and with 50 million tokens per day, it's almost impossible to exhaust (for translation purposes).
   - First you need to download the [Immersive Translate](https://immersivetranslate.com/) extension, then open the [configuration page](extension://amkbmndfnliijdhojkpoglbnaaahippg/options.html#services), click "Add Custom Translation Service" in the top-right corner, click "Custom" or "OpenAI", then enable the newly created service. Fill in your own [API key](https://longcat.chat/platform/api_keys) on the right side. For the model, first check "Enter custom model name", then enter LongCat-Flash-Lite. Find the "Custom API Endpoint URL" field and enter "https://api.openai.com/v1/chat/completions". As for the maximum requests per second below, I'm not sure what values to set, but my settings are: maximum 200 requests per second, maximum text length 16384, maximum request paragraphs 4. Enabling rich text translation is fine. Then click "Set as Default" and you can start using it.

# 3. Zhipu

Zhipu is quite well-known domestically. Anyway, all models from Zhipu with the "flash" suffix are free.
First you need to |{[([register an account](https://bigmodel.cn/))]}|and you'll get what seems to be 30 million tokens, which you can use to call other more powerful models. I think the validity period is about three months|, but here I only introduce purely free models. After creating the account, go to [API key](https://bigmodel.cn/apikey/platform) to create a new key, and then you can start calling. You can go to [Rate Limits](https://bigmodel.cn/usercenter/proj-mgmt/rate-limits) to check the rate limits. Of course, I've also compiled a list here (the official website doesn't provide more information like RPM, RDP, TPM limits, it seems there are only concurrency limits).
<question collapsible:close title:Rate Limits>

> Parameter explanation: Z1 and thinking are thinking models, those with V are vision models, pure numbers are pure text models. GLM-4-Flash's concurrency of 200 has limitations. Official statement: "To ensure the stability of GLM-4-Flash during the free calling period, when the request context exceeds 8K, the system will limit concurrency to 1% of the standard rate."

| Model Name                    | Concurrency Limit |
| ----------------------- | ---- |
| GLM-4-Flash             | 200  |
| GLM-Z1-Flash            | 30   |
| GLM-4V-Flash            | 10   |
| GLM-4.1V-Thinking-Flash | 5    |
| GLM-4.5-Flash           | 2    |
| GLM-4.7-Flash           | 1    |
| GLM-4.6V-Flash          | 1    |

</question>

# Of course, there are bound to be more other model providers that are free, but I currently can't think of any that are particularly stable. If you know of any, please leave a comment and I'll add them promptly. If I haven't added them, you can email me at 2662308929@qq.com.
