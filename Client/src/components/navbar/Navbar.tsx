
import "./navbar.css";


export function Navbar()  {
    return(
        <div className="sno__navbar color-transparent ">
            <div className="sno__navbar-spacer">
                <h1 >SNO House</h1>
                <div className="sno__navbar-shortcuts ">
                    <a><h2>Rooms Available</h2></a>
                    <a><h2>General Info</h2></a>
                    <a><h2>Contact Us</h2></a>
                </div>
            </div>
        </div>
    )
}