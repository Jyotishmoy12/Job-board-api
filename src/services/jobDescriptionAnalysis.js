const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const PorterStemmer = natural.PorterStemmer;
const stemmer = new PorterStemmer();

const analyzeJobDescription = (jobDescription) => {
  const tokens = tokenizer.tokenize(jobDescription);
  const stemmedTokens = tokens.map((token) => stemmer.stem(token));
  const uniqueTokens = [...new Set(stemmedTokens)];
  return uniqueTokens;
};

module.exports = analyzeJobDescription;