import React, { Component } from "react";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import Card from "../components/Card";
import DeleteBtn from "../components/DeleteBtn";
import AddBtn from "../components/AddBtn";
import Button from "../components/Button";

class DailyPlan extends Component {
  state = {
    dailyPlanName: "",
    dailyPlanList: [],
    mealList: [],
    dailyPlanMealList: [],
    currentDailyPlan: null
  };

  componentDidMount() {
    this.loadDailyPlans("JohnSmith");
    this.loadMealList("JohnSmith");
  }
  loadMealList = userName => {
    API.getMealByUser(userName)
      .then(res => {
        console.log("mealList is: ", res.data);
        this.setState({
          mealList: res.data
        });
      })
      .catch(err => console.log(err));
  };

  loadDailyPlans = userName => {
    API.getDailyPlanByUser(userName)
      .then(res => {
        console.log("getDailyPlanByUser returned: ", res.data);
        this.setState({
          dailyPlanList: res.data
        });
      })
      .catch(err => console.log(err));
  };

  selectDailyPlan = dailyPlan => {
    console.log("selectDailyPlan dailyplan is : " + dailyPlan);
    console.log(dailyPlan);

    this.setState({ currentDailyPlan: dailyPlan });
    console.log(
      "selected dailyPlan... now current dailyPlan state is:",
      this.state.currentDailyPlan
    );

    var mealListArray = [];
    dailyPlan.mealList.map(mealID =>
      API.getMealByID(mealID)
        .then(res => {
          console.log("mealListArray element is: ", res.data);

          mealListArray.push(res.data);

          this.setState({
            dailyPlanMealList: mealListArray
          });
        })
        .catch(err => console.log(err))
    );
  };

  removeFromDailyPlan = mealID => {
    console.log("remove meal:", mealID);
    console.log("from dailyPlan:", this.state.currentDailyPlan._id);
    API.removeMealFromDailyPlanByID(this.state.currentDailyPlan._id, mealID)
      .then(data => {
        console.log("meal delete returned: ", data);
        // }
        // );
        const tempMealList = data.data.mealList;
        let totalPotassium = 0;
        let totalEnergy = 0;
        tempMealList.map(meal => {
          totalPotassium += meal.meal.totalPotassium;
          totalEnergy += meal.meal.totalEnergy;
        });
        console.log("total energy is:", totalEnergy);
        console.log("total potassium is:", totalPotassium);
        API.updateEnergyPotassiumTotalsForDailyPlanByID(
          this.state.currentDailyPlan._id,
          totalEnergy,
          totalPotassium
        ).then(data => {
          console.log(
            "dailyPlan data after meal REMOVE, with updated totals",
            data.data
          );
          this.setState({
            currentDailyPlan: data.data,
            dailyPlanMealList: data.data.mealList
          });

          console.log(this.state.dailyPlanMealList);
        });
      })
      .catch(err => console.log(err));
  };

  //! new version
  addToDailyPlan = meal_id => {
    // console.log("in addToDailyPlan");
    // console.log("meal id is:", meal_id);
    // console.log("servingSize is:", servingSize);
    API.addMealToDailyPlanByID(this.state.currentDailyPlan._id, meal_id)
      .then(data => {
        // console.log("addMealToDailyPlanByID data.data is", data.data);
        // console.log("meallist is:", data.data.mealList);
        // const totalEnergy = data.data.mealList.reduce((a, b) => ({
        //   energy: a.energy + b.energy
        // }));
        // const totalPotassium = data.data.mealList.reduce((a, b) => ({
        //   potassium: a.potassium + b.potassium
        // }));
        console.log("data.data is:", data.data);
        const tempMealList = data.data.mealList;
        console.log("tempMealList is:", tempMealList);
        let totalPotassium = 0;
        let totalEnergy = 0;
        tempMealList.map(meal => {
          totalPotassium += meal.totalPotassium;
          totalEnergy += meal.totalEnergy;
        });
        console.log("total energy before update totals is:", totalEnergy);
        console.log("total potassium before update totals is:", totalPotassium);
        API.updateEnergyPotassiumTotalsForDailyPlanByID(
          this.state.currentDailyPlan._id,
          totalEnergy,
          totalPotassium
        ).then(data => {
          console.log(data);
          console.log(
            "dailyPlan data after meal ADD, with updated totals",
            data.data
          );
          this.setState({
            currentDailyPlan: data.data,
            dailyPlanMealList: data.data.mealList
          });
        });
      })
      .catch(err => console.log(err));
  };
  //next 3 functions from addDailyPlan.js
  deleteDailyPlan = id => {
    API.deleteDailyPlan(id)
      .then(res => {
        console.log("res is: ", res.data);
        window.location.href = "/ViewDailyPlan";

        // window.location.href = "/AddDailyPlan";
        // this.setState({
        //   dailyPlanList: res.data
        // });
      })
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    console.log([name], value);
    // console.log(this.state.meals);
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.dailyPlanName) {
      API.saveDailyPlan({
        dailyPlanName: this.state.dailyPlanName,
        userName: "JohnSmith",
        totalEnergy: 0,
        totalPotassium: 0
      })
        //todo this refreshes the screen... or should i update state?
        .then(res => (window.location.href = "/ViewDailyPlan"))
        // .then(res => (window.location.href = "/AddDailyPlan"))
        //.then(res => this.loadDailyPlans())
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-9 sm-9">
            <Input
              value={this.state.dailyPlanName}
              onChange={this.handleInputChange}
              name="dailyPlanName"
              placeholder="Enter dailyPlan name to create new dailyPlan"
            />
          </Col>
          <Col size="md-3 sm-3">
            <Button
              className="btn btn-primary"
              disabled={
                !this.state.dailyPlanName

                // && this.state.mealGroup &&
                // this.state.energy &&
                // this.state.potassium
              }
              onClick={this.handleFormSubmit}
            >
              Add DailyPlan
            </Button>
          </Col>
        </Row>
        {/* end of add dailyPlan section */}

        {this.state.currentDailyPlan ? (
          <Row>
            <Col size="md-12 sm-12">
              <strong>Selected DailyPlan: </strong>{" "}
              {this.state.currentDailyPlan.dailyPlanName}
              <strong>Total Energy: </strong>
              {this.state.currentDailyPlan.totalEnergy}
              <strong>Total Potassium: </strong>
              {this.state.currentDailyPlan.totalPotassium}
            </Col>
          </Row>
        ) : (
          <Row>
            <Col size="md-12 sm-12">
              <h6>
                Select a DailyPlan from the dailyPlan list to see what meals it
                contains and to make changes
              </h6>
            </Col>
          </Row>
        )}

        <Row>
          <Col size="md-4 sm-4">
            <Row>
              <h3>DailyPlan List</h3>
            </Row>
            <Row>
              {this.state.dailyPlanList.length ? (
                <>
                  {this.state.dailyPlanList.map(dailyPlan => (
                    <Card key={dailyPlan._id}>
                      {/* <Link to={"/meal/" + meal._id}></Link> */}
                      <strong>
                        DailyPlan Name: {dailyPlan.dailyPlanName} <br />
                        Energy: {dailyPlan.totalEnergy} <br />
                        Potassium: {dailyPlan.totalPotassium} <br />
                      </strong>
                      <Button
                        className="btn btn-primary"
                        onClick={() => this.selectDailyPlan(dailyPlan)}
                      >
                        Select
                      </Button>
                      <Button
                        className="btn btn-danger"
                        onClick={() => this.deleteDailyPlan(dailyPlan._id)}
                      >
                        Delete
                      </Button>
                    </Card>
                  ))}
                </>
              ) : (
                <h6>No DailyPlans, Add a dailyPlan first</h6>
              )}
            </Row>
          </Col>
          <Col size="md-4 sm-4">
            <Row>
              <h3>Meals in your DailyPlan</h3>
            </Row>
            <Row>
              <div>
                {/* this.state.currentDailyPlan && */}
                {this.state.dailyPlanMealList.length + " meals"}
                {this.state.dailyPlanMealList.length > 0 ? (
                  <List>
                    {this.state.dailyPlanMealList.map((
                      meal // console.log("MEAL IS: " + meal)
                    ) => (
                      <Card key={meal._id}>
                        <strong>
                          <br /> {meal.mealName} <br />
                          <br /> Energy:{meal.totalEnergy} <br />
                          <br /> Potassium:{meal.totalPotassium} <br />
                          {/* <br /> ServingSize:{meal.servingSize}
                          <br /> */}
                          <br /> Efficiency: {meal.efficiency} <br />
                        </strong>
                        <Button
                          className="btn btn-danger"
                          onClick={() => this.removeFromDailyPlan(meal._id)}
                        >
                          Remove
                        </Button>
                      </Card>
                    ))}
                  </List>
                ) : (
                  <h6>Click Add on a meal card to add it to your dailyPlan</h6>
                )}
              </div>
            </Row>
          </Col>
          <Col size="md-4 sm-4">
            <Row>
              <h3>Meals</h3>
            </Row>
            <Row>
              {this.state.mealList.length ? (
                this.state.mealList.map(meal => (
                  <Card key={meal._id}>
                    <strong>
                      <br /> {meal.mealName} <br />
                      <br /> Energy:{meal.totalEnergy} <br />
                      <br /> Potassium:{meal.totalPotassium} <br />
                      <br /> Efficiency:{meal.efficiency} <br />
                    </strong>
                    <Button
                      className="btn btn-primary"
                      onClick={() => this.addToDailyPlan(meal._id)}
                    >
                      Add
                    </Button>
                  </Card>
                ))
              ) : (
                <h6>Click Add to add a meal to the dailyPlan</h6>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DailyPlan;
