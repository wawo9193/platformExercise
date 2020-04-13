# Documentation

### Features:
- Endpoint that identifies words with the most anagrams
- Endpoint that takes a set of words and returns whether or not they are all anagrams of each other
- Endpoint to return all anagram groups of size >= *x*
- Endpoint to delete a word *and all of its anagrams*
- Allow spaces in the query/response of anagrams (if there are spaces then defaulting to no proper noun)

### Implementation details:
- Setup the server using express, updated bodyparser, location of routes file, and listener
- Setup routes file, making sure to export
- Used local data structure (array,name=local_store) to store data
- Used try catch blocks for request error handling
- I used express, but found information that it is very heavy and not good for microservices
  so I tried converting to nanoexpress because of the table of runtimes presented in this
  repository - https://github.com/the-benchmarker/web-frameworks 
  However, the benchmarks I got back on my local machine had conflicting information -

                        nanoexpress tests
                        88.62 tests/s     310.16 assertions/s
                        85.54 tests/s     311.08 assertions/s

                        express tests
                        59.21 tests/s     207.22 assertions/s
                        65.58 tests/s     229.51 assertions/s

  So I reverted back to express for this project. I would like to run more tests, and also
  do more research into why my results didn't match up in the future.
- I added two unit tests that are titled 'test_words_info' and 'propernoun_test'

### To test:  
- cd platform_dev_intern  
- node server OR nodemon server  
  
on separate terminal...  
- cd platform_dev_intern  
- ruby anagram_test.rb  
OR test http requests using bash,postman/insomnia
