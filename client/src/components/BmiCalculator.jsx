import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { useSelector } from "react-redux";
import { Header } from "./Header";
import "../styles/BmiCalculator.scss";

const BmiCalculator = () => {
  const user = useSelector((state) => state.user);
  const { weight, height } = user;

  const [calories, setCalories] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [days, setDays] = useState("");
  const [error, setError] = useState(false);
  const [estimatedWeight, setEstimatedWeight] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validate input values
    if (
        !calories ||
        !caloriesBurned ||
        !days ||
        isNaN(calories) ||
        isNaN(caloriesBurned) ||
        isNaN(days) ||
        calories <= 0 ||
        caloriesBurned <= 0 ||
        days <= 0
    ) {
        setEstimatedWeight(null);
        setError(true);
      return;
    }

    setError(false);

    // Calculate estimated weight based on calories and days
    const caloriesPerKg = 7700;  // calories in 1 kg of body weight
    const weightChangePerDay = (calories - caloriesBurned)/caloriesPerKg;
    console.log(weightChangePerDay);
    console.log(weightChangePerDay * days);
    console.log(weight + weightChangePerDay * days);
    const estimatedWeightChange = parseFloat(weight) + parseFloat((weightChangePerDay * days));

    // Display the estimated weight change
    setEstimatedWeight(estimatedWeightChange);
    setCalories("");
    setCaloriesBurned("");
    setDays("");
  };

  return (
    <>
      <Header />
      <div className="BMI-container">
        <Sidebar />
        <div>
            <p className="currentBMI">BMI and Weight Estimator:</p>
            <p className="helpertext">(This tool can be get an estimate of your weight and BMI after your desired time period, based on your calorie consumption)</p>
          <div className="formContainerDiv">
            {/* Form for inputting calories and days */}
            <form style={{ marginTop: "10px" }} onSubmit={handleFormSubmit}>
              <label style={{ margin: "5px" }} className="inputLabel">
                Calories Consumed per day:
                <input
                  className="inputElem"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(parseFloat(e.target.value))}
                  required
                />
              </label>
              <label style={{ margin: "5px" }} className="inputLabel">
              Calories Burned per day:
              <input
                className="inputElem"
                type='number'
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(parseFloat(e.target.value))}
                required
              />
              </label>
              <label style={{ margin: "5px" }} className="inputLabel">
                Days:
                <input
                  className="inputElem"
                  type="number"
                  value={days}
                  onChange={(e) => setDays(parseFloat(e.target.value))}
                  required
                />
              </label>
              <button type="submit" className="formButton">Calculate Estimated Weight</button>
            </form>

            {/* Display the estimated weight */}
            {estimatedWeight !== null && (
              <p className="displayBMI">
                Estimated weight change after consuming {calories} calories and burning { caloriesBurned } calories per day for { days } days would be:
                <span className="blueText">
                  {" "}
                  {estimatedWeight.toFixed(2)} kgs {" "}
                </span>
                and your BMI would be:
                <span className="blueText">
                  {" "}
                  {(estimatedWeight / (height * 0.01) ** 2).toFixed(2)} kg/m2
                </span>
              </p>
            )}

            {/* Display the estimated weight */}
            {error && (
              <p className="displayBMI">
                <span className="redText">
                  *Please enter the correct input values
                </span>
              </p>
            )}
          </div>

          <p className="currentBMI topElement">
            Your current BMI according to the provided data i.e., weight =
            <span className="blueText"> {weight} kgs</span> and height = {" "}
            <span className="blueText">{height} cms </span> is
            <span className="blueText">
              {" "}
              {(weight / (height * 0.01) ** 2).toFixed(2)} kg/m2
            </span>
          </p>
          <p className="currentBMI categories">
            BMI Categories:
            <ul className="currentBMI categories">
              <li>{"Underweight <= 18.5"}</li>
              <li>{"Normal weight = 18.5 – 24.9"}</li>
              <li>{"Overweight = 25 – 29.9"}</li>
              <li>{"Obesity = BMI of 30 or greater"}</li>
            </ul>
          </p>
        </div>
      </div>
    </>
  );
};

export { BmiCalculator };
