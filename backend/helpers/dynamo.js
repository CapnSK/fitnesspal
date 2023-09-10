const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const get = async (key, tableName) => {
  try {
    const dynamoObject = {
      TableName: tableName,
      Key: key,
    };
    const response = await dynamoDB.get(dynamoObject).promise();
    return response.Item;
  } catch (error) {
    console.error("Could Not Get Item", error);
    return null;
  }
};

const post = async (attributes, tableName) => {
  try {
    const dynamoObject = {
      TableName: tableName,
      Item: attributes,
    };
    await dynamoDB.put(dynamoObject).promise();
  } catch (error) {
    console.error("Could Not Post Item", error);
    throw error;
  }
};

module.exports = {
  get: get,
  post: post,
};
