// Update google chrome
// Use npm version 12.0.0

'use strict';

const {Builder, By, Key, until} = require('selenium-webdriver');
const fetch = require("node-fetch");

const hello = async hello => {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
};


const goodTitleWords = [
    'nook',
    'nooks',
    'timmy',
    'tommy',
    'nooklings',
    'cranny',
    'twins',
];

// Finds the title and makes sure there's good words in there and it's over the price of 400
const filterTitle = title => {
    const matches = title.match(/(\d+)/);
    if(matches){
        for(let i = 0; i < goodTitleWords.length; i++){
            if(title.indexOf(goodTitleWords[i]) !== -1 && matches[0] > 300)
                return true;
        }
    }
};

// Check if turnipexchange link is there
const verifyTurnipExchangeLink = selfText => {
    if(selfText.indexOf('turnip.exchange') !== -1){
        // console.log('selfText :', selfText);
        return true;
    }
}

// Get turnipexchange link
const getTurnipExchangeLink = selfTextHTML => {
    let blooky = selfTextHTML;
    let index = selfTextHTML.indexOf('href=\"');
    blooky = blooky.substring(index);
    const matches = blooky.match(/"(.*?)"/);
    console.log(matches ? matches[1]: blooky)
}

fetch("https://api.reddit.com/r/acturnips/new.json?sort=new")
  .then(response => response.json())
  .then(response => {
    for(let i = 0; i< response.data.children.length; i++){
    const data = response.data.children[i].data;
    const title = data.title;
    const selfText = data.selftext;
    const selfTextHTML = data.selftext_html;

    // Filter the name title based on good words
    if(filterTitle(title.toLowerCase())){
        // Filter to see if turnip.exchange link
        if(verifyTurnipExchangeLink(selfText)){
            getTurnipExchangeLink(selfTextHTML);
        } else {
          console.log('no valid turnip link');
        }
    }
    }
  });