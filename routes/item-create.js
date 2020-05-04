var express = require("express");
const router = new express.Router()
var monday_URL = "https://api.monday.com/v2/";
const axios = require('axios')
// const funcs = require('./functions.js')
require("dotenv").config();
const { graphql } = require("@octokit/graphql");
const kit_KEY = process.env.OCTOKIT_KEY;
const repo_Id = process.env.REPO_ID;
const repo_Id_test = "MDEwOlJlcG9zaXRvcnkyNTU5ODM2MjA="
const subId = process.env.CREATE_SUB_ID

router.post("/monday/item_create", (req, res) => {
  res.end()
  var monday_itemData = req.body.event;
  console.log(monday_itemData);
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
                     }
                     }`,
    },
  };
  async function get_allUsers() {
    // Make request to Monday.com API
    console.log("Get All Users functions running");

    try {
      const response = await axios.get(monday_URL, options);
      return response.data.data.users;
    } catch (err) {
      console.log(err.response);
    }
  }

  async function get_Users(userId) {
    try {
      user_data = await get_allUsers(); //All user data from monday_API.
      console.log("Get_Users function running");
      for (var i in user_data)
        if (userId === user_data[i].id)
          //response.data.data.users
          return user_data[i].name;
    } catch (error) {
      console.log(error);
    }
    console.log("this happens after");
  }
  // const req_userId = get_Users(monday_itemData.userId)
  //  console.log(req.query.data) //monday update data
  graph_Kit = async () => {
    console.log("Graph Kit Starting initial");
    
    console.log("awaiting req_userId");
    var req_userId = await get_Users(monday_itemData.userId); // I believe we needed to put this variable before the try, to let the program know this variable will be filled later.
    try {
      const issue_Body =
        `
# Monday Board: IT Operations \n
## Group Name: ` +
        monday_itemData.groupName +
        `\n
### Created by ` +
        req_userId +
        `\n
#### (Do not delete) Unique ID: ` +
        monday_itemData.pulseId;
      // await get_Users() // Test with this deleted - Worked

      console.log("Graph Kit Starting inside async");
      await graphql(
        `
          mutation CreateIssue(
            $repositoryId: ID!
            $title: String!
            $body: String!
          ) {
            createIssue(
              input: { repositoryId: $repositoryId, title: $title, body: $body }
            ) {
              issue {
                id
              }
            }
          }
        `,
        {
          repositoryId: repo_Id,
          title: monday_itemData.pulseName,
          body: issue_Body,
          headers: {
            authorization: `token ` + kit_KEY,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    console.log("Graph Kit Ending");
  };
  
  if (process.env.CREATE_SUB_ID === monday_itemData.subscriptionId){
    graph_Kit()
    
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