---
layout: post
kicker: Project
title: "arXivBot"
date: 2026-07-17
tags: [LLM, Side Project]
permalink: /projects/arxivbot/
---

For the past few years, my every day at work has started with the same ritual. I open [arXiv’s Computer Vision page](https://arxiv.org/list/cs.CV/recent) and go over the new papers that came out that day. Sometimes researchers are merciful, and there are “only” 50 or 100 new papers that day. But once in a while, there are days with 300+ new papers. I obviously don’t read each one of them. I just skim through the titles and open the ones that sound relevant to my research interests or catch my attention otherwise. This ritual has become so embedded in my everyday life that I feel an itch if I don’t do it, and I haven’t skipped a day, even during vacations. Think of it as OCD or a habit, but I do believe it’s been helping me with work. However, it’s also taking up to 20 to 30 minutes every day, and scrolling through hundreds of titles trying to figure out if they are relevant can sometimes be tiresome.

![arxivbot scanning a typical morning on cs.CV](/assets/images/blog/arxiv-flood.png)

*(my internal classifier’s output every morning)*

A while back, I thought: what if I could just ask an LLM bot to find the relevant papers for me? Can I just give it my interests and ask it to check every paper one by one every day? In the end [Language Models are Few-Shot Learners](https://arxiv.org/pdf/2005.14165), right? I figured that Gemini has a pretty generous free daily token allowance, so I wrote a simple parser that would go over every paper on arXiv that came out that day, send it to the Gemini API along with my research interests, and ask a simple question: is this paper relevant? After that, the bot aggregated summaries for all the relevant papers into a single email and sent it to me in the morning. And believe it or not, I wrote the code for that bot myself (crazy times!). This was a couple of years ago, and it used one of the early Gemini Flash versions. While the bot kind of worked, it wasn’t perfect. It would often skip relevant papers while being too loose with many irrelevant ones, so over time I just went back to checking the papers myself.

Recently, I thought it was probably time to revisit this, and I asked Fable to completely overhaul the code, as well as upgrade it to the latest Gemini model. And guess what? It works a lot better now. I’ve been testing it for the past couple of weeks, and while it’s still a bit too loose (as are my research interests, to be fair), it hasn’t skipped a single relevant paper and reduces the number of paper titles and abstracts I need to look at by ~80%, giving me more time to focus on the actual content of the papers.

The nice part about the bot is that it’s completely free to run, as long as you have a computer that can run a cron job. The Gemini API and the email service both work on their free tiers, and that’s enough. The code is on [GitHub](https://github.com/vaheta/arxivbot) — enjoy using it!
