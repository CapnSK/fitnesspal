const AWS = require("aws-sdk");
const dynamo = require("../helpers/dynamo");

const DYNAMO_TABLE = "user-details";

const messageTemplate = "Hi {name}, Please find your calorie distribution below. Stay fit.\nProtein: {protein}\nCarbs: {carbs}\nFats: {fats}\nFibers: {fibers}\n\nTotal Calories to be consumed: {intake}";

const calculateWeightGain = async (event) => {
  try {
    console.log(event);
    const { email, name, height, weight, fat, age, gender, lifestyle } = event;

    const { tdee } = getBaseValues({ height, weight, fat, age, gender, lifestyle });
    
    const intake = tdee + 500;
    const {protein, fats, carbs, fibers} = getMacroDistribution({intake, gender, weight});
    console.log("calculated macros for the person are P Fa C Fi", protein, fats, carbs, fibers);
    const currObj = await dynamo.get({email: email}, DYNAMO_TABLE);
    const response = await dynamo.post({
      ...currObj,
      protein, fats, carbs, fibers, tdee, intake, importStatus: "Done"
    }, DYNAMO_TABLE);
    console.log(response);
    const message = messageTemplate
                    .replace("{name}",name)
                    .replace("{protein}", protein)
                    .replace("{carbs}", carbs)
                    .replace("{fats}", fats)
                    .replace("{fibers}", fibers)
                    .replace("{intake}", intake);
    await sendEmail(email, message);
    console.log("Weight Gain Processing Done");
    return "Weight Gain Processing Done";
  } catch (error) {
    console.error(error);
  }
};

const calculateWeightLoss = async (event) => {
  try {
    console.log(event);
    const { email, name, height, weight, fat, age, gender, lifestyle } = event;

    const { tdee } = getBaseValues({ height, weight, fat, age, gender, lifestyle });

    const intake = tdee - 500;
    const {protein, fats, carbs, fibers} = getMacroDistribution({intake, gender, weight});
    console.log("calculated macros for the person are P Fa C Fi", protein, fats, carbs, fibers);
    const currObj = await dynamo.get({email: email}, DYNAMO_TABLE);
    const response = await dynamo.post({
      ...currObj,
      protein, fats, carbs, fibers, tdee, intake, importStatus: "Done"
    }, DYNAMO_TABLE);
    console.log(response);
    const message = messageTemplate
                    .replace("{name}",name)
                    .replace("{protein}", protein)
                    .replace("{carbs}", carbs)
                    .replace("{fats}", fats)
                    .replace("{fibers}", fibers)
                    .replace("{intake}", intake);
    await sendEmail(email, message);
    console.log("Weight Loss Processing Done");
  } catch (error) {}
};

const sendEmail = async (email, message) => {
  const sns = new AWS.SNS();
  console.log(email, message);

  const listTopicsResult = await sns.listTopics({}).promise();
  const topics = listTopicsResult.Topics;
  const topicName = email.replace("@", "").replace(".", "");
  console.log(topics);
  console.log(topicName);
  const topic = topics.find((t) => t.TopicArn.includes(topicName));
  let topicArn = "";
  if (!topic) {
    console.log("Creating new topic with name " + topicName);
    const topicParams = {
      Name: topicName,
    };

    const topicData = await sns.createTopic(topicParams).promise();
    console.log("New topic created");
    topicArn = topicData.TopicArn;
    const subscribeParams = {
      Protocol: "email",
      TopicArn: topicArn,
      Endpoint: email,
    };

    await sns.subscribe(subscribeParams).promise();
  } else {
    console.log("Topic Already Created For: " + email);
    topicArn = topic.TopicArn;
  }

  const publishParams = {
    Subject: "Fitnesspal - Your Fitness Regime",
    Message: message,
    TopicArn: topicArn,
  };

  await sns.publish(publishParams).promise();
};

const getMacroDistribution = ({intake, weight, gender}) => {
  const protein = Math.round(weight*(gender === "M" ? 0.8 : 0.6));
  const fats = Math.round((intake*0.25)/9);
  const carbs = Math.abs(Math.round((intake - (protein*4 + fats*9))/4));
  const fibers = (Math.random()*10 + 20); // fiber intake can be between 20 to 30 gms
  return {protein, fats, carbs, fibers};
}

const getBaseValues = ({height, weight, age, gender, fat, lifestyle}) =>{
  const bmi = (weight/2.2)/((height*height)/10000); 
  let bmr;
  let tdee;
  let mf;
  if(gender === "M"){
    bmr = 88.362 + (13.397*(weight/2.2)) + (4.799*height) - (5.677*age);
  } else {
    bmr = 447.593 + (9.247*(weight/2.2)) + (3.098*height) - (4.330*age);
  }
  switch(lifestyle){
    case "se":
      mf = 1.2;
      break;
    case "ma":
      mf = 1.55;
      break;
    case "ra":
      mf = 1.725;
      break;
  }
  tdee = mf*bmr;

  return { tdee, bmr, bmi };
}

module.exports = {
  calculateWeightGain: calculateWeightGain,
  calculateWeightLoss: calculateWeightLoss,
};
