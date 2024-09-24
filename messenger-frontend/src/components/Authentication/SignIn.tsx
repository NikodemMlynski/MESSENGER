import { FC, FormEvent } from "react";
import InputContainer from "../../assets/InputContainer";
import classes from './SignUp.module.css'
import { URL } from "../../assets/utils";
import { Link, useNavigate } from "react-router-dom";
interface ISignedUser {
    email: string;
    password: string;
}

const SignIn: FC = () => {
    const navigate = useNavigate();
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement
        const formData = new FormData(form);
        const dataObj: ISignedUser = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }
        signUp(dataObj);
        form.reset();
    }

    const signUp = async (data: ISignedUser) => {
        try {
            const res = await fetch(`${URL}users/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if(!res.ok) throw new Error('Failed to sign up user');
            const resData = await res.json();
            const userData = {
                token: resData.token,
                email: resData.data.user.email,
                friends: resData.data.user.friends,
                username: resData.data.user.username,
                id: resData.data.user._id
            }
            localStorage.setItem('authData', JSON.stringify(userData));
            const user = localStorage.getItem('authData');
            navigate('/chats');
            console.log(user);
        } catch (error) {
            console.log(error);
        }
       
    }
    return (
        <form className={classes.form} onSubmit={handleSubmit}>
        <InputContainer labelText="Email" name="email" type="email"/>
        <InputContainer labelText="Password" name="password" type="password"/>
        <div>
            <button>Submit</button>
        </div>
        <p className={classes.link}>Not a member <Link to={'/signup'}>Sign up</Link></p>
    </form>
    )
}

export default SignIn;