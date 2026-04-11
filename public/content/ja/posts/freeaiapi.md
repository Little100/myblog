---
title: いくつかの無料大規模言語モデルAPIプロバイダー
description: 無料の大規模言語モデルAPIプロバイダーの推奨
date: 2026-04-11
lastEdited: 2026-04-11
author: Little100
readMinutes: 4
tags: ["推奨", "公益", "無料", "AI"]
icon: "https://img.little100.cn/i/2026/04/11/10f3zfb-3.svg"
---

タイトルの通り、最近AIが急速に発展していますが、実際にはAPIを通じて大規模言語モデルを呼び出したことがない人が多くいます。または経済的に苦しい、あるいは簡単な翻訳のためにお金を無駄に使いたくない人もいるでしょう。|{[(だから以下を読んでください)]}|注意：この記事で「無料」とは永久に無料であることを指しています。ただし、常に公式情報を参照してください。私は一切の責任を負いません。|

> まず、OpenAI形式、Gemini形式、Anthropicプロトコルなど、各メーカーの呼び出し方法を理解する必要があります。この記事はいかなるチュートリアルも提供しません。AIに自分で質問してください。|{[(この記事にはRPM、RPD、TPMなどの用語が登場し、批注に記載されています)]}|説明：RPMはRequests Per Minuteの略で、1分間にリクエストできる回数を指します。

RPDはRequests Per Dayの略で、1日にリクエストできる回数を指します。

TPMはTokens Per Minuteの略で、1分間に使用できるトークン数を指します。|

# 1. |{[(Google AI Studio)]}|Googleは本当に親切です。アカウントを登録して、直接[Geminiウェブインターフェース](https://gemini.google.com/)で試すことができます。また、フリーティアユーザーは[antigravity](https://antigravity.google/)を使用できます。クォータは明記されていませんが、「寛大なクォータ」と言われています。|

 - |{[(まず[AI Studio](https://aistudio.google.com/)に進み、Googleアカウントでログインする必要があります)]}|中大陸中国ではGoogleにアクセスするためにVPNが必要ですが、この記事ではVPNツールについて説明しません。自分で見つけてください|。その後、[projects](https://aistudio.google.com/projects)に進み、新しいプロジェクトを作成し、名前を付けてから、プロジェクト作成をクリックしてください。その後、[APIキーページ](https://aistudio.google.com/api-keys)に進み、APIキーを作成してください。すべてが完了したら、APIキーをコピーして使用できます。Gemini形式で呼び出すことに注意してください。[ここで毎日のクォータを確認できます](https://aistudio.google.com/rate-limit)。もちろん、以下には現在利用可能な無料モデルもリストアップしています。
 
<question collapsible:close title:レート制限（一部モデル）>
| モデル名                                     | カテゴリ       | RPM / RPD      | TPM    |
| ---------------------------------------- | -------- | -------------- | ------ |
| Gemini Embedding 1                       | Embedding     | **100** / 1K   | 30K    |
| Gemini Embedding 2                       | Embedding     | **100** / 1K   | 30K    |
| Gemma 3 1B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 2B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 4B                               | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 12B                              | LLM     | **30** / 14.4K | 15K    |
| Gemma 3 27B                              | LLM     | **30** / 14.4K | 15K    |
| Gemini 3.1 Flash Lite                    | LLM   | **15** / 500   | 250K   |
| Gemma 4 26B                              | LLM     | **15** / 1.5K  | 無制限    |
| Gemma 4 31B                              | LLM     | **15** / 1.5K  | 無制限    |
| Gemini 2.5 Flash Lite                    | LLM   | **10** / 20    | 250K   |
| Gemini 2.5 Flash                         | LLM   | **5** / 20     | 250K   |
| Gemini 3 Flash                           | LLM   | **5** / 20     | 250K   |
</question>

~~十分でないと思ったら、複数のプロジェクトを作成できます。各プロジェクトはAPIキーを作成できますが、アカウント停止については責任を負いません~~

# 2. Meituan（美団）のLongCat

 - Meituanの独自のLongCatモデル。現在のところ無料の毎日のクォータを提供していますが、永久に無料かどうかは明確に述べられていません。
<question collapsible:close title:公式声明>
### 毎日の無料クォータ
 - 各アカウントは毎日自動的に500,000トークンの無料クォータを取得でき、LongCat-Flash-Chat、LongCat-Flash-Thinking、LongCat-Flash-Thinking-2601、LongCat-Flash-Omni-2603、およびLongCat-Flash-Chat-2602-Expに適用できます。
 - LongCat-Flash-Liteモデルの場合、各アカウントは毎日自動的に50,000,000トークンの無料クォータを取得します
 - 無料クォータは毎日午前0時（北京時間）に自動的にリセットされます
 - 前日に使用されなかったクォータはゼロにリセットされ、翌日に累積されません
### 無料クォータを増やす方法
 - クォータ増に申請する前に、[APIキーを作成](https://longcat.chat/platform/api_keys)していることを確認してください。
 - [使用情報](https://longcat.chat/platform/usage)ページにアクセスして、無料トークンクォータの増加を申請してください。承認された後、無料クォータは5,000,000トークン/日に増加します。（注：このクォータ増申請はLongCat-Flash-Chat、LongCat-Flash-Thinking、LongCat-Flash-Thinking-2601、LongCat-Flash-Omni-2603、およびLongCat-Flash-Chat-2602-Expモデルにのみ適用されます。LongCat-Flash-Liteはクォータ増に参加しません）
 - さらにクォータが必要な場合は、longcat-team@meituan.comにメールでお問い合わせください。アカウント内の任意のAPIキーを提供していただければ、迅速に対応させていただきます。
</question>

 - 私自身、LongCat-Flash-Lite以外のモデルを実際に使用していないため、他のモデルについてはコメントしません。ここでは主にImmersive Translateの設定方法について説明します。個人的には、このモデルはGLM-4-Flashより少し強いと考えており、毎日5000万トークンあれば、（翻訳の目的では）ほぼ使い尽くすことは不可能です。
   - まず[Immersive Translate](https://immersivetranslate.com/)拡張機能をダウンロードする必要があります。その後、[設定ページ](extension://amkbmndfnliijdhojkpoglbnaaahippg/options.html#services)を開き、右上角の「カスタム翻訳サービスを追加」をクリックし、「カスタム」または「OpenAI」をクリックしてから、新たに作成したサービスを有効にします。右側に自分の[APIキー](https://longcat.chat/platform/api_keys)を入力します。モデルについては、まず「カスタムモデル名を入力」をチェックしてから、LongCat-Flash-Liteを入力します。「カスタムAPIエンドポイントURL」フィールドを見つけて、"https://api.openai.com/v1/chat/completions" を入力します。以下の1秒あたりの最大リクエスト数などについては、何を設定すべきか確かではありませんが、私の設定は：1秒あたりの最大200リクエスト、最大テキスト長16384、最大リクエスト段落4です。リッチテキスト翻訳を有効にしても問題ありません。その後、「デフォルトに設定」をクリックすると、使用を開始できます。

# 3. Zhipu（智谱）

Zhipuは国内ではよく知られています。とにかく、Zhipuの「flash」接尾辞が付いたすべてのモデルは無料です。
まず|{[([アカウントを登録](https://bigmodel.cn/))]}|する必要があります。3000万トークンを取得でき、他のより強力なモデルを呼び出すために使用できます。有効期間は約3か月だと思います|。しかし、ここでは純粋に無料のモデルのみについて説明します。アカウントを作成した後、[APIキー](https://bigmodel.cn/apikey/platform)に進み、新しいキーを作成してから、呼び出しを開始できます。[レート制限](https://bigmodel.cn/usercenter/proj-mgmt/rate-limits)にアクセスしてレート制限を確認できます。もちろん、ここでもリストをまとめました（公式ウェブサイトではRPM、RDP、TPMなどの制限に関する情報を提供していないため、同時実行制限のみがあるようです）。
<question collapsible:close title:レート制限>

> パラメータの説明：Z1とthinkingは思考モデルで、Vが付いているのはビジョンモデル、純粋な数字はテキストのみのモデルです。GLM-4-Flashの同時実行200には制限があります。公式声明：「無料呼び出し期间中のGLM-4-Flashのサービス安定性を確保するため、リクエストコンテキストが8Kを超える場合、システムは同時実行を標準レートの1%に制限します。」

| モデル名                    | 同時実行制限 |
| ----------------------- | ---- |
| GLM-4-Flash             | 200  |
| GLM-Z1-Flash            | 30   |
| GLM-4V-Flash            | 10   |
| GLM-4.1V-Thinking-Flash | 5    |
| GLM-4.5-Flash           | 2    |
| GLM-4.7-Flash           | 1    |
| GLM-4.6V-Flash          | 1    |

</question>

# もちろん、無料の他のモデルプロバイダーがもっと多くあるはずですが、現在のところ、特に安定しているものについては思い当たりません。知っていることがあれば、コメントで教えてください。迅速に追加します。追加していない場合は、メール2662308929@qq.comに送ってください。
