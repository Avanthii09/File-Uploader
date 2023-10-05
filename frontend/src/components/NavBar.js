import React from "react";
import '@progress/kendo-theme-material';
import '../styles/NavBar.css';



function MyNavBar() {

    return (
        <div>
            <nav className='nav'>
                <ul>
                    <li>
                        <a href='https://www.psgtech.edu/'>
                            <img className="img-size" src='https://www.psgtech.edu/IIC/psg-2.png' alt='PSG Tech Logo' />
                        </a>
                    </li>

                    <li>
                        <a className="nav-text" href='https://www.psgtech.edu/'> PSG College Of Technology </a>
                        <p className="small-text"> COE: QUARTERLY REPORT SUBMISSION PORTAL </p>
                    </li>


                </ul>

            </nav>
        </div>
    )
}

export default MyNavBar;

