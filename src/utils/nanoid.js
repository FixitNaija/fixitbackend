const nanoid = require('nanoid');
const { customAlphabet } = nanoid; 
const alphabet = '0123456789';




const issueID = customAlphabet(alphabet, 4); 


module.exports = issueID;


