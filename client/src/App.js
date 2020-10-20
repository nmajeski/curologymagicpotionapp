import React, { Component } from 'react';
import 'whatwg-fetch';
import curologyContainerPhoto from './images/curology-container-photo.jpeg'

const BASE_PRICE = 49.99;

class App extends Component {

  constructor() {
    super();

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      phoneNumber: '',
      ccNum: '',
      expDate: '',
      quantity: 1,
      totalPrice: BASE_PRICE,
      numSubmits: 0,
      errors: []
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateInputText = this.validateInputText.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentDidMount() { }

  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    let theState = {[name]: value};
    if (name === 'quantity') {
      theState['quantity'] = parseInt(value, 10);
      theState['totalPrice'] = (BASE_PRICE * parseInt(value, 10)).toFixed(2);
    } else {
      let errorsList = this.state.errors.filter(function(errorName) {
        return errorName !== name;
      });
      theState['errors'] = errorsList;
    }
    this.setState(theState);
  }

  validateInputText(name, text, regex) {
    let errorList = this.state.errors;
    if (text && regex.test(text)) {
      errorList = errorList.filter(function (value) {
        return value !== name;
      });
    } else if (this.state.numSubmits > 0) {
      if (errorList.indexOf(name) === -1) errorList.push(name);
    }

    this.setState({errors: errorList});
  }

  resetState() {
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      phoneNumber: '',
      ccNum: '',
      expDate: '',
      quantity: 1,
      totalPrice: BASE_PRICE,
      numSubmits: 0,
      errors: []
    })
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({numSubmits: ++this.state.numSubmits}, function() {
      ['firstName', 'lastName', 'addressLine1', 'addressLine2', 'city', 'state'].forEach(function (name) {
        this.validateInputText(name, this.state[name], /.+/);
      }, this);
      this.validateInputText('zip', this.state.zip, /(^\d{5}$)|(^\d{5}-\d{4}$)/);
      this.validateInputText('email', this.state.email, /^\S+@\S+\.\S+$/);
      this.validateInputText('phoneNumber', this.state.phoneNumber, /^\d{10}$/);
      this.validateInputText('ccNum', this.state.ccNum, /^\d{16}$/);
      this.validateInputText('expDate', this.state.expDate, /^(0[1-9]|1[0-2])\/[0-9]{2}$/);

      if (this.state.errors.length === 0) {
        const resetStateFunc = this.resetState;
        fetch('http://localhost:8080/api/magic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            address: {
              street1: this.state.addressLine1,
              street2: this.state.addressLine2,
              city: this.state.city,
              state: this.state.state,
              zip: this.state.zip
            },
            phone: this.state.phoneNumber,
            quantity: this.state.quantity,
            total: `${this.state.totalPrice}`,
            payment: {
              ccNum: this.state.ccNum,
              exp: this.state.expDate
            }
          })
        })
        .then(function(response) {
          if (response.status >= 200 && response.status < 300) {
            resetStateFunc();
            alert('Your order has been placed!');
          } else if (response.status === 403) {
            alert("We're sorry, but you cannot place orders for more than three Magic Potions per month! Please try again next month.");
          } else {
            console.error('request failed', response.status, response.text);
            alert("We're sorry, but your order could not be placed! Please try again later.");
          }
        })
        .catch(function(error) {
          console.error('request failed', error);
          alert("We're sorry, but your order could not be placed! Please try again later.");
        })
      } else {
        alert("We're sorry, but your order could not be placed! Please fix the errors in the form and try again.")
      }
    });
  }

  render() {
    return (
      <div className="main-container">
        <div className="header-container">
          <h1 className="header">Magic Potion #1</h1>
        </div>
        <div className="product-and-form-container">
          <form onSubmit={this.onSubmit}>
            <div className="product-and-form-grid">
              <div className="product-container">
                <div className="product-info">
                  <span className="product-info-text">Purchase Magic Potion #1</span>
                </div>
                <div className="magic-potion-image">
                  <img src={curologyContainerPhoto} alt="Magic Potion"/>
                </div>
                <div className="product-totals">
                  <div>
                    Quantity:&nbsp; 
                    <select name="quantity" value={this.state.quantity} onChange={this.onChange}>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                  <div>Total: ${this.state.totalPrice}</div>
                  <input className="magic-potion-purchase" type="submit" value="Purchase" />
                </div>
              </div>
              <div className="billing-info-container">
                <div className="billing-info">
                  <h2 className="billing-info-header">Billing Information</h2>
                  <div className="billing-info-inputs">
                    <div className="input-group">
                      <div className="customer-name">
                        <div className="label">First Name</div>
                        <input name="firstName" className="customer-input-95" type="text" value={this.state.firstName} onChange={this.onChange}/>
                        {
                          this.state.errors.indexOf('firstName') !== -1 && 
                          <div className="error-text">The First Name field is invalid.</div>
                        }
                      </div>
                      <div className="customer-name">
                        <div className="label">Last Name</div>
                        <input name="lastName" className="customer-input-95" type="text" value={this.state.lastName} onChange={this.onChange}/>
                        {
                          this.state.errors.indexOf('lastName') !== -1 && 
                          <div className="error-text">The Last Name field is invalid.</div>
                        }
                      </div>
                    </div>
                    <div className="input-group">
                      <div className="label">Address Line 1</div>
                      <input name="addressLine1" className="customer-input-100" type="text" value={this.state.addressLine1} onChange={this.onChange}/>
                      {
                        this.state.errors.indexOf('addressLine1') !== -1 && 
                        <div className="error-text">The Address Line 1 field is invalid.</div>
                      }
                    </div>
                    <div className="input-group">
                      <div className="label">Address Line 2</div>
                      <input name="addressLine2" className="customer-input-100" type="text" value={this.state.addressLine2} onChange={this.onChange}/>
                      {
                        this.state.errors.indexOf('addressLine2') !== -1 && 
                        <div className="error-text">The Address Line 2 field is invalid.</div>
                      }
                    </div>
                    <div className="input-group">
                      <div className="customer-city">
                        <div className="label">City</div>
                        <input name="city" className="customer-input-95" type="text" value={this.state.city} onChange={this.onChange}/>
                        {
                          this.state.errors.indexOf('city') !== -1 && 
                          <div className="error-text">The City field is invalid.</div>
                        }
                      </div>
                      <div className="customer-state">
                        <div className="label">State</div>
                        <input name="state" className="customer-input-95" type="text" value={this.state.state} onChange={this.onChange}/>
                        {
                          this.state.errors.indexOf('state') !== -1 && 
                          <div className="error-text">The State field is invalid.</div>
                        }
                      </div>
                      <div className="customer-zip">
                        <div className="label">Zip</div>
                        <input name="zip" className="customer-input-95" type="text" value={this.state.zip} onChange={this.onChange}/>
                        {
                          this.state.errors.indexOf('zip') !== -1 && 
                          <div className="error-text">The Zip field is invalid.</div>
                        }
                      </div>
                    </div>
                    <div className="input-group">
                      <div className="customer-email">
                        <div className="label">Email Address</div>
                        <input name="email" className="customer-input-95" type="text" value={this.state.email} onChange={this.onChange}/>
                        {
                          this.state.errors.indexOf('email') !== -1 && 
                          <div className="error-text">The Email Address field is invalid.</div>
                        }
                      </div>
                      <div className="customer-phone">
                        <div className="label">Phone Number</div>
                        <input name="phoneNumber" className="customer-input-95" type="text" value={this.state.phoneNumber} onChange={this.onChange} placeholder="8005551212"/>
                        {
                          this.state.errors.indexOf('phoneNumber') !== -1 && 
                          <div className="error-text">The Phone Number field is invalid.</div>
                        }
                      </div>
                    </div>
                    <div className="input-group">
                      <div className="customer-name">
                        <div className="label">Credit Card Number</div>
                        <input name="ccNum" className="customer-input-95" type="text" value={this.state.ccNum} onChange={this.onChange} placeholder="1234567887654321"/>
                        {
                          this.state.errors.indexOf('ccNum') !== -1 && 
                          <div className="error-text">The Credit Card Number field is invalid.</div>
                        }
                      </div>
                      <div className="customer-name">
                        <div className="label">CC Exp.</div>
                        <input name="expDate" className="customer-input-25" type="text" value={this.state.expDate} onChange={this.onChange} placeholder="mm/yy"/>
                        {
                          this.state.errors.indexOf('expDate') !== -1 && 
                          <div className="error-text">The CC Exp. field is invalid.</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
