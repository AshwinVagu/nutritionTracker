# README #

This README would normally document whatever steps are necessary to get your application up and running.


### a) Project Name - 
WellnessWise - A health app that helps a user adjust his daily routine and make sure he has a healthier lifestyle.

### b) What will the project do? 
1. The project would be useful to any user who is need of maintining his/her physical health.
2. It could help in the user to adjust his/her diet to maintain a well-balanced and fit body.
3. The user could see the nutritional value of each food item he/her is taking and can accordingly maintain his diet goals.
4. Also based on the user's history the application would provide a detailed analysis based on the food intake and workout schedules of the user.
5. This analysis could be represented to the user via a graphical format so that the user could better understand the results of his/her work.
6. Each user would have his own profile and an authentication system would be present to ensure user data integrity.
7. Normal users seeking help from the application will have a different interface from the admins maintaining the application.
8. A notification system would be present to help out the users and admins about various operations of the applications.
9. Moreover, other calculations like goal tracking and BMI generation would also be present in the application.

### c) Who will benefit from this project?
1. Individuals Seeking Weight Management: Individuals seeking to manage their nutritional intake and establish objectives can utilize this application.
2. Fitness Enthusiasts: People dedicated to exercise and fitness can find value in the app's workout monitoring, aiding them in maintaining their exercise regimens.
3. Nutrition-Conscious Individuals: Those who want to make better dietary decisions and understand their nutritional intake can use the app to track their food intake and gain insights into their diet.
4. People with Specific Dietary Needs: This app can be useful to people with specific dietary requirements, such as vegetarians, vegans, or those with food allergies or intolerances, by offering bespoke meal plans and recipes.
5. Health Challengers/Athletes: The app can be useful for athletes by tracking performance and nutrition, as well as providing insights and analysis that will help them optimize their training and recovery for peak athletic performance.
6. Corporates: Companies interested in monitoring their employees' health and well-being can use features like health assessments and data analytics. 
7. Health nutritionists: This app can be useful for nutritionists by facilitating meal planning, progress tracking, and nutritional insights to support clients in achieving their dietary goals.

### d) What data will be saved in database?
1. User Info: Personal details like age, weight, and goals to customize recommendations.
2. Food Database: Comprehensive list of foods with nutritional info for accurate tracking which will be loaded into the database through an ETL pipeline.
3. User Nutrition Data: Records of daily food intake for calorie and nutrient tracking.
4. User Workout Data: Information on exercises and activities for fitness monitoring.

### e) What will be the easiest part of this project?
- Calculation of individual days health benefits based on the received user data.
- The most easily achievable goal of the project would be to gather the inputs provided by the user on their food consumption.
- It is one the direct inputs received from the user that will be analyzed and processed to produce the necessary analytics to the user.
- Based on the reports generated the user's can plan their diet and nutrition accordingly to stay focused on their health and fitness goals.
- Additionally, calculating the daily health benefits will made easier by performing basic analysis operations on the gathered data which would later be used for further analysis purposes.

### f) What will be the most difficult part of this project?
- Configuring the ETL characteristics and executions to take in the excel data containing the nutritional info of the user as an input and transform it to NoSQL commands which would be directly fed into the database.
- Processing this data to link the necessary fields and provide scope for multiple reporting features required by the user.
- Integrating publish-subscribe (pub/sub) architecture in the application to allow asynchronous communication in the form of notifications to provide the user with periodic reports of their nutritional data.