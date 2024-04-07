import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!(credentials.confirmPassword === credentials.password)) {
            props.showAlert("Password doesn't match", "danger");
        }
        else {
            const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
            });

            const json = await response.json();
            // console.log(json);

            if (json.sucess) {
                localStorage.setItem('token', json.authToken)
                props.showAlert("Account created sucessfully", "success");

                //re-direct to the home page
                navigate("/");
            }
            else {
                //alert
                props.showAlert("Invalid credentials", "danger");
            }

            setCredentials({ name: "", email: "", password: "", confirmPassword: "" });
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className="mt-3">
            <form onSubmit={handleSubmit}>
                <h2>Create A New Account</h2>
                <div className="mb-3 my-5">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input value={credentials.name} type="text" className="form-control" id="name" aria-describedby="emailHelp" onChange={onChange} name="name" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input value={credentials.email} type="email" className="form-control" id="email" aria-describedby="emailHelp" name="email" onChange={onChange} required />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input value={credentials.password} type="password" className="form-control" id="password" onChange={onChange} name="password" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input value={credentials.confirmPassword} type="password" className="form-control" id="confirmPassword" onChange={onChange} name="confirmPassword" minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    )
}