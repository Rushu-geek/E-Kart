import React from 'react';
import "../styles.css"
import {API} from '../backend';
import Base from './Base';

const Home = () => {
    console.log("API is", API); 
    
    return (
        <Base title="Home Page" description="Welcome to my online store!!">
            <h1 className="text-white">Hello Frontend!!!</h1>
        </Base>
    )
}

export default Home;