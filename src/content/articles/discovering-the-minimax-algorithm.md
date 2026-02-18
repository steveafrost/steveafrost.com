---
title: "Discovering the Minimax Algorithm"
date: 2017-03-05
description: "For the past few weeks I've been trying, failing, and trying again to implement the minimax algorithm into a game of tic-tac-toe that I built using Javascript. Completing the challenge didn't come all at once but rather in pieces: deciding on the approach, understanding the objective of minimax, and implementing the algorithm."
tags:
  - javascript
  - algorithm
  - recursion
---

![algorithm-on-chalk-board](/img/blogs/minimax1.jpg)

For the past few weeks I've been trying, failing, and trying again to implement the [minimax algorithm](http://neverstopbuilding.com/minimax) into a game of tic-tac-toe that I built using Javascript. Completing the challenge didn't come all at once but rather in pieces: deciding on the approach, understanding the objective of minimax, and implementing the algorithm.

### About Minimax

Minimax is a exceptional algorithm for situations when a person needs to make a decision and has all the surrounding, encompassing information regarding all decisions. In relation to games, that matches activities such as chess, checkers, and tic-tic-toe. On the other hand, situations where each person does not have the particulars like scrabble, poker, or blackjack cannot use this minimax algorithm although [there is evidence](https://www.wired.com/2017/02/libratus/) that computers have solved those as well.

### Approach

Previously, I had built a [tic-tac-toe in command-line](https://github.com/steveafrost/tic-tac-toe-rb-q-000) using Ruby. Instead of recycling this code, I wanted to choose a new approach in both language and user interface so as to learn fresh ideas. Instead of command-line, I created a browser interface which you can see below. The interface makes use of a lightweight CSS boilerplate called [Skeleton](http://getskeleton.com/) that I included to give the board & buttons some proper styling and also to make the interface responsive. As far as the building blocks, instead of Ruby, I decided to use Javascript to improve on my skills in this second language. At first I built out the entire program as individual functions as a rough draft to establish a foundation and be able to focus on the algorithm itself. Speaking of minimax...

![tic-tac-toe-ui](/img/blogs/minimax2.jpg)

### Understanding Minimax

When starting on an assignment or project, starting to code immediately always seems appealing but in my experience I've found it is almost always counterproductive. Instead, the most rewarding use of time is reading, writing, doodling, watching videos, or [talking through it](https://blog.codinghorror.com/rubber-duck-problem-solving/) before typing even a single character into a text editor. Typically, there is no lack of programming materials that can help sleuth an issue and I found that to be true of minimax as well. The most helpful pages were [Mostafa Samir's advice](https://mostafa-samir.github.io/) and [Vivek Panyam's pointers](https://blog.vivekpanyam.com/how-to-build-an-ai-that-wins-the-basics-of-minimax-search/). It is helpful that each of these are done in different styles and the former actually inspired me to restructure my code using ES6 classes since Mostafa used prototype in his solution.

After reading these, and several other, posts I also watched a [video on YouTube](https://www.youtube.com/watch?v=aWhb9dr1jNw&t=2098s) and walked through [intro to algorithms](https://app.pluralsight.com/library/courses/algorithmics-introduction/table-of-contents) on PluralSight. Following these, I started to doodle in my random thoughts notebook a few times a week when traveling to and from work on the subway. Needless to say, the rock of the train made for some messy notes. Nevertheless, the doodling was likely the most productive and propelled me into the actual implementation.

Following my research about the algorithm, I realized I had to learn another idea, recursion. Recursion is critical to the minimax algorithm because it handles the logic of iterating over subsequent states of the game being played. The [dictionary definition](http://www.dictionary.com/browse/recursion) of recursion sums it up succinctly: "the process of defining a function or calculating a number by the repeated application of an algorithm."

```javascript
minimax(state) {
  if (currentGame.over(state)) {
    return this.score(state);
  }

  let scores = [];
  let moves = [];
  let availablePositions = currentGame.availableMoves(state);

  let nextStates = availablePositions.map(function(position) {
    return currentAI.nextState(position);
  });

  for(let singleState of nextStates) {
    scores.push(currentAI.minimax(singleState));
  }
}
```

### Implementing the Algorithm

Although it is immensely helpful to read, watch, and write about an idea before starting coding, at some point the building must begin. Based on my notes & doodles, I knew I wanted to implement minimax using two core functions - `minimax()` and `score()`. The first, minimax, would be used to do the actual state generation itself and then recursively pass each state back into minimax. If you've just hesitated and had flashes of `call stack exceeded` or infinite loops - you're right. To avoid these issues, recursive functions must have an exit once a condition is met. Above, you can see `minimax()` exits once the current game has reached an end state whether that be by win, loss, or tie.

```javascript
score(state) {
  if (currentGame.tie(state)) {
    return 0;
  } else if (currentGame.player() === "X") {
    return this.depth - 10;
  } else if (currentGame.player() === "O") {
    return 10 - this.depth;
  }
}
```

Once the terminal state is reached, `score()` then takes that terminal state and gives it a number based on how many moves – what I've been calling depth – and who is the current player. The depth aspect is used to give moves a higher weight which win, lose, or tie in less moves than others and leads to a truly undefeatable AI. This scoring aspect is actually how the algorithm gets it's name. In practice, the recursive algorithm verifies who's turn it is at each step and will take the *maximum* value move as the computer or the *minimum* value move if it is the players turn – hence minimax.

### Celebrate Perseverance

As I stated earlier, this all didn't happen in one iteration. Actually, it didn't happen in two or three either and at one point I even took all the individual functions I had and rewrote them as ES6 classes to take on the code from a different angle. For the harder topics in programming, perseverance is key. Regularly I thought I wasn't going to be able to solve the algorithm as a whole so I broke down what I had into smaller pieces until it made sense. This process of breaking down the daunting picture of recursion and an unfamiliar algorithm into smaller, concise pieces alleviated much of my stress and offered up more chances to celebrate success. Everybody loves celebrations.

![celebration-gif](https://d3vv6lp55qjaqc.cloudfront.net/items/1D0s2i2U1s0v0G1k1J11/Image%202017-03-05%20at%205.26.46%20PM.gif);
