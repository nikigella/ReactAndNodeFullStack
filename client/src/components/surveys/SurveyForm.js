// SurveyForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
    renderFields() {
       return _.map(formFields, field => {
           return (
            <Field key={field.name} component={SurveyField} type="text" label={field.label} name={field.name}/>
           );
       });
    }
    render() {
        return (
            // From below -> <input type="text" name="surveyTitle" />
            <div>
                {/* props.handleSubmit -> automatically provided by the reduxForm */}
                {/* onSubmit={this.props.handleSubmit(values => console.log(values))} -> 
                    called automatically when the user submits the form and from the 
                    console.log(values) => {surveyTitle: "jfaoiweoiwjeofijweofiwoi"}
                */}
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields()}
                    <Link to="/surveys" className="red btn-flat left white-text">
                        Cancel
                    </Link>
                    <button type="submit" className="teal btn-flat right white-text">
                        Next
                        <i className="material-icons right">done</i>
                    </button>
                </form>
              
            </div>
        );
    }
}

function validate(values) {
    const errors = {};

     // If there are any invalid emails
     errors.recipients = validateEmails(values.recipients || '');

    // If email is provided
    _.each(formFields, ({ name }) => {
        if (!values[name]) {
            errors[name] = 'You must provide a value'
        }
    });

   

    return errors;
}



export default reduxForm({
    validate,
    form: 'surveyForm',
    // Keep the form values
    destroyOnUnmount: false
})(SurveyForm);