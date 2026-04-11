---
title: 一些免費大模型API提供商
description: 推薦一些免費的大模型API提供商
date: 2026-04-11
lastEdited: 2026-04-11
author: Little100
readMinutes: 4
tags: ["推薦", "公益", "免費", "Ai"]
icon: "https://img.little100.cn/i/2026/04/11/10f3zfb-3.svg"
---

如題，最近AI發展迅速，但是有很多人實際上沒有體驗過API調用大模型，或者囊中羞澀，又或者是為了簡單的翻譯不願意花冤枉錢，|{[(那麼往下看就對了)]}|注意：本文中的免費指的是永久免費，不過一切以官方為主，本人不負任何責任|

> 首先，你需要了解各大廠家的調用方式比如openai格式、gemini格式、anthropic協議等等，本文不會提供任何教程，請自行詢問AI，|{[(文中會出現類似RPM,RPD,TPM等詞彙，已經標註在批註當中)]}|解釋：RPM 全稱 Requests Per Minute，指的是每分鐘能請求的次數

RPD 全稱 Requests Per Day，指的是每天能請求的次數

TPM 全稱 Tokens Per Minute，指的是每分鐘能使用的token數量|

# 1. |{[(谷歌AI Studio)]}|谷歌可以說是真的大善人了，註冊賬號可以直接去[gemini網頁端](https://gemini.google.com/)去體驗，並且給free tier的用戶可以用[antigravity](https://antigravity.google/)，額度沒有標註，不過據說是"慷慨的配額"|

 - |{[(首先你需要進入[aistudio](https://aistudio.google.com/)，登陸你的谷歌賬號)]}|在大陸你必須要有魔法才可以訪問谷歌，但是本文不會介紹任何魔法工具，請自行尋路他人|，然後進入到[projects](https://aistudio.google.com/projects)內點擊創建新項目，隨便命名，然後點擊創建項目，緊接著進入[apikey頁面](https://aistudio.google.com/api-keys)，點擊創建API密鑰，創建密鑰，一切完成之後複製你的API密鑰，然後就可以去使用了，注意使用gemini格式調用，每日限額可以[點擊查看](https://aistudio.google.com/rate-limit)，當然下面也會給出截至當前可用免費模型，
 
<question collapsible:close title:速率限制(部分模型)>
| 模型名稱                                     | 類別       | RPM / RPD      | TPM    |
| ---------------------------------------- | -------- | -------------- | ------ |
| Gemini Embedding 1                       | Embedding     | **100** / 1K   | 30K    |
| Gemini Embedding 2                       | Embedding     | **100** / 1K   | 30K    |
| Gemma 3 1B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 2B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 4B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 12B                              | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 27B                              | LLM     | **30** / 14.4K | 15K    |
| Gemini 3.1 Flash Lite                    | LLM   | **15** / 500   | 250K   |
| Gemma 4 26B                              | LLM     | **15** / 1.5K  | 無限制    |
| Gemma 4 31B                              | LLM     | **15** / 1.5K  | 無限制    |
| Gemini 2.5 Flash Lite                    | LLM   | **10** / 20    | 250K   |
| Gemini 2.5 Flash                         | LLM   | **5** / 20     | 250K   |
| Gemini 3 Flash                           | LLM   | **5** / 20     | 250K   |
</question>

~~如果你覺得不夠用，可以創建多個項目，每一個項目都可以創建一個API密鑰，不過封號概不負責~~

# 2. 美團的LongCat

 - 美團自己的龍貓模型，目前提供了免費的每日額度，沒有實際說是永久免費還是啥
<question collapsible:close title:官網原話>
### 每日免費額度
 - 每個賬號每天自動獲得 500,000 Tokens 免費額度，可用於LongCat-Flash-Chat、LongCat-Flash-Thinking、LongCat-Flash-Thinking-2601、LongCat-Flash-Omni-2603 和 LongCat-Flash-Chat-2602-Exp；
 - LongCat-Flash-Lite 模型，每個賬號每天自動獲得 50,000,000 Tokens 免費額度
 - 免費額度將於每日凌晨（北京時間）自動刷新
 - 前一天未使用完的額度將清零，不會累積到下一天
### 免費額度提升方式
 - 申請額度提升前，請確保您已[創建 API Key](https://longcat.chat/platform/api_keys)。
 - 前往[用量信息](https://longcat.chat/platform/usage) 頁面申請提升免費Tokens配額，審核通過後免費額度將提升至 5,000,000 Tokens/天。（註：此提額申請僅適用於LongCat-Flash-Chat、 LongCat-Flash-Thinking、LongCat-Flash-Thinking-2601、LongCat-Flash-Omni-2603及LongCat-Flash-Chat-2602-Exp模型，LongCat-Flash-Lite 模型不參與提額）
 - 如需更多額度，請通過e-mail聯繫longcat-team@meituan.com 。請在郵件中提供您賬號下的任意一個 API Key，以便我們快速為您處理。
</question>

 - 我自己沒有實際用過除了LongCat-Flash-Lite以外的模型，所以不對其他模型進行評價，這裡我主要說明如何配置沉浸式翻譯，我個人認為這個模型比glm4flash要強一點，並且每天5千萬的token也幾乎是用不完(翻譯方面)
   - 首先你需要下載[沉浸式翻譯](https://immersivetranslate.com/)這個插件，然後打開[配置頁面](extension://amkbmndfnliijdhojkpoglbnaaahippg/options.html#services)，點擊右上角的添加自定義翻譯服務，點擊自定義或者openai，然後啟用擬新增的服務，在右側中填入你自己的[apikey](https://longcat.chat/platform/api_keys)，模型這裡首先勾選"輸入自定義模型名稱"，然後輸入LongCat-Flash-Lite，找到"自定義 API 接口地址"這裡，輸入"https://api.openai.com/v1/chat/completions" ，下面的每秒最大請求數等我也不知道應該填寫多少，但是我的填寫是每秒最大次數200，最大文本長度16384，請求最大段落4，開啟富文本翻譯是沒有問題的，緊接著點擊設為默認就可以享受了

# 3. 智譜

智譜的話，是國內比較有名的了，哦不對我介紹這個幹什麼，總之來自智譜的flash後綴的模型均免費
首先你需要|{[([註冊一個賬號](https://bigmodel.cn/))]}|然後會送你好像是3千萬token，可以調用其他更強的模型，我記得有效期應該是三個月|，不過我這裡僅介紹純免費的模型，創建完畢之後，進入[apikey](https://bigmodel.cn/apikey/platform)創建一個新的key，緊接著就可以調用了，這裡可以前往[速率限制](https://bigmodel.cn/usercenter/proj-mgmt/rate-limits)查看速率限制，當然我這裡也總和了一份(官網沒有給更多類似RPM,RDP,TPM等限制信息，應該是沒有這些限制僅並發限制)
<question collapsible:close title:速率限制>

> 參數說明：Z1、thinking是思考模型，帶V的是視覺模型，純數字的是純文本模型，glm4flash的200並發是有限制的 官網原話"為了確保GLM-4-Flash在免費調用期間的服務穩定性，當請求的上下文超過8K時，系統將限制並發為標準速率的1%。"

| 模型名稱                    | 並發限制 |
| ----------------------- | ---- |
| GLM-4-Flash             | 200  |
| GLM-Z1-Flash            | 30   |
| GLM-4V-Flash            | 10   |
| GLM-4.1V-Thinking-Flash | 5    |
| GLM-4.5-Flash           | 2    |
| GLM-4.7-Flash           | 1    |
| GLM-4.6V-Flash          | 1    |

</question>

# 當然，肯定會有更多其他的模型提供商是免費的，不過我目前想不到有哪些是比較穩定的，如果知道可以從評論中留言，我會及時添加，如果沒有添加可以發送我郵件 2662308929@qq.com。
