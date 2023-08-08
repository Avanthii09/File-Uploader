// import React from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/Adduser.css';
// import MyNavBarLogout from './NavBarLogout';
// import { Form, Field } from '@progress/kendo-react-form';
// import { DropDownList } from '@progress/kendo-react-dropdowns';

// function MyAdduser() {
//   const [formError, setFormError] = React.useState('');

//   const handleFormSubmit = async (values) => {
//     try {
//       // Get the JWT token from your authentication method (e.g., local storage)
//       const token = localStorage.getItem('my_app_token'); // Replace 'my_app_token' with the actual name of your JWT token key

//       // Set the request headers to include the JWT token
//       const headers = {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json', // Set the content type if you are sending JSON data
//       };

//       // Make the API request to the backend to add user details
//       await axios.post('http://127.0.0.1:8000/admin/enter_details', values, { headers });

//       // Redirect to the Admin page after successful user details entry
//       window.location.href = '/Admin';
//     } catch (error) {
//       // Handle error (e.g., show error message to the user)
//       console.error(error);
//       // Set the form submission error in the component's state
//       setFormError('An error occurred while processing the request');
//     }
//   };

//   const idValidator = (value) => {
//     if (!value || !value.trim()) {
//       return 'Name cannot be empty.';
//     }
//     return '';
//   };

//   const emailRegex = new RegExp(/\S+@\S+\.\S+/);
//   const emailValidator = (value) => (emailRegex.test(value) ? '' : 'Please enter a valid email.');

//   return (
//     <div>
//       <div>
//         <MyNavBarLogout />
//       </div>
//       <div className='k-form'>
//         <Form
//           onSubmit={handleFormSubmit}
//           render={(formRenderProps) => (
//             <form className='adduserform' onSubmit={formRenderProps.onSubmit}>
//               <div className='addusertitle'>
//                 <p>ADD USER</p>
//               </div>
//               <div className='k-input-container'>
//                 <label htmlFor='id'>User ID</label>
//                 <br></br>
//                 <Field
//                   id={'id'}
//                   name={'id'}
//                   component={'input'}
//                   validator={idValidator}
//                   className='k-input'
//                 />
//                 {formRenderProps.touched.id && formRenderProps.errors.id && (
//                   <div className='k-input-error'>{formRenderProps.errors.id}</div>
//                 )}
//               </div>
//               <div className='k-input-container'>
//                 <label htmlFor='email'>Email</label>
//                 <br></br>
//                 <Field
//                   id={'email'}
//                   name={'email'}
//                   component={'input'}
//                   validator={emailValidator}
//                   className='k-input'
//                 />
//                 {formRenderProps.touched.email && formRenderProps.errors.email && (
//                   <div className='k-input-error'>{formRenderProps.errors.email}</div>
//                 )}
//               </div>
//               <div className='k-input-container'>
//                 <label htmlFor='password'>Password</label>
//                 <br></br>
//                 <Field
//                   id={'password'}
//                   name={'password'}
//                   component={'input'}
//                   className='k-input'
//                 />
//                 {formRenderProps.touched.password && formRenderProps.errors.password && (
//                   <div className='k-input-error'>{formRenderProps.errors.password}</div>
//                 )}
//               </div>
//               {/* <Field
//               id={'Role'}
//               name={'role'}
//               label={'Role'}
//               component={(fieldRenderProps) => (
//                 <div style={{ width: '60%' }}>
//                   <DropDownList {...fieldRenderProps} />
//                 </div>
//               )}
//               data={['Principal', 'Principal PA', 'Admin', 'Section']}
//             />
              
//               {/* Rest of your form fields */}
              

//               <div className='k-form-buttons'>
//                 <button type='submit' className='adduser-button' disabled={!formRenderProps.allowSubmit}>
//                   ADD USER
//                 </button>
//               </div>
//             </form>
//           )}
//         />
//         {/* Display form submission errors */}
//         {formError && <div className='k-input-error'>{formError}</div>}
//       </div>
//       <div className='back-to-admin'>
//         <Link to='/admin'>Back to Admin</Link>
//       </div>
//     </div>
//   );
// }

// export default MyAdduser; 


import * as React from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Error } from '@progress/kendo-react-labels';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import MyNavBarLogout from "./NavBarLogout";
import { Link } from 'react-router-dom';
import '@progress/kendo-theme-material/dist/all.css';
import '../styles/Adduser.css';
import axios from 'axios';

function MyAdduser() {
  const [formError, setFormError] = React.useState('');

  const handleFormSubmit = async (values) => {
    try {
      // Get the JWT token from your authentication method (e.g., local storage)
      const token = localStorage.getItem('my_app_token'); // Replace 'my_app_token' with the actual name of your JWT token key

      // Set the request headers to include the JWT token
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the content type if you are sending JSON data
      };

      // Make the API request to the backend to add user details
      await axios.post('http://127.0.0.1:8000/admin/enter_details', {
        id: values.id,
        email: values.email,
        password: values.password,
        role: values.role,
      }, { headers });

      // Redirect to the Admin page after successful user details entry
      window.location.href = '/Admin';
    } catch (error) {
      // Handle error (e.g., show error message to the user)
      console.error(error);
      // Set the form submission error in the component's state
      setFormError('An error occurred while processing the request');
    }
  };

  const idValidator = (value) => {
    if (!value || !value.trim()) {
      return 'Name cannot be empty.';
    }
    return '';
  };


  const idInput = (fieldRenderProps) => {
    const { validationMessage, visited, ...others } = fieldRenderProps;
    return (
        <div >
            <Input {...others}  />
            {visited && validationMessage && <Error>{validationMessage}</Error>}
        </div>
    );
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

    const emailInput = (fieldRenderProps) => {
        const { validationMessage, visited, ...others } = fieldRenderProps;
        return (
            <div>
                <Input {...others} />
                {visited && validationMessage && <Error>{validationMessage}</Error>}
            </div>
        );
    };

  const emailRegex = new RegExp(/\S+@\S+\.\S+/);
  const emailValidator = (value) => (emailRegex.test(value) ? '' : 'Please enter a valid email.');

  return (
    <div>
      <div>
        <MyNavBarLogout />
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
                            id={'id'}
                            name={'id'}
                            label={' Enter User ID'}
                            component={idInput}
                            validator={idValidator}
                        />
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
                            // validator={passwordValidator}
                        />
                         <Field
                            id={'role'}
                            name={'role'}
                            label={'Role'}
                            component={(fieldRenderProps) => (
                                <div style={{ width: '60%' }}>
                                    <DropDownList {...fieldRenderProps} />
                                </div>
                            )}
                            data={['Principal', 'Principal_PA', 'Admin', 'Section']}
                        />
              <div className='k-form-buttons'>
                <button type='submit' className='adduser-button' disabled={!formRenderProps.allowSubmit}>
                  ADD USER
                </button>
              </div>
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