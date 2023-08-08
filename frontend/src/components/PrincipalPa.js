import React from 'react';
import MyNavBarLogout from "./NavBarLogout";
import MyDatePicker from './DatePicker';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Error } from '@progress/kendo-react-labels';
import { useAuth } from "./AuthContext";
import axios from 'axios';
import '../styles/PrincipalPa.css';
import '@progress/kendo-theme-material';

function MyPrincipalPa() {
     const { handleLogout } = useAuth();

     

    // const [formData, setFormData] = useState({});
    const dateValidator = (value) => {
        if (!value) {
            return 'Date is required';
        }

        const parsedDate = new Date(value);

        if (isNaN(parsedDate.getTime())) {
            return 'Invalid date';
        }

        return '';
    };
    const orgValidator = (value) => {
        if (!value || !value.trim()) {
            return "Cannot be empty.";
        }
        return "";
    };

    const orgInput = (fieldRenderProps) => {
        const { validationMessage, visited, ...others } = fieldRenderProps;
        return (
            <div>
                <Input {...others} className="principalpa-input" />

                {visited && validationMessage && <Error>{validationMessage}</Error>}
            </div>
        );
    };

    const handleSubmit = async (data) => {
        try {
            const response = await axios.post('/user/upload_pdf', data); // Replace with your API endpoint
            if (response.status === 200) {
                alert('Data submitted successfully');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data');
        }
    };
    const handleLogoutClick = () => {
        handleLogout(); // Call the handleLogout function
      };

    return (
        <div>
            <div>
                <MyNavBarLogout onLogout={handleLogoutClick} />
            </div>
            <div>
                <Form

                    className='paform'
                    onSubmit={(data) => {
                        // setFormData(data);
                        handleSubmit(data);
                    }}
                    render={(formRenderProps) => (
                        <FormElement className='felement'>
                            <div className='patitle'>
                                <p>Add Details</p>
                            </div>
                            <div className='tdate'>
                                <Field
                                    id={'date'}
                                    name={'date'}
                                    label={' Date'}
                                    component={MyDatePicker}
                                    validator={dateValidator}
                                />

                            </div>


                            <Field
                                id={'organization'}
                                name={'organization'}
                                label={'Enter organization '}
                                component={orgInput}
                                validator={orgValidator}
                                className='custom-input'

                            />
                            <Field
                                id={'purpose'}
                                name={'purpose'}
                                label={'Enter Purpose'}
                                component={orgInput}
                                validator={orgValidator}
                                className='custom-input'

                            />

                            <div className='mydate'>
                                <div className='date-picker-container'>
                                    <Field
                                        id={'fromDate'}
                                        name={'fromDate'}
                                        label={'Valid from'}
                                        component={MyDatePicker}
                                        validator={dateValidator}

                                    />
                                    <Field
                                        id={'toDate'}
                                        name={'toDate'}
                                        label={'Valid Until'}
                                        component={MyDatePicker}
                                        validator={dateValidator}
                                    />
                                </div>
                            </div>
                            <Field
                                id={'department'}
                                name={'department'}
                                label={'Enter Department '}
                                component={orgInput}
                                validator={orgValidator}
                                className='principalpa-input'
                            />
                            <Field
                                id={'remarks'}
                                name={'remarks'}
                                label={'Enter Remarks '}
                                component={orgInput}
                                validator={orgValidator}
                                textarea={true} // This makes the field a text area
                                className='custom-textarea'
                            />

                            <div className="k-form-buttons">
                                <button type={'submit'} className="submit-button" disabled={!formRenderProps.allowSubmit} onClick={handleSubmit}>
                                    SUBMIT
                                </button>
                            </div>

                        </FormElement>
                    )}
                />
            </div>


        </div>
    )
}

export default MyPrincipalPa;