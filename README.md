# helloworld

This repository contains a simple **web-based Love Language Quiz** inspired by the book *The 5 Love Languages*.

## How to Run

Open `index.html` in any modern web browser. The page presents five questions and calculates your primary love language.

For a quick local test, you can run `python3 -m http.server` in this
directory and then open `http://localhost:8000/index.html` in your
browser.

After completing the quiz you will receive a share code which you can copy and send to friends (for example via WeChat) to compare compatibility.

The page stores quiz statistics using `localStorage`, including how many people have taken the test and counts of each top love language.

## Features

- Interactive quiz with five love languages
- One-click copy to share your results (send the code via WeChat)
- Compatibility scoring after entering a friend's share code
- Persistent statistics about quiz results stored in your browser
