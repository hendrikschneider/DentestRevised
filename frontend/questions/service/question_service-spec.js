'use_strict';

describe('QuestionService', function() {

  beforeEach(module('questions'));
  beforeEach(module('globalConstants'));
  
  var result,mockBackend,baseURL,qService;
  beforeEach(inject(function($httpBackend,QuestionService,REST_BASE_URL){
        baseURL = REST_BASE_URL;
        result = null;
        mockBackend = $httpBackend;
        qService = QuestionService;
        spyOn(QuestionService,'build_pagination_info').andCallThrough();
        spyOn(QuestionService,'getTopics').andCallThrough();
        qService.set_page_size(1);
   }));
   
   afterEach(function(){
        mockBackend.verifyNoOutstandingExpectation();
        mockBackend.verifyNoOutstandingRequest();
   });
   
   var result_handler = function(data){
       result = data;
   }
   
   var buildParams = function(page,page_size){
        var params = {
                format:'json',
                page:page,
                page_size:page_size,
            };
      
        var keys = Object.keys(params).sort(); //how angular orders query params
        var returnString = '?' + keys[0] + '=' + params[keys[0]] +
        '&' + keys[1] + '=' + params[keys[1]] + '&' + keys[2] + '=' + params[keys[2]];
        return returnString;
   };
   
   
   var topicResponsePage1 = {
    count: 3,
    next: "https://dentest.com/topics/?format=json&page=2&page_size=1",
    previous: null,
    results: [
        {
            name: "Dentistry",
            description: "The subject this app is for"
        }
    ],
    };
    
    var topicResponsePage2 = {
    count: 3,
    next: "https://dentest.com/topics/?format=json&page=3&page_size=1",
    previous: "https://dentest.com/topics/?format=json&page=1&page_size=1",
    results: [
        {
            "name": "Math",
            "description": "Numbers and stuff"
        }
    ]
    };
    
    var topicResponsePage3 = {
    count: 3,
    next: null,
    previous: "https://dentest.com/topics/?format=json&page=2&page_size=1",
    results: [
        {
            name: "Physics",
            description: "Bla"
        }
    ]
    };
    
    var subtopicResponsePage1 = {
    count: 3,
    next: "https://dentest.com/subtopics/?format=json&page=2&page_size=1",
    previous: null,
    results: [
        {
            topic: "Math",
            name: "Algebra",
            description: "That thing where letters represent numbers."
        }
    ]
    };

    var allQuestionsResponsePage1 = {
    count: 4,
    next: "https://dentest.com/questions/?format=json&page=2&page_size=1",
    previous: null,
    results: [
        {
            id: 1,
            subtopic: {
                topic: "Math",
                name: "Algebra"
            },
            question: "if a=3 and b=4 what is a+b?",
            answer: "7",
            restricted: false
        }
    ]
};

    var questionsByTopicResponsePage1 = {
    count: 3,
    next: "https://dentest.com/questions/by_topic/Math/?format=json&page=2&page_size=1",
    previous: null,
    results: [
        {
            id: 1,
            subtopic: {
                topic: "Math",
                name: "Algebra"
            },
            question: "if a=3 and b=4 what is a+b?",
            answer: "7",
            restricted: false
        }
    ]
};
    
    var questionsBySubtopicResponsePage1 = 
{
    count: 1,
    next: null,
    previous: null,
    results: [
        {
            id: 4,
            subtopic: {
                topic: "Math",
                name: "Calculus"
            },
            question: "Who invented Calculus",
            answer: "Newton and Leibniz came up with it at about the same time.",
            restricted: false
        }
    ]
};
    var questionByIDResponse = 
{
    id: 1,
    subtopic: {
        topic: "Math",
        name: "Algebra"
    },
    question: "if a=3 and b=4 what is a+b?",
    answer: "7",
    restricted: false
};

   //========================================FETCHING TOPICS================================================
   describe('Fetching Topics',function(){
        it('should contact the correct API endpoint',function(){
            mockBackend.expectGET(baseURL+'/topics/'+ buildParams(1,1)).respond(404,{}); //return value doesnt matter
            qService.getTopics(1,result_handler); //get page 1
            mockBackend.flush();
        });
        
        it('should call build_pagination_info() to store next/previous page, no_of_pages, etc',function(){
            mockBackend.expectGET(baseURL+'/topics/' + buildParams(2,1)).respond(200,topicResponsePage2);
            qService.getTopics(2,result_handler);
            mockBackend.flush();
            expect(qService.build_pagination_info).toHaveBeenCalledWith(2,topicResponsePage2);
            var page_info = qService.get_pagination_info();
            expect(page_info.current_page_number).toEqual(2);
            expect(page_info.previous_page_number).toEqual(1);
            expect(page_info.next_page_number).toEqual(3);
            expect(page_info.no_of_pages).toEqual(3);
        });
        
        it('should return the full response if the request is successful',function(){
            mockBackend.expectGET(baseURL + '/topics/' + buildParams(1,1)).respond(200,topicResponsePage1);
            qService.getTopics(1,result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:topicResponsePage1,errors:{}});
        });
        
        it('should return errors if the request fails',function(){
            mockBackend.expectGET(baseURL + '/topics/' + buildParams(1,1)).respond(404,{errors:['errors']});
            qService.getTopics(1,result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:{},errors:{errors:['errors']}});
        });
   });
   
   
   //======================================FETCHING SUBTOPICS===============================================
   describe('Fetching Subtopics',function(){
        it('should make a request to the correct API endpoint',function(){
            mockBackend.expectGET(baseURL + '/subtopics/'+ buildParams(1,1)).respond(200,subtopicResponsePage1);
            qService.getSubtopics(1,result_handler);
            mockBackend.flush();
        });
        
        it('should call build_pagination_info() to store the next/previous page, etc',function(){
            mockBackend.expectGET(baseURL + '/subtopics/'+ buildParams(1,1)).respond(200,subtopicResponsePage1);
            qService.getSubtopics(1,result_handler);
            mockBackend.flush();
            expect(qService.build_pagination_info).toHaveBeenCalledWith(1,subtopicResponsePage1);
            var page_info = qService.get_pagination_info();
            expect(page_info.current_page_number).toEqual(1);
            expect(page_info.previous_page_number).toEqual(null);
            expect(page_info.next_page_number).toEqual(2);
            expect(page_info.no_of_pages).toEqual(3);
        });
        
        it('should return the full response if the request is successful',function(){
            mockBackend.expectGET(baseURL + '/subtopics/' + buildParams(1,1)).respond(200,subtopicResponsePage1);
            qService.getSubtopics(1,result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:subtopicResponsePage1,errors:{}});
        });
        
        it('should return errors if the request fails',function(){
            mockBackend.expectGET(baseURL + '/subtopics/' + buildParams(1,1)).respond(404,{errors:['errors']});
            qService.getSubtopics(1,result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:{},errors:{errors:['errors']}});
        });
   });
    
    
   //==============================FETCH ALL QUESTIONS=========================================================
   describe('Fetching questions (without filtering)',function(){
        it('should make a request to the correct API endpoint',function(){
            mockBackend.expectGET(baseURL + '/questions/'+ buildParams(1,1)).respond(404,{}); //response doesnt matter
            qService.getQuestions(1,result_handler);
            mockBackend.flush();
        });
    
        it('should call build_pagination_info() to store next/previous page, etc', function(){
            mockBackend.expectGET(baseURL + '/questions/'+ buildParams(1,1)).respond(200,allQuestionsResponsePage1);
            qService.getQuestions(1,result_handler);
            mockBackend.flush();
            expect(qService.build_pagination_info).toHaveBeenCalledWith(1,allQuestionsResponsePage1);
            var page_info = qService.get_pagination_info();
            expect(page_info.current_page_number).toEqual(1);
            expect(page_info.previous_page_number).toEqual(null);
            expect(page_info.next_page_number).toEqual(2);
            expect(page_info.no_of_pages).toEqual(4);
            
        });
              
        it('should return the full response if the request is successful',function(){
            mockBackend.expectGET(baseURL + '/questions/' + buildParams(1,1)).respond(200,allQuestionsResponsePage1);
            qService.getQuestions(1,result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:allQuestionsResponsePage1,errors:{}});
        });
        
        it('should return errors if the request fails',function(){
            mockBackend.expectGET(baseURL + '/questions/' + buildParams(1,1)).respond(404,{errors:['errors']});
            qService.getQuestions(1,result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:{},errors:{errors:['errors']}});
        });
    });
    
    //=====================================FETCHING QUESTIONS BY TOPIC=================================================
    describe('Fetching questions by Topic',function(){
        it('should make a request to the correct API endpoint',function(){
            mockBackend.expectGET(baseURL + '/questions/by_topic/Math/'+ buildParams(1,1)).respond(404,{}); //response doesnt matter
            qService.getQuestionsByTopic(1,'Math',result_handler);
            mockBackend.flush();
        });
    
        it('should call build_pagination_info() to store next/previous page, etc', function(){
            mockBackend.expectGET(baseURL + '/questions/by_topic/Math/'+ buildParams(1,1)).respond(200,questionsByTopicResponsePage1);
            qService.getQuestionsByTopic(1,'Math',result_handler);
            mockBackend.flush();
            expect(qService.build_pagination_info).toHaveBeenCalledWith(1,questionsByTopicResponsePage1);
            var page_info = qService.get_pagination_info();
            expect(page_info.current_page_number).toEqual(1);
            expect(page_info.previous_page_number).toEqual(null);
            expect(page_info.next_page_number).toEqual(2);
        });
        
        it('should return the full response if the request is successful',function(){
            mockBackend.expectGET(baseURL + '/questions/by_topic/Math/' + buildParams(1,1)).respond(200,questionsByTopicResponsePage1);
            qService.getQuestionsByTopic(1,'Math',result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:questionsByTopicResponsePage1,errors:{}});
        });
        
        it('should return errors if the request fails',function(){
            mockBackend.expectGET(baseURL + '/questions/by_topic/Math/' + buildParams(1,1)).respond(404,{errors:['errors']});
            qService.getQuestionsByTopic(1,'Math',result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:{},errors:{errors:['errors']}});
        });
    });
    
    
    //========================================FETCHING QUESTIONS BY SUBTOPIC=========================================
      describe('Fetching questions by Subtopic',function(){
        it('should make a request to the correct API endpoint',function(){
            mockBackend.expectGET(baseURL + '/questions/by_subtopic/Math/Algebra/'+ buildParams(1,1)).respond(404,{}); //response doesnt matter
            qService.getQuestionsBySubtopic(1,'Math','Algebra',result_handler);
            mockBackend.flush();
        });
    
        it('should call build_pagination_info() to store next/previous page, etc', function(){
            mockBackend.expectGET(baseURL + '/questions/by_subtopic/Math/Algebra/'+ buildParams(1,1)).respond(200,questionsBySubtopicResponsePage1);
            qService.getQuestionsBySubtopic(1,'Math','Algebra',result_handler);
            mockBackend.flush();
            expect(qService.build_pagination_info).toHaveBeenCalledWith(1,questionsBySubtopicResponsePage1);
            var page_info = qService.get_pagination_info();
            expect(page_info.current_page_number).toEqual(1);
            expect(page_info.previous_page_number).toEqual(null);
            expect(page_info.next_page_number).toEqual(null);
        });
        
        it('should return the full response if the request is successful',function(){
            mockBackend.expectGET(baseURL + '/questions/by_subtopic/Math/Algebra/' + buildParams(1,1)).respond(200,questionsBySubtopicResponsePage1);
            qService.getQuestionsBySubtopic(1,'Math','Algebra',result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:questionsBySubtopicResponsePage1,errors:{}});
        });
        
        it('should return errors if the request fails',function(){
            mockBackend.expectGET(baseURL + '/questions/by_subtopic/Math/Algebra/' + buildParams(1,1)).respond(404,{errors:['errors']});
            qService.getQuestionsBySubtopic(1,'Math','Algebra',result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:{},errors:{errors:['errors']}});
        });
    });
    
      describe('Fetching a question by id',function(){
        it('should make a request to the correct API endpoint',function(){
            mockBackend.expectGET(baseURL + '/questions/question_number/1/?format=json').respond(404,{}); //response doesnt matter
            qService.getQuestionByID(1,result_handler);
            mockBackend.flush();
        });
    
        it('should not call pagination info (no pages) and clear the pagination info', function(){
            mockBackend.expectGET(baseURL + '/questions/question_number/1/?format=json').respond(200,questionByIDResponse); //response doesnt matter
            qService.getQuestionByID(1,result_handler);
            mockBackend.flush();
            expect(qService.build_pagination_info).not.toHaveBeenCalled();
            var page_info = qService.get_pagination_info();
            expect(page_info.current_page_number).toEqual(null);
            expect(page_info.previous_page_number).toEqual(null);
            expect(page_info.next_page_number).toEqual(null);
            expect(page_info.previous_page_link).toEqual(null);
            expect(page_info.next_page_link).toEqual(null);
        });
        
        it('should return the full response if the request is successful',function(){
            mockBackend.expectGET(baseURL + '/questions/question_number/1/?format=json').respond(200,questionByIDResponse);
            qService.getQuestionByID(1,result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:questionByIDResponse,errors:{}});
        });
        
        it('should return errors if the request fails',function(){
            mockBackend.expectGET(baseURL + '/questions/question_number/1/?format=json').respond(404,{errors:['errors']});
            qService.getQuestionByID(1,result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:{},errors:{errors:['errors']}});
        });
    });
    
    describe('Pagination',function(){
         it('should give the next page of topics after a request if next_page is called',function(){
            mockBackend.expectGET(baseURL + '/topics/' + buildParams(2,1)).respond(200,topicResponsePage2);
            qService.getTopics(2,result_handler);
            mockBackend.flush();
            mockBackend.expectGET(baseURL + '/topics/' + buildParams(3,1)).respond(200,topicResponsePage3);
            qService.next_page(result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:topicResponsePage3,errors:{}});
         
        });
        
        it('should give the previous page of topics after a request if previous_page is called',function(){
            mockBackend.expectGET(baseURL + '/topics/'+ buildParams(2,1)).respond(200,topicResponsePage2);
            qService.getTopics(2,result_handler);
            mockBackend.flush();
            mockBackend.expectGET(baseURL + '/topics/'+ buildParams(1,1)).respond(200,topicResponsePage1);
            qService.previous_page(result_handler);
            mockBackend.flush();
            expect(result).toEqual({data:topicResponsePage1,errors:{}});
        });
        
        it('should handle the case where there is no further page and next_page is called',function(){
            mockBackend.expectGET(baseURL + '/topics/' + buildParams(3,1)).respond(200,topicResponsePage3);
            qService.getTopics(3,result_handler);
            mockBackend.flush();
            qService.next_page(result_handler);
            expect(result).toEqual(null);
        });
        
        it('should handle the case where there is no previous page and previous_page is called',function(){
            mockBackend.expectGET(baseURL + '/topics/'+ buildParams(1,1)).respond(200,topicResponsePage1);
            qService.getTopics(1,result_handler);
            mockBackend.flush();
            qService.previous_page(result_handler);
            expect(result).toEqual(null);
        });
        
        it('should calculate the number of pages, first and last page numbers, and next and previous page numbers from the topic response',function(){
            mockBackend.expectGET(baseURL + '/topics/'+ buildParams(1,1)).respond(200,topicResponsePage1);
            qService.getTopics(1,result_handler);
            mockBackend.flush();
            var pagination_info = qService.get_pagination_info();
            expect(pagination_info).toEqual({
                no_of_pages:3,
                current_page_number:1,
                next_page_number:2,
                previous_page_number:null,
                next_page_link: baseURL+"/topics/?format=json&page=2&page_size=1",
                previous_page_link: null,
            });
        });
    
    });
});