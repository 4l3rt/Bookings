
import "./navbar.css";
import snoLogo from "../../assets/svgs/SnoHouse.svg"


export function Navbar()  {
    return(
        <div className="sno__navbar ">
            <div className="sno__navbar_content-spacer">
                    <a href=""><img  src={snoLogo}/></a>
                    <div className="sno__navbar-shortcuts">
                        <h2 className="txt-primary"><a href="">Rooms Available</a></h2>
                        <div className="sno__navbar_shortcuts_split"/>
                        <h2 className="txt-primary"><a href="">General Info</a></h2>
                        <div className="sno__navbar_shortcuts_split"/>
                        <h2 className="txt-primary"><a href="">Location</a></h2>
                        <div className="sno__navbar_shortcuts_split"/>
                        <h2 className="txt-primary"><a href="">Contact us</a></h2>
                </div>   
            </div>
        </div>
    )
}