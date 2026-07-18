---
layout: post
kicker: Project
title: "5toguess"
date: 2025-07-01
tags: [Game, AI, Side Project]
permalink: /projects/5toguess/
---

[5toguess](https://5toguess.com) is a daily word-guessing game: one hidden word, five image clues, five guesses. Every clue is connected to the word, but you start with just one. Each incorrect guess reveals the next clue — and if you're stuck, you can reveal one manually at the cost of a guess. So every round is the same little dilemma: commit to a guess off the first cryptic image for the glory, or trade attempts for information and play it safe. There's a new game every day.

<video src="/assets/images/projects/5toguess-tutorial.webm" autoplay loop muted playsinline></video>

*(how a round plays out)*

The fun part under the hood is that the games make themselves: an AI agent comes up with the word and generates the five images, and a separate AI bot then plays each game blind to validate that the difficulty actually lands before it's shown to humans. Developed together with my friend [Petr Kaplunovich](https://x.com/petrkaplunovich) as a fun project, we wanted to see how far AI self-play could go, and we quite liked the results.

Try [today's game](https://5toguess.com) — five guesses, no pressure.
