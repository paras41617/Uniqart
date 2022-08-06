import React from "react";
import { Link } from 'react-router-dom';
import '../css/Footer.css';

class Footer extends React.Component {
    render() {
        return (
            <div className="footer" >
                <div id="newsletter">
                    <div id='footer_logo'>
                        <Link id='footer_logo' to="/">UNIQART</Link>
                        <div id="copyright_footer_text" >
                            Copyright 2022 | Uniqart | License | Published
                        </div>
                    </div>
                    <div id="footer_second_section">
                        <div className="footer_text">
                            Get Latest Updates
                        </div>
                        <div>
                            <input id="footer_input" type='text' placeholder="Your Email Address" />
                        </div>
                        <div className="footer_text">
                            Subscribe to our newsLetter
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;