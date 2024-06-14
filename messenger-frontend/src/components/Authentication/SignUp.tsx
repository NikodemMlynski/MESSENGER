import { FC, FormEvent } from "react";
import InputContainer from "../../assets/InputContainer";
import { URL } from "../../assets/utils";
import classes from './SignUp.module.css';

interface ISignUpUser {
    username: string;
    email: string;
    password: string;
    passwordConfirm?: string;
    // createdAt: Date;
    photo?: string;
}

const SignUp: FC = () => {

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement
        const formData = new FormData(form);
        const dataObj: ISignUpUser = {
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            passwordConfirm: formData.get('passwordConfirm') as string,
            photo: formData.get('photo') as string
        }
        if(formData.get('password') !== formData.get('passwordConfirm')) {
            alert('Hasła muszą być takie same');
            return;
        }
        signUp(dataObj);
        form.reset();
    }

    const signUp = async (data: ISignUpUser) => {
        try {
            const res = await fetch(`${URL}users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if(!res.ok) throw new Error('Failed to sign up user');
            const resData = await res.json();
            console.log(resData);
        } catch (error) {
            console.log(error);
        }
       
    }
    return (
        <form className={classes.form} onSubmit={handleSubmit}>
            <InputContainer labelText="Username" name="username" type="text"/>
            <InputContainer labelText="Email" name="email" type="email"/>
            <InputContainer labelText="Password" name="password" type="password"/>
            <InputContainer labelText="Confirm your password" name="passwordConfirm" type="password"/>
            <div>
                <button>Submit</button>
            </div>
        </form>
    )
}

export default SignUp;