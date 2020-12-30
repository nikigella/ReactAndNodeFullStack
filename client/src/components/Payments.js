import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Payments extends Component {
    render() {
        
        return (
            <StripeCheckout
                name="Emaily"
                description="$5 for 5 email credits"
            // amount needs to be in cents 
                amount={500}
            // token is the value that comes back
            // from the stripe api after the user
            // enters their credit card info and 
            // submits the form
                token={token => this.props.handleToken(token)}
            // stripe publishable key
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
            >
                <button className="btn">
                    Add Credits
                </button>
            </StripeCheckout>
        );
    }
}

export default connect(null, actions)(Payments);