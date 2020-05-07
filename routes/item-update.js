var express = require("express");
const router = new express.Router()

require("dotenv").config();
var monday_URL = "https://api.monday.com/v2/";
const handle_Bars = require('hbs');
path = require('path')
const axios = require('axios')
const { graphql } = require("@octokit/graphql");
const kit_KEY = process.env.OCTOKIT_KEY;
var new_Cursor;
var new_Data = `{"body":""},`; //Added so the first object will not be empty. Not sure if it is necessary.
var conc_This;
const html_Path = path.join(__dirname, '../views/html')
const subId = process.env.UPDATE_SUB_ID




router.post("/monday/item_update", (req, res) => {

    res.end()
    const options = {
      headers: {
        // Reads from your .env file
        Authorization: process.env.API_KEY,
        url: monday_URL,
      },
      data: {
        // GraphQL query here
        query: `{
                      users (kind: non_guests) {
                      id
                      name
                      email
                       }
                       }`,
      },
    };
  get_allUsers = async function() {
      // Make request to Monday.com API
      console.log("Get All Users functions running");

      try {
        const response = await axios.get(monday_URL, options);
        return response.data.data.users;
      } catch (err) {
        console.log(err.response);
      }
    }

  get_Users =  async function (userId) {
      try {
        user_data = await get_allUsers(); //All user data from monday_API.
        console.log("Get_Users function running");
        for (var i in user_data)
          if (userId === user_data[i].id)
            //response.data.data.users
            return user_data[i].email;
      } catch (error) {
        console.log(error);
      }
      console.log("this happens after");
    }
    var monday_itemData = req.body.event
    var cursor_Variable = null

    console.log(monday_itemData);
    data_Getter = async(cursor_Data)=> {
      console.log("Starting data_Getter");
      var data = await graphql(`
     query get_Issues(
       $endCursor: String
     ){
       repository(name: "it-operations", owner: "github") {
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

      if(data_GetterData.repository.issues.pageInfo.hasNextPage === true){
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
        if(final_Parse[i].body.includes("(Do not delete) Unique ID: "+ monday_itemData.pulseId) === true)
        var final_Data = final_Parse[i].id
        console.log(final_Parse[i].body);
        var req_userId = await get_Users(monday_itemData.userId)
        var userHandle = req_userId.replace('@github.com','')
        const update_Comment = "From @" + userHandle + ': \n'+ monday_itemData.textBody;

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
      console.log(error);
      console.log(`"Item does not exist on GitHub. Please attach "Unique ID: {id}" to issue body.`);
      }
    };

  if (monday_itemData.subscriptionId === monday_itemData.subscriptionId){
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
