const AWS = require("aws-sdk");
const dynamo = require("../helpers/dynamo");
const stepfunctions = new AWS.StepFunctions();

const DYNAMO_TABLE = "user-details";
const headers =  {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers" : "*",
}
const postUserData = async (event) => {
  try {
    const coreStateMachineArn = process.env.STEP_FUNCTION_ARN;
    if (!coreStateMachineArn) {
      throw new Error("State Machine ARN Not Provided");
    }
    const data = JSON.parse(event.body);
    console.log(data);
    const stateMachineInput = {
      email: data?.email,
      name: data?.name,
      goal: data?.goal,
      weight: data?.weight,
      height: data?.height,
      fat: data?.fat,
      age:data?.age,
      gender: data?.gender,
      lifestyle: data?.lifestyle
    };
    const dynamoData = {
      ...stateMachineInput,
      importStatus: "Processing",
    };
    console.log(dynamoData);
    await dynamo.post(dynamoData, DYNAMO_TABLE);
    const stateMachineBody = {
      stateMachineArn: coreStateMachineArn,
      input: JSON.stringify(stateMachineInput),
    };
    await stepfunctions.startExecution(stateMachineBody).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User Data Posted Successfully" }),
      headers: headers
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: headers
    };
  }
};

const getUserData = async (event) => {
  try {
    const email = event.pathParameters?.email;
    console.log(email);
    const dynamoObject = await dynamo.get({ email: email }, DYNAMO_TABLE);
    if (!dynamoObject) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User not found" }),
        headers: headers
      };
    }
    if (dynamoObject?.importStatus == "Processing") {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User Data is still processing" }),
        headers: headers
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        macroDistribution :{ 
          P: Math.floor(dynamoObject.protein),
          C: Math.floor(dynamoObject.carbs),
          Fa: Math.floor(dynamoObject.fats),
          Fi: Math.floor(dynamoObject.fibers)
        },
        TDEE: Math.floor(dynamoObject.tdee),
        Intake: Math.floor(dynamoObject.intake)
      }),
      headers: headers
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: headers
    };
  }
};

const getImportStatus = async (event) => {
  try {
    const email = event.pathParameters?.email;
    const dynamoObject = await dynamo.get({ email: email }, DYNAMO_TABLE);
    if (!dynamoObject) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User not found" }),
        headers: headers
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ status: dynamoObject?.importStatus }),
      headers: headers
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: headers
    };
  }
};

module.exports = {
  postUserData: postUserData,
  getUserData: getUserData,
  getImportStatus: getImportStatus,
};
