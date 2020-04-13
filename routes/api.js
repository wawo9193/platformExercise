
// ******************************************* List of all functionalities *******************************************

/* 
 * `POST /words.json`: Takes a JSON array of English-language words and adds them to the corpus (data store).
 *
 * `GET /anagrams/:word.json`:
 *      - Returns a JSON array of English-language words that are anagrams of the word passed in the URL.
 *      - This endpoint should support an optional query param that indicates the maximum number of results to return.
 * 
 * `DELETE /words/:word.json`: Deletes a single word from the data store.
 * 
 * `DELETE /words.json`: Deletes all contents of the data store.
 * 
 * `GET /words.json`: Endpoint that returns a count of words in the corpus and min/max/median/average word length
 *      - using unit test `test_words_info`
 * 
 * `GET /anagrams/:word.json?proper=`bool`: Respect a query param for whether or not to include proper nouns in the list of anagrams
 *      - using unit test `propernoun_test`
 */

// *******************************************************************************************************************


const router = require('express').Router();
var local_store = []; // Storing the results locally
// const fs = require('fs');
// var entire_dict = {};

function sort_Str(str) {
    return str.split('').sort().join('');
}

// toLower, sort, then check for equivalency (anagram checker)
function is_Ana(str1,str2) {
    str1=str1.toLowerCase();
    str2=str2.toLowerCase();

    return sort_Str(str1) === sort_Str(str2);
}

// Checks if the flag is set to only proper nouns and if the string is proper or not
function is_Proper_Check(str,proper) {
    if (proper) {
        return (str[0]>='A' && str[0]<='Z') ? true : false;
    } else {
        return true;
    }
}

// If we want to read in the entire dictionary and store it locally

// fs.readFile(__dirname + '/../dictionary.txt', (err, data) => { 
//     if (err) throw err; 
//     let all = data.toString().split(/\n/);

//     for (var i=0; i<all.length; i++){
//         local_store.push(all[i]);
//     }
//     entire_dict = {words:local_store};
// }) 

router.post('/words.json', (req, res) => {

    try {
        // Hold all words passed in body of request, type: JSON
        let words = req.body['words']
        var added_words = []
        // Check if already in local store, if so, then it will ignore
        for (var i=0; i<words.length; i++){
            if (local_store.includes(words[i])) {
                console.log('Already in corpus');
            } else {
                local_store.push(words[i]);
                added_words.push(words[i]);
            }
        }
        res.status(201); // 201 - CREATED
        res.send({'words':local_store}); // Response sent

    } catch (error) {
        res.status(500).send('Error deleting all, message: ', error); // 500 - INTERNAL ERROR
    }

});


router.get('/anagrams/:word.json', (req, res) => {

    try {
        var ret = [];

        // If no limit is sent, it will be undefined i.e. unlimited, else set to limit
        var lim = (req.query['limit']==null) ? Number.MAX_VALUE : req.query['limit'];
        // Limiting to proper nouns or not
        var proper = (req.query['proper']==null) ? false : true;

        for (var i=0; i<local_store.length; i++) {
            // Check if anagram
            if ( is_Ana(local_store[i], req.params['word']) == true) {
                if (local_store[i]!=req.params['word']) {
                    if (!is_Proper_Check(local_store[i],proper)) continue; // Using a helper function (at top)
                    if (--lim<0) break;
                    // else
                    ret.push(local_store[i]);
                }
            }
        }
        res.status(200); // 200 - OK
        res.send({'anagrams':ret}); // Response sent

    } catch (error) {
        res.status(500).send('Error deleting all, message: ', error); // 500 - INTERNAL ERROR
    }

});

router.get('/words.json', (req, res) => {

    try {
        let nums = [];
        var min = Number.MAX_VALUE,
            max = 0,
            med = 0,
            mean = 0,
            count = local_store.length;
        
        for (var i=0; i<local_store.length; i++) {
            // Converting array of strings to array of lengths
            nums.push(local_store[i].length);
            mean+=local_store[i].length;
        
            if (local_store[i].length<min) {
                min = local_store[i].length;
            } else if (local_store[i].length>max) {
                max = local_store[i].length;
            }
        }

        // Uses merge, nlogn
        nums.sort();

        if (count%2==0){
            med = (nums[nums.length/2 - 1] + nums[nums.length/2]) / 2;
        } else {
            // A way to round down using bitwise operator
            var indx = (nums.length / 2) | 0;
            med = nums[indx];
        }
        mean/=nums.length;
        min = (min==Number.MAX_VALUE) ? 0:min; // Make sure min doesn't stay at max value i.e. no words in array

        res.status(200); // 200 - OK
        res.send({'min':min,'max':max,'median':med,'avg':mean,'count':count}); // Response sent

    } catch (error) {
        res.status(500).send('Error deleting all, message: ', error); // 500 - INTERNAL ERROR
    }

});

router.delete('/words/:word.json', (req, res) => {

    try {
        // Req.params stores the word to be deleted
        const indx = local_store.indexOf(req.params['word']);

        if (indx==-1) {
            res.send('No word match');
        } else {
            // Removes a single word at index, length 1
            local_store.splice(indx,1);
        }

    } catch (error) {
        res.status(500).send('Error deleting all, message: ', error); // 500 - INTERNAL ERROR
    }
    res.status(204); // 204 - NO RESPONSE
    res.send({'words':local_store}) // Response sent

});

router.delete('/words.json', (req, res) => {

    try {
        local_store.length = 0; // Empties locally stored words without creating a copy
        res.status(204); // 204 - NO RESPONSE
        res.send({'words':local_store}) // Response sent
    } catch (error) {
        res.status(500).send('Error deleting all, message: ', error); // 500 - INTERNAL ERROR
    }

});

module.exports = router;