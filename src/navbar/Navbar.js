import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

class Navbar extends React.Component {


    constructor(props) 
    {
        super(props);
    }


    render() {

        return (

            <div>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <span className="navbar-brand" href="#">JAVAZON</span>
                        <div id="navbarSupportedContent">
                            <form className="d-flex" role="search">
                                <input
                                    type="text"
                                    placeholder="Inserisci Nome Prodotto"
                                    value={this.props.search}
                                    onChange={this.props.handleSearchChange}
                                />
                            </form>
                        </div>
                    </div>
                </nav>
            </div>

        );

    }


}

export default Navbar;