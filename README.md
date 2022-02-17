# ![logo](static/logo_icon.png) Poker app built with Svelte

## Technology stack

Introduce and motivate your chosen technology stack, and explain how it contributes to solving the business problem.

### Chosen frameworks

**Svelte**\
Why?

1. **Its the new kid on the block (2016)**\
   With the domination of React, Angular and Vue.js a new challenger has entered the area.
2. **Highest community score of all commonly used javascript frameworks**\
   With only `2%` of votes on a jetbrains community vote on "which JavaScript frameworks do you regularly use", svelte is a very underused framework. (https://www.jetbrains.com/lp/devecosystem-2020/javascript/) Though in a 2020 state of JS survey, it received first place with a `89%`(!) satisfaction, interest, usage and awareness ration ranking. (https://2020.stateofjs.com/en-US/technologies/front-end-frameworks/)
3. **Performance oriented**
   - **No virtual dom**\
      Svelte uses an algorithm to generate native javascript functions that it needs to update the HTML Dom, thus substancially lowering the amount of re-renders performed on the UI.
     (https://svelte.dev/blog/virtual-dom-is-pure-overhead)
   - **True reactivity**\
      Reactivity is not handled via an API, but is built into the language itself and added during compile time. Thus eliminating the need of expensive API calls and the garbage collection which is a result. By simply prepending `$` you can make a statement reactive and svelte will recalculate and rerender state of the app accordingly.
     (https://svelte.dev/blog/svelte-3-rethinking-reactivity)
   - **Lightweight framework size**\
      Svelte out of the box is `4.3kB`, which is very small in comparison to other frameworks like React, which is `128kB` (React + ReactDOM). Because of this, web applications load faster and bandwidth costs are lowered meaning faster page loads and app-like performance for the user.
4. **Easy to understand**
   - **HTML, CSS, JS**\
      Because svelte can be written in plain JavaScript, it has almost no learning curve for someone already familiar with the basics of web development and JavaScript.
   - **Speed up development**\
      The added benefit of svelte's slim learning curve, simplicity of syntax and the skinny amount of code, results in the development cycle speeding up by a fair margin.

- Sveltekit
- SocketIO

### Scalability

Optional section with explanation of how the code is designed with scalability in mind.
More info can be found here:
[https://lib.hva.nl/permalink/31UKB_UAM2_INST/1btjd75/alma9939263288505132
](https://lib.hva.nl/permalink/31UKB_UAM2_INST/1btjd75/alma9939263288505132)

### Privacy

Optional section with explanation of how the code is designed with privacy in mind.
For more info: [https://www.nldigital.nl/news/avg-uitgelegd-deel-3-privacy-by-design-privacy-by-default/](https://www.nldigital.nl/news/avg-uitgelegd-deel-3-privacy-by-design-privacy-by-default/)

## Repository overview

```
│   .env.example
│   .eslintrc.cjs
│   .gitignore
│   .gitlab-ci.yml
│   .prettierrc
│   package-lock.json
│   package.json
│   README.md
│   svelte.config.js
│   tsconfig.json
│   yarn.lock
│
├───src
│   │   app.html
│   │   global.d.ts
│   │
│   └───routes
│       │   index.svelte
│       │
│       ├───about
│       │       [userid].svelte
│       │       _Card.svelte
│       │
│       ├───api
│       │   └───deck
│       │           index.ts
│       │
│       └───poker
│               index.svelte
│
└───static
        .nojekyll
        favicon.png
```

# How to install, configure, run and deploy

To host your own instance of this application follow these steps to setup this project. For this guide you need a (unix) terminal like [CMDer](https://cmder.net/).

1. Pull this repository via `git@gitlab.fdmci.hva.nl:graafft4/pokerapp.git` and navigate to the directory `/PokerApp`
2. Execute `node -v` to check if you have [Node](https://nodejs.org/en/) installed
3. Execute `npm install yarn` to use [Yarn](https://yarnpkg.com/) package manager
4. In the root folder of the project run `yarn install` to install all project dependancies
5. Execute `yarn dev` to start the server in development mode

## More resources

Point interested users to any related literature and/or documentation.
For example this document used these resources:

- [https://tilburgsciencehub.com/building-blocks/store-and-document-your-data/document-data/readme-best-practices/](https://tilburgsciencehub.com/building-blocks/store-and-document-your-data/document-data/readme-best-practices/)
- [https://www.welcometothejungle.com/en/articles/btc-readme-documentation-best-practices](https://www.welcometothejungle.com/en/articles/btc-readme-documentation-best-practices)

## About

Explain who has contributed to the repository. You can say it has been part of a class you've taken at the University of Applied Sciences Amsterdam.

Link to your methods and techniques document: [MT.md](MT.md)

# Moscow tables of user stories

## Must have
| **Player**                                                                                                               | **Table**                                                                                                          | **User**                                                                                                           |
|--------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| When I’m playing, each turn I want to be dealt new cards,  so I can play the game.                                       | When I want to play poker, I want to create a table,  so I can invite people to play with me.                      | When entering the site for the first time,  I want to create an account, so I can participate in a game.           |
| When I’m playing, each turn I want to be able to “check”  my opponents, so I can play the game.                          | When a table is created, I want to be able to find  it in my list of tables, so I can start it at some other time. | When I have created an account, I want to log into my account,  so I can participate in a game.                    |
| When I’m playing, each turn I want to be able to “fold”  to my opponents, so I can play the game.                        | When I want to play with others,  I want to browse online tables, so I can join others.                            | While browsing my profile settings, I want to link my mobile  device to my account, so I can use it during a game. |
| When I’m playing, each turn I want to be able to “raise” my opponents, so I can play the game.                           | When I have created a table, I want to be able to start it,  so I can begin to play.                               |                                                                                                                    |
| When I’m playing, each turn I want to be able to go “all-in”, so  I can play the game.                                   | When I’m in a match, I want to be able to end the table,  so I can stop playing.                                   |                                                                                                                    |
| When I’m playing, I want to be able to see the cards on the table,  so I know what my hand is worth.                     |                                                                                                                    |                                                                                                                    |
| When I’m playing, I want to see the status of each opponent and  the move that they made, so I can play the game.        |                                                                                                                    |                                                                                                                    |
| When I’m playing, I want to see each opponent’s name, so I know  which opponent is which.                                |                                                                                                                    |                                                                                                                    |
| When I’m playing, I want to see each opponent’s profile picture,  so I know which opponent is which.                     |                                                                                                                    |                                                                                                                    |
| When I’m playing, I want to see each opponent’s role  (big /small blind and dealer), so I know in what position I am in. |                                                                                                                    |                                                                                                                    |
| When the round is finished, I want to see who has the winning hand,  so I can see who won the hand                       |                                                                                                                    |                                                                                                                    |
<br />
## Should have
| Player                                                                                            | Table (Match)                                                                                                | User                                                                                                                     |
|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| When I’m playing, I want to see each  opponent's chip amount, so I know how many chips they have. | When I make a table, I want to create and share an invitation, so I can invite other people to play with me. | While browsing my profile settings, I want to be able to upload a profile picture, so I can identify myself to everyone. |
|                                                                                                   | When I have received an invite link, I want to be able  to join a table, so I can play with my friends.      |                                                                                                                          |
<br />

## Could have
| Player | Table (Match)                                                                                         | User |
|--------|-------------------------------------------------------------------------------------------------------|------|
|        | When I want to watch others play, I want to be able to spectate  a table, so I can learn from others. |      |
|        |                                                                                                       |      |
<br />

## Won't have  
| Player | Table (Match) | User |
|--------|---------------|------|
|        |               |      |
|        |               |      |
</br>