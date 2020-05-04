var express = require("express");
const router = new express.Router()
// const funcs = require('./functions.js')
require("dotenv").config();
const handle_Bars = require('hbs');
path = require('path')

const { graphql } = require("@octokit/graphql");
const kit_KEY = process.env.OCTOKIT_KEY;
var new_Cursor;
var new_Data = `{"body":""},`;
var conc_This
const html_Path = path.join(__dirname, '../views/html')
const subId = process.env.UPDATE_SUB_ID


router.get("/monday/item_update", (req,res)=>{
  res.end();
  res.render('html')
})

router.post("/monday/item_update", (req, res) => {
    
    var monday_itemData = req.body.event
    var cursor_Variable = null
    
    console.log(monday_itemData);
    data_Getter = async(cursor_Data)=> { 
      console.log("Starting data_Getter");
      var data = await graphql(`
     query get_Issues(
       $endCursor: String
     ){
       repository(name: "monday-test", owner: "github") {
       issues(first: 100, after: $endCursor)
       {
     nodes {
       id
       body
     }
     pageInfo {
       endCursor
       hasNextPage
       hasPreviousPage
             }
           }
         }
       }
       `,
   {
     endCursor: cursor_Data,
     headers: {
       authorization: `token ` + kit_KEY,
     },
   })
   console.log("returning data from data_Getter.data");
   return data
  };
    get_Issues = async() => { 
    console.log("get_Issues starting");
      
    data_GetterData = await data_Getter(new_Cursor)
    console.log("Inside get_Issues.data_GetterData await");
    
  
    
    try{
      // for(i in repoIssuePageNumber, i <= repoIssuePageNumber, i++);
      if(data_GetterData.repository.issues.pageInfo.hasNextPage === true){
        // var dank_Data = data_GetterData.repository.issues.nodes;
        var stringify = JSON.stringify(data_GetterData.repository.issues.nodes)
        var sliced_String =  stringify.slice(1,-1) + ",";
        new_Data+=sliced_String;
        new_Cursor = data_GetterData.repository.issues.pageInfo.endCursor;

        get_Issues(new_Cursor) 
      }else{
        
        stringify = JSON.stringify(data_GetterData.repository.issues.nodes)
        var sliced_String = stringify.slice(1,-1)
        conc_This = new_Data.concat(sliced_String);
     
        var final_String = ("[" + conc_This + "]")
        var final_Parse = JSON.parse(final_String)
        console.log("Data from else (end): ");
        for (i in final_Parse)
        if(final_Parse[i].body.includes("Unique ID: "+ monday_itemData.pulseId) === true)
        
      
        var final_Data = final_Parse[i].id
        console.log(final_Data);
        console.log(final_Parse[i].body);
        
        const update_Comment = monday_itemData.textBody
        await graphql(`
          mutation MyMutation ($Id:String, $update_Comment:String)
          {
            addComment(input: {subjectId: $Id, body: $update_Comment}) {
              clientMutationId
            }
          }`,
          {
            Id: final_Data,
            update_Comment: update_Comment,
            headers: {
              authorization: `token ` + kit_KEY,
            },
          })
      
      }   
    }catch(error){
      console.log(`"Item does not exist on GitHub. Please attach "Unique ID: 'id'" to issue body.`);
      }
    };
    post_Issue = async() => { // unused function. 
      var issue_iD = await get_Issues()
      
      try{
        const update_Comment = "Muahahahahaha"
        await graphql(`
          mutation MyMutation ($Id:String, $update_Comment:String)
          {
            addComment(input: {subjectId: $Id, body: $update_Comment}) {
              clientMutationId
            }
          }`,
          {
            Id: issue_iD,
            update_Comment: update_Comment,
            headers: {
              authorization: `token ` + kit_KEY,
            },
          })
        }catch(error){
        console.log(error);
      }
  };
  
  if (process.env.UPDATE_SUB_ID === monday_itemData.subscriptionId){
    get_Issues()
    
  } else if(TypeError){
    
    const nopes = ["Nah", "Nuh uh","Ha! No", "No way!", "who the hell are you?", "Jeffrey Epstein didnt' kill himself."]
    console.log(nopes[Math.floor(Math.random()*nopes.length)]);
    
    
  }else if(req.body.event.subscriptionId === undefined){
      const nopes = ["Nah", "Nuh uh","Ha! No", "No way!", "who the hell are you?", "Jeffrey Epstein didnt' kill himself."]
      console.log(nopes[Math.floor(Math.random()*nopes.length)]);
  }else{
    const nopes = ["Nah", "Nuh uh","Ha! No", "No way!", "who the hell are you?", "Jeffrey Epstein didnt' kill himself."]
    console.log(nopes[Math.floor(Math.random()*nopes.length)]);
    
  }
});

  module.exports = router