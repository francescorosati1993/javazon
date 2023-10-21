import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import Prodotto from "./Prodotto";

class Prodotti extends React.Component
{
    
    

    constructor(props)
    {
        super(props);
        this.state= {prodotti: props.prodotti}
    }

    componentDidUpdate(prevProps) 
    {
        if (prevProps.prodotti !== this.props.prodotti) 
        {
            this.setState({ prodotti: this.props.prodotti });
        }
    }

    render()
    {
        return (

            <div className="d-flex flex-wrap justify-content-center">
                 {this.state.prodotti.map(prodotto => <div className="m-3"> <Prodotto key={prodotto.id} prod={prodotto} addToCart={this.props.addToCart}></Prodotto></div>)}
            </div>

        );

    }


}

export default Prodotti;