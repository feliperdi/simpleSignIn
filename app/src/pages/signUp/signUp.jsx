import React, { useEffect, useState } from 'react';
import '../../app.css';
import {useNavigate} from 'react-router-dom';
import visibility from '../../icons/visibility.svg';
import visibilityOff from '../../icons/visibility_off.svg';
import {paths} from '../router';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const SignUp = props => {
    const navigate = useNavigate();
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const [signUpError, setSignUpError] = useState(false);
    const { register, handleSubmit, watch, setError, setValue, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [enableButton, setEnableButton] = useState(true);


    const signUp = async (data) => {
        try {
            if(watch('email') !== watch('confirmEmail')) {
                setError("confirmEmail",
                    {
                        type: 'NotEqual',
                        message: "Email and confirm  email must be equal"
                    },
                    {shouldFocus: true}
                );
            } else {
                const res = await axios.post('http://localhost:3000/signUp', {
                    email: data.email,
                    password: data.password,
                    role: "USER"
                });
                navigate("/app");
            }
        }catch(error) {
            if(error.response){
                if(error.response.status === 409) {
                    setError("email",
                        {
                            type: 'emailAlreadyInUse',
                            message: "Email already in use"
                        },
                        {shouldFocus: true}
                    );
                    setValue("confirmEmail", "");
               }
            } else {
                setSignUpError(true);
            }
        }
    };



    useEffect( () => {
        if(watch('email') !== "" && watch('confirmPassword') !== "" && watch('password').length >= 8 ) {
            setEnableButton(false)
        } else {
            setEnableButton(true);
        }
    },[ watch('email'), watch('confirmEmail'), watch('password')])

    return(
        <div className='wrapper'>
            {signUpError ? 
            <div>server unavailable.</div>
            :
            <div className='signIn_card'>
                <span className='title'>SignUp</span>
                <form className='login-form' onSubmit={handleSubmit( data => signUp(data))}>
                    <label className='login-label'>Email</label>
                    <input 
                        className='login-input'
                        {...register('email', {pattern: { value: re, message: 'Invalid email'}})}
                    />
                    {errors.email && <span className='help-text'>{errors.email.message}</span>}
                    <label className='login-label'>Confirm email</label>
                    <input 
                        className='login-input'
                        {...register('confirmEmail')}

                    />
                    {errors.confirmEmail && <span className='help-text'>{errors.confirmEmail.message}</span>}
                    <label className='login-label'>Password</label>
                    <div className='login-password-input-box'>
                        <img 
                            className='show_password_icon' 
                            alt='password-icon'
                            onClick={() => setShowPassword(!showPassword)} 
                            src={showPassword ? visibility : visibilityOff}
                        />
                        <input 
                            className='login-password-input'
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                        />
                        <div></div>
                    </div>
                     {errors.password && <span className='help-text'>{errors.password.message}</span>}
                    <button disabled={enableButton} className='login-button'>Create Account</button>
                    <span onClick={() => navigate(paths.signIn)} className='login-massage'>alrealdy has an account?<span>SignIn</span></span>
                </form>
            </div>
            }
        </div>
    );
};

export default SignUp;