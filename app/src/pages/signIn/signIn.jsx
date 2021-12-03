import React, { useEffect, useState } from 'react';
import '../../app.css';
import { useNavigate } from 'react-router-dom';
import visibility from '../../icons/visibility.svg';
import visibilityOff from '../../icons/visibility_off.svg';
import {paths} from '../router';
import axios from 'axios';


const SignIn = props => {
    const navigate = useNavigate();
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const [signInError, setSignInError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [enableButton, setEnableButton] = useState(true);

    const [form, setForm] = useState({
      email: {
        value: '',
        error: false,
        errorMessage: ''
      },
      password: {
        value: '',
        error: false,
        errorMessage: ''
      }
    });

    const onChange = e => {
        const {id, value} = e.target;
        setForm({
            ...form,
            [id]: {
                value: value,
                error: false,
                errorMessage: ''
            }
        });
    };

    const login = async (data) => {
        try {
            const res = await axios.post('http://localhost:3000/signIn', {
                email: data.email,
                password: data.password,
                role: "USER"
            });
            navigate("/app");
        }catch(error) {
            if(error.response) {
                if(error.response.status === 404) {
                    setForm({
                        ...form,
                        email: {
                            ...form.email,
                            error: true,
                            errorMessage: 'User does not exist'
                        }
                    });
                }
            } else {
                signInError(true);
            }
        }
    } 

    const handleSubmit = e => {
        e.preventDefault();
        if(!re.test(form.email.value)) {
            setForm({
                ...form,
                email: {
                    ...form.email,
                    error: true,
                    errorMessage: 'Invalid email'
                }
            });
        };
        if(form.password.value.length < 8) {
            setForm({
                ...form,
                password: {
                    ...form.password,
                    error: true,
                    errorMessage: 'The password must have at last 8 character'
                }
            });
        }
        if(!form.email.error && !form.password.error) {
            login({
                email: form.email.value,
                password: form.password.value
            });
        }
    }

    useEffect( () => {
        if(form.email.value.length > 0 && form.password.value.length >= 8 ) {
            setEnableButton(false)
        } else {
            setEnableButton(true);
        }
    },[form.email.value, form.password.value])

    return(
        <div className='wrapper'>
            {signInError ?
                <div>server unavailable.</div>
                :
                <div className='signIn_card'>
                    <span className='title'>SignIn</span>
                    <form className='login-form' onSubmit={handleSubmit}>
                        <label className='login-label'>Email</label>
                        <input 
                            className='login-input'
                            id='email'
                            onChange={onChange}
                            value={form.email.value}
                        />
                        {form.email.error && <span className='help-text'>{form.email.errorMessage}</span>}
                        <label className='login-label'>Password</label>
                        <div className='login-password-input-box'>
                            <img 
                                className='show_password_icon' 
                                onClick={() => setShowPassword(!showPassword)} 
                                src={showPassword ? visibility : visibilityOff}
                            />
                            <input 
                                className='login-password-input'
                                id='password'
                                onChange={onChange}
                                value={form.password.value}
                                type={showPassword ? 'text' : 'password'}
                            />
                            <div></div>
                        </div>
                        {form.password.error && <span className='help-text'>{form.password.errorMessage}</span>}
                        <button disabled={ enableButton } type='submit' className='login-button'>Login</button>
                        <span onClick={() => navigate(paths.signUp) } className='login-massage'>doesn't have an account yet?<span >SignUp</span></span>
                    </form>
                </div> 
            }
        </div>
    );
};

export default SignIn;