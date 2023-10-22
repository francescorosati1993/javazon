import React from "react"
import 'bootstrap/dist/css/bootstrap.css';

class Prodotto extends React.Component {
    constructor(props) 
    {
        super(props);
        this.state={pProdotti: props.prod, pCarrello: props.proprieta };
    }

    componentDidUpdate(prevProps) 
    {
        if (prevProps.proprieta !== this.props.proprieta) 
        {
            this.setState({pCarrello: this.props.proprieta});
        }
    }


    render() {


        if(this.props.carrello) 
        {
            return (
                <div className="row mt-3">
                    <p className="col-1">{this.state.pCarrello.quantita}</p>
                    <h5 className="card-title col-4">{this.state.pCarrello.nome}</h5>
                    <span className="col-3">{this.state.pCarrello.prezzo} €</span>
                    <div className="row col-4">
                        <button className="btn btn-danger col-4 m-1" onClick={()=> this.props.removeToCart(this.state.pCarrello.id)}>-</button>
                        <button className="btn btn-primary col-4 m-1" onClick={()=> this.props.addToCart(this.state.pCarrello.id)}>+</button> 
                    </div>
                </div>
            ); 
        }

        //QUESTA QUI è LA STAMPA DEL PRODOTTO COME CARD (QUINDI AL CENTRO PAGINA)
        return (
            <div>
                <div className="card" style={{width: "18rem", height: "30rem"}}>
                    <img src={this.state.pProdotti.url_foto} style={{width: "17.9rem", height:"18rem"}} className="card-img-top" alt="Immagine Prodotto"/>
                        <div className="card-body">
                            <h5 className="card-title">{this.state.pProdotti.nome}</h5>
                            <h6>Categoria: {this.state.pProdotti.tipologia}</h6>
                            <p className="card-text">{this.state.pProdotti.descrizione}</p>
                            <div className="row">
                                <span className="col-8">{this.state.pProdotti.prezzo} €</span>
                                <button className="btn btn-primary col-4" onClick={() => this.props.addToCart(this.state.pProdotti.id)}>Aggiungi</button>
                            </div>
                        </div>
                </div>
            </div>
        );

    }


}

export default Prodotto;