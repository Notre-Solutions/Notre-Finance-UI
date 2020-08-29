import React from "react";
import axios from "axios";
import Modal from "react-modal";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

/**
 * App
 *
 * React app to calculate your finances
 */
class App extends React.Component {
  /**
   * constructor
   *
   * @object  @props  parent props
   * @object  @state  component state
   */
  constructor(props) {
    super(props);

    this.state = {
      savings: 0,
      plannedPurchasedDate: new Date(),
      cost: 0,
      startDate: new Date(),
      res: 0,
      showModal: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.clearData = this.clearData.bind(this);
    this.handleChangePlannedPurchasedDate = this.handleChangePlannedPurchasedDate.bind(
      this
    );
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      [event.target.name]: value,
    });
  }

  handleChangePlannedPurchasedDate(date) {
    this.setState({
      plannedPurchasedDate: date,
    });
  }

  handleChangeStartDate(date) {
    this.setState({
      startDate: date,
    });
  }

  closeModal() {
    this.setState({ showModal: false });
    this.clearData();
  }

  clearData() {
    this.setState({
      savings: 0,
      plannedPurchasedDate: new Date(),
      startDate: new Date(),
      cost: 0,
    });
  }

  convertDate(date) {
    return parseInt(date.toISOString().slice(0, 10).replace(/-/g, ""));
  }

  async sendData(event) {
    event.preventDefault();
    const data = {
      savings: parseInt(this.state.savings),
      plannedPurchaseDate: this.convertDate(this.state.plannedPurchasedDate),
      startDate: this.convertDate(this.state.startDate),
      cost: parseInt(this.state.cost),
    };
    console.log(data);
    let results;
    try {
      results = await axios.post(
        "https://notre-finances.herokuapp.com/calc",
        data,
        {
          "Content-Type": "application/json",
        }
      );
    } catch (error) {
      console.log(`😱 Axios request failed: ${error}`);
    }
    if (results.status === 200) {
      this.setState({ res: results.data, showModal: true });
    }
  }

  /**
   * render
   *
   * Render UI
   */

  render() {
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
      },
    };

    return (
      <>
        <h1>Notre Finances</h1>
        <div className="container">
          <form onSubmit={this.sendData}>
            <label>
              Enter your current Savings:
              <input
                placeholder="3000"
                type="number"
                name="savings"
                value={this.state.savings}
                onChange={this.handleChange}
              />
            </label>
            <label>
              Enter the day you plan to start saving:
              <div>
                <DatePicker
                  selected={this.state.startDate}
                  onChange={this.handleChangeStartDate}
                  dateFormat="yyyy/MM/dd"
                  className="datePicker"
                />
              </div>
            </label>
            <label>
              Enter the date you plan to purchase the item:
              <div>
                <DatePicker
                  selected={this.state.plannedPurchasedDate}
                  onChange={this.handleChangePlannedPurchasedDate}
                  dateFormat="yyyy/MM/dd"
                  className="datePicker"
                />
              </div>
            </label>
            <label>
              Enter how much the item costs:
              <input
                placeholder="400000"
                type="number"
                name="cost"
                value={this.state.cost}
                onChange={this.handleChange}
              />
            </label>

            <input type="submit" value="Submit" />
          </form>
        </div>
        <Modal
          isOpen={this.state.showModal}
          style={customStyles}
          contentLabel="Results"
        >
          <h2>Results</h2>
          <h4>
            Saving Period: <strng>{this.state.res.savingPeriod}</strng>
          </h4>
          <h4>
            Saving Per Month:
            <strong>£ {this.state.res.savePerMonth}</strong>
          </h4>
          <h4>Current Savings: {this.state.savings}</h4>
          <h4>Item Cost: {this.state.cost}</h4>
          <h4>
            Date you will purchase Item:{" "}
            {this.state.plannedPurchasedDate.toISOString().slice(0, 10)}
          </h4>
          <h4>
            Date you will begin Saving:{" "}
            {this.state.startDate.toISOString().slice(0, 10)}
          </h4>

          <button onClick={this.closeModal}>close</button>
        </Modal>
      </>
    );
  }
}

export default App;
