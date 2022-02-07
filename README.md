# Poker app built with Svelte

## Technology stack

Introduce and motivate your chosen technology stack, and explain how it contributes to solving the business problem.

###  Chosen frameworks

- Svelte
- Sveltekit
- SocketIO


Summarize your justification of chosen frameworks concisely. Make use of subheaders where appropriate. 

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