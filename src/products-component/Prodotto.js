import React from "react"
import 'bootstrap/dist/css/bootstrap.css';

class Prodotto extends React.Component {
    constructor(props) 
    {
        super(props);
        this.state = props.prod;
    }


    render() {


        return (

            <div>
                <div className="card" style={{width: "18rem", height: "30rem"}}>
                    <img src={this.state.url_foto} style={{width: "17.9rem", height:"18rem"}} className="card-img-top" alt="Immagine Prodotto"/>
                        <div className="card-body">
                            <h5 className="card-title">{this.state.nome}</h5>
                            <h6>Categoria: {this.state.tipologia}</h6>
                            <p className="card-text">{this.state.descrizione}</p>
                            <span>{this.state.prezzo} €</span>
                        </div>
                </div>
            </div>

        );

    }


}

export default Prodotto;