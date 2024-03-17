import * as React from 'react';
import { useEffect } from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Error } from '@progress/kendo-react-labels';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import MyNavBarLogout from "./NavBarLogout";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '@progress/kendo-theme-material/dist/all.css';
import '../styles/Adduser.css';
import axios from 'axios';

function MyAdduser() {
  const [formError, setFormError] = React.useState('');
  const [userAdded, setUserAdded] = React.useState(false);
  const navigate = useNavigate();


  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {

    if (!accessToken) {
      // User is not logged in, redirect to "/"
      navigate("/");
    }
  }, [navigate]);

  const handleFormSubmit = async (values) => {
    
    try {
      // Get the JWT token from your authentication method (e.g., local storage)
      const token = localStorage.getItem('auth_token'); // Replace 'my_app_token' with the actual name of your JWT token key

      // Set the request headers to include the JWT token
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the content type if you are sending JSON data
      };

      // Make the API request to the backend to add user details
      await axios.post('http://127.0.0.1:8000/admin/enter_details', {
        email: values.email,
        password: values.password,
        role: values.role,
        section:values.section,
        order:values.order
      }, { headers });

      setUserAdded(true);

      // Redirect to the Admin page after successful user details entry
      setTimeout(() => {
        // Redirect to the Admin page after successful user details entry
        window.location.href = '/Admin';
      }, 3000); // 3000 milliseconds = 3 seconds
    }catch (error) {
      // Handle error (e.g., show error message to the user)
      console.error(error);
      // Set the form submission error in the component's state     
      setFormError('Enter valid user details');
    }
  };


    const passwordInput = (fieldRenderProps) => {
        const { validationMessage, visited, ...others } = fieldRenderProps;
        return (
            <div>
                <Input {...others} />
                {visited && validationMessage && <Error>{validationMessage}</Error>}
            </div>
        );
    };
    const orderValidator = (value) => {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
          return "Order must be a valid number.";
      }
      return "";
  };
        const orderInput = (fieldRenderProps) => {
          const { validationMessage, visited, ...others } = fieldRenderProps;
          return (
              <div>
                  <Input type="number" min= "0"{...others} />
                  {visited && validationMessage && <Error>{validationMessage}</Error>}
              </div>
          );
      };

      const sectionValidator = (value) => {
        if (!value || !value.trim()) {
            return "Section cannot be empty.";
        }
        return "";
      };

      const sectionInput = (fieldRenderProps) => {
        const { validationMessage, visited, ...others } = fieldRenderProps;
        return (
            <div>
                <Input {...others} />
                {visited && validationMessage && <Error>{validationMessage}</Error>}
            </div>
        );
    };

    const emailInput = (fieldRenderProps) => {
        const { validationMessage, visited, ...others } = fieldRenderProps;
        return (
            <div>
                <Input {...others} />
                {visited && validationMessage && <Error>{validationMessage}</Error>}
            </div>
        );
    };
    const handleLogout = () => {
      // Call the handleLogout function passed from props
      navigate("/");
      // Additional logic if needed...
    };

  const emailRegex = new RegExp(/\S+@\S+\.\S+/);
  const emailValidator = (value) => (emailRegex.test(value) ? '' : 'Please enter a valid email.');

  return (
    <div>
      <div>
        <MyNavBarLogout handleLogout={handleLogout}/>
      </div>
      <div className='box1'>
      <div className='k-form'>
        <Form
          className='adduserform'
          onSubmit={handleFormSubmit}
          render={(formRenderProps) => (
            <FormElement className='felement'>
                        <div className='addusertitle'>
                            <p>ADD USER</p>
                        </div>                        
                         <Field
                            id={'email'}
                            name={'email'}
                            label={' Enter Email'}
                            component={emailInput}
                            validator={emailValidator}
                        />
                        <Field
                            id={'password'}
                            name={'password'}
                            label={'Enter Password'}
                            component={passwordInput}
                        />
                         

                        <Field
                            id={'order'}
                            name={'order'}
                            label={'Enter Order'}
                            component={orderInput}
                            validator={orderValidator}
                        />

                        <Field
                            id={'section'}
                            name={'section'}
                            label={'Enter Section'}
                            component={sectionInput}
                            validator={sectionValidator}
                        />
                        <Field
                            id={'Role'}
                            name={'role'}
                            label={'Role'}
                            component={(fieldRenderProps) => (
                                <div style={{ width: '60%' }}>
                                    <DropDownList {...fieldRenderProps} />
                                </div>
                            )}
                            data={['Principal_PA', 'Admin', 'Section']}
                        />
              <div className='k-form-buttons'>
                <button type='submit' className='adduser-button' disabled={!formRenderProps.allowSubmit}>
                  ADD USER
                </button>
              </div>
              {userAdded && <div className='success-message'>User successfully added!</div>}
            </FormElement>
          )}
        />
        {/* Display form submission errors */}
        {formError && <div className='k-input-error'>{formError}</div>}
      </div>
      <div className='back-to-admin'>
        <Link to='/admin'>Back to Admin</Link>
      </div>
    </div>
    </div>
  );
}

export default MyAdduser; 